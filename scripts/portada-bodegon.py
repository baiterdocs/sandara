"""Portada tipo bodegón (referencia: Anise) en vista cenital (flat lay).

Joyas de Sandara sobre una superficie de yeso cálido y una losa de travertino,
con luz rasante desde la izquierda y sombras largas hacia la derecha.
La mitad izquierda queda despejada para el texto de la portada.

Uso: work/venv/bin/python3 scripts/portada-bodegon.py <carpeta_fotos> <salida.jpg> [ancho alto]
Las fotos deben ser de producto sobre fondo blanco (se recortan solas).
"""
import sys, os, math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

SRC, OUT = sys.argv[1], sys.argv[2]
W, H = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (2400, 1050)
K = W / 2400                                  # escala de la composición
rng = np.random.default_rng(11)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def ruido(escalas, pesos, semilla):
    g = np.random.default_rng(semilla)
    total = np.zeros((H, W), np.float32)
    for s, p in zip(escalas, pesos):
        s = max(2, int(s * K))
        peq = g.random((H // s + 3, W // s + 3)).astype(np.float32)
        img = Image.fromarray((peq * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
        total += p * (np.asarray(img).astype(np.float32) / 255.0)
    return total


def a_mascara(img_l, blur=0.0):
    if blur:
        img_l = img_l.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(img_l).astype(np.float32)[..., None] / 255


def desplazar(m, dx, dy, blur):
    im = Image.fromarray((m[..., 0] * 255).astype(np.uint8))
    lienzo_m = Image.new("L", (W, H), 0); lienzo_m.paste(im, (int(dx), int(dy)))
    return a_mascara(lienzo_m, blur)


# ---------------- Superficie: yeso cálido con luz rasante ----------------
yeso = ruido((220, 70, 20, 6), (0.45, 0.3, 0.17, 0.08), 3)
luz = 1.06 - 0.30 * smooth(0.0, 1.0, xx / W) - 0.10 * smooth(0.0, 1.0, yy / H)   # entra por la izquierda
base = np.array([0.86, 0.81, 0.74])
lienzo = base * (luz + (yeso - 0.5) * 0.05)[..., None]
# haz cálido diagonal, como el sol de ventana de la referencia
haz = np.exp(-(((xx - 0.42 * W) * 0.8 + (yy - 0.55 * H) * 0.6) / (0.33 * W)) ** 2)
lienzo *= (1 + 0.07 * haz)[..., None]

# ---------------- Losa de travertino (vista desde arriba) ----------------
def contorno(cx, cy, rx, ry, rot, semilla, n=180):
    g = np.random.default_rng(semilla)
    fases = g.random(6) * 6.28; amps = np.array([0.05, 0.035, 0.025, 0.02, 0.012, 0.008])
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        r = 1 + sum(a * math.sin((k + 2) * t + f) for k, (a, f) in enumerate(zip(amps, fases)))
        r += g.normal(0, 0.006)
        # forma rectangular redondeada (superelipse) para que parezca losa cortada a mano
        c, s_ = math.cos(t), math.sin(t)
        e = 4.0
        sx = math.copysign(abs(c) ** (2 / e), c); sy = math.copysign(abs(s_) ** (2 / e), s_)
        x, y = sx * rx * r, sy * ry * r
        xr = x * math.cos(rot) - y * math.sin(rot); yr = x * math.sin(rot) + y * math.cos(rot)
        pts.append((cx + xr, cy + yr))
    return pts

losa_pts = contorno(1560 * K, 520 * K, 640 * K, 300 * K, math.radians(-9), 4)
m_losa_img = Image.new("L", (W, H), 0); ImageDraw.Draw(m_losa_img).polygon(losa_pts, fill=255)
m_losa = a_mascara(m_losa_img, 1.0)
# sombra de la losa: larga hacia la derecha (luz rasante) + oclusión de contacto
lienzo *= 1 - 0.38 * desplazar(m_losa, 46 * K, 26 * K, 34 * K) * (1 - m_losa)
lienzo *= 1 - 0.30 * desplazar(m_losa, 8 * K, 6 * K, 6 * K) * (1 - m_losa)

trav = ruido((300, 110, 40, 12, 4), (0.35, 0.25, 0.2, 0.12, 0.08), 9)
vetas = 0.5 + 0.5 * np.sin(((yy - xx * 0.16) / (26 * K)) + trav * 7.0)        # bandas del travertino
poros_raw = (rng.random((H, W)) < 0.010).astype(np.float32)
poros = a_mascara(Image.fromarray((poros_raw * 255).astype(np.uint8)), 1.3 * K)[..., 0]
tono = np.array([0.90, 0.84, 0.75])
sup_losa = tono * (luz * 1.04 + (trav - 0.5) * 0.10 + (vetas - 0.5) * 0.035 - poros * 0.22)[..., None]
lienzo = lienzo * (1 - m_losa) + sup_losa * m_losa
# canto iluminado arriba-izquierda y canto en sombra abajo-derecha
borde_luz = np.clip(m_losa - desplazar(m_losa, 3 * K, 3 * K, 1.0), 0, 1)
borde_sombra = np.clip(m_losa - desplazar(m_losa, -4 * K, -4 * K, 1.5), 0, 1)
lienzo = lienzo + borde_luz * 0.07 - borde_sombra * 0.10


# ---------------- Joyas recortadas ----------------
def recorte(ruta, caja=None):
    im = Image.open(ruta).convert("RGB")
    if caja:
        x0, y0, x1, y1 = caja
        im = im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))
    a = np.asarray(im).astype(np.float32) / 255
    L = a.mean(axis=2); S = a.max(axis=2) - a.min(axis=2)
    alfa = np.clip(smooth(0.05, 0.20, 1 - L) + smooth(0.06, 0.20, S), 0, 1)
    # reflejos sobre la mesa blanca (grises claros sin color): fuera
    reflejo = smooth(0.74, 0.90, L) * (1 - smooth(0.04, 0.10, S))
    alfa = alfa * (1 - reflejo)
    # cerrar huecos pequeños dentro de la joya (brillos del metal) para que no se transparenten
    a_img = Image.fromarray((alfa * 255).astype(np.uint8))
    cerrado = a_img.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    alfa = np.maximum(alfa, np.asarray(cerrado).astype(np.float32) / 255 * 0.98)
    alfa = a_mascara(Image.fromarray((alfa * 255).astype(np.uint8)), 0.7)[..., 0]
    c = np.clip((a - (1 - alfa[..., None])) / np.maximum(alfa[..., None], 0.05), 0, 1)
    img = Image.fromarray((np.dstack([c, alfa]) * 255).astype(np.uint8))
    return img.crop(img.getbbox())


def poner(pieza, centro, alto, angulo=0):
    global lienzo
    alto = int(alto * K)
    p = pieza.resize((max(1, int(pieza.width * alto / pieza.height)), alto), Image.LANCZOS)
    p = p.rotate(angulo, resample=Image.BICUBIC, expand=True)
    arr = np.asarray(p).astype(np.float32) / 255
    h, w = arr.shape[:2]
    x0, y0 = int(centro[0] * K - w / 2), int(centro[1] * K - h / 2)
    al = np.zeros((H, W, 1), np.float32); col = np.zeros((H, W, 3), np.float32)
    ys = slice(max(0, y0), min(H, y0 + h)); xs = slice(max(0, x0), min(W, x0 + w))
    al[ys, xs, 0] = arr[ys.start - y0: ys.stop - y0, xs.start - x0: xs.stop - x0, 3]
    col[ys, xs] = arr[ys.start - y0: ys.stop - y0, xs.start - x0: xs.stop - x0, :3]
    # sombras: contacto corto + sombra rasante larga hacia la derecha
    lienzo *= 1 - 0.50 * desplazar(al, 4 * K, 3 * K, 2.5 * K)
    lienzo *= 1 - 0.30 * desplazar(al, 22 * K, 10 * K, 9 * K)
    calido = col * np.array([1.0, 0.975, 0.935])          # reflejo cálido del ambiente
    lienzo = lienzo * (1 - al) + calido * al


f = lambda n: os.path.join(SRC, n)
# Composición: diagonal de izquierda a derecha sobre la losa; aire a la izquierda para el texto.
poner(recorte(f("copy-of-dije-antonella-1-1.jpg"), (0, 0, 1, 0.86)), (1330, 470), 640, angulo=-24)  # Azalea, plata 950
poner(recorte(f("copy-of-dije-antonella-1.jpg"), (0, 0, 1, 0.90)), (1820, 430), 470, angulo=18)    # Antonella, plata 950
poner(recorte(f("aretes-lilieth-1.jpg"), (0, 0, 1, 0.90)), (1640, 690), 104, angulo=-10)                               # aretes Lilieth
poner(recorte(f("dije-corazon-bombita-3.jpg"), (0, 0, 1, 0.78)), (2000, 690), 92, angulo=12)          # corazones dorados
poner(recorte(f("dije-estrella-brilllante-3.jpg"), (0, 0, 1, 0.80)), (1130, 760), 96, angulo=-16)     # estrella brillante (en el yeso)
poner(recorte(f("dije-punto-de-luz-1-3.jpg"), (0, 0, 1, 0.78)), (2230, 900), 92, angulo=20)           # puntos de luz (en el yeso)

# ---------------- Acabado fotográfico ----------------
v = np.sqrt(((xx - W * 0.55) / (W * 0.80)) ** 2 + ((yy - H * 0.50) / (H * 0.90)) ** 2)
lienzo *= (1 - 0.20 * smooth(0.40, 1.25, v))[..., None]
lienzo = 0.02 + lienzo * 0.975                                   # negros levemente levantados
lienzo += rng.normal(0, 1.3 / 255, lienzo.shape)
Image.fromarray((np.clip(lienzo, 0, 1) * 255 + 0.5).astype(np.uint8)).save(OUT, quality=90, optimize=True, progressive=True)
print("ok", OUT, W, H)
