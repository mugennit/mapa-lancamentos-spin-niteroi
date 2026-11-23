import test from 'node:test';
import assert from 'node:assert/strict';
import {clusterPoints,clusterWithoutOverlap,clusterSize,fanOffsets,placeLabels,maxSpread,estimateLabelWidth} from '../lib/map-clusters.ts';

const pt=(id,x,y,lat=-22.9,lng=-43.1)=>({id,x,y,lat,lng});

test('clusters group by real pixel distance and keep every point exactly once',()=>{
  const points=[pt('a',0,0,-22.90,-43.10),pt('b',30,0,-22.91,-43.11),pt('c',200,0,-22.95,-43.2),pt('d',230,10,-22.96,-43.21)];
  const clusters=clusterPoints(points,46);
  assert.equal(clusters.length,2);
  assert.deepEqual(clusters.flatMap(c=>c.ids).sort(),['a','b','c','d']);
  assert.deepEqual(clusterPoints([...points].reverse(),46).map(c=>c.ids),clusters.map(c=>c.ids),'order independent');
  assert.equal(clusters.every(c=>!c.coincident),true);
});

test('identical coordinates are flagged as coincident and never moved',()=>{
  const twins=[pt('a',100,100,-22.8893,-43.1253),pt('b',100,100,-22.8893,-43.1253)];
  const snapshot=JSON.stringify(twins);
  const [cluster]=clusterPoints(twins,46);
  assert.equal(cluster.coincident,true);
  assert.equal(maxSpread(twins),0);
  assert.equal(JSON.stringify(twins),snapshot,'input coordinates untouched');
});

test('fan offsets are visual, distinct and grow with the number of pins',()=>{
  for(const n of [2,3,5,9]){
    const offsets=fanOffsets(n);
    assert.equal(offsets.length,n);
    assert.equal(new Set(offsets.map(o=>`${o.dx},${o.dy}`)).size,n);
    const radius=Math.hypot(offsets[0].dx,offsets[0].dy);
    assert.ok(radius>=58);
    for(let i=1;i<n;i++){const a=offsets[i-1],b=offsets[i];assert.ok(Math.hypot(a.dx-b.dx,a.dy-b.dy)>=24,'labels need room')}
  }
  assert.deepEqual(fanOffsets(0),[]);
});

test('labels avoid overlaps but forced labels always show',()=>{
  const w=estimateLabelWidth('Conviva Icaraí');
  const candidates=[{id:'a',x:100,y:100,width:w,height:24},{id:'b',x:110,y:104,width:w,height:24},{id:'c',x:400,y:100,width:w,height:24}];
  assert.deepEqual([...placeLabels(candidates)].sort(),['a','c']);
  assert.deepEqual([...placeLabels(candidates,[],new Set(['b']))].sort(),['a','b','c']);
  assert.deepEqual([...placeLabels(candidates,[{left:350,right:450,top:60,bottom:120}])],['a']);
});

test('no two drawn clusters overlap after merging',()=>{
  const points=[];let n=0;
  for(let x=0;x<400;x+=23)for(let y=0;y<300;y+=31)points.push(pt(`p${n++}`,x+(y%7),y+(x%5),-22.9-y/1e4,-43.1+x/1e4));
  const clusters=clusterWithoutOverlap(points,46);
  assert.equal(clusters.flatMap(c=>c.ids).length,points.length);
  for(let i=0;i<clusters.length;i++)for(let j=i+1;j<clusters.length;j++){
    const a=clusters[i],b=clusters[j];
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=(clusterSize(a.ids.length)+clusterSize(b.ids.length))/2,'overlap');
  }
});
