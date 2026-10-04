import json,re,urllib.request,urllib.parse,unicodedata,time
from pathlib import Path
p=Path('/workspace/scratch/spin-audit-catalog.json');d=json.loads(p.read_text());cachefile=Path('/workspace/scratch/spin-geocoding-cache.json');cache=json.loads(cachefile.read_text())
def norm(s):return unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
for x in d:
 if not x['address'] or x['lat'] is not None or x.get('locationStatus')=='Bairro ou segmento da via ambíguo':continue
 stem=re.sub(r',?\s*(lote|esquina).*','',x['address'],flags=re.I);stem=re.sub(r',?\s*\d+[A-Za-z]?\s*$','',stem).strip()
 stem=re.sub(r'^(Rua|Avenida|Estrada)\s+','',stem,flags=re.I).replace('Jayme','Jaime').replace('Luiz de Ferreira Travassos','Luís Ferreira')
 q=stem+', Niterói, Brasil'
 if q in cache:r=cache[q]
 else:
  try:
   u='https://nominatim.openstreetmap.org/search?'+urllib.parse.urlencode({'q':norm(q),'format':'jsonv2','limit':5})
   r=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'SpinNiteroiCatalog/1.0'}),timeout=20));cache[q]=r;cachefile.write_text(json.dumps(cache,ensure_ascii=False,indent=2))
  except Exception as e:r=[];print('LOOKUP UNAVAILABLE',x['name'],flush=True)
  time.sleep(1.15)
 good=next((a for a in r if 'Niterói' in a.get('display_name','') and -23.01<float(a['lat'])<-22.80 and -43.23<float(a['lon'])<-42.90 and a.get('addresstype')=='road' and (x['neighborhood']=='A confirmar' or norm(x['neighborhood']) in norm(a['display_name']))),None)
 if good:
  x['lat']=float(good['lat']);x['lng']=float(good['lon']);x['precision']='street';x['locationStatus']='Via localizada · posição aproximada';x['geocoding']={'provider':'Nominatim / OpenStreetMap','osmType':good.get('osm_type'),'osmId':good.get('osm_id'),'displayName':good['display_name'],'checkedAt':'2026-09-30'};print('RECOVERED',x['name'],good['display_name'],flush=True)
 else:print('PENDING',x['name'],flush=True)
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
print('TOTAL',sum(x['lat'] is not None for x in d),flush=True)
