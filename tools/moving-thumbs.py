# Makes the gently-moving card pictures (games/<folder>/thumb-anim.svg) from each game's thumb.jpg.
# Hub tool - run from the site folder:  python tools/moving-thumbs.py
# Each game below lists its moving extras, placed on an 800 x 600 grid over its thumb.jpg.
# If a game's thumb.jpg changes, re-check the positions for that game, then run this again.
import base64, os
import sys
ONLY=sys.argv[1:]   # e.g. python tools/moving-thumbs.py chompers-car-wash  (nothing = remake all)
U=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'games') + os.sep

CSS = '''
  .b{animation:bob var(--d,3s) ease-in-out infinite;animation-delay:var(--l,0s)}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(var(--y,-3px))}}
  .s{transform-box:fill-box;transform-origin:center;animation:sway var(--d,3s) ease-in-out infinite;animation-delay:var(--l,0s)}
  @keyframes sway{0%,100%{transform:rotate(calc(var(--r,4deg) * -1))}50%{transform:rotate(var(--r,4deg))}}
  .sp{transform-box:fill-box;transform-origin:center;opacity:0;animation:tw var(--d,2.8s) ease-in-out infinite;animation-delay:var(--l,0s)}
  @keyframes tw{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
  .pl{transform-box:fill-box;transform-origin:center;animation:pulse var(--d,2.4s) ease-in-out infinite;animation-delay:var(--l,0s)}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(var(--k,1.05))}}
  .halo{transform-box:fill-box;transform-origin:center;animation:glow 4s ease-in-out infinite}
  @keyframes glow{0%,100%{opacity:.35;transform:scale(.95)}50%{opacity:.9;transform:scale(1.12)}}
  .puff{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center;animation:puff 3.6s ease-out infinite;animation-delay:var(--l,0s)}
  @keyframes puff{0%{opacity:0;transform:translate(0,0) scale(.35)}15%{opacity:.95}100%{opacity:0;transform:translate(-70px,-120px) scale(1.6)}}
  .ht{opacity:0;transform-box:fill-box;transform-origin:center;animation:heart 3.2s ease-out infinite;animation-delay:var(--l,0s)}
  @keyframes heart{0%{opacity:0;transform:translateY(0) scale(.5)}20%{opacity:1}100%{opacity:0;transform:translateY(-60px) scale(1.1)}}
  .spin{transform-box:fill-box;transform-origin:center;animation:spin var(--d,6s) linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .blur{transform-box:fill-box;transform-origin:center;animation:blur .25s linear infinite}
  @keyframes blur{0%,100%{transform:scaleX(1);opacity:.75}50%{transform:scaleX(.35);opacity:.45}}
  .dust{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center;animation:dust 1.2s ease-out infinite;animation-delay:var(--l,0s)}
  @keyframes dust{0%{opacity:0;transform:translate(0,0) scale(.4)}20%{opacity:.85}100%{opacity:0;transform:translate(-55px,-8px) scale(1.3)}}
  .bub{opacity:0;animation:bub var(--d,3s) ease-out infinite;animation-delay:var(--l,0s)}
  @keyframes bub{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}100%{opacity:0;transform:translate(var(--x,10px),-110px)}}
  .drop{opacity:0;animation:drop var(--d,1.6s) ease-in infinite;animation-delay:var(--l,0s)}
  @keyframes drop{0%{opacity:0;transform:translate(0,0)}10%{opacity:1}90%{opacity:1}100%{opacity:0;transform:translate(var(--x,0px),150px)}}
  .sx{animation:sx var(--d,2s) ease-in-out infinite;animation-delay:var(--l,0s)}
  @keyframes sx{0%,100%{transform:translateX(calc(var(--x,3px) * -1))}50%{transform:translateX(var(--x,3px))}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}.sp,.puff,.ht,.dust,.bub,.drop{opacity:0}}
'''
STAR='M0 -{a} L{b} -{b} L{a} 0 L{b} {b} L0 {a} L-{b} {b} L-{a} 0 L-{b} -{b}Z'
def star(x,y,size=14,delay=0,colour='#FFD43B',dur=2.8):
    a=size; b=round(size*.28,1)
    return f'<path class="sp" style="--l:{delay}s;--d:{dur}s" transform="translate({x} {y})" d="{STAR.format(a=a,b=b)}" fill="{colour}" stroke="#fff" stroke-width="2"/>'

class Pic:
    def __init__(s, game, note):
        s.game=game; s.note=note; s.defs=[]; s.layers=[]; s.n=0
    def clip(s, shape):
        s.n+=1; cid=f'c{s.n}'; s.defs.append(f'<clipPath id="{cid}">{shape}</clipPath>'); return cid
    def region(s, cls, shape, style, pivot=None):
        cid=s.clip(shape)
        # a fill-box-less group: rotate/scale around given pivot using transform-origin in px
        extra = f';transform-origin:{pivot[0]}px {pivot[1]}px;transform-box:view-box' if pivot else ''
        s.layers.append(f'<g clip-path="url(#{cid})"><g class="{cls}" style="{style}{extra}"><use href="#pic"/></g></g>')
    def rect(s,x,y,w,h,rx=6): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>'
    def ell(s,cx,cy,rx,ry): return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>'
    def bob(s,x,y,w,h,dy=-3,dur=3,delay=0): s.region('b', s.rect(x,y,w,h), f'--y:{dy}px;--d:{dur}s;--l:{delay}s')
    def sway_ell(s,cx,cy,rx,ry,deg=6,dur=2.6,delay=0): s.region('s', s.ell(cx,cy,rx,ry), f'--r:{deg}deg;--d:{dur}s;--l:{delay}s', pivot=(cx,cy))
    def sway_rect(s,x,y,w,h,px,py,deg=3,dur=3,delay=0): s.region('s', s.rect(x,y,w,h), f'--r:{deg}deg;--d:{dur}s;--l:{delay}s', pivot=(px,py))
    def pulse(s,x,y,w,h,k=1.05,dur=2.4,delay=0): s.region('pl', s.rect(x,y,w,h), f'--k:{k};--d:{dur}s;--l:{delay}s', pivot=(x+w/2,y+h/2))
    def spin_circle(s,cx,cy,r,dur=6): s.region('spin', f'<circle cx="{cx}" cy="{cy}" r="{r}"/>', f'--d:{dur}s', pivot=(cx,cy))
    def add(s,svg): s.layers.append(svg)
    def halo(s,cx,cy,r):
        s.defs.append('<radialGradient id="rays"><stop offset=".55" stop-color="#FFF3B0" stop-opacity="0"/><stop offset=".72" stop-color="#FFF3B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></radialGradient>')
        s.add(f'<circle class="halo" cx="{cx}" cy="{cy}" r="{r}" fill="url(#rays)"/>')
    def hearts(s,x,y,delays=(0,1.6)):
        for d in delays: s.add(f'<path class="ht" style="--l:{d}s" transform="translate({x} {y}) scale(.9)" d="M0 6 C-10 -4 -14 -12 -7 -15 C-3 -17 0 -13 0 -11 C0 -13 3 -17 7 -15 C14 -12 10 -4 0 6Z" fill="#FF6FA3" stroke="#fff" stroke-width="1.5"/>')
    def star(s,*a,**k): s.add(star(*a,**k))
    def save(s):
        if ONLY and s.game not in ONLY: return 0
        jpg=base64.b64encode(open(U+s.game+os.sep+'thumb.jpg','rb').read()).decode()
        svg=('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 600" width="800" height="600">\n'
             f'<!-- Gently moving card picture for the home page: the game picture (same as thumb.jpg) plus {s.note}. Made by the hub chat. -->\n'
             f'<style>{CSS}</style>\n<defs><image id="pic" width="800" height="600" href="data:image/jpeg;base64,{jpg}"/>{"".join(s.defs)}</defs>\n'
             '<use href="#pic"/>\n' + '\n'.join(s.layers) + '\n</svg>\n')
        open(U+s.game+os.sep+'thumb-anim.svg','w', encoding='utf-8').write(svg); return len(svg)

# ---------------- each game ----------------
p=Pic('chompers-choo-choo','steam puffs, a glowing sun, sparkles and a little engine chug')
p.halo(672,113,78)
p.bob(388,348,212,104,dy=-1.5,dur=.45)
for d in (0,1.2,2.4): p.add(f'<circle class="puff" style="--l:{d}s" cx="562" cy="342" r="16"/>')
p.star(160,190,15); p.star(640,160,12,.9); p.star(430,150,10,1.8)
print('choo', p.save())

p=Pic('glitter-sky','Rainbow bobbing as she flies, a floating sandwich, a bouncing cloud and twinkles')
p.bob(470,70,100,100,dy=-5,dur=2.6,delay=.4)
p.bob(465,330,290,220,dy=-3,dur=3.2,delay=.8)
p.pulse(445,350,110,55,k=1.08,dur=1.6)
p.bob(60,160,345,210,dy=-5,dur=2.4)
p.star(700,130,12); p.star(90,440,13,.9); p.star(240,560,11,1.6); p.star(420,300,10,2.1)
print('sky', p.save())

p=Pic('unicorn-soccer','a spinning ball, a hopping crowd, sparkles on the rainbow shot and a swishing tail')
p.bob(0,0,800,98,dy=-2,dur=.8)
p.spin_circle(192,148,21,dur=3)
p.sway_rect(620,440,110,150,625,455,deg=4,dur=2.2)
p.star(230,180,12); p.star(280,300,10,.7); p.star(345,440,11,1.4); p.star(610,150,10,2)
print('soccer', p.save())

p=Pic('lenny-banana-catch','swinging monkeys, wobbling bananas, a glinting banana and Lenny bouncing')
for i,(x) in enumerate((20,195,375,550)): p.bob(x,40,75,120,dy=-3,dur=2.6,delay=i*.5)
p.sway_ell(168,275,34,22,deg=10,dur=1.6)
p.sway_ell(540,195,34,22,deg=10,dur=1.8,delay=.5)
p.sway_ell(375,428,28,16,deg=10,dur=1.5,delay=.9)
p.bob(300,445,130,140,dy=-3,dur=1.8)
p.star(560,175,12); p.star(185,258,9,1.1)
print('banana', p.save())

p=Pic('glitter-getaway','Starlight bobbing mid-jump, bobbing glitter gems, a glowing sun and twinkles')
p.halo(650,120,58)
p.bob(262,225,150,150,dy=-5,dur=2.2)
for i,x in enumerate((512,560,605,650)): p.bob(x,418,40,50,dy=-4,dur=1.8,delay=i*.3)
p.bob(425,390,45,50,dy=-4,dur=1.8,delay=1.2)
p.pulse(120,332,160,66,k=1.05,dur=2.6)
p.star(470,240,12); p.star(700,380,11,1); p.star(330,200,9,1.8)
print('getaway', p.save())

p=Pic('chompers-car-crunch','a pulsing CRUNCH!, Chomper stomping, a wobbling car and flying sparkles')
p.pulse(170,180,310,120,k=1.06,dur=1.2)
p.bob(65,300,160,135,dy=-3,dur=.9)
p.sway_rect(180,120,95,80,227,160,deg=4,dur=1.1)
p.sway_rect(620,415,85,105,662,470,deg=3,dur=1.3,delay=.4)
p.star(300,330,12,colour='#FFD43B'); p.star(245,395,10,.6,colour='#FF8FB1'); p.star(330,390,9,1.2,colour='#7FD4FF')
print('crunch', p.save())

p=Pic('whirlybird-rescue','Whirly hovering with a spinning rotor, a floating balloon, a flapping bird and a bouncing cloud')
p.bob(570,0,150,285,dy=-4,dur=2.2)
p.add('<ellipse class="blur" cx="645" cy="57" rx="62" ry="5" fill="#fff" style="animation-name:blur"/>')
p.bob(30,35,125,170,dy=-5,dur=3)
p.bob(450,70,60,35,dy=-3,dur=.9)
p.bob(435,265,120,80,dy=-3,dur=3.4,delay=.6)
p.star(200,270,10); p.star(740,215,10,1.1)
print('whirly', p.save())

p=Pic('blossoms-easter-eggs','wobbling Easter eggs, rising hearts, bouncing clouds and a glowing sun')
p.halo(748,50,52)
for i,(cx,cy) in enumerate(((158,225),(287,183),(480,225),(367,315),(463,450))): p.sway_ell(cx,cy,26,30,deg=9,dur=1.8,delay=i*.35)
p.sway_ell(543,145,26,40,deg=6,dur=1.2)
for i,x in enumerate((60,260,460,660)): p.bob(x,60,80,55,dy=-3,dur=3,delay=i*.6)
p.hearts(97,335,(0,1.6)); p.hearts(705,335,(.8,2.4)); p.hearts(400,440,(.4,2))
print('blossom', p.save())

p=Pic('lenny-memory-match','Lenny bobbing and waving, glowing matched cards and confetti sparkles')
p.bob(35,140,190,185,dy=-4,dur=2)
p.pulse(272,15,160,145,k=1.03,dur=1.6); p.pulse(437,15,160,145,k=1.03,dur=1.6,delay=.8)
p.star(425,20,11); p.star(600,300,10,.9); p.star(270,440,10,1.7); p.star(750,180,9,1.2)
print('memory', p.save())

p=Pic('starlight-unicorn-race','a hopping crowd, Rainbow flying, dust puffs from galloping hooves, pulsing stars and a glowing sun')
p.halo(680,90,70)
p.bob(310,195,490,105,dy=-2,dur=.7)
p.bob(0,195,150,88,dy=-2,dur=.7,delay=.35)
p.bob(275,300,225,84,dy=-3,dur=2.2)
p.bob(148,305,70,82,dy=-2,dur=.6,delay=.2)
p.bob(0,285,112,96,dy=-2,dur=.7,delay=.4)
for d in (0,.4,.8): p.add(f'<ellipse class="dust" style="--l:{d}s" cx="378" cy="522" rx="12" ry="8"/>')
for d in (.2,.6,1): p.add(f'<ellipse class="dust" style="--l:{d}s" cx="440" cy="522" rx="10" ry="7"/>')
p.pulse(719,397,46,40,k=1.1,dur=1.4); p.star(690,425,9,.5,colour='#FFF3B0')
p.star(230,370,10); p.star(560,330,11,.9); p.star(760,150,10,1.7)
print('race', p.save())

p=Pic('chompers-car-wash','a scrubbing sponge, rising bubbles, a bouncy soapy car, a pulsing sign and sparkles')
p.pulse(95,108,332,72,k=1.03,dur=2.4)
p.sway_ell(221,290,52,42,deg=9,dur=.7)
p.bob(62,318,405,200,dy=-2,dur=1.1)
for i,(x,y,r,dx) in enumerate(((120,330,9,-8),(170,300,7,6),(230,340,10,-4),(150,420,8,10),(260,300,6,-10),(200,470,9,5))):
    p.add(f'<circle class="bub" style="--l:{i*0.5}s;--d:{2.6+i%3*0.4}s;--x:{dx}px" cx="{x}" cy="{y}" r="{r}" fill="#FFFFFFB0" stroke="#9FD3F0" stroke-width="2"/>')
p.star(310,320,11); p.star(470,300,10,.9); p.star(700,330,9,1.6)
print('carwash', p.save())

p=Pic('chompers-digger','a glowing dinosaur bone, a swinging digger bucket, falling dirt, Tipper idling, a glowing sun and sparkles')
p.halo(712,50,58)
p.pulse(312,165,98,68,k=1.07,dur=1.6)
p.sway_rect(352,200,94,88,372,210,deg=3,dur=1.8)
for i,(x,dx) in enumerate(((388,-6),(402,4),(395,-2))):
    p.add(f'<circle class="drop" style="--l:{i*0.55}s;--x:{dx}px" cx="{x}" cy="290" r="{6-i}" fill="#7A4A2A"/>')
p.bob(543,282,257,170,dy=-1.5,dur=.45)
p.bob(30,48,110,45,dy=-3,dur=3.4); p.bob(350,12,90,38,dy=-3,dur=3,delay=.8); p.bob(535,95,75,32,dy=-2,dur=3.6,delay=.4)
p.star(300,160,11); p.star(420,170,10,.8); p.star(355,250,8,1.5)
print('digger', p.save())

p=Pic('unicorn-pinball','boinging cloud bumpers, Lenny swinging, a bobbing ball, glowing stars and hearts, Rainbow flying and sparkles')
p.pulse(303,113,60,60,k=1.08,dur=.9); p.pulse(406,113,66,64,k=1.08,dur=.9,delay=.3); p.pulse(356,181,64,58,k=1.08,dur=.9,delay=.6)
p.sway_rect(415,0,72,82,432,2,deg=6,dur=2.4)
p.bob(406,432,40,38,dy=-8,dur=1.2)
p.pulse(266,278,38,38,k=1.12,dur=1.3); p.pulse(317,258,38,38,k=1.12,dur=1.3,delay=.4); p.pulse(368,252,38,38,k=1.12,dur=1.3,delay=.8)
p.pulse(248,356,38,38,k=1.1,dur=1.6); p.pulse(488,356,38,38,k=1.1,dur=1.6,delay=.8)
p.bob(315,0,85,68,dy=-4,dur=2.2)
p.star(560,60,11); p.star(250,440,10,.7); p.star(540,250,9,1.3); p.star(70,340,10,1.9); p.star(740,300,10,1.1)
print('pinball', p.save())

p=Pic('blossoms-jigsaw','a floating jigsaw piece, Blossom hopping, fluttering butterflies and sparkles')
p.bob(30,15,112,160,dy=-6,dur=2.6)
p.bob(14,458,74,138,dy=-6,dur=1.4)
p.sway_ell(316,297,17,14,deg=14,dur=.9); p.sway_ell(598,183,16,14,deg=14,dur=.8,delay=.3)
p.star(690,60,12); p.star(360,140,10,.8); p.star(560,320,10,1.5); p.star(150,250,9,1.1); p.star(110,520,9,1.9)
print('jigsaw', p.save())

p=Pic('busy-building-site','idling trucks, chimney smoke, Lenny bouncing and sparkles')
for d in (0,1.2,2.4): p.add(f'<circle class="puff" style="--l:{d}s" cx="446" cy="28" r="11"/>')
p.bob(150,82,104,92,dy=-2,dur=.42)
p.bob(244,134,114,80,dy=-2,dur=.48,delay=.1)
p.bob(578,164,112,114,dy=-2,dur=.45,delay=.2)
p.bob(452,448,106,90,dy=-2,dur=.4,delay=.15)
p.bob(503,268,44,52,dy=-4,dur=.9)
p.star(300,240,10); p.star(700,470,10,.9); p.star(80,260,9,1.6); p.star(560,90,9,1.2)
print('building site', p.save())

p=Pic('chompers-toot-toot','steam puffs from the engine, a glowing beach-hut stop, waving kids and sparkles')
for d in (0,1.2,2.4): p.add(f'<circle class="puff" style="--l:{d}s" cx="418" cy="322" r="9"/>')
p.halo(692,252,100)
p.bob(516,352,98,72,dy=-3,dur=.9)
p.star(470,85,11); p.star(560,160,10,.7); p.star(445,545,10,1.4); p.star(105,480,9,1.9)
print('toot toot', p.save())

p=Pic('chompers-digger-maze','Lenny cheering, Tipper idling, a glowing dinosaur bone, dirt flying from the scoop and twinkling gold nuggets')
p.bob(662,48,134,152,dy=-4,dur=1.1)
p.bob(636,448,164,116,dy=-1.5,dur=.45)
p.pulse(326,58,92,62,k=1.06,dur=1.8)
p.halo(370,88,62)
for i,(x,dx,r) in enumerate(((352,-14,6),(366,8,5),(343,-26,5),(372,18,4))):
    p.add(f'<circle class="bub" style="--l:{i*0.35}s;--d:{1.4+i%2*0.3}s;--x:{dx}px" cx="{x}" cy="300" r="{r}" fill="#8A5A34"/>')
p.star(495,176,11); p.star(592,282,10,.7); p.star(178,488,10,1.4); p.star(500,384,9,2.0)
print('digger maze', p.save())

p=Pic('whirly-cloud-maze','Whirly hovering with a spinning rotor, Woolly waving for help, a glowing star, cloud puffs blowing away and sparkles')
p.bob(352,168,176,106,dy=-2,dur=1.6)
p.add('<ellipse class="blur" cx="404" cy="174" rx="70" ry="4" fill="#fff" style="animation-name:blur"/>')
p.sway_rect(138,84,74,66,172,150,deg=3,dur=1.2)
p.pulse(362,356,76,76,k=1.08,dur=1.6)
for i,(x,y) in enumerate(((672,170),(690,300),(676,470))):
    p.add(f'<circle class="puff" style="--l:{i*1.1}s" cx="{x}" cy="{y}" r="18"/>')
p.star(300,90,10); p.star(560,300,10,.8); p.star(250,420,9,1.6)
print('cloud maze', p.save())

p=Pic('lenny-jungle-maze','Lenny swinging on the vine, the baby lemurs bobbing along behind Lenny, the toucan bobbing, a waving lost baby and sparkles')
p.region('sx', p.rect(409,311,50,85,rx=4), '--x:2.5px;--d:1.6s')
p.bob(588,188,66,72,dy=-3,dur=.9)
for i,x in enumerate((470,512,552)): p.bob(x,205,40,52,dy=-3,dur=.9,delay=.15*(i+1))
p.bob(636,64,84,50,dy=-3,dur=1.8)
p.bob(680,408,40,50,dy=-3,dur=.8)
p.star(565,92,10); p.star(100,492,10,.8); p.star(432,492,10,1.6); p.star(300,360,9,1.2); p.star(560,370,9,.4)
print('jungle maze', p.save())

p=Pic('trick-or-treat-maze','Chomper and Sparklehoof bobbing along, the bats flapping, the little ghost floating, the glowing door and sparkles')
# shapes cut round the door mat beside Chomper's tail and the tree edge beside Sparklehoof's tail, so nothing behind them wobbles
p.region('b', '<polygon points="318,168 404,168 404,260 300,260 300,220 318,220"/>', '--y:-3px;--d:.9s;--l:0s')
p.region('b', '<polygon points="456,166 516,166 516,254 444,254 444,214 456,214"/>', '--y:-3px;--d:.9s;--l:.45s')
p.star(236,170,9,1.5)
p.bob(672,280,58,60,dy=-5,dur=2.2)
p.bob(412,72,58,30,dy=-4,dur=1.1)
p.bob(80,358,56,34,dy=-4,dur=1.3,delay=.4)
p.bob(666,406,56,34,dy=-4,dur=1.2,delay=.8)
p.pulse(280,110,160,32,k=1.04,dur=1.8)
p.pulse(214,336,40,52,k=1.03,dur=2.2); p.halo(234,362,30)
p.star(255,345,9,.3); p.star(108,42,9,1.1); p.star(745,240,9,1.9); p.star(560,330,9,.7); p.star(180,48,9,2.2)
print('trick-or-treat maze', p.save())
