# Sandara · Wix: implementación CRO + Velo + Meta + SEO
> Estado revisado el 11/11/2026: este documento contiene propuestas y código preparado; no acredita su instalación en Wix. El catálogo de la simulación es una muestra de 20 piezas; el editor contiene 153 productos.
> Configuración verificada: pago manual por Yape/Plin; link de pago y transferencia por consulta en WhatsApp 949 209 933. Izipay, Mercado Pago y PayPal no conectados. Envío Lima S/ 8, nacional S/ 20, gratis desde S/ 300; recojo coordinado. Meta Pixel/CAPI, Google Tag y catálogo de Facebook aparecen sin conectar.
> Prioridad: mantener el checkout nativo. No reemplazarlo por CompraExpress hasta probar variantes, costos de entrega y recuperación ante errores en un sitio de prueba. La compra en tres toques es una propuesta, no una función verificada.

Simulaciones: [`../index_simulacion.html`](../index_simulacion.html) (compra en 3 toques) · [`../index_simulacion_home.html`](../index_simulacion_home.html) (home + pop-up).

## ★ Sitio completo — mapa y montaje

Simulación navegable (servir con `.claude/launch.json`, no abrir como archivo): [`../inicio.html`](../inicio.html) → [`../coleccion.html`](../coleccion.html) → ficha [`../index_simulacion.html?p=dije-azalea`](../index_simulacion.html) · [`../atelier.html`](../atelier.html) · [`../ayuda.html`](../ayuda.html). Estilos: `sim/styles.css` + `sim/site.css`. Catálogo real (20 piezas, precios y fotos de sandara.pe): `sim/catalogo.json`.

| Página Wix | Bloques (en orden) | Wix nativo / Velo |
|---|---|---|
| Inicio | Header negro 72 px · Hero partido (texto izq., foto der.) · Franja de 4 promesas · "Encuentra la tuya" (4 categorías 3:4) · "Recién salidas del Atelier" (4 piezas) · Banda Atelier charcoal · Testimonio · Instagram 6 fotos · Canal de WhatsApp · Footer | Galería de Wix Stores filtrada por la colección "Nuevo"; Instagram Feed app; `masterPage.js` |
| Colección / categorías | H1 por categoría · Filtros fijos (chips con conteo) · Orden · Grilla 4 col (2 en móvil), foto 2 al pasar el cursor, "Comprar ahora" en cada tarjeta, agotados al final | Página de categoría de Wix Stores; activar "Mostrar segunda imagen al pasar el cursor" y "Avisarme cuando vuelva" (notificaciones de stock nativas) |
| Ficha | Ver sección Compra rápida | `pagina-producto.js` |
| Atelier | Foto a sangre + H1 · Texto (completar historia real) · 3 pilares · Díptico · CTA colección | Sin código |
| Ayuda | Índice lateral · Envíos · Pagos · Cambios · Cuidado · FAQ (acordeón) · Legal · Contacto WhatsApp | Sin código; FAQ app de Wix o acordeón |

1. **Header/footer**: header negro con logo blanco centrado, menú Colección · Atelier · Ayuda; en móvil, menú lateral negro. Footer de 4 columnas: marca, Comprar, Ayuda, Contacto + línea legal (Términos · Privacidad · **Libro de Reclamaciones**, obligatorio en Perú).
2. **Categorías**: crear en Wix Stores las colecciones Aretes, Dijes, Anillos, "Cadenas y pulseras" y "Nuevo".
3. **SEO de URLs**:
   - Prefijo de fichas: Ajustes SEO > Páginas de producto > cambiar `p-gina-de-producto` por `joya`.
   - Slug limpio en cada producto (Producto > SEO > URL). **Dos fichas conservan nombres de URL de otros productos**: Aretes Sienna usa `copy-of-aretes-liria` y Cadena Inlove usa `dije-qantu`.
   - Importar [`seo/redirecciones.csv`](seo/redirecciones.csv) (validar las filas actuales y sus destinos antes de importar) en Ajustes SEO > Gestor de redirecciones URL > Importar CSV.
   - Revisar nombre "Dije Trebol" → "Dije Trébol".
4. **Títulos SEO**: Inicio "Sandara · Joyería de autor en Lima"; Colección "Aretes, dijes y anillos de plata | Sandara"; fichas "{Nombre} en plata | Sandara"; meta descripciones en cada HTML de la simulación.
5. **Textos pendientes** (marcados "Pendiente" en la simulación): historia de la marca, envíos, pagos, cambios, legales.

## ★ Compra rápida (Fricción Cero) — montaje

| Toque | Clienta nueva | Clienta que vuelve / miembro |
|---|---|---|
| 1 | "Comprar ahora" en la ficha | "Comprar ahora" en la ficha |
| 2 | "Continuar al pago" en la hoja de datos | "Pagar" |
| 3 | "Pagar" | — |

1. **Ajustes de checkout** (Wix > Ajustes > Checkout): permitir compra como invitado = SÍ · pedir inicio de sesión = NO · campos solo nombre, correo, celular y dirección (quitar empresa/código postal) · activar Yape/Plin y tarjeta en Pagos.
2. **Código**: `backend/compra-rapida.web.js`, `public/datos-cliente.js`, `frontend/pagina-producto.js` (reemplaza la versión anterior), `frontend/lightbox-CompraExpress.js` y `frontend/pagina-gracias.js`.
3. **Ficha de producto**: botón `#btnComprarAhora` (ancho completo, primero), texto `#txtErrCompra` debajo, enlace `#btnOtraDireccion` ("Enviar a otra dirección"), desplegable `#ddOpcion` (solo para productos con talla o medida). Ocultar "Comprar ahora" nativo del widget para no tener dos botones; "Agregar al carrito" queda como enlace secundario.
4. **Lightbox `CompraExpress`**: en móvil 100 % ancho, anclado abajo, sin cerrar al tocar fuera. Address Input `#addrDireccion` con **filtro de país = Perú**. Campos de texto con `#txtEmail`, `#txtNombre`, `#txtCel`, `#txtDireccion` debajo (Texto enriquecido). Tamaño de letra de los inputs ≥ 16 px (evita el zoom de iOS). Orden de tabulación = orden visual.
5. **Página de gracias**: caja `#boxGuardar` con `#txtGuardar`, Custom Element `social-login` → `#socialLogin`, `#txtOkGuardar` y `#btnNoGracias`.
6. **Estados de campo**: pegar `styles/global.css` en Page Code > global.css. Si el editor no lo admite, el código aplica el borde por estilo directo. Errores = borde 2px charcoal + fondo niebla + "!" en negrita; nunca colores fuera de marca.
7. **Pixel manual**: `public/meta-pixel-base.html` solo si no se usa la integración nativa.
8. **Seguridad**: el backend solo recibe ID de producto, opción, cantidad (1–5) y datos de envío; precio y stock los calcula Wix. No guardamos datos del invitado en nuestra base; "Recordar mis datos" vive solo en el navegador de la clienta (90 días, sin pagos).

## 0. Diagnóstico (datos de la captura de sandara.pe, 10-nov-2026)

| # | Cuello de botella | Evidencia | Arreglo |
|---|---|---|---|
| 1 | Hero sin propuesta ni CTA | "DESCUBRE SANDARA" es un carrusel sin texto ni botón | Hero con titular, sello Plata 950 y botón "Ver novedades" |
| 2 | Cero señales de confianza | 0 menciones de envío, garantía, cambios, Yape/Plin o reseñas en la home | Franja de 4 sellos + barra de envío gratis + texto de confianza en la ficha |
| 3 | Header de 180 px en negro | Ocupa ~20 % del primer pantallazo en móvil | Header de 56 px + menú de categorías horizontal |
| 4 | URLs con "copy-of" | 6 productos: `/p-gina-de-producto/copy-of-dije-antonella-1`, `copy-of-aretes-liria`, etc. | Renombrar slug en cada producto + redirección 301 (Ajustes > SEO > Redirecciones) |
| 5 | Prefijo de URL roto | `/p-gina-de-producto/` (acento perdido) | Cambiar el prefijo de las páginas de producto a `/joya/` y crear la redirección 301 masiva |
| 6 | Sin H1 real | Firecrawl mide el H1 en 10 px (oculto o vacío) | H1 visible: "Joyería de autor en plata 950" |
| 7 | Producto "Agotado" sin salida | "ANILLO PUREZA" en gris, sin acción | Activar "Avísame cuando haya stock" (Wix Stores > Ajustes del producto) |
| 8 | "Cargar más" con 49 imágenes en la home | Mucho peso y una grilla interminable | Home: 4 categorías + 4 más vendidos; el catálogo completo en /tienda |
| 9 | Sin atajo a WhatsApp | Solo "Unirme al canal" (canal de difusión, no chat) | Botón fijo de WhatsApp + WhatsApp con el producto precargado en la ficha |
| 10 | Sin captura de visitas que se van | No hay pop-up ni formulario de correo | Pop-up de salida (Lightbox "Salida") |

## 1. Montaje en Wix (orden)

1. **Modo Dev** activado. **Secrets Manager**: `META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE` (vacío en producción), `GOOGLE_CLIENT_ID`, `META_APP_ID`, `META_APP_SECRET`.
2. **CMS > colección `Leads`**: campos `email` (texto), `telefono` (texto), `origen` (texto), `pagina` (texto), `consentimiento` (booleano), `utm` (texto). **Permisos: personalizados, todo "Admin"**.
3. **Backend**: copiar `backend/*` con los mismos nombres. Archivos `*.web.js` = web methods.
4. **Validations**: Código > Service plugins > + eCommerce Validations → nombre `sandara-limites`. Pegar `sandara-limites.js` y en `-config.js` poner `validateInCart: true`.
5. **Public**: `public/pixel-eventos.js`, y `public/custom-elements/exit-intent.js` y `social-login.js`.
6. **Custom Elements** (requiere plan Premium y dominio conectado): Añadir > Embed > Custom element → archivo Velo, tag `exit-intent` → ID `#exitIntent`, "Mostrar en todas las páginas". Repetir en la página Acceso con el tag `social-login` → `#socialLogin`.
7. **Lightbox `Salida`**: activador = ninguno (solo por código). Elementos según los IDs de `lightbox-Salida.js`. `#inWeb` es el campo trampa para bots: colapsado y fuera de vista.
8. **Header**: texto `#txtEnvio` (+ barra de progreso `#barEnvio`). Código → `masterPage.js`.
9. **Ficha de producto**: `#txtEnvioProd`, `#txtConfianza`, `#btnWhatsApp` → `pagina-producto.js`. Poner el número real en `WHATSAPP`.
10. **Paquete** `@wix/site` (Packages & Apps) para `pixel-eventos.js`.
11. **Cupón** `BIENVENIDA10` (10 %, 1 uso por cliente) en Marketing > Cupones. El código solo se revela después de guardar el lead en el servidor.
12. Probar con `META_TEST_EVENT_CODE` en Events Manager > Test events; luego vaciarlo.

## 2. Checkout (flujo)

- Header: envío gratis con la barra de progreso (`resumenCarrito`)
- Ficha: precio, sellos de confianza, "Agregar al carrito" y WhatsApp con el producto
- Carrito: barra "te faltan S/ X" + 1 pieza complementaria (Wix Stores > Productos relacionados)
- Validación en carrito (WARNING) y en checkout (ERROR): máximo 5 unidades por pieza
- Checkout nativo de Wix en un solo paso: Google/Facebook (login social nativo) o compra como invitada
- Campos: correo → celular → distrito (envíos por zona en Ajustes > Envíos: Lima / provincias)
- Pago: Yape, Plin, tarjeta, transferencia (según la pasarela habilitada: Niubiz / Mercado Pago / Izipay)
- Cupón visible + total final + "Pago seguro"
- Gracias: `wixEcom_onOrderApproved` → Purchase por CAPI **solo si** no usas la integración nativa
- Post-compra: correo automático (Automatizaciones) pidiendo reseña a los 7 días

## 3. Meta

- **Pixel + CAPI**: Wix > Marketing & SEO > Marketing Integrations > **Meta Pixel & CAPI** → pendiente de conectar con Business Manager. Cubre PageView, ViewContent, AddToCart, InitiateCheckout y Purchase en navegador y servidor, con deduplicación. **No pegar el código base del Pixel** en Ajustes > Código personalizado (doble conteo).
- **Código propio**: `backend/meta-capi.js` (Lead del pop-up solo por servidor, con `fbp`/`fbc`/UA para mejorar la coincidencia), `public/pixel-eventos.js` (clic en WhatsApp y en el canal) y `backend/events.js` (Purchase, apagado por defecto).
- Verificar el dominio `sandara.pe` en Business Manager > Seguridad de la marca > Dominios (meta-tag en Wix > SEO > Ajustes de la home > Meta tags adicionales).

### Instagram Shopping (panel de Wix)

- Instagram en cuenta **profesional/empresa**, vinculada a la página de Facebook y al mismo Business Manager.
- Wix > Canales de venta > **Facebook e Instagram** → conectar → elegir el Business Manager, la página y el catálogo → Wix sincroniza los productos automáticamente.
- Catálogo listo: cada producto con nombre sin "copy of", descripción, ≥1 foto cuadrada de 1080 px, precio en PEN, stock y SKU único.
- Commerce Manager > revisar la elegibilidad: en Perú no hay checkout dentro de Instagram; la compra se completa en sandara.pe (etiquetado de producto → web). Confirmar que la cuenta esté aprobada.
- Instagram > Configuración > Empresa > Compras → elegir el catálogo. Luego etiquetar productos en los posts/reels y activar la pestaña Tienda.
- Revisar en Commerce Manager > Diagnóstico los productos rechazados; corregir en Wix, no en Meta (Wix sobrescribe).

## 4. SEO

- `seo/jsonld-negocio.json` → Wix > Página de inicio > SEO > Avanzado > **Marcado de datos estructurados** (pegar el contenido). Completar el teléfono real; añadir `streetAddress` solo si hay tienda física.
- Producto: `pagina-producto.js` reemplaza el JSON-LD automático con Product + Offer + vendedor + envío. Validar con https://search.google.com/test/rich-results.
- Agregar `aggregateRating` solo cuando haya reseñas reales (app Wix Reviews); Google penaliza reseñas inventadas.

## 5. SSO

- **Recomendado (sin código)**: Ajustes > Miembros > Registro e inicio de sesión → activar Google, Facebook y Apple.
- **Propio** (`sso.web.js` + `social-login.js`): solo si se necesita un botón con diseño propio. El backend verifica el token con Google (`tokeninfo`: aud, iss, email_verified, exp) y con Meta (`debug_token`: app_id, is_valid) **antes** de `generateSessionToken`. Nunca exponer un web method que reciba solo el correo: equivale a entregar cualquier cuenta.
- Google Cloud Console: OAuth Client ID tipo web, orígenes autorizados `https://www.sandara.pe` y `https://sandara.pe`. Meta: app con Facebook Login, dominio `sandara.pe`, permiso `email`.

## Pendiente con datos reales

Número de WhatsApp, umbral de envío gratis, política de cambios, tiempos de envío, métodos de pago activos, teléfono del JSON-LD y IDs/tokens de Meta y Google.
