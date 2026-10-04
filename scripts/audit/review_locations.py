import json,unicodedata,re
from pathlib import Path
p=Path('/workspace/scratch/spin-audit-catalog.json');data=json.loads(p.read_text());cache=json.loads(Path('/workspace/scratch/spin-geocoding-cache.json').read_text())
def n(s):return unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
for x in data:
 if x['lat'] is None or x['neighborhood']=='A confirmar':continue
 old=x['geocoding']['displayName'];hood=n(x['neighborhood'])
 if hood in n(old):continue
 street=re.sub(r',?\s*(lote|esquina).*','',x['address'],flags=re.I);stem=re.sub(r',?\s*\d+[A-Za-z]?\s*$','',street).strip();results=[]
 for q,r in cache.items():
  if q.startswith(street+',') or q.startswith(stem+','):results+=r
 good=next((r for r in results if hood in n(r.get('display_name','')) and 'Niterói' in r.get('display_name','') and r.get('addresstype') not in ['suburb','city','neighbourhood']),None)
 if good:
  x['lat']=float(good['lat']);x['lng']=float(good['lon']);x['geocoding']['displayName']=good['display_name'];x['geocoding']['osmId']=good.get('osm_id');x['geocoding']['osmType']=good.get('osm_type');print('CORRECTED',x['name'],flush=True)
 else:
  x['lat']=None;x['lng']=None;x['precision']=None;x['locationStatus']='Bairro ou segmento da via ambíguo';print('AMBIGUOUS',x['name'],old,flush=True)
p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print('SAFE PINS',sum(x['lat'] is not None for x in data))
