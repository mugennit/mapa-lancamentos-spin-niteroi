// Celular: controles do mapa sem sobreposição (320–430 px, com busca, satélite,
// menu, localização, cartão e comparação) e abertura no modo Mapa por padrão.
//   BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/mobile-map.mjs
import { chromium } from "playwright";
const base=(process.env.BASE_URL||"http://localhost:4181").replace(/\/$/,"");
const password=process.env.SITE_PASSWORD; if(!password) throw new Error("Defina SITE_PASSWORD.");
const SEL=[".map-topleft .map-pill",".map-search-area",".leaflet-control-layers",".leaflet-control-zoom",".map-preview",".map-legend-v2",".leaflet-control-attribution",".comparison-bar",".map-menu",".bottom-nav"];
async function check(p,label){
  const r=await p.evaluate((SEL)=>{const boxes=[];for(const s of SEL)for(const e of document.querySelectorAll(s)){const st=getComputedStyle(e);if(st.display==="none"||st.visibility==="hidden")continue;const b=e.getBoundingClientRect();if(b.width<2||b.height<2)continue;boxes.push({s,b:{l:b.left,t:b.top,r:b.right,bt:b.bottom,w:b.width,h:b.height}})}
    const ov=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i].b,c=boxes[j].b;if(boxes[i].s===boxes[j].s&&boxes[i].s===".map-topleft .map-pill")continue;if(a.l<c.r-1&&a.r>c.l+1&&a.t<c.bt-1&&a.bt>c.t+1)ov.push(`${boxes[i].s} × ${boxes[j].s}`)}
    const pills=[...document.querySelectorAll(".map-topleft .map-pill")].map(e=>e.getBoundingClientRect());for(let i=0;i<pills.length;i++)for(let j=i+1;j<pills.length;j++){const a=pills[i],c=pills[j];if(a.left<c.right-1&&a.right>c.left+1&&a.top<c.bottom-1&&a.bottom>c.top+1)ov.push("pill × pill")}
    const map=document.querySelector(".map-canvas").getBoundingClientRect();
    const out=boxes.filter(x=>x.s!==".bottom-nav"&&x.s!==".comparison-bar"&&(x.b.l<map.left-1||x.b.r>map.right+1||x.b.t<map.top-1||x.b.bt>map.bottom+1)).map(x=>x.s);
    const small=boxes.filter(x=>[".map-topleft .map-pill",".map-search-area"].includes(x.s)&&x.b.h<40).map(x=>x.s);
    return {ov,out,small,scrollX:document.documentElement.scrollWidth>innerWidth,search:boxes.some(x=>x.s===".map-search-area")};},SEL);
  const bad=r.ov.length||r.out.length||r.small.length||r.scrollX;
  console.log(`${bad?"FALHA":"ok"} ${label}${r.search?" [busca visível]":""}${r.ov.length?" sobreposição: "+r.ov.join(", "):""}${r.out.length?" fora do mapa: "+r.out.join(","):""}${r.small.length?" toque pequeno: "+r.small:""}${r.scrollX?" rolagem horizontal":""}`);
  return !bad;
}
const b=await chromium.launch(); let ok=true;
for (const w of [320,360,390,430]) {
  const ctx=await b.newContext({viewport:{width:w,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:2,geolocation:{latitude:-22.9035,longitude:-43.1096},permissions:["geolocation"]});const p=await ctx.newPage();
  await p.goto(base+"/login");await p.fill("input[type=password]",password);await p.press("input[type=password]","Enter");await p.waitForURL(base+"/");await p.locator("main[data-ready='1']").waitFor();await p.waitForTimeout(800);
  const view=await p.locator("main").getAttribute("data-view"); if(view!=="mapa"){console.log("FALHA",w,"não abriu no mapa:",view);ok=false}
  ok=await check(p,`${w}px inicial`)&&ok;
  // mover o mapa → Buscar nesta região
  await p.waitForTimeout(1500);
  const c=await p.locator(".map-canvas").boundingBox(); await p.mouse.move(c.x+c.width/2,c.y+c.height*0.55); await p.mouse.down(); await p.mouse.move(c.x+c.width/2-40,c.y+c.height*0.55+30,{steps:6}); await p.mouse.up(); await p.waitForTimeout(500);
  ok=await check(p,`${w}px após mover (busca)`)&&ok;
  const sb=await p.locator(".map-search-area").boundingBox().catch(()=>null);
  if(!sb){console.log("FALHA",w,"Buscar nesta região não apareceu");ok=false}
  else { const top=await p.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest(".map-search-area")!==null,{x:sb.x+sb.width/2,y:sb.y+sb.height/2}); console.log(`   busca: ${Math.round(sb.width)}x${Math.round(sb.height)} px, tocável: ${top}`); if(!top||sb.height<40) ok=false; }
    // satélite
  await p.locator(".leaflet-control-layers-base label").nth(1).click(); await p.waitForTimeout(300);
  ok=await check(p,`${w}px satélite`)&&ok;
  // menu Mais
  await p.getByRole("button",{name:"Mais"}).tap(); await p.waitForTimeout(200);
  ok=await check(p,`${w}px menu aberto`)&&ok;
  // localização pelo menu
  await p.getByRole("menuitem",{name:/Perto de mim/}).tap(); await p.waitForTimeout(1500);
  ok=await check(p,`${w}px localização`)&&ok;
  // cartão de pin
  for(let i=0;i<3&&(await p.locator(".mk-dot,.mk-label").count())<2;i++){await p.locator(".leaflet-control-zoom-in").tap();await p.waitForTimeout(400)}
  const idx=await p.locator(".mk-dot,.mk-label").evaluateAll(els=>els.findIndex(e=>{const r=e.getBoundingClientRect();const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return r.top>130&&r.bottom<innerHeight-260&&r.left>10&&r.right<innerWidth-60&&t&&e.contains(t)}));
  if(idx>=0){await p.locator(".mk-dot,.mk-label").nth(idx).tap();await p.waitForTimeout(500)}
  ok=await check(p,`${w}px cartão aberto${idx<0?" (sem pin livre)":""}`)&&ok;
  // comparação
  await p.getByRole("navigation",{name:"Visualização"}).getByRole("button",{name:/Cards/}).tap();
  await p.locator(".pcard").nth(0).getByRole("button",{name:/Comparar/}).tap();await p.locator(".pcard").nth(1).getByRole("button",{name:/Comparar/}).tap();
  await p.getByRole("navigation",{name:"Visualização"}).getByRole("button",{name:/Mapa/}).tap();await p.waitForTimeout(800);
  const idx2=await p.locator(".mk-dot,.mk-label").evaluateAll(els=>els.findIndex(e=>{const r=e.getBoundingClientRect();const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return r.top>130&&r.bottom<innerHeight-330&&r.left>10&&r.right<innerWidth-60&&t&&e.contains(t)}));
  if(idx2>=0){await p.locator(".mk-dot,.mk-label").nth(idx2).tap();await p.waitForTimeout(500)}
  ok=await check(p,`${w}px comparação${idx2>=0?" + cartão":""}`)&&ok;
  await ctx.close();
}
// vitrine no celular
for (const w of [320,390]) {const ctx=await b.newContext({viewport:{width:w,height:740},isMobile:true,hasTouch:true});const p=await ctx.newPage();await p.goto(base+"/vitrine");await p.locator("main[data-ready='1']").waitFor();await p.waitForTimeout(800);
  console.log(`vitrine ${w}px modo:`,await p.locator("main").getAttribute("data-view"),"| pins:",await p.locator(".mk-host").count());ok=await check(p,`vitrine ${w}px inicial`)&&ok;await ctx.close();}
// Modo inicial: celular abre no Mapa; ver= explícito é respeitado; computador abre em Cards.
async function initial(label, path, opts, expected, login=true){
  const ctx=await b.newContext(opts);const p=await ctx.newPage();
  if(login){await p.goto(base+"/login");await p.fill("input[type=password]",password);await p.press("input[type=password]","Enter");await p.waitForURL(base+"/");}
  await p.goto(base+path);await p.locator("main[data-ready='1']").waitFor();await p.waitForTimeout(900);
  const view=await p.locator("main").getAttribute("data-view");
  const r={view,ok:view===expected};
  if(expected==="mapa"){
    const inside=await p.evaluate(()=>{const m=document.querySelector(".map-canvas").getBoundingClientRect();return [...document.querySelectorAll(".mk-cluster,.mk-body")].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.left>=m.left&&b.right<=m.right&&b.top>=m.top&&b.bottom<=m.bottom}).length});
    r.pinsNaTela=inside; if(!inside) r.ok=false;
  }
  console.log(`${r.ok?"ok":"FALHA"} modo inicial ${label}: ${JSON.stringify(r)}`);
  await ctx.close();return r.ok;
}
const phone={viewport:{width:390,height:780},isMobile:true,hasTouch:true};
ok=await initial("interno celular /","/",phone,"mapa")&&ok;
ok=await initial("interno celular ?ver=cards","/?ver=cards",phone,"cards")&&ok;
ok=await initial("interno celular ?ver=lista","/?ver=lista",phone,"lista")&&ok;
ok=await initial("interno computador /","/",{viewport:{width:1440,height:900}},"cards")&&ok;
ok=await initial("vitrine celular /","/vitrine",phone,"mapa",false)&&ok;
ok=await initial("vitrine celular ?ver=cards","/vitrine?ver=cards",phone,"cards",false)&&ok;
// Alternar para Cards grava ver=cards; voltar ao endereço principal reabre no Mapa.
{const ctx=await b.newContext(phone);const p=await ctx.newPage();
 await p.goto(base+"/login");await p.fill("input[type=password]",password);await p.press("input[type=password]","Enter");await p.waitForURL(base+"/");await p.locator("main[data-ready='1']").waitFor();
 await p.getByRole("navigation",{name:"Visualização"}).getByRole("button",{name:/Cards/}).tap();await p.waitForTimeout(300);
 const url=new URL(p.url());const cardsOk=url.searchParams.get("ver")==="cards"&&await p.locator(".pcard").first().isVisible();
 await p.reload();await p.locator("main[data-ready='1']").waitFor();const kept=await p.locator("main").getAttribute("data-view");
 await p.goto(base+"/");await p.locator("main[data-ready='1']").waitFor();const back=await p.locator("main").getAttribute("data-view");
 const r=cardsOk&&kept==="cards"&&back==="mapa";console.log(`${r?"ok":"FALHA"} alternância: Cards grava ver=cards (${cardsOk}), recarregar mantém (${kept}), endereço principal volta ao Mapa (${back})`);ok=r&&ok;await ctx.close();}
console.log(ok?"TUDO OK":"HÁ FALHAS");await b.close();if(!ok)process.exit(1);
