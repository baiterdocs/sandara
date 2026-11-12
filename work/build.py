#!/usr/bin/env python3
"""Sandara reel re-edit. Usage: build.py base | preview t1 t2 ... | final"""
import sys, subprocess, os, math, argparse

parser = argparse.ArgumentParser(description="Genera el reel de Sandara. Requiere numpy, Pillow y ffmpeg.")
parser.add_argument("mode", choices=["info", "base", "bounds", "preview", "final"])
parser.add_argument("values", nargs="*")
parser.add_argument("--source", default=os.environ.get("SANDARA_VIDEO_SOURCE"))
args = parser.parse_args()
if args.mode == "base" and (not args.source or not os.path.isfile(args.source)):
    parser.error("Indica un video existente con --source.")
if args.mode == "final" and len(args.values) != 1:
    parser.error("final requiere una ruta de salida.")
if args.mode == "preview" and not args.values:
    parser.error("preview requiere uno o más tiempos en segundos.")
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = args.source
OUT = os.path.join(ROOT, "out"); os.makedirs(OUT, exist_ok=True)
W, H, FPS = 1080, 1920, 30
BAND_Y = 1210
CHARCOAL = (47, 46, 46); PAPER = (255, 255, 255); GREY = (176, 174, 172)

def snap(t): return round(t * FPS) / FPS

# ---------------------------------------------------------------- audio segments (source in/out)
SEGS = [(0.00, 16.84), (20.60, 22.84), (24.05, 28.64), (31.77, 38.08), (39.94, 45.35),
        (45.80, 49.20), (49.65, 51.95), (61.30, 66.38), (66.87, 68.94), (75.96, 79.00)]
SEGS = [(snap(a), snap(b)) for a, b in SEGS]
OFF = []; acc = 0.0
for a, b in SEGS:
    OFF.append(acc); acc += b - a
BODY = acc
END_CARD = 1.9
TOTAL = BODY + END_CARD
NFR = int(round(TOTAL * FPS))

def o(src_t):
    """source time -> output time"""
    for (a, b), off in zip(SEGS, OFF):
        if a - 0.04 <= src_t <= b + 0.04:
            return off + min(max(src_t, a), b) - a
    raise ValueError(src_t)

# ---------------------------------------------------------------- camera spans (src in, src out, zoom, cx, eye_y) ; zoom None = hidden under a card
def cam(z, cx=540, eye=780, x0=None, y0=None):
    w, h = W / z, H / z
    if x0 is None: x0 = min(max(cx - w / 2, 0), W - w)
    if y0 is None: y0 = min(max(eye - 0.40 * h, 0), H - h)
    return (int(round(w / 2) * 2), int(round(h / 2) * 2), int(x0), int(y0))

HOOK_END = 3.10
SPANS = [
    (0.00, HOOK_END, cam(1.0)),
    (HOOK_END, 8.2333, cam(1.14, 520, 770)),
    (8.2333, 11.50, cam(1.5, x0=170, y0=185)),
    (11.50, 16.84, None),
    (20.60, 20.9667, None),
    (20.9667, 22.0667, cam(1.08, 540, 790)),
    (22.0667, 22.84, None),
    (24.05, 28.64, None),
    (31.77, 32.8333, None),
    (32.8333, 34.9333, cam(1.12, 540, 780)),
    (34.9333, 38.08, None),
    (39.94, 41.70, cam(1.22, 540, 780)),
    (41.70, 44.6333, None),
    (44.6333, 45.35, cam(1.06, 540, 780)),
    (45.80, 49.20, cam(1.3, 545, 760)),
    (49.65, 51.95, cam(1.08, 540, 770)),
    (61.30, 66.38, cam(1.0)),
    (66.87, 68.94, cam(1.25, 540, 760)),
    (75.96, 77.2667, None),
    (77.2667, 79.00, cam(1.0)),
]
SPANS = [(snap(a), snap(b), c) for a, b, c in SPANS]

GRADE = "eq=contrast=1.05:saturation=1.09:gamma=0.985,colorbalance=rm=0.015:bm=-0.02:rh=0.01:bh=-0.012"

def build_base():
    parts = []; labels = []
    for i, (a, b, c) in enumerate(SPANS):
        if c is None: c = cam(1.0)
        w, h, x, y = c
        sharp = ",unsharp=5:5:0.35:5:5:0" if w < 1000 else ""
        parts.append(f"[0:v]fps=30,trim=start_frame={round(a*FPS)}:end_frame={round(b*FPS)},setpts=PTS-STARTPTS,crop={w}:{h}:{x}:{y},"
                     f"scale={W}:{H}:flags=lanczos{sharp},{GRADE},setsar=1[v{i}]")
        labels.append(f"[v{i}]")
    parts.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=0,tpad=stop_mode=clone:stop_duration={END_CARD},fps={FPS}[v]")
    al = []
    for i, (a, b) in enumerate(SEGS):
        d = b - a
        parts.append(f"[0:a]atrim=start={a:.4f}:end={b:.4f},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:d=0.015,afade=t=out:st={d-0.03:.4f}:d=0.03[a{i}]")
        al.append(f"[a{i}]")
    parts.append("".join(al) + f"concat=n={len(al)}:v=0:a=1,highpass=f=75,"
                 "acompressor=threshold=-20dB:ratio=5:attack=4:release=140:makeup=2,"
                 "alimiter=limit=0.5:attack=3:release=60:level=disabled,"
                 f"loudnorm=I=-14:TP=-1.5:LRA=8,apad=pad_dur={END_CARD},aresample=48000[a]")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(parts),
           "-map", "[v]", "-map", "[a]", "-t", f"{TOTAL:.4f}",
           "-c:v", "libx264", "-preset", "fast", "-crf", "12", "-pix_fmt", "yuv420p",
           "-c:a", "pcm_s16le", os.path.join(OUT, "base.mov")]
    subprocess.run(cmd, check=True)

# ---------------------------------------------------------------- type helpers
def font(name, size, wght):
    f = ImageFont.truetype(os.path.join(ROOT, "fonts", name + ".ttf"), size)
    try: f.set_variation_by_axes([wght])
    except Exception as e: print("var font fail", e)
    return f

def text_layer(lines, fnt, color, tracking=0.0, leading=1.15, shadow=False, align="center"):
    """returns RGBA PIL image tightly holding the text block"""
    size = fnt.size; tr = tracking * size
    def width(s): return sum(fnt.getlength(ch) for ch in s) + tr * max(len(s) - 1, 0)
    ws = [width(l) for l in lines]
    pad = 40
    lw = int(max(ws)) + pad * 2; lh = int(size * leading)
    img = Image.new("RGBA", (lw, lh * len(lines) + pad * 2), (0, 0, 0, 0))
    def draw(dst, col):
        d = ImageDraw.Draw(dst)
        for i, l in enumerate(lines):
            x = pad + (max(ws) - ws[i]) / 2 if align == "center" else pad
            y = pad + i * lh
            for ch in l:
                d.text((x, y), ch, font=fnt, fill=col)
                x += fnt.getlength(ch) + tr
    if shadow:
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0)); draw(sh, (0, 0, 0, 255))
        a = sh.split()[3]
        soft = a.filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * 0.55))
        hard = a.filter(ImageFilter.GaussianBlur(3)).point(lambda v: int(v * 0.5))
        sh2 = Image.new("RGBA", img.size, (0, 0, 0, 0))
        sh2.putalpha(Image.fromarray(np.maximum(np.array(soft), np.array(hard))))
        img = Image.alpha_composite(img, sh2)
        top = Image.new("RGBA", img.size, (0, 0, 0, 0)); draw(top, color + (255,))
        img = Image.alpha_composite(img, top)
    else:
        draw(img, color + (255,))
    return img

def ease(x):
    x = min(max(x, 0.0), 1.0); return 1 - (1 - x) ** 3

class Canvas:
    def __init__(self):
        self.rgb = np.zeros((H, W, 3), np.float32); self.a = np.zeros((H, W, 1), np.float32); self.used = False
    def put(self, img, cx=None, y=0, alpha=1.0, x=None):
        """composite RGBA PIL/np image; cx = centre x, or x = left"""
        if alpha <= 0.003: return
        arr = np.asarray(img, np.float32) if not isinstance(img, np.ndarray) else img
        h, w = arr.shape[:2]
        x0 = int(round(cx - w / 2)) if x is None else int(round(x)); y0 = int(round(y))
        sx0 = max(0, -x0); sy0 = max(0, -y0); sx1 = min(w, W - x0); sy1 = min(h, H - y0)
        if sx1 <= sx0 or sy1 <= sy0: return
        src = arr[sy0:sy1, sx0:sx1]
        sa = (src[..., 3:4] / 255.0) * alpha if arr.shape[2] == 4 else np.full(src.shape[:2] + (1,), alpha, np.float32)
        ds = (slice(y0 + sy0, y0 + sy1), slice(x0 + sx0, x0 + sx1))
        self.rgb[ds] = src[..., :3] * sa + self.rgb[ds] * (1 - sa)
        self.a[ds] = sa + self.a[ds] * (1 - sa)
        self.used = True
    def rect(self, x0, y0, x1, y1, color, alpha=1.0):
        if alpha <= 0.003: return
        ds = (slice(int(y0), int(y1)), slice(int(x0), int(x1)))
        self.rgb[ds] = np.array(color, np.float32) * alpha + self.rgb[ds] * (1 - alpha)
        self.a[ds] = alpha + self.a[ds] * (1 - alpha); self.used = True
    def bytes(self):
        out = np.empty((H, W, 4), np.uint8)
        a = self.a
        rgb = np.where(a > 1e-4, self.rgb / np.maximum(a, 1e-4), 0)   # un-premultiply (we stored premultiplied-over-black)
        out[..., :3] = np.clip(rgb + 0.5, 0, 255).astype(np.uint8); out[..., 3:] = np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8)
        return out.tobytes()

EMPTY = bytes(W * H * 4)

# ---------------------------------------------------------------- assets
def load(n): return Image.open(os.path.join(ROOT, "img", n)).convert("RGB")
IMG_A, IMG_B, IMG_C, IMG_E = load("15.jpg"), load("37.jpg"), load("16.jpg"), load("01.jpg")
_logo = Image.open(os.path.join(ROOT, "..", "sim", "assets", "logo-blanco.png")).convert("RGBA")
bb = _logo.split()[3].getbbox(); _logo = _logo.crop(bb)
def logo(width, color):
    l = _logo.resize((width, int(_logo.height * width / _logo.width)), Image.LANCZOS)
    solid = Image.new("RGBA", l.size, color + (0,)); solid.putalpha(l.split()[3]); return solid
LOGO_DARK, LOGO_WHITE, LOGO_END = logo(196, CHARCOAL), logo(196, PAPER), logo(600, PAPER)

def kenburns(img, box_w, box_h, focus, z):
    """cover-fit img into box with zoom z around focus (fx,fy in 0..1 of img)"""
    iw, ih = img.size
    s = max(box_w / iw, box_h / ih) * z
    cw, ch = box_w / s, box_h / s
    l = max(min(focus[0] * iw - cw / 2, iw - cw), 0); t = max(min(focus[1] * ih - ch / 2, ih - ch), 0)
    return img.resize((box_w, box_h), Image.BICUBIC, box=(l, t, l + cw, t + ch))

def contain(img, size, z):
    """packshot: scale to size*z square crop centre"""
    iw, ih = img.size; c = iw / z
    l = (iw - c) / 2; t = (ih - c) / 2
    return img.resize((size, size), Image.BICUBIC, box=(l, t, l + c, t + c))

F_DISPLAY = lambda s: font("Cinzel", s, 400)
F_LABEL = lambda s: font("JosefinSans", s, 400)
F_CAP = font("JosefinSans", 54, 500)

# pre-rendered text
T = {}
def mk(key, lines, fnt, color, **kw):
    T[key] = text_layer(lines if isinstance(lines, list) else [lines], fnt, color, **kw); return T[key]

SMALL = dict(tracking=0.34)
# hook
mk("hook_s", "SERIE  ·  30 DÍAS", F_LABEL(30), GREY, **SMALL)
mk("hook_t", "DÍA 01 / 30", F_DISPLAY(118), PAPER, tracking=0.03)
mk("hook_b", "JOYAS PARA TODAS LAS OCASIONES", F_LABEL(35), PAPER, tracking=0.16)
# title
mk("ttl_s", "HOY INICIAMOS CON", F_LABEL(30), GREY, **SMALL)
mk("ttl_t", ["ARGOLLAS", "DORADAS"], F_DISPLAY(104), PAPER, tracking=0.05, leading=1.12)
# diptych
mk("dip_s", "ELIGE TU TAMAÑO", F_LABEL(30), GREY, **SMALL)
mk("dip_t", ["DE PEQUEÑAS", "A LARGAS"], F_DISPLAY(92), PAPER, tracking=0.04, leading=1.14)
mk("dip_b", "MUY VERSÁTILES", F_LABEL(35), PAPER, tracking=0.2)
# chapters
for n, title, size in (("1", ["DÍA A DÍA"], 112), ("2", ["OCASIONES", "ESPECIALES"], 88), ("3", ["TRABAJO"], 112)):
    mk(f"ch{n}_s", f"OCASIÓN 0{n} / 03", F_LABEL(30), GREY, **SMALL)
    mk(f"ch{n}_t", title, F_DISPLAY(size), PAPER, tracking=0.04, leading=1.14)
KW = {"1": ["SÚPER", "CORRER", "INSTI", "UNI"], "2": ["EVENTO", "BODA", "BAUTIZO"], "3": ["LOOK MINIMALISTA"]}
KWIMG = {}
for n, words in KW.items():
    f = F_LABEL(35)
    KWIMG[n] = [text_layer([w_], f, PAPER, tracking=0.2) for w_ in words]
    KWIMG[n + "dot"] = text_layer(["·"], f, GREY)
# cta
mk("cta_s", "TU TURNO", F_LABEL(30), GREY, **SMALL)
mk("cta_t", ["¿QUÉ JOYA", "EXPLORAMOS?"], F_DISPLAY(88), PAPER, tracking=0.04, leading=1.14)
mk("cta_b", "CUÉNTAMELO EN LOS COMENTARIOS", F_LABEL(34), PAPER, tracking=0.16)
# end
mk("end_b", "JOYERÍA  &  DISEÑO", F_LABEL(34), PAPER, tracking=0.34)
mk("end_c", "@SANDARA.PE   ·   SANDARA.PE", F_LABEL(27), GREY, tracking=0.26)
# name tag
mk("name_t", "SANDRA", F_DISPLAY(44), PAPER, tracking=0.12, shadow=True)
mk("name_b", "SANDARA  ·  JOYERÍA & DISEÑO", F_LABEL(24), PAPER, tracking=0.24, shadow=True)

# ---------------------------------------------------------------- captions (seg src times)
CAPS = [
    (3.15, 4.26, ["Mi nombre es Sandra"]),
    (4.26, 5.10, ["y en esta serie"]),
    (5.10, 6.41, ["vamos a explorar", "distintas joyas"]),
    (6.41, 7.33, ["para que las puedan usar"]),
    (7.33, 8.2333, ["en distintas ocasiones"]),
    (8.2333, 8.99, ["sin tener que comprar"]),
    (8.99, 10.04, ["una joya nueva"]),
    (10.04, 11.12, ["para cada ocasión"]),
    (20.9667, 22.0667, ["Las puedes llevar"]),
    (32.8333, 34.9333, ["También para", "ocasiones especiales"]),
    (40.18, 40.95, ["Así puedes llevar"]),
    (40.95, 41.70, ["un look minimalista"]),
    (44.6333, 45.35, ["en el trabajo"]),
    (45.82, 46.90, ["porque son sobrias,"]),
    (46.90, 47.40, ["no pesan,"]),
    (47.40, 49.15, ["son súper sencillas", "de usar"]),
    (49.66, 50.74, ["Las puedes combinar"]),
    (50.74, 51.95, ["con todos los colores"]),
    (66.95, 67.50, ["Quédate aquí"]),
    (67.50, 68.94, ["si no quieres estar", "gastando un montón"]),
    (75.98, 77.2667, ["Déjame sacarte", "de tu zona de confort"]),
    (77.75, 79.00, ["¡y a disfrutar", "nuestras joyas!"]),
]
def cap_img(lines):
    t = text_layer(lines, F_CAP, PAPER, tracking=0.015, leading=1.22)
    bb = t.getbbox(); t = t.crop(bb)
    px, py = 34, 24
    box = Image.new("RGBA", (t.width + px * 2, t.height + py * 2), CHARCOAL + (255,))
    box.alpha_composite(t, (px, py))
    return box
CAPS = [(o(a), o(b), cap_img(l)) for a, b, l in CAPS]
CAP_CY = 1395

# ---------------------------------------------------------------- band helper
def band(cv, items, t, top=BAND_Y):
    """items: list of (img, y, appear_time). centred, fade+rise."""
    cv.rect(0, top, W, H, CHARCOAL)
    for img, y, t0 in items:
        k = ease((t - t0) / 0.38)
        cv.put(img, cx=W / 2, y=y - 40 + (1 - k) * 22, alpha=k)   # -40 = text_layer pad

def rule(cv, y, t, t0, w=84):
    k = ease((t - t0) / 0.45)
    cv.rect(W / 2 - w / 2 * k, y, W / 2 + w / 2 * k, y + 2, GREY, alpha=min(1, k * 1.5))

def keywords(cv, n, y, t, times):
    imgs = KWIMG[n]; dot = KWIMG[n + "dot"]; gap = 26
    widths = [im.width - 80 for im in imgs]; dw = dot.width - 80
    total = sum(widths) + (len(imgs) - 1) * (dw + 2 * gap)
    x = W / 2 - total / 2
    for i, im in enumerate(imgs):
        k = ease((t - times[i]) / 0.3)
        if i > 0:
            cv.put(dot, x=x + gap - 40 - (dw + 2 * gap), y=y - 40, alpha=k)
        cv.put(im, x=x - 40, y=y - 40 + (1 - k) * 14, alpha=k)
        x += widths[i] + dw + 2 * gap

def packshot_card(cv, img, p):
    cv.rect(0, 0, W, BAND_Y, PAPER)
    size = 860
    cv.put(contain(img, size, 1.0 + 0.06 * p), cx=W / 2, y=300)
    cv.put(LOGO_DARK, cx=W / 2, y=205)

# ---------------------------------------------------------------- timeline events (output times)
SP_OUT = []; _acc = 0.0
for a, b, c in SPANS:
    SP_OUT.append((_acc, _acc + (b - a))); _acc += b - a
assert abs(_acc - BODY) < 1e-6, (_acc, BODY)
def sp(i, j=None): return (SP_OUT[i][0], SP_OUT[j if j is not None else i][1])
T_HOOK = sp(0)
_cut = snap(o(14.2333))
T_TTL = (SP_OUT[3][0], _cut)
T_DIP = (_cut, SP_OUT[4][1])
T_CH1 = sp(6, 7)
T_CH2A = sp(8); T_CH2B = sp(10)
T_CH3 = sp(12)
T_CTA = sp(16)
T_PACK = sp(18)
T_END = (BODY, TOTAL)
CAM_LOGO = [SP_OUT[i] for i, (a, b, c) in enumerate(SPANS) if c is not None]

def inside(t, r): return round(r[0] * FPS) <= round(t * FPS) < round(r[1] * FPS)

def frame(t):
    cv = Canvas()
    # --- hook band over camera
    if inside(t, T_HOOK):
        band(cv, [(T["hook_s"], 1272, 0.10), (T["hook_t"], 1322, 0.18), (T["hook_b"], 1500, 0.50)], t)
        rule(cv, 1474, t, 0.40)
    # --- title card
    elif inside(t, T_TTL):
        p = (t - T_TTL[0]) / (T_TTL[1] - T_TTL[0]); t0 = T_TTL[0]
        cv.put(kenburns(IMG_A, W, BAND_Y + 2, (0.50, 0.50), 1.0 + 0.05 * p), x=0, y=0)
        band(cv, [(T["ttl_s"], 1272, t0 + 0.05), (T["ttl_t"], 1318, o(12.55))], t)
    # --- diptych
    elif inside(t, T_DIP):
        p = (t - T_DIP[0]) / (T_DIP[1] - T_DIP[0]); t0 = T_DIP[0]
        cv.rect(0, 0, W, BAND_Y, PAPER)
        cv.put(kenburns(IMG_A, 536, BAND_Y, (0.44, 0.56), 2.05 + 0.10 * p), x=0, y=0)
        cv.put(contain(IMG_B, 500, 1.0 + 0.05 * p), x=562, y=380)
        band(cv, [(T["dip_s"], 1272, t0 + 0.05), (T["dip_t"], 1318, t0 + 0.12), (T["dip_b"], 1556, o(20.62))], t)
        rule(cv, 1536, t, o(20.60))
    # --- chapter 1
    elif inside(t, T_CH1):
        p = (t - T_CH1[0]) / (T_CH1[1] - T_CH1[0]); t0 = T_CH1[0]
        packshot_card(cv, IMG_B, p)
        band(cv, [(T["ch1_s"], 1272, t0 + 0.04), (T["ch1_t"], 1322, t0 + 0.10)], t)
        rule(cv, 1474, t, t0 + 0.45)
        keywords(cv, "1", 1502, t, [o(24.50), o(25.30), o(27.15), o(28.05)])
    # --- chapter 2 (two visits)
    elif inside(t, T_CH2A) or inside(t, T_CH2B):
        t0 = T_CH2A[0]; span = (T_CH2A[1] - T_CH2A[0]) + (T_CH2B[1] - T_CH2B[0])
        el = (t - T_CH2A[0]) if inside(t, T_CH2A) else (T_CH2A[1] - T_CH2A[0]) + (t - T_CH2B[0])
        packshot_card(cv, IMG_C, el / span)
        band(cv, [(T["ch2_s"], 1272, t0 + 0.04), (T["ch2_t"], 1318, t0 + 0.10)], t)
        rule(cv, 1536, t, T_CH2B[0] + 0.05)
        keywords(cv, "2", 1560, t, [o(35.50), o(36.95), o(37.30)])
    # --- chapter 3
    elif inside(t, T_CH3):
        p = (t - T_CH3[0]) / (T_CH3[1] - T_CH3[0]); t0 = T_CH3[0]
        cv.put(kenburns(IMG_A, W, BAND_Y + 2, (0.46, 0.55), 1.55 + 0.08 * p), x=0, y=0)
        band(cv, [(T["ch3_s"], 1272, o(42.10)), (T["ch3_t"], 1322, o(42.18))], t)
        rule(cv, 1474, t, t0 + 0.05)
        keywords(cv, "3", 1502, t, [t0 + 0.02])
    # --- CTA band over camera
    elif inside(t, T_CTA):
        t0 = T_CTA[0]
        band(cv, [(T["cta_s"], 1272, t0 + 0.06), (T["cta_t"], 1318, t0 + 0.14), (T["cta_b"], 1560, t0 + 0.9)], t)
        rule(cv, 1536, t, t0 + 0.8)
    # --- packaging full-bleed
    elif inside(t, T_PACK):
        p = (t - T_PACK[0]) / (T_PACK[1] - T_PACK[0])
        cv.put(kenburns(IMG_E, W, H, (0.55, 0.60), 1.12 + 0.06 * p), x=0, y=0)
    # --- end card
    elif t >= T_END[0] - 1e-6:
        e = t - T_END[0]
        cv.rect(0, 0, W, H, (0, 0, 0), alpha=ease(e / 0.30))
        k = ease((e - 0.25) / 0.5)
        cv.put(LOGO_END, cx=W / 2, y=800 + (1 - k) * 16, alpha=k)
        rule(cv, 800 + LOGO_END.height + 52, t, T_END[0] + 0.55, w=110)
        k2 = ease((e - 0.7) / 0.45)
        cv.put(T["end_b"], cx=W / 2, y=800 + LOGO_END.height + 84 - 40, alpha=k2)
        k3 = ease((e - 0.95) / 0.45)
        cv.put(T["end_c"], cx=W / 2, y=800 + LOGO_END.height + 160 - 40, alpha=k3)
    # --- watermark on camera shots
    if any(inside(t, r) for r in CAM_LOGO):
        cv.put(LOGO_DARK, cx=W / 2, y=205, alpha=0.88)
    # --- captions
    for a, b, img in CAPS:
        if inside(t, (a, b)):
            k = ease((t - a + 1 / FPS) / 0.14)
            cv.put(img, cx=W / 2, y=CAP_CY - img.height / 2 + (1 - k) * 12, alpha=k)
    return cv.bytes() if cv.used else EMPTY

# ---------------------------------------------------------------- render
def render(out_path, frames=None, crf=17):
    base = os.path.join(OUT, "base.mov")
    if frames is None:
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", base, "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
               "-filter_complex", "[0:v][1:v]overlay=format=auto:shortest=1,format=yuv420p[v]", "-map", "[v]", "-map", "0:a",
               "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-profile:v", "high", "-level", "4.2",
               "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
               "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out_path]
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for i in range(NFR):
            p.stdin.write(frame(i / FPS))
        p.stdin.close()
        if p.wait() != 0: raise subprocess.CalledProcessError(p.returncode, cmd)
    else:
        for t in frames:
            n = int(round(t * FPS)); tt = n / FPS
            raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{tt:.4f}", "-i", base, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                 capture_output=True, check=True).stdout
            bg = Image.frombytes("RGB", (W, H), raw).convert("RGBA")
            fg = Image.frombytes("RGBA", (W, H), frame(tt))
            Image.alpha_composite(bg, fg).convert("RGB").resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(OUT, f"pv_{tt:06.2f}.jpg"), quality=88)

if __name__ == "__main__":
    mode = args.mode
    if mode == "info":
        print("BODY", BODY, "TOTAL", TOTAL, "frames", NFR)
        for (a, b), off in zip(SEGS, OFF): print(f"  src {a:6.2f}-{b:6.2f} -> out {off:6.2f}-{off+b-a:6.2f}")
    elif mode == "base": build_base()
    elif mode == "bounds":
        ts = []
        for a, b in SP_OUT[1:]: ts += [a - 1 / FPS, a]
        print(" ".join(f"{x:.3f}" for x in ts)); render(None, ts)
    elif mode == "preview": render(None, [float(x) for x in args.values])
    elif mode == "final": render(args.values[0])
