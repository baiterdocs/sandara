import json, re, urllib.parse, html, os, subprocess
OUT='sim-anise'
slugs=[('dije-azalea','copy-of-dije-antonella-1','Atelier'),('dije-antonella','copy-of-dije-antonella','Atelier'),
 ('aretes-antonella','copy-of-aretes-antonella','Atelier'),('pulsera-senor-de-los-milagros','señor-de-los-milagros-pulsera','Atelier'),
 ('collar-royal-blue','collar-royal-blue','Atelier')]
def get(u):
    return subprocess.run(['curl','-sL','--max-time','40',u],capture_output=True,check=True).stdout
prods=[]
for key,slug,linea in slugs:
    h=get('https://www.sandara.pe/p-gina-de-producto/'+urllib.parse.quote(slug)).decode()
    ld=None
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',h,re.S):
        try: j=json.loads(m.group(1))
        except: continue
        for x in (j if isinstance(j,list) else [j]):
            if isinstance(x,dict) and x.get('@type')=='Product': ld=x
    imgs=[]
    for i,im in enumerate((ld.get('image') or [])[:4]):
        u=im if isinstance(im,str) else (im.get('contentUrl') or im.get('url'))
        base=u.split('/v1/')[0]
        ext='png' if '.png' in base else 'jpg'
        fn=f'{key}-{i+1}.{ext}'
        open(f'{OUT}/img/{fn}','wb').write(get(base))
        imgs.append('img/'+fn)
    off=ld.get('Offers') or ld.get('offers') or {}
    if isinstance(off,list): off=off[0]
    prods.append({'id':key,'nombre':html.unescape(ld['name']).title(),'precio':float(off.get('price')),'linea':linea,
      'descripcion':html.unescape(ld.get('description','')).strip(),'imagenes':imgs,'url':'https://www.sandara.pe/p-gina-de-producto/'+slug})
open(f'{OUT}/productos.js','w').write('window.PRODUCTOS = '+json.dumps(prods,ensure_ascii=False,indent=1)+';\n')
for p in prods: print(p['id'],p['nombre'],p['precio'],len(p['imagenes']))
