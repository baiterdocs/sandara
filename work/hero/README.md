# Portada SANDARA · 13 de noviembre de 2026

## Archivos

- `hero-orig.jpg`: fotografía vertical de origen.
- `sandara-hero.mp4`: primera versión de Claude, 20 segundos, 1080 × 1440.
- `sandara-hero-v2.mp4`: segunda versión vertical, 8 segundos, 1080 × 1440.
- `sandara-hero-horizontal.png`: extensión lateral generada con IA a partir de la fotografía original.
- `sandara-hero-horizontal.mp4`: versión horizontal aprobada y publicada, 8 segundos, 1920 × 1080, 30 fps, sin audio, zoom en bucle.

## Regeneración

Ejecutar `bash scripts/video-hero-horizontal.sh` desde el proyecto. Requiere FFmpeg. El PNG expandido es el insumo; el script solo regenera el movimiento, no la expansión con IA.

La expansión se realizó con la herramienta integrada de generación de imágenes. Prompt: extender lateralmente la foto a un encuadre horizontal 16:9 para portada de joyería; conservar pose, ropa, iluminación y diseño de cadena y dije; prolongar hombros y fondo de estudio, con espacio a los lados, sin textos, logos ni barras desenfocadas.

## Estado en Wix

- Video horizontal publicado como fondo de la franja de portada a todo el ancho, con posición inferior centrada y reproducción en bucle.
- Franja de Atelier / Selección Sandara con fondos blancos uniformes: se corrigió el desnivel visible en la transición con el video.
- Separador `line3`: ancho 1 px, altura 86 px, posición X 490 / Y 653 en el editor de escritorio. Alineado desde los títulos hasta las descripciones. Se verificó publicado en sandara.pe.
- Estos cambios se realizaron en el editor de Wix. Los HTML locales no son una exportación del sitio publicado.

Los MP4 de esta carpeta se versionan como excepción a la exclusión general de videos pesados.
