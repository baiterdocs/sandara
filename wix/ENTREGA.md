# Sandara: estado e implementación

Actualizado el 12 de noviembre de 2026. Los archivos de este proyecto son código preparado y una simulación; no acreditan su instalación ni publicación en Wix.

## Marca aprobada

Joyería de autor en plata, elaborada en Sandara. La bisutería de alta calidad se comunica como **Selección Sandara**, sin nombres de proveedores. No presentar la bisutería como fabricación propia ni extender propiedades de un producto a toda la colección. Conservar logo, blanco y negro, Cinzel y Josefin Sans. Portada: desde el 12-nov-2026 Luis aprobó la portada del artboard (franja negra «Joyería de autor en plata 950» + bloque Atelier / Selección Sandara); está guardada como borrador en el editor de Wix, pendiente de publicar.

## Producción verificada anteriormente

- Checkout nativo de Wix; pago manual Yape/Plin. WhatsApp: 949 209 933. Transferencias y enlaces de pago por consulta, sin prometer tarjetas integradas.
- Envíos configurados: Lima S/ 8, nacional S/ 20, gratis desde S/ 300 y recojo coordinado. **Pendiente corregir cobertura:** ambos métodos figuraban en la misma región nacional. No asumir que el departamento de Lima equivale a Lima Metropolitana.
- Meta Pixel/CAPI, Google Tag y catálogo de Facebook aparecían sin conectar. No activar seguimiento manual sin configuración y consentimiento adecuados.
- Catálogo Wix: 153 productos. La simulación contiene solo 20.
- Se eliminó y publicó el bloque de portada solicitado; esto no supone publicar los cambios actuales del repositorio.

## Código preparado

`frontend/pagina-producto.js`, `backend/compra-rapida.web.js` y `frontend/lightbox-CompraExpress.js` implementan un flujo experimental de compra. **Mantener los botones y el checkout nativos hasta probar este flujo en Wix.** No prometer compra en tres toques. Siempre revisar entrega y total final antes del pago.

Elementos del flujo preparado: `#productPage1`, `#btnComprarAhora`, `#txtErrCompra`, `#ddOpcion`, `#btnOtraDireccion`, `#txtEnvioProd`, `#txtConfianza`, `#btnWhatsApp`; lightbox `CompraExpress` según comentarios de su archivo. No ocultar los controles nativos para instalar código sin validar.

Validar antes de instalar: productos con varias opciones y variantes administradas, stock por variante, descuentos, invitado y miembro, errores de red, cierre de hoja, entrega Lima/provincias/recojo y datos guardados. El almacenamiento local es voluntario y caduca a los 90 días; conectar un control visible a `borrarDatos()` antes de ofrecer esa función.

El acceso social requiere aplicaciones configuradas. Priorizar el inicio de sesión nativo de Wix mientras los identificadores propios sean marcadores. La colección `Leads` debe tener permisos solo de administrador. El cupón BIENVENIDA10 requiere creación y prueba en Wix; la deduplicación de leads requiere un índice único de email antes de activar el formulario. No activar estos módulos como si ya estuvieran instalados.

## SEO

Mantener el prefijo actual de producto. No cambiarlo globalmente por razones estéticas. `seo/redirecciones.csv` es una propuesta: crear y comprobar cada destino antes de importar. Qantu debe usar un destino diferente de la URL histórica que pertenece a Cadena Inlove. No atribuir plata a todas las fichas: cada título y descripción debe corresponder al material real.

## Simulación y pruebas

Inicio: `inicio.html`; colección: `coleccion.html`; ficha: `index_simulacion.html`; marca: `atelier.html`; información: `ayuda.html`. La simulación no procesa pagos ni envía avisos de reposición.

Ejecutar `node tests/regresiones.cjs` para las regresiones locales. Estas pruebas usan dobles de las APIs y no sustituyen pruebas dentro de Wix. Los pendientes y evidencias de la revisión inicial están en `../REVISION-CODIGO-BRANDING.md`.
