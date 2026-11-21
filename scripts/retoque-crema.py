"""Retoque de fotos de joyería a fondo de estudio crema (look Anise).

Uso: work/venv/bin/python3 scripts/retoque-crema.py <carpeta_origen> <carpeta_destino>

- Fotos de producto sobre blanco: el fondo pasa a un barrido de estudio crema con viñeta suave,
  conservando las sombras de contacto. La joya no se recolorea (la plata sigue neutra).
- Fotos de ambiente (modelo, empaque): solo gradación cálida y suave para que combinen.
- Grano muy fino para que el fondo no se vea plano/digital.
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter

SRC, DST = sys.argv[1], sys.argv[2]
os.makedirs(DST, exist_ok=True)

FONDO_CENTRO = np.array([0xF1, 0xEC, 0xE2]) / 255.0   # crema claro al centro
FONDO_BORDE = np.array([0xE3, 0xDB, 0xCD]) / 255.0    # arena en los bordes
rng = np.random.default_rng(7)


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def gradacion(a, calidez=1.0):
    """Curva suave: negros levantados, luces cálidas, contraste contenido."""
    a = 0.018 + a * 0.975
    a = a + 0.06 * (a - a**2) * (a - 0.5) * 2          # S muy leve
    luz = smooth(0.55, 1.0, a.mean(axis=2, keepdims=True))
    tinte = np.array([1.0, 0.988, 0.962]) ** calidez
    return a * (1 - luz) + a * tinte * luz


for nombre in sorted(os.listdir(SRC)):
    if not nombre.lower().endswith((".jpg", ".jpeg", ".png")) or nombre.startswith("logo"):
        continue
    im = Image.open(os.path.join(SRC, nombre)).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    h, w, _ = a.shape
    L = a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722
    S = a.max(axis=2) - a.min(axis=2)
    blanco = ((L > 0.9) & (S < 0.06)).mean()

    if blanco > 0.30:
        # --- Producto sobre blanco: reemplazar el fondo conservando sombras ---
        m = smooth(0.78, 0.95, L) * (1 - smooth(0.05, 0.14, S))
        m_img = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2))
        m = np.asarray(m_img).astype(np.float32)[..., None] / 255.0
        ref = np.percentile(L[(L > 0.85)], 90) if (L > 0.85).any() else 1.0
        sombra = np.clip(L / ref, 0, 1)[..., None]
        sombra = 1 - (1 - sombra) * 0.85                # sombras un poco más suaves
        yy, xx = np.mgrid[0:h, 0:w]
        d = np.sqrt(((xx - w * 0.5) / (w * 0.62)) ** 2 + ((yy - h * 0.42) / (h * 0.70)) ** 2)
        v = smooth(0.15, 1.05, d)[..., None]
        fondo = FONDO_CENTRO * (1 - v) + FONDO_BORDE * v
        joya = gradacion(a, calidez=0.35)               # joya casi neutra
        out = joya * (1 - m) + (fondo * sombra) * m
        tipo = "producto"
    else:
        # --- Ambiente: balance de blancos hacia crema + gradación cálida ---
        claros = a[L > np.percentile(L, 60)]
        med = np.median(claros, axis=0)
        if med[2] >= med[0] - 0.01:                     # fondo gris o azulado: calentarlo
            objetivo = FONDO_CENTRO * med.mean() / FONDO_CENTRO.mean()
            wb = 1 + 0.6 * (objetivo / np.maximum(med, 1e-3) - 1)
            a = np.clip(a * wb, 0, 1)
        out = gradacion(a, calidez=1.0)
        tipo = "ambiente"

    out = out + rng.normal(0, 1.1 / 255.0, out.shape)   # grano fino
    out = np.clip(out, 0, 1)
    Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(
        os.path.join(DST, os.path.splitext(nombre)[0] + ".jpg"), quality=90, optimize=True, progressive=True)
    print(f"{nombre:42s} {tipo:9s} blanco={blanco:.2f}")
