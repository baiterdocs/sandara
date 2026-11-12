# Sandara — Branding y sistema de diseño

> Fuentes: https://www.sandara.pe/ (captura Firecrawl + navegador, 10-nov-2026, escritorio 1920px) e https://www.instagram.com/sandara.pe/ (perfil público, sin iniciar sesión).
> Evidencia guardada: `.firecrawl/design-reference.json`, `.firecrawl/design-reference.png` (página completa), `.firecrawl/logo.png`, `.firecrawl/og.png`.
> Leyenda: **[medido]** = valor leído del CSS computado · **[visual]** = estimado a partir de capturas · **[propuesta]** = sugerencia de implementación.

---

## 1. Esencia de marca

| | |
|---|---|
| Nombre | **SANDARA** (siempre en mayúsculas en el logotipo) |
| Categoría | Joyería de autor en plata, elaborada en Sandara, y bisutería de alta calidad de **Selección Sandara** |
| Bio de Instagram observada el 10-nov-2026 (referencia histórica, no texto aprobado) | "SANDARA \| Joyería & Diseño · Diseño de autor y tendencias seleccionadas. • Piezas hipoalergénicas • Plata 950 & 925 •" |
| Tagline del footer | "Joyería minimalista, hecha para acompañar el día a día." / "Diseño minimalista · Lima, Perú" |
| Tono | Minimalista, elegante, cercano, artesanal ("Atelier", "cada detalle", "delicadeza"). Español peruano, tuteo ("Únete", "Descubre"). |
| Personalidad visual | Monocromo negro/blanco, mucho aire, la joya como protagonista sobre fondo claro; toques de lujo vía serif clásica en mayúsculas. |

**Criterio de marca confirmado por Luis (12-nov-2026)**
- **Joyería de autor** es esencial en la identidad de Sandara y se mantiene en la comunicación de sus piezas de plata. Todas las piezas de plata se elaboran en Sandara.
- La bisutería se presenta públicamente como **Selección Sandara**. No incluir nombres de proveedores en textos, metadatos ni materiales públicos.
- No atribuir a la bisutería fabricación propia. No extender a toda la colección propiedades de una pieza, como material, baño, piedras naturales o carácter hipoalergénico.
- Portada (actualizado 12-nov-2026, decisión de Luis): se adopta la portada del artboard «Web — home propuesta»: franja negra con el titular «Joyería de autor en plata 950», subtítulo, botones «Ver el atelier» y «Novedades», y foto a la derecha; debajo, bloque «Atelier / Selección Sandara». Reemplaza la regla anterior de mantener retirado el bloque de portada.
- Mantener el logotipo original, la paleta blanca y negra y las tipografías de la marca.

**Mensajes clave observados**
- "DESCUBRE SANDARA" · "EL ATELIER" · "Novedades antes que nadie"
- "Cada pieza de nuestro Atelier es elaborada con especial cuidado, prestando atención a cada detalle…"
- CTA: "AGREGAR AL CARRITO", "UNIRME AL CANAL" (WhatsApp), "Cargar más", "Vista rápida"
- Badges: "Nuevo", "Más vendido", "Agotado"
- Nombres de producto evocadores y femeninos: Azalea, Antonella, Sienna, Liria, Qantu (quechua), Romelia, Dalia, Noir Amour, Áurea, Royal Blue.

## 2. Logotipo

- **Wordmark "SANDARA"**: display de alto contraste — astas gruesas combinadas con diagonales de trazo finísimo (hairline), sin serifas marcadas, estilo editorial/moda. [visual] (`.firecrawl/og.png`)
- Versiones vistas:
  - Blanco sobre negro (header y footer del sitio) — `.firecrawl/logo.png` es la versión blanca con fondo transparente.
  - Negro sobre blanco (OG image, avatar circular de Instagram).
  - Marca de agua blanca pequeña "SANDARA" abajo-derecha en posts de Instagram.
- La tipografía exacta del logo no está identificada (es imagen). Alternativas libres parecidas **[propuesta]**: *Bodoni Moda* (mayúsculas, 600), *Playfair Display SC*, *Gloock*. Para fidelidad usar siempre el PNG/SVG original.
- URLs:
  - Logo blanco: `https://static.wixstatic.com/media/6720f3_8dc2fac4d8c149219889551bfd6505fd~mv2.png`
  - Wordmark negro (OG): `https://static.wixstatic.com/media/6720f3_4004e05604414930aa8e0b69f9fcb33f~mv2.png`
  - Favicon: `https://static.wixstatic.com/media/6720f3_ac8588bf0cea4b7ba636d2c62134a08f~mv2.jpg`

## 3. Color

| Rol | Hex | Fuente | Uso |
|---|---|---|---|
| `--ink` (negro marca) | `#000000` | [medido] | Header, footer, avatar IG, fondos de piezas promocionales ("CYBER WOW") |
| `--charcoal` (texto / botón) | `#2F2E2E` | [medido] | Texto principal, títulos, botones primarios, banda "El Atelier" |
| `--graphite` | `#605E5E` | [medido] | Texto secundario / estados |
| `--paper` | `#FFFFFF` | [medido] | Fondo general, texto sobre negro |
| `--mist` | `#F6F6F6` | [medido] | Fondo de tarjetas de producto y badges "Nuevo" |
| `--disabled` | `~#B5B5B5` | [visual] | Botón "AGOTADO" |
| Acentos de producto | dorado, plata, amatista morado, perla | [visual] | Vienen de la fotografía, no de la UI |

Firecrawl detectó `#2B5672` (azul) y `#E03939` (rojo) como primary/link, pero **no aparecen en ninguna parte visible** — son restos del tema Wix. No usarlos.

**Regla**: paleta estrictamente acromática; el color lo aporta la joya.

## 4. Tipografía

| Rol | Familia | Tamaño / peso | Fuente |
|---|---|---|---|
| Display / H2 de sección | **Cinzel** (serif romana, solo mayúsculas visuales) | 56px / 400 ("EL ATELIER", "Novedades antes que nadie"); 33px / 400 ("DESCUBRE SANDARA") | [medido] |
| Nombre de producto | **Cinzel** | 19px / 700, mayúsculas | [medido] |
| Cuerpo, botones, navegación | **Josefin Sans** | 16–20px / 400; botones en MAYÚSCULAS con tracking amplio | [medido] tracking [visual] |
| Títulos de slider / precios | Avenir LT 85 Heavy / 35 Light | 20px / 700; 16px light | [medido] |
| Precio | Josefin Sans / Avenir Light | ~14–16px, gris, formato `S/ 140.00` | [visual] |

Todas disponibles en Google Fonts salvo Avenir (sustituir por **Nunito Sans** o **Montserrat** light/bold) **[propuesta]**.

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Josefin+Sans:wght@300;400;600&display=swap');
```

## 5. Layout y componentes (escritorio)

1. **Header** negro sólido, ~180px de alto [medido], logo blanco centrado. Iconos IG/TikTok flotantes abajo-derecha.
2. **Hero "Descubre Sandara"**: carrusel horizontal de fotos verticales (507×676, ratio 3:4) [medido], mezcla de packshot sobre blanco y fotos de modelo (cuello, oreja, mano) con luz natural.
3. **Banda "El Atelier"**: fondo `#2F2E2E`, slider de productos destacados con nombre en blanco (Avenir Heavy) y precio debajo, párrafo centrado en Josefin Sans blanco.
4. **Tienda**: sidebar izquierda con filtros en mayúsculas pequeñas (PLATA DE LEY 950 & 925, ATELIER, ANILLOS, ARETES, PULSERAS, COLLARES, PIERCINGS); grilla de **3 columnas**, imágenes cuadradas sobre `#F6F6F6`, gap ~16px [visual], icono corazón (wishlist) arriba-derecha.
   - Badge "Nuevo": chip pequeño fondo `#F6F6F6`, texto negro ~11px. "Más vendido": chip gris oscuro con texto blanco.
   - Botón primario: ancho completo, fondo `#2F2E2E`, texto blanco MAYÚSCULAS Josefin Sans, **border-radius 0**, sin sombra [medido].
   - Botón secundario ("Cargar más"): blanco con borde 1px charcoal, radius 0 [medido].
5. **Newsletter/WhatsApp**: título Cinzel 56px, subtítulo pequeño centrado, botón negro "UNIRME AL CANAL".
6. **Testimonios**: foto full-bleed desenfocada de fondo + tarjeta blanca centrada con cita en Cinzel mayúsculas y autor ("Mariana L., Pe"); flechas finas blancas y puntos.
7. **Footer** negro: logo blanco + tagline a la izquierda; columnas "CONTACTO" (Whatsapp, Instagram, Lima, Perú) y "SANDARA" (Colección, Nosotros); línea divisoria fina; "© 2026 Sandara".

**Principios**: esquinas rectas en todo, sin sombras, divisores de 1px, mucho espacio en blanco, contenido centrado (~1100px de ancho útil [visual]).

## 6. Instagram

- Avatar: wordmark negro sobre círculo blanco.
- Highlights con portadas fotográficas (no iconos): Handmade, Lookbook, Joyas de acero, Comprar, Clientas, Ferias — fotos cálidas, beige/doradas.
- Feed: fotografía de producto en uso (oreja, mano, muñeca) con fondos verdes de planta desenfocados o superficies claras; packshots sobre gris claro; piezas promo en **fondo negro con titular sans bold blanco en mayúsculas** ("CYBER WOW", "HASTA 50% DE DESCUENTO") y logo abajo.
- Anotaciones finas tipo flecha + texto pequeño blanco sobre la foto para explicar el producto (estilo editorial).
- Firma: wordmark "SANDARA" blanco pequeño, abajo-derecha o centrado abajo.

## 7. Tokens para implementar [propuesta]

```css
:root {
  --ink: #000000;
  --charcoal: #2F2E2E;
  --graphite: #605E5E;
  --paper: #FFFFFF;
  --mist: #F6F6F6;
  --disabled: #B5B5B5;

  --font-display: 'Cinzel', 'Times New Roman', serif;
  --font-body: 'Josefin Sans', 'Helvetica Neue', Arial, sans-serif;

  --radius: 0;
  --border: 1px solid var(--charcoal);
  --space-unit: 4px;          /* base detectada */
  --container: 1100px;
  --tracking-caps: 0.08em;    /* botones y labels en mayúsculas [visual] */
}
.btn-primary { background: var(--charcoal); color: var(--paper); font: 400 15px/1 var(--font-body);
  text-transform: uppercase; letter-spacing: var(--tracking-caps); padding: 12px 20px; border-radius: 0; }
.btn-secondary { background: var(--paper); color: var(--charcoal); border: var(--border); border-radius: 0; }
h2.section { font: 400 56px/1.1 var(--font-display); color: var(--charcoal); text-align: center; }
.product-name { font: 700 19px/1.2 var(--font-display); text-transform: uppercase; }
```

## 8. Pendientes / límites

- Fuente exacta del wordmark sin identificar (es imagen).
- Solo se inspeccionó escritorio; no se verificó layout móvil, hovers ni animaciones.
- Instagram visto sin sesión: solo cabecera, highlights y primeras ~6 publicaciones.
- Logos, fotos y textos son propiedad de Sandara; úsalos solo si tienes derecho (p. ej., si trabajas para la marca).
