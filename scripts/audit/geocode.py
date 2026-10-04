import json,urllib.request,urllib.parse,time,re,sys,datetime,unicodedata
from pathlib import Path
root=Path(__file__).resolve().parents[2];p=Path('/workspace/scratch/spin-audit-catalog.json');data=json.loads(p.read_text());cachefile=Path('/workspace/scratch/spin-geocoding-cache.json');cache=json.loads(cachefile.read_text()) if cachefile.exists() else {}
start,end=map(int,sys.argv[1:3]);new=0;pending=[]
def request(q):
 if q in cache:return cache[q]
 try:
  url='https://nominatim.openstreetmap.org/search?'+urllib.parse.urlencode({'q':unicodedata.normalize('NFKD',q).encode('ascii','ignore').decode(),'format':'jsonv2','limit':5})
  req=urllib.request.Request(url,headers={'User-Agent':'SpinNiteroiCatalog/1.0 (internal real estate address verification)'})
  result=json.load(urllib.request.urlopen(req,timeout=20));cache[q]=result;cachefile.write_text(json.dumps(cache,ensure_ascii=False,indent=2));time.sleep(1.15);return result
 except Exception as e:print('ERROR',type(e).__name__,flush=True);time.sleep(1.15);return []
for x in data[start:end]:
 if not x['address']:
  x['locationStatus']='Endereço ausente';pending.append(x['name']);continue
 address=re.sub(r',?\s*(lote|esquina).*','',x['address'],flags=re.I)
 hood=(', '+x['neighborhood']) if x['neighborhood']!='A confirmar' else ''
 queries=[address+hood+', Niterói, Brasil']
 # Second query can locate the source road when the house number is absent from the map.
 street=re.sub(r',?\s*\d+[A-Za-z]?\s*$','',address).strip()
 if street!=address:queries.append(street+hood+', Niterói, Brasil')
 found=None
 for q in queries:
  r=request(q);r.sort(key=lambda a: x['neighborhood'].lower() not in a.get('display_name','').lower());found=next((a for a in r if -23.01<float(a['lat'])<-22.80 and -43.23<float(a['lon'])<-42.90 and ('Niterói' in a.get('display_name','')) and a.get('addresstype') not in ['city','municipality','state','county','country','suburb','neighbourhood']),None)
  if found:break
 if found:
  x['lat']=float(found['lat']);x['lng']=float(found['lon']);x['precision']='building' if found.get('addresstype') in ['house','building'] and found.get('address',{}).get('house_number') else 'street'
  x['locationStatus']='Localizado' if x['precision']=='building' else 'Via localizada · posição aproximada';x['geocoding']={'provider':'Nominatim / OpenStreetMap','osmType':found.get('osm_type'),'osmId':found.get('osm_id'),'displayName':found['display_name'],'checkedAt':'2026-09-30'};new+=1
 else:x['locationStatus']='Endereço sem correspondência segura';pending.append(x['name'])
 p.write_text(json.dumps(data,ensure_ascii=False,indent=2));print('CHECK',x['name'],x['locationStatus'],flush=True)
p.write_text(json.dumps(data,ensure_ascii=False,indent=2))
report={'batch':f'{start+1}–{min(end,len(data))}','checked':min(end,len(data))-start,'locatedInBatch':new,'totalLocated':sum(x['lat'] is not None for x in data),'pending':pending};print(json.dumps(report,ensure_ascii=False),flush=True)
