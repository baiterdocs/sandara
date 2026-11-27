# Traspaso: continuar Sandara en otro Claude (macOS)

> Escrito el 27-nov-2026 desde Windows, rama `diseno/home-artboard`.
> La memoria de Claude (`~/.claude/projects/.../memory/`) **no viaja con git**. Aquí está resumido lo que esa memoria sabe para que el Claude de la Mac arranque con el mismo contexto.

## Cómo empezar en la Mac

```sh
git clone https://github.com/baiterdocs/sandara.git   # o git pull si ya existe
cd sandara
git checkout diseno/home-artboard
npm install            # solo si vas a correr Playwright
```

Leer primero, en este orden: `MARCA.md` → `PRODUCT.md` → `DESIGN.md` → este archivo.

---

## Qué trae este commit

| Archivo | Qué es |
|---|---|
| `whatsapp/respuestas-rapidas.md` | **Nuevo (hoy).** Textos finales de WhatsApp Business: bienvenida, ausencia y 8 respuestas rápidas. |
| `MARCA.md` | Visión de marca y colores (26-nov). Orden: plata peruana de autor → atelier → acero hipoalergénico. |
| `wix/custom-code/intuitivo.js` | Borrado: lo reemplaza `intuitivo-publicado.html` (ver `wix/custom-code/README.md`). |
| `wix/custom-code/intuitivo-head.html` | Bloque CSS para el `<head>` que acompaña a `intuitivo.js`. |
| `wix/custom-code/intuitivo-publicado.html`, `portada-completa-publicado.html`, `portada-slideshow.html` | Copias de los bloques de código personalizado tal como estaban en Wix. **Están APAGADOS en Wix** (ver reglas abajo). |
| `wix/frontend/pagina-inicio.js` | Código de página (Velo) que calcularía «N piezas · desde S/ X» por colección. Preparado, **sin activar**. |
| `wix/public/medios-de-pago.svg` | Logos de medios de pago (usado en el pie de página). |
| `package.json`, `package-lock.json`, `playwright.config.ts`, `tests/example.spec.ts` | Andamiaje de Playwright recién creado; el test es el ejemplo por defecto, todavía no prueba sandara.pe. |

---

## Trabajo de hoy: WhatsApp Business

**Hecho y verificado** (en WhatsApp Web, cuenta Sandara Business):
- 8 respuestas rápidas guardadas: `/hola`, `/navidad`, `/precios`, `/pago`, `/envio`, `/separar`, `/gracias`, `/cuidado`. La `/gracias` anterior («Gracias por preferirnos…») se reemplazó.
- Textos exactos en `whatsapp/respuestas-rapidas.md`.

**Pendiente:**
- **Mensaje de bienvenida y de ausencia**: WhatsApp Web no tiene esas opciones. Se configuran desde el celular (⋮ → Herramientas para la empresa). Textos listos en el mismo archivo.
- Para la ausencia falta el **horario real de atención** (poner primero en Perfil de empresa).
- `/navidad` se acompañará con **imágenes de cada regalo** (aún no hechas).
- Confirmar plazos de envío (3–5 días Lima, 3–7 provincias) y la separación de 24 h.
- En WhatsApp Web aparece «Meta Business Agent» (respuestas automáticas con IA). No se tocó.

**Lo que no funcionó (para no repetirlo):**
- La app de escritorio de WhatsApp en Windows sale en negro con computer use (la dibuja WebView2). En Mac puede ser distinto; si no, usar WhatsApp Web en Chrome.
- En la extensión Claude in Chrome hay dos navegadores conectados. El que tenía WhatsApp Web de **otra cuenta** (no Sandara) no se debe usar. Se vinculó Sandara Business por QR en el otro perfil.
- En el formulario de respuesta rápida: saltos de línea con **Shift+Enter** (Enter guarda). Los `ref` del diálogo cambian cada vez: buscarlos con `find` tras abrir el «+».

---

## Contexto del negocio que la memoria tenía (no está en git)

### Reglas de trabajo
- **Diseño en el editor de Wix, no con código.** Los 4 bloques de Código personalizado (Diseño intuitivo CSS head, portada completa, Portada slideshow, Diseño intuitivo cuerpo) están **apagados**, no borrados. No reactivarlos ni agregar código sin preguntar. Motivo: el código desbarataba la página y lo publicado no coincidía con el editor.
- La barra negra de envío (franja comp-mwq61am9) va arriba del todo en escritorio y en celular.
- Textos públicos: no decir «pack», decir **«regalo»**. No decir «pide por WhatsApp»; usar «Atención personal», «Pagos flexibles», «Reservar mi regalo». **Nunca mencionar «Xuping».**
- Títulos de acero en Marketplace: «Dije X – Acero con doble enchape de oro de 18k» (no «baño de oro»).

### Campaña Navidad 2026: «El arte de regalar»
- Vigencia propuesta 27-nov-2026 → 6-ene-2027. Paleta de temporada verde bosque, cobre, dorado y marfil (excepción a la marca blanco y negro; falta aprobación de Sandra).
- Seis regalos («Lo que dices al regalar»):
  - N°01 Gratitud S/ 89.90: aretes + collar, acero
  - N°02 Complicidad S/ 39.90: 2 pares de aretes pequeños, acero
  - N°03 Celebración S/ 79.90: dúo de argollas, acero
  - N°04 Legado S/ 119.90: dos dijes iguales en plata, mamá e hija
  - N°05 Admiración S/ 139.90: aretes + cadena con dije, plata; piedra pirita, turmalina o cuarzo
  - N°06 Ternura S/ 179.90: collar, dije y aretes, plata 950 con cuarzo
- En Wix: página `/regalos-navidad` (id ryyhe) y sección «El arte de regalar» en la home (comp-mwyd0bds, carrusel comp-mwydjw1f con 6 diapositivas, fotos provisionales).

### Pagos y envíos
- Yape o Plin: 949 209 933 (Sandra Carpio). Tarjeta: **Culqi fuera de Wix** (enlace de pago). En Wix solo están los pagos manuales; Culqi no se integra con Wix. No conectar pasarelas sin preguntar (comisiones).
- Envíos: Lima S/ 8 (3–5 días), provincias S/ 20 (3–7 días, Olva o Shalom), gratis desde S/ 300. Entrega sin costo en Open Plaza Angamos, Real Plaza Primavera o Estación del Tren de Angamos.

### Wix: trucos que ahorran tiempo
- En el editor clásico, el iframe `#preview` expone `window[0].documentServices` (`ds`): `ds.components.get.byId(id)`, `layout.update`, `data.update`, `properties.update`, `serialize` + `add`, `remove`. Para móvil, `{id, type:'MOBILE'}`; el diseño móvil se regenera al cambiar a la vista de celular.
- El encabezado del sitio es fijo (159,5 px) y tapa lo que va arriba de cada página.
- Portada: slideshow comp-mwq687xx. Galería Atelier de la home = categoría ATELIER PORTADA (agregar ahí lo que deba verse en portada).
- Para seleccionar elementos tapados: clic derecho → «Elementos superpuestos». Para textos pegados al borde: clic derecho en la sección → «Edición rápida».
- Pendiente de antes: en celular, el botón «¿Te ayudamos? WhatsApp» (comp-mwpinpze) queda tapado; el editor móvil no permite fijarlo. Opciones: «Barra de acciones» o código (preguntar).

### Facebook / Marketplace
- Hacerlo en el perfil de Chrome **Sandara**. Al 26-nov: 17 piezas de plata y 22 dijes de acero publicados; faltan ~133 de acero y Atelier. Cada descripción termina con el bloque de envíos (Olva o Shalom; puntos de entrega; «Escríbenos…»). Rechazar siempre «Promocionar» (es de pago).
