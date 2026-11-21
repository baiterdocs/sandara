"""Descarga todas las fotos de producto de sandara.pe (sitemap de la tienda + datos ld+json)
y genera la versión retocada en crema con scripts/retoque-crema.py.

Uso: python3 -I scripts/fotos-catalogo.py
Salida:
  work/catalogo/originales/<slug>-<n>.jpg   fotos tal como están en Wix
  work/catalogo/crema/<slug>-<n>.jpg        fotos retocadas (fondo de estudio crema)
  work/catalogo/catalogo.json               slug, nombre, url de la ficha y archivos
"""
import json, re, subprocess, os, html, urllib.parse
from concurrent.futures import ThreadPoolExecutor

BASE = "work/catalogo"
ORI, CRE = f"{BASE}/originales", f"{BASE}/crema"
os.makedirs(ORI, exist_ok=True)


def get(u):
    return subprocess.run(["curl", "-sL", "--max-time", "60", u], capture_output=True, check=True).stdout


sitemap = get("https://www.sandara.pe/store-products-sitemap.xml").decode()
urls = re.findall(r"<loc>([^<]+)</loc>", sitemap)
print("productos en el sitemap:", len(urls))


def ficha(url):
    h = get(url).decode("utf-8", "ignore")
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', h, re.S):
        try:
            j = json.loads(m.group(1))
        except Exception:
            continue
        for x in (j if isinstance(j, list) else [j]):
            if isinstance(x, dict) and x.get("@type") == "Product":
                slug = urllib.parse.unquote(url.rstrip("/").split("/")[-1])
                imgs = []
                for i, im in enumerate(x.get("image") or []):
                    u = im if isinstance(im, str) else (im.get("contentUrl") or im.get("url"))
                    base = u.split("/v1/")[0]
                    fn = f"{slug}-{i + 1}.jpg"
                    ruta = os.path.join(ORI, fn)
                    if not os.path.exists(ruta):
                        open(ruta, "wb").write(get(base))
                    imgs.append({"archivo": fn, "media": base.split("/media/")[-1]})
                return {"slug": slug, "nombre": html.unescape(x.get("name", "")), "url": url, "imagenes": imgs}
    return {"slug": url, "error": "sin datos"}


with ThreadPoolExecutor(6) as ex:
    datos = list(ex.map(ficha, urls))
json.dump(datos, open(f"{BASE}/catalogo.json", "w"), ensure_ascii=False, indent=1)
ok = [d for d in datos if "error" not in d]
print("fichas leídas:", len(ok), "| fotos:", sum(len(d["imagenes"]) for d in ok), "| errores:", len(datos) - len(ok))
subprocess.run(["work/venv/bin/python3", "scripts/retoque-crema.py", ORI, CRE], check=True)
print("listo")
