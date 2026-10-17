# Turns recorded frames + game audio into a finished vertical Short with a title and an end card.
import sys, json, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
name, title, tagline = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 1080, 1920
meta = json.load(open(name + '.json')); times = json.load(open(name + '_times.json'))
# start the video just after Play is tapped (skip the start screen)
first = next(i for i, t in enumerate(times) if t >= meta.get('tap', times[0]) + 0.6)
times = times[first:]
meta['offset'] = meta['audio_start'] - times[0]
fdir = name + '_frames'
def font(f, s, wght=None):
    ft = ImageFont.truetype(f, s)
    if wght:
        try: ft.set_variation_by_axes([wght])
        except Exception: pass
    return ft
CH = lambda s: font('Chewy.ttf', s); NU = lambda s, w=800: font('Nunito.ttf', s, w)
PINK, PURPLE = (108, 92, 231), (75, 61, 184)  # brand purple + dark purple (names kept from the old pink look)
def pill(d, cx, cy, text, ft, fill, col, padx=44, pady=22, shadow=True):
    b = d.textbbox((0, 0), text, font=ft); w, h = b[2]-b[0], b[3]-b[1]
    box = [cx - w/2 - padx, cy - h/2 - pady, cx + w/2 + padx, cy + h/2 + pady]
    if shadow: d.rounded_rectangle([box[0], box[1]+8, box[2], box[3]+8], radius=(h+2*pady)/2, fill=(0, 0, 0, 40))
    d.rounded_rectangle(box, radius=(h+2*pady)/2, fill=fill)
    d.text((cx - w/2 - b[0], cy - h/2 - b[1]), text, font=ft, fill=col)
# title overlay for the first seconds (sits high, clear of YouTube's own buttons at the bottom and right)
ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
pill(d, W/2, 330, title, CH(92), (255, 255, 255, 240), PINK)
pill(d, W/2, 460, tagline, NU(46), (75, 61, 184, 230), (255, 255, 255), padx=34, pady=16)
ov.save(name + '_title.png')
# small site name the whole way through
wm = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(wm)
pill(d, W/2, 205, 'lylarosegames.com', NU(36), (255, 255, 255, 190), PURPLE, padx=26, pady=12, shadow=False)
wm.save(name + '_wm.png')
# end card
end = Image.new('RGB', (W, H)); px = end.load()
top, bot = (205, 235, 245), (255, 242, 210)
for y in range(H):
    t = y / H; c = tuple(int(top[i] + (bot[i]-top[i])*t) for i in range(3))
    for x in range(W): px[x, y] = c
d = ImageDraw.Draw(end, 'RGBA')
for i, c in enumerate([(255,107,107),(255,169,77),(255,212,59),(105,219,124),(77,171,247),(151,117,250)]):
    r = 760 - i*44; d.arc([W/2-r, 1500-r, W/2+r, 1500+r], 180, 360, fill=c+(150,), width=44)
icon = Image.open('icon-512.png').convert('RGBA').resize((330, 330))
end.paste(icon, (int(W/2-165), 330), icon)
d.text((W/2, 790), 'Lyla Rose Games', font=CH(120), fill=PINK, anchor='mm')
d.text((W/2, 905), 'Free games for little kids', font=NU(54), fill=PURPLE, anchor='mm')
y = 1040
for t in ['No ads', 'No sign-ups', 'Made by a dad for his little girl and boy']:
    d.text((W/2, y), '✓  ' + t if False else t, font=NU(50, 700), fill=(80, 60, 120), anchor='mm'); y += 78
pill(d, W/2, 1380, 'lylarosegames.com', CH(84), (108, 92, 231, 255), (255, 255, 255), padx=50, pady=28)
end.save(name + '_end.png')
# frames -> constant 30fps video, with the overlays
lst = open(name + '_list.txt', 'w')
for i in range(len(times)):
    dur = (times[i+1] - times[i]) if i + 1 < len(times) else 1/30
    lst.write(f"file '{fdir}/{i+first:05d}.jpg'\nduration {max(dur, 0.001):.4f}\n")
lst.write(f"file '{fdir}/{len(times)-1+first:05d}.jpg'\n"); lst.close()
span = times[-1] - times[0]; ENDS = 3.5
off = meta['offset']
cmd = ['ffmpeg', '-v', 'error', '-y',
  '-f', 'concat', '-safe', '0', '-i', name + '_list.txt',
  '-loop', '1', '-t', str(ENDS), '-i', name + '_end.png',
  '-i', name + '_title.png', '-i', name + '_wm.png',
  '-i', meta['audio'],
  '-filter_complex',
  f"[0:v]fps=30,scale={W}:{H},setsar=1[g];"
  f"[g][2:v]overlay=0:0:enable='between(t,0.3,3.6)'[g2];[g2][3:v]overlay=0:0[g3];"
  f"[1:v]fps=30,scale={W}:{H},setsar=1,fade=t=in:st=0:d=0.4[e];"
  f"[g3][e]concat=n=2:v=1:a=0[v];" +
  (f"[4:a]adelay={int(off*1000)}:all=1,apad," if off >= 0 else f"[4:a]atrim=start={-off:.3f},asetpts=PTS-STARTPTS,apad,") + f"atrim=0:{span+ENDS:.2f},loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st={span+ENDS-1.5:.2f}:d=1.5[a]",
  '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', name + '_short.mp4']
subprocess.run(cmd, check=True)
print('made', name + '_short.mp4')
