import sys, math, subprocess
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
W,H = 1080,1440
N = int(sys.argv[3]) if len(sys.argv)>3 else 600
AMP = float(sys.argv[4]) if len(sys.argv)>4 else 0.03
im = Image.open(src).convert('RGB').resize((2160,2880), Image.LANCZOS)
p = subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','-',
  '-c:v','libx264','-crf','20','-preset','slow','-pix_fmt','yuv420p','-an','-movflags','+faststart',out], stdin=subprocess.PIPE)
ax, ay = 0.5, 0.45
for i in range(N):
    z = 1 + AMP*(1-math.cos(2*math.pi*i/N))
    s = 2.0/z                      # source px per output px
    x0 = 2160*ax - W*ax*s; y0 = 2880*ay - H*ay*s
    f = im.transform((W,H), Image.AFFINE, (s,0,x0,0,s,y0), resample=Image.BICUBIC)
    p.stdin.write(f.tobytes())
p.stdin.close(); p.wait()
