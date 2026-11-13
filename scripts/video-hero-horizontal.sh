#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -hide_banner -loglevel error \
  -i work/hero/sandara-hero-horizontal.png \
  -vf "scale=3840:2160:flags=lanczos,zoompan=z='1+0.18*(1-cos(2*PI*on/240))/2':x='(iw-iw/zoom)*0.5':y='(ih-ih/zoom)*0.70':d=240:s=1920x1080:fps=30,setsar=1" \
  -frames:v 240 -c:v libx264 -preset slow -crf 19 \
  -pix_fmt yuv420p -an -movflags +faststart \
  work/hero/sandara-hero-horizontal.mp4
