# Revisión de código y branding de Sandara

Fecha: 11 de noviembre de 2026 (Lima).

Revisión principal de backend e integración, más dos evaluaciones independientes: branding (`branding_review`) y frontend (`frontend_audit`). Fuentes sin modificar durante la auditoría. Este documento registra hallazgos, no certifica una instalación ni una corrección en producción.

## Resultado

La identidad visual tiene una base coherente: logo original, negro/blanco, Cinzel/Josefin Sans y fotografía protagonista. El código personalizado de compra y acceso todavía necesita correcciones y pruebas en Wix antes de reemplazar las funciones nativas.

La simulación local y la tienda publicada son implementaciones distintas. La portada pública ya no tiene el bloque «Joyería de autor» eliminado por petición del usuario; `inicio.html` todavía contiene otro hero. No debe publicarse la simulación como si fuera una copia actual del sitio.

## Cobertura y límites

Inventario de 42 archivos de proyecto: 23 JavaScript, seis HTML de páginas y el HTML del píxel, tres CSS, catálogo, JSON-LD, redirecciones, documentación, configuración y `work/build.py`. Los scripts de las herramientas instaladas no son código de Sandara y no se auditaron como aplicación. Los JSON de transcripción se validaron como datos, no como lógica ejecutable.

Se inspeccionaron visualmente la portada pública y la ficha Dije Azalea en navegador independiente. No se inspeccionaron las 153 fichas una por una, ni el backend interno de Wix, ni se ejecutó un pedido real. La revisión del código Velo corresponde a los archivos disponibles en el repositorio; no prueba que estén instalados en el editor.

Pruebas realizadas:

- Sintaxis de los 23 JS y scripts inline: sin errores detectados.
- AST de Python y seis JSON: válidos.
- Catálogo: 20 identificadores únicos, referencias locales e imágenes existentes.
- Ejecuciones aisladas con dobles de prueba: rechazo de red en compra, carrera del cargador social, cantidad 7, entrada nula, subtotal del carrito, dos líneas del mismo producto, leads simultáneos y ordenación del catálogo.
- Consulta de documentación oficial Wix para contratos de checkout, variantes y carrito.

Estos controles no sustituyen una prueba integrada con APIs, inventario, permisos, pagos y entrega reales.

## Hallazgos prioritarios de código

P1 significa corregir antes de desplegar el código afectado; P2, corregir en la siguiente pasada. No se declara un incidente crítico activo en producción.

| Prioridad | Ubicación | Problema y evidencia | Corrección propuesta |
|---|---|---|---|
| P1 | `wix/frontend/pagina-producto.js:84–102` | Con datos guardados y rechazo de red, queda el botón deshabilitado en «PREPARANDO TU PAGO…». Reproducido con promesa rechazada. La navegación también puede fallar sin recuperación. | Manejar excepciones y restaurar etiqueta/estado cuando no hubo navegación; conservar los datos para reintentar. |
| P1 | `wix/frontend/pagina-producto.js:41–49`; `wix/backend/compra-rapida.web.js:39–49` | El frontend solo recoge la primera opción del producto. El backend no resuelve `variantId` para variantes gestionadas. Una pieza con talla y material no queda representada correctamente. | Resolver todas las selecciones y la variante válida en servidor, incluyendo disponibilidad y precio. Probar productos con una y varias opciones. |
| P1 | `wix/public/custom-elements/social-login.js:4–5,12,33` | La segunda carga del SDK se da por terminada por existir el script, aunque todavía no haya cargado. Los cambios consecutivos de atributos provocan renders concurrentes. Reproducido. | Compartir la promesa de carga por URL, serializar render y mostrar error recuperable. |
| P1 | `wix/seo/redirecciones.csv:2–3` | Las reglas forman `dije-qantu-1 → dije-qantu → cadena-inlove`. Qantu acabaría en otra pieza si se aplican ambas. No se comprobó su instalación. | Elegir destinos finales únicos y comprobar todas las cadenas antes de importar. |
| P1 | `wix/ENTREGA.md:35` y secciones de montaje/pagos | Conviven la advertencia «mantener checkout nativo» y pasos para ocultarlo, activar tarjeta y prometer compras en tres toques. El estado inicial del mismo documento reconoce pagos manuales y pasarelas desconectadas. | Separar estado verificado, propuesta y pasos de despliegue. Eliminar instrucciones contradictorias antes de seguirlas. |
| P2 | `wix/backend/carrito.web.js:13` | Lee `t.lineItems` de una estimación de totales. La respuesta documentada usa `calculatedLineItems`; el conteo requiere obtener el carrito y sus cantidades. En prueba con subtotal S/280 devuelve cero unidades. | Obtener líneas del carrito mediante su API y no usar una estimación como lista de unidades. |
| P2 | `wix/backend/carrito.web.js:24–27` | Cualquier error se convierte en carrito vacío. Un fallo de red o permisos pasa inadvertido y puede producir mensajes de envío incorrectos. | Distinguir carrito inexistente de error; mostrar estado recuperable y registrar diagnóstico sin datos personales. |
| P2 | `wix/backend/service-plugins/ecom-validations/sandara-limites/sandara-limites.js:10` | El máximo de cinco es por línea, pese a anunciarse «por pieza». Dos líneas de tres del mismo producto no producen violaciones en la prueba. | Definir si el límite es producto o variante y sumar por esa identidad antes de validar. |
| P2 | `wix/backend/compra-rapida.web.js:30,38` | `null` produce excepción antes del `try`. Una cantidad 7 se transforma silenciosamente en 5; decimales/textos también se coaccionan. | Validar objeto e entero dentro del rango y devolver error, sin alterar silenciosamente la cantidad. |
| P2 | `wix/backend/leads.web.js:20–27` | La consulta previa y la inserción no son atómicas: dos solicitudes simultáneas guardan dos leads. Usar otros correos evita el supuesto freno de 24 horas. | Separar deduplicación de control de abuso; aplicar una operación/idempotencia apropiada y limitar solicitudes. |
| P2 | `wix/frontend/pagina-producto.js:15` | `imgUrl` transforma una URL HTTPS válida de Wix en `https://static.wixstatic.com/media/media`. Reproducido. Afecta datos estructurados y foto de la hoja. | Conservar URLs HTTPS válidas y convertir solo el formato `wix:image://` que corresponda. |
| P2 | `wix/frontend/pagina-producto.js:90` | La hoja recibe `formattedPrice` normal mientras el botón usa el precio rebajado. | Mostrar el mismo precio efectivo y variante en todas las etapas. |
| P2 | `sim/site.js:98–105` | Tras enviar el formulario de aviso, se reemplaza por texto pero queda el botón. El siguiente clic busca un input inexistente y falla. | Actualizar el estado del botón/formulario y proteger el acceso al campo. |
| P2 | `inicio.html:89–96`; `coleccion.html:49–72` | Si falla el catálogo, los listados quedan vacíos sin explicación ni reintento. | Estados de carga, vacío y error separados. |
| P2 | `coleccion.html:55–57` | Después de ordenar por precio se mandan los agotados al final. El orden ascendente termina en `158,158,45`. | Mantener el criterio elegido o separar y rotular expresamente los agotados. |
| P2 | `sim/app.js:51–55`; `sim/site.js:62–72` | Diálogo y menú mueven el foco, pero no contienen la navegación por Tab ni desactivan el fondo. Riesgo comprobado por lectura, pendiente de ensayo de teclado en navegador. | Implementar diálogo nativo o confinamiento de foco y fondo inerte; conservar Escape y retorno. |
| P2 | `index_simulacion.html:139–140`; `sim/app.js:134–151` | El «Total» simulado es solo el producto; no calcula entrega. No existe cobro real. | Llamarlo subtotal y separar la entrega pendiente, o simular explícitamente cada opción. |
| P2 | `work/build.py:8,174,397–405` | Render dependiente de un vídeo en Downloads y un logo fuera del control de versiones; no comprueba el retorno final de ffmpeg. No hay manifiesto de dependencias del render. | Parámetros de entrada, recursos reproducibles, comprobación de retorno y dependencias documentadas. |

## Seguridad e integraciones: alcance correcto

Hay decisiones acertadas: precios no aceptados del navegador, secretos leídos solo en backend, validación del token antes de emitir sesión, consentimiento para leads y almacenamiento de dirección mediante opt-in.

Pendientes antes de activar:

- Probar autenticación personalizada y vinculación por correo con proveedores reales. No se demostró una toma de cuenta; no corresponde presentarla como vulnerabilidad explotada. Los IDs de frontend siguen siendo placeholders.
- `createCheckout` tiene requisitos de permisos según su documentación actual, pero sus ejemplos de Velo muestran llamadas directas. Verificar el comportamiento real como visitante, no declarar resuelto ni roto solo a partir de esa discrepancia documental.
- `checkoutInfo` sí aparece en el ejemplo oficial: no se considera por sí mismo un error. Los ejemplos también difieren en opciones no gestionadas; probar el catálogo concreto. La ausencia de resolución de variantes gestionadas sigue siendo una carencia confirmada del código.
- `events.js` mantiene Purchase CAPI apagado; no es un fallo activo. Antes de activarlo, probar pago manual pendiente/aprobado y deduplicación. Los errores CAPI se silencian y faltan evidencias de entrega de eventos.
- Revisar el consentimiento de marketing antes de habilitar Pixel/CAPI. La plantilla base dispara PageView inmediatamente; su clasificación y activación en Wix no están documentadas en el archivo.
- `datos-cliente.js` afirma «borrable con un clic», pero no se encontró un control dedicado de borrado. Desmarcar al volver a completar la compra es una ruta distinta.
- El servidor de desarrollo usa solo 127.0.0.1, lo cual limita exposición. Su `decodeURIComponent` no está protegido: una ruta mal formada puede tirar el proceso. Sirve el árbol del proyecto; no reutilizarlo como servidor público.

## Branding y contenido

**Conservar:** logo original, paleta acromática, fotografía real, Cinzel/Josefin Sans y fotos inmediatamente después del menú. No reponer el bloque de «Joyería de autor» eliminado.

**Cambiar con prioridad:**

1. Distinguir autoría, fabricación y selección. `inicio.html:7` dice «Diseño de autor hecho en Lima» y `coleccion.html:18` engloba toda la colección como autor; `atelier.html:29` reconoce piezas propias y tendencias seleccionadas. Es una inconsistencia demostrable, no una prueba de procedencia falsa. Evitar una promesa global hasta aclarar el alcance real.
2. Materiales por producto. Las afirmaciones amplias sobre plata, piedras naturales o hipoalergenicidad deben coincidir con cada ficha. «Minimalista» describe parte del lenguaje visual, pero el catálogo incluye piezas ornamentales; no debería limitar artificialmente la marca.
3. Alinear promesas de servicio. Ayuda promete avisos de stock que la simulación declara que no enviará. «Pensada para no quitártela» contradice los cuidados de retirar las joyas al bañarse o hacer deporte. Historia, cambios y legales tienen pendientes locales explícitos.
4. Dar contenido real al Atelier: quién diseña, qué proceso se realiza y qué piezas pertenecen a esa línea. El texto actual transmite cuidado, pero podría pertenecer a cualquier joyería.
5. Unificar acciones y nombres: la lupa local lleva a Colección sin ofrecer búsqueda; en la web publicada conviven «Agregar al carrito» y «Agregar a la bolsa». Elegir un vocabulario estable.

### Observaciones del sitio publicado

- Portada: bloque eliminado confirmado; fotografías, logo y navegación preservados.
- Dije Azalea: la foto muestra cadena, mientras «La cadena no está incluida» queda en la descripción que visualmente se contrae bajo «Leer más». Hacer ese aviso visible cerca del precio/botón.
- La descripción de Azalea menciona una piedra roja, mientras la foto principal observada muestra un centro claro. Revisar todas las fotos y la ficha original antes de modificar el atributo: se registra discrepancia aparente, no composición certificada.
- Material Plata 950 aparece como una única opción sin seleccionar. Sigue existiendo una selección potencialmente redundante; no eliminarla sin comprobar si el catálogo la necesita para identificar inventario.
- Breadcrumb de Azalea: «CYBER DAYS». Verificar si esa campaña sigue siendo la categoría de navegación deseada.
- La restricción geográfica de S/8 Lima frente a S/20 provincias sigue pendiente de prueba. Esta auditoría no cambió tarifas ni publicó cambios nuevos.

### Evaluación heurística provisional de la simulación

Juicio de código/contenido, no puntuación del sitio publicado ni ensayo completo con usuarios.

| Criterio | Puntos /4 | Motivo |
|---|---:|---|
| Estado del sistema | 2 | Conteos presentes; errores de catálogo sin respuesta |
| Lenguaje del usuario | 3 | Categorías claras; Atelier necesita explicar su alcance |
| Control y libertad | 3 | Escape y cierre presentes; foco del fondo pendiente |
| Consistencia | 2 | Diseño coherente; acciones y promesas divergentes |
| Prevención de errores | 2 | Validación parcial; variantes incompletas |
| Reconocimiento | 3 | Precios y categorías visibles |
| Flexibilidad | 2 | Orden y filtros, sin búsqueda local real |
| Estética | 3 | Marca sobria y fotografía protagonista |
| Recuperación de errores | 0 | Fallos de descarga y algunas acciones sin recuperación |
| Ayuda | 2 | Estructura útil con contenido aún pendiente |
| Total | 22/40 | Mejoras funcionales y de contenido necesarias |

Para una primera compradora, la prioridad es saber qué incluye la pieza y cuánto pagará. Para una compradora móvil, descubrir filtros y reintentar sin perder datos. Para una usuaria de teclado, poder comprar sin que el foco salga del diálogo.

## Orden de trabajo recomendado

1. Recuperación de compra, variantes, carrito y conflicto de redirecciones.
2. Prueba integrada en Wix con visitante y miembro, producto agotado, descuento, variantes, Lima/provincias/recojo y fallo de red. Mantener checkout nativo mientras tanto.
3. Ficha publicada: inclusión de cadena, material, medidas, categoría y entrega visibles.
4. Aclarar colección propia frente a selección; alinear documentación, SEO y textos.
5. Corregir fallos de simulación, navegación por teclado, login y medición antes de reutilizar ese código.

## Fuentes técnicas

- https://dev.wix.com/docs/velo/apis/wix-ecom-backend/checkout/create-checkout
- https://dev.wix.com/docs/velo/apis/wix-ecom-backend/checkout/create-checkout.md
- https://dev.wix.com/docs/velo/apis/wix-ecom-backend/current-cart/estimate-current-cart-totals
- https://dev.wix.com/docs/api-reference/business-solutions/e-commerce/purchase-flow/cart/estimate-current-cart-totals?apiView=SDK
- https://dev.wix.com/docs/api-reference/business-solutions/stores/catalog-v3/e-commerce-integration

Pregunta pendiente de negocio: ¿qué piezas diseña o elabora Sandara y cuáles selecciona de otros proveedores? La respuesta determina los textos de marca; no bloquea corregir los errores técnicos.
