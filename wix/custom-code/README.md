# Diseño «intuitivo» en sandara.pe (código personalizado de Wix)

Estos dos archivos son **copia exacta** de lo que está instalado y publicado en sandara.pe
(extraído de la web publicada el 21-nov-2026). Si cambias algo en Wix, vuelve a copiarlo aquí.

| Archivo | Dónde va en Wix | Nombre en Wix |
|---|---|---|
| `intuitivo-head.html` | Head | Diseño intuitivo (CSS head) |
| `intuitivo-publicado.html` | Cuerpo - final | Diseño intuitivo |

Ambos: **Todas las páginas**, **Subir código una vez**, tipo **Esencial**.

## Qué hace

- Aviso de envío como barra negra con texto blanco (escritorio). En móvil, texto corto: «Envío gratis desde S/ 300 · Paga con Yape o Plin».
- Portada: «Comprar ahora» como botón negro lleno con flecha.
- Fichas de producto: botón «Agregar» con contorno negro.
- Texto en Nunito Sans en lugar de Avenir.
- Franja de confianza (envíos, gratis desde S/ 300, Yape y Plin, dudas) arriba del pie.
- Accesibilidad: nombres en español para botones y enlaces sin texto, un solo H1 por página.
- Espera a que Wix termine de cargar (hidratar) antes de tocar la página, para no provocar saltos.

Solo cambia presentación: no toca productos, carrito ni pagos.

## Instalar o actualizar

1. Wix > **Ajustes** > **Código personalizado**.
2. Si ya existen «Diseño intuitivo (CSS head)» y «Diseño intuitivo»: menú **⋯ > Editar las configuraciones**, borra el contenido y pega el archivo completo.
   Si no existen: **+ Agregar código personalizado**, pega el archivo, ponle el nombre de la tabla, **Todas las páginas**, **Subir código una vez** y la ubicación de la tabla.
3. **Aplicar** en cada uno.
4. Abre el editor del sitio y pulsa **Publicar** (el código personalizado no se ve en sandara.pe hasta publicar).
5. Comprueba en sandara.pe, escritorio y móvil, que se ve la franja de confianza antes del pie y el botón negro de la portada.

## Dependencias frágiles

Usa ids de Wix: `comp-mwpi68gn` (aviso), `comp-mwogvs3u` («Comprar ahora»), `SITE_HEADER`, `SITE_FOOTER`, `masterPage`.
Si alguien borra o duplica esos elementos en el editor, cambian los ids y hay que actualizarlos en los dos archivos.

Referencia visual: `sim-intuitivo/index.html`.
