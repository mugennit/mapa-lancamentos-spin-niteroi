import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2];p=Path('/workspace/scratch/spin-audit-catalog.json');d=json.loads(p.read_text());review=[]
for x in d:
 if x['id']=='conviva-charitas':
  x['lat']=None;x['lng']=None;x['precision']=None;x['locationStatus']='Tipo de logradouro divergente'
  x['addressReview']='Book: Rua Santa Cândida, 44. Mapa: Travessa Santa Cândida. Confirmar se é a mesma via.'
 if not x['address']:
  x['addressReview']='Endereço completo não identificado no cadastro reunido.';x['locationStatus']='Endereço ausente'
 elif x['lat'] is None and not x.get('addressReview'):
  x['addressReview']='Bairro divergente na correspondência do mapa.' if 'ambíguo' in x.get('locationStatus','') else 'Sem correspondência geográfica segura; validar endereço ou enviar posição no mapa.'
 elif not re.search(r'\d',x['address']) and 'esquina' not in x['address'].lower():
  x['addressReview']='Número ou lote não identificado; o marcador indica apenas a via.'
 if x.get('addressReview'):
  review.append({k:x.get(k) for k in ['id','name','company','neighborhood','address','addressReview']})
  note='Validação pendente: '+x['addressReview']
  if note not in x['notes']:x['notes'].append(note)
 x['locationCheckedAt']='2026-09-30'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2));(root/'data/catalog.json').write_text(p.read_text());(root/'data/geocoding-cache.json').write_text(Path('/workspace/scratch/spin-geocoding-cache.json').read_text());(root/'data/address-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2))
report={'checkedAt':'2026-09-30','checked':len(d),'located':sum(x['lat'] is not None for x in d),'unlocated':sum(x['lat'] is None for x in d),'addressValidationNeeded':len(review),'batches':[{'from':i+1,'to':min(i+10,len(d)),'checked':len(d[i:i+10]),'locatedAfterReview':sum(x['lat'] is not None for x in d[i:i+10])} for i in range(0,len(d),10)]};(root/'data/location-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
assert len(d)==112 and len({x['id'] for x in d})==112
for x in d:
 if x['lat'] is not None:
  assert x['address'] and x['lng'] is not None and x['geocoding']['provider']=='Nominatim / OpenStreetMap'
  assert -23.01<x['lat']<-22.80 and -43.23<x['lng']<-42.90
  assert 'Niterói' in x['geocoding']['displayName']
for x in review:print(x['name']+' | '+(x['address'] or 'Não identificado')+' | '+x['addressReview'])
print(json.dumps(report,ensure_ascii=False))
