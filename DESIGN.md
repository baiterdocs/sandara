# Sandara — sistema visual (blanco y negro de alto diseño, vigente desde 13-nov-2026)

> Fuentes: `Sistema visual — propuesta.pdf` (Propuesta 02) y la home «Web — home propuesta» de Claude Design (canvas «Sandara · Exploraciones de marca»). Reemplaza el sistema anterior de negro y blanco puro de Wix.
> Lo que NO cambia: el logotipo (serif de alto contraste, solo en negro o blanco), Cinzel y Avenir (Nunito Sans de respaldo web), los nombres con identidad (Qantu, Señor de los Milagros) y el empaque blanco y negro.

## 1. Qué es Sandara (hechos confirmados)

- Joyería de Lima, Perú. Dos materiales:
  1. **Plata 950 y 925**, elaborada en Sandara. «Joyería de autor» es esencial a la identidad.
  2. **Acero hipoalergénico con doble enchapado de oro de 18 k.**
- **Selección Sandara:** bisutería de alta calidad elegida por su diseño. No se nombran proveedores ni se atribuye fabricación propia.
- **Cada ficha dice su material exacto:** si es plata, plata; si es acero, acero con doble enchapado de oro de 18 k; con el nombre de las piedras cuando las hay. Nunca se extiende la propiedad de una pieza a toda la colección. Un mensaje general (cintillo, título SEO) debe nombrar los dos materiales, no solo «plata» ni solo «hipoalergénico».
- Pendiente de confirmar con Sandra: si el acero con oro de 18 k va bajo «Selección Sandara» o es una línea propia.
- Pagos manuales (Yape, Plin, transferencia) coordinados por WhatsApp. No hay pasarela.

## 2. Paleta (alto diseño: blanco, negro y la joya como único brillo)

Decisión del 13-nov-2026: se descartan el marfil, el lino y el crema. Se ven «de tienda de barrio». La referencia es la joyería de lujo (Cartier, Louis Vuitton, Gucci): contraste puro, mucho aire y fotografía protagonista.

| Token | Nombre | Hex | Uso |
|---|---|---|---|
| `--negro` | Negro | `#0A0A0A` | Texto, botón principal, franjas oscuras, logo |
| `--blanco` | Blanco | `#FFFFFF` | Fondo general y fondo de producto |
| `--gris-2` | Gris texto | `#5A5A5A` | Texto secundario sobre blanco (7.0:1) |
| `--gris-claro` | Gris sobre negro | `#A6A6A6` | Texto secundario sobre negro (8.3:1) |
| `--gris-fondo` | Gris de foto | `#F2F2F2` | Solo fondo de foto de producto, nunca de sección |

- Sin colores de apoyo: ni dorado, ni beige, ni rojo. Las pocas veces que se necesite un énfasis, es peso o tamaño, no color.
- Filetes de 1 px en negro sobre blanco (o blanco sobre negro) como único adorno.
- El color lo pone la joya: oro de 18 k, plata, piedras. Fotos en su color natural, enmarcadas por blanco o negro.
- En Wix: base clara `#FFFFFF`, base oscura `#0A0A0A`, acentos en negro y gris `#6B6B6B`.

## 3. Tipografía

| Rol | Fuente | Detalle |
|---|---|---|
| Títulos, nombres de pieza, números N° | **Cinzel** 400 | Titular hero `clamp(44px, 5.4vw, 84px)`, interlineado 1.02; sección 44 px; pieza 22 px |
| Texto, precios, botones | **Avenir** (web: Nunito Sans 300–700) | Cuerpo 16–18 px, interlineado 1.6, medida ≤ 65 caracteres |
| Etiquetas | Avenir mayúsculas | 12–13 px, tracking 0.2–0.32 em |

Fuera: scripts y fuentes de campaña (Cyber Wow, Anniversary).

## 4. Componentes

- **Filete de 1 px** (`--negro` sobre blanco, `--blanco` sobre negro) como único adorno. Sin sombras, sin degradados, esquinas rectas.
- **Numeración «N° 07»** en cada pieza, como catálogo de autor, junto a su línea (Atelier o Selección).
- **Etiqueta de línea:** cuadro de 1 px con el nombre en mayúsculas pequeñas. Distinta para Atelier (borde negro) y para Selección (borde gris `#5A5A5A`).
- **Botón principal:** fondo negro, texto blanco, mayúsculas con tracking 0.24 em. **Secundario:** borde 1 px negro. Nunca el azul por defecto de Wix.
- **Tarjeta de pieza:** foto 4:5 con filete, fila «N° · línea», nombre en Cinzel 22 px bajo un filete, precio.
- **Ritmo de la página:** alternar bloques negro y blanco. La home sigue el artboard de Claude Design: cintillo, encabezado centrado, hero blanco con foto, dos líneas (N° 01 Atelier / N° 02 Selección), Esenciales hoy, bloque «El atelier» con foto y texto, cita de clienta, canal de WhatsApp y pie.
- **Cintillo superior** (negro, 11 px, tracking): «Plata 950 & 925 · Acero hipoalergénico con doble enchapado de oro 18 k · Envíos a todo el Perú».

## 5. Pulido (better-ui) para todo HTML y CSS propio

- Radios anidados: radio exterior = interior + relleno. Esquinas rectas en botones y tarjetas de marca.
- Imágenes de contenido con contorno `1px` inset, `oklch(0 0 0 / 0.1)` (nunca un gris cálido, para que no tiña el borde).
- Botón presionado: escala `0.96` en `150ms ease-out`; deshabilitado no escala.
- Transiciones nombradas (`opacity`, `background-color`, `scale`), nunca `all`. Hover solo bajo `@media (hover: hover)`.
- Movimiento detrás de `prefers-reduced-motion: no-preference`; con reducción, solo fundido de opacidad. Una entrada con escalonado de `100ms` como máximo, en el hero.
- Íconos con `currentColor` y trazo `1.5px`, de una sola librería.

## 6. Cómo se aplica en Wix

1. **Diseño del sitio → Colores:** base clara #FFFFFF, base oscura #0A0A0A, acentos en negro y gris #6B6B6B. Fondo de página en blanco y texto en negro.
2. **Temas de texto:** títulos en Cinzel y párrafos en Avenir/Nunito Sans, con los tamaños de §3.
3. **Botones:** estilo principal y secundario de §4; eliminar el azul.
4. **Secciones de la home** según el artboard, por fases con publicación entre cada una.
5. Wix no controla animaciones ni curvas al detalle; esas reglas de §5 aplican solo a HTML propio (simulación local o una web futura).

## 7. Mensajes y términos

- Español peruano, tuteo. «Atelier» para la plata de autor; «Selección Sandara» para la bisutería.
- Evitar frases de relleno («con cuidado en cada detalle»). Preferir hechos: material, piedras, medidas, dónde se elabora.
- No inventar reseñas, cifras ni certificaciones. Testimonios solo reales y con permiso.

## 8. Pendientes

- Foto de Sandra o del atelier y 2–3 líneas suyas para el bloque «El atelier» (el artboard trae un texto de relleno entre corchetes que no se publica).
- Material y piedras de cada ficha.
- Confirmar dónde va el acero con oro de 18 k (§1).
