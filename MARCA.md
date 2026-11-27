# Sandara — visión de marca y colores

> Documento de referencia rápida (26-nov-2026). Resume la identidad de Sandara para quien diseñe, escriba o publique en su nombre. El detalle técnico vive en `DESIGN.md` (sistema visual) y `PRODUCT.md` (negocio y clienta).
>
> Orden de la marca (26-nov-2026): **1.** diseño de autor en plata peruana, **2.** atelier, **3.** acero hipoalergénico.

## 1. Visión

**Diseño de autor en plata peruana, para llevar todos los días.**

Sandara es una joyería de Lima. Lo principal es su diseño de autor en plata peruana, elaborado en su propio atelier. La colección se completa con acero hipoalergénico con doble enchapado de oro de 18 k. Queremos que una mujer tenga una joya con nombre, material claro y origen conocido sin esperar una ocasión especial para usarla.

> Propuesta de redacción. Validar la frase con Sandra antes de publicarla.

## 2. Qué nos define

En este orden de importancia:

| Pilar | En la práctica |
|---|---|
| **1. Diseño de autor en plata peruana** | Lo principal de la marca. Piezas de plata 950 y 925 con diseño propio y nombre con identidad. |
| **2. Atelier** | Las piezas de plata se elaboran en el atelier de Sandara, en Lima. |
| **3. Acero hipoalergénico** | Acero hipoalergénico con doble enchapado de oro de 18 k, para el uso diario. |
| **Verdad en cada pieza** | Cada ficha dice su material exacto (plata, o acero hipoalergénico con doble enchapado de oro de 18 k) y el nombre de sus piedras. Nunca se extiende la propiedad de una pieza a toda la colección. |
| **La joya es la protagonista** | La interfaz es blanco y negro. El color lo pone la pieza: oro, plata y piedras. |
| **Trato directo** | Pedido, pago (Yape, Plin, transferencia) y entrega se coordinan por WhatsApp. Es una decisión, no una carencia. |
| **Para el día a día** | Piezas minimalistas para usar seguido o para regalar. |

### Dos líneas

- **Atelier (N° 01):** plata de autor elaborada en Sandara.
- **Selección Sandara (N° 02):** bisutería de alta calidad elegida por su diseño. No se nombran proveedores ni se le atribuye fabricación propia.

## 3. Para quién

Mujeres de 20 a 40 años en Lima que descubren las piezas en Instagram (@sandara.pe), entran desde el celular y buscan joyas para el día a día o para regalar.

## 4. Personalidad y voz

- **Sobria, segura, cercana.** Alto diseño sin distancia: tuteo y español peruano.
- **Hechos antes que adjetivos.** Material, piedras, medidas y dónde se elabora. Nada de «con cuidado en cada detalle».
- **Nombres con identidad:** Qantu, Señor de los Milagros. Cada pieza lleva su número «N° 07», como un catálogo de autor.
- **Nunca inventar:** ni reseñas, ni cifras, ni certificaciones, ni premios. Testimonios solo reales y con permiso.

| Sí | No |
|---|---|
| «Aretes de plata 950 con cuarzo rosa, elaborados en Sandara.» | «Hermosos aretes hechos con amor.» |
| «Acero hipoalergénico con doble enchapado de oro de 18 k.» | «Toda nuestra joyería es hipoalergénica.» |
| «Escríbenos por WhatsApp y coordinamos tu entrega.» | «¡Compra ya antes de que se acabe!» |

## 5. Colores

Blanco, negro y la joya como único brillo. Referencia: la joyería de lujo (contraste puro, mucho aire, fotografía protagonista). Desde el 13-nov-2026 se descartan el marfil, el lino y el crema.

| Token | Nombre | Hex | RGB | Uso | Contraste |
|---|---|---|---|---|---|
| `--negro` | Negro | `#0A0A0A` | 10 10 10 | Texto, logo, botón principal, franjas oscuras | 19.8:1 sobre blanco |
| `--blanco` | Blanco | `#FFFFFF` | 255 255 255 | Fondo general y fondo de producto | — |
| `--gris-2` | Gris texto | `#5A5A5A` | 90 90 90 | Texto secundario sobre blanco; borde de etiqueta «Selección» | 7.0:1 sobre blanco |
| `--gris-claro` | Gris sobre negro | `#A6A6A6` | 166 166 166 | Texto secundario sobre negro | 8.3:1 sobre negro |
| `--gris-fondo` | Gris de foto | `#F2F2F2` | 242 242 242 | Solo fondo de foto de producto, nunca de sección | — |
| (Wix) | Acento gris | `#6B6B6B` | 107 107 107 | Acento en la paleta del editor de Wix | 5.3:1 sobre blanco |

```css
:root {
  --negro: #0A0A0A;
  --blanco: #FFFFFF;
  --gris-2: #5A5A5A;
  --gris-claro: #A6A6A6;
  --gris-fondo: #F2F2F2;
}
```

### Reglas de color

- **Sin colores de apoyo:** ni dorado, ni beige, ni rojo. El énfasis se da con peso o tamaño, no con color.
- **Único adorno:** filete de 1 px en negro sobre blanco, o blanco sobre negro. Sin sombras, sin degradados, esquinas rectas.
- **El logotipo** va solo en negro o en blanco.
- **Fotos en su color natural**, enmarcadas por blanco o negro. No se tiñen ni se filtran.
- **Ritmo:** alternar bloques blancos y negros a lo largo de la página.
- **Nunca** el azul por defecto de Wix en botones o enlaces.
- Contraste mínimo WCAG AA en todo texto; las combinaciones de la tabla lo cumplen.

## 6. Tipografía (resumen)

| Rol | Fuente |
|---|---|
| Títulos, nombres de pieza, números N° | **Cinzel** 400 |
| Texto, precios, botones | **Avenir** y **Nunito Sans** (300–700); en la web se usa Nunito Sans |
| Etiquetas | Avenir o Nunito Sans en mayúsculas, 12–13 px, tracking 0.2–0.32 em |

Fuera: scripts y fuentes de campaña. Tamaños exactos en `DESIGN.md` §3.

## 7. Lo que no cambia

El logotipo (serif de alto contraste), Cinzel, Avenir y Nunito Sans, los nombres con identidad de las piezas y el empaque en blanco y negro.

## 8. Pendientes

- Validar la frase de visión (§1) con Sandra.
- Confirmar si el acero con oro de 18 k va bajo «Selección Sandara» o es una línea propia.
- Foto de Sandra o del atelier y 2–3 líneas suyas para el bloque «El atelier».
