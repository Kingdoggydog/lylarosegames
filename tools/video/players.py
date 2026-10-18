# How each game gets played on camera: real taps where a toddler would tap.
# Each play() runs until the deadline. Add a game by writing a function and listing it in GAMES.
import time, random

def bubble(pg, tap, end, W, H):
    while time.time() < end:
        st = pg.evaluate('__lbp.state')
        if st['phase'] == 'play' and st['bubbleXY']:
            x, y, r = max(st['bubbleXY'], key=lambda b: b[1])
            if 110 < y < H - 60: tap(x + random.randint(-8, 8), y + random.randint(-8, 8))
            pg.wait_for_timeout(random.randint(650, 1000))
        elif st['giant']:
            pg.wait_for_timeout(500); pg.evaluate('__lbp.popNext()'); pg.wait_for_timeout(800)
        else:
            pg.wait_for_timeout(300)

def fetch(pg, tap, end, W, H):
    pg.wait_for_timeout(800); tickles = 0; tricks = 0
    while time.time() < end:
        st = pg.evaluate('__bft.state')
        if st['mode'] in ('ready', 'idle', 'wait', 'home', 'play'):
            tickles = 0
            if random.random() < 0.15 and tricks < 2:
                tap(st['pup']['x'], st['pup']['y']); tricks += 1; pg.wait_for_timeout(1400); continue
            tap(random.randint(int(W*0.2), int(W*0.85)), random.randint(int(H*0.5), int(H*0.8))); pg.wait_for_timeout(900)
        elif st['mode'] == 'party':
            if tickles < 3: tap(st['pup']['x'], st['pup']['y']); tickles += 1
            pg.wait_for_timeout(700)
        else:
            pg.wait_for_timeout(300)

def pumpkin(pg, tap, end, W, H):
    def btn(sel):
        b = pg.locator(sel).bounding_box(); tap(b['x'] + b['width']/2, b['y'] + b['height']/2)
    looks = [[(0, 2), (1, 3), (2, 0), (3, 1), (4, 1)], [(0, 3), (1, 2), (2, 1), (3, 3), (4, 3)], [(0, 1), (1, 0), (2, 4), (3, 0), (4, 0)]]
    pg.wait_for_timeout(1200); n = 0
    for pick in (3, 1, 2):
        if time.time() > end - 6: break
        L = pg.evaluate('__bpf.layout()'); q = L['patch'][pick]
        tap(q['x'], q['base'] - q['R']); pg.wait_for_timeout(2200)
        L = pg.evaluate('__bpf.layout()'); tr, P, Tb = L['tray'], L['P'], L['Tb']
        for i, j in looks[n % 3]:
            tx, ty = tr['tabs'][i]; tap(tr['x'] + tx + Tb/2, tr['y'] + ty + Tb/2); pg.wait_for_timeout(450)
            px, py = tr['pcs'][j]; tap(tr['x'] + px + P/2, tr['y'] + py + P/2); pg.wait_for_timeout(850)
        btn('#lightBtn'); pg.wait_for_timeout(3800)
        btn('#porchBtn'); pg.wait_for_timeout(3000)
        n += 1
        if time.time() > end - 8: break
        btn('#newBtn'); pg.wait_for_timeout(1800)
    while time.time() < end: pg.wait_for_timeout(300)

def _drag(pg, x0, y0, x1, y1, steps=22):
    cdp = getattr(pg, '_cdp', None) or pg.context.new_cdp_session(pg); pg._cdp = cdp
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x0, 'y': y0}]}); pg.wait_for_timeout(120)
    for i in range(1, steps + 1):
        k = i / steps; k = k*k*(3 - 2*k)  # ease in and out, like a real hand
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x0 + (x1-x0)*k, 'y': y0 + (y1-y0)*k - 40*(1-(2*k-1)**2)}]}); pg.wait_for_timeout(22)
    pg.wait_for_timeout(80); cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})

def shapes(pg, tap, end, W, H):
    pg.wait_for_timeout(1000)
    cv = pg.evaluate("(()=>{const c=[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect()).sort((a,b)=>b.width*b.height-a.width*a.height)[0];return [c.left,c.top]})()")
    wrong_done = False
    while time.time() < end:
        st = pg.evaluate('__bss.state')
        if st['phase'] == 'play':
            todo = [s for s in st['shapes'] if not s['posted'] and s['state'] in ('idle', 'home', 'rest', 'ready', 'wait')]
            if not todo: pg.wait_for_timeout(300); continue
            s = random.choice(todo); hole = [q for q in st['holes'] if q['kind'] == s['kind']][0]
            if not wrong_done and st['round'] >= 2 and len(st['holes']) > 2:   # one silly wrong try that boings back
                o = [q for q in st['holes'] if q['kind'] != s['kind']][0]; hole = o; wrong_done = True
            _drag(pg, cv[0]+s['x'], cv[1]+s['y'], cv[0]+hole['x']+6, cv[1]+hole['y']+4); pg.wait_for_timeout(random.randint(700, 1000))
        else:
            pg.wait_for_timeout(400)

def puppy(pg, tap, end, W, H):
    pg.wait_for_timeout(1000); mode0 = None; dress = 0; since = time.time()
    while time.time() < end:
        st = pg.evaluate('__bpc.state'); m = st['mode']
        if m != mode0: mode0 = m; dress = 0; since = time.time()
        if time.time() - since > 12: pg.evaluate('__bpc.skip()'); since = time.time(); continue
        if m in ('food', 'bath', 'brush', 'dress') and st['done'].get(m):
            nxt = [k for k in st['buttons'] if not st['done'].get(k)]
            if nxt: b = st['buttons'][nxt[0]]; pg.wait_for_timeout(900); tap(b['x'], b['y']); pg.wait_for_timeout(1200); continue
        if m == 'room':
            nxt = [k for k in st['buttons'] if not st['done'].get(k)]
            b = st['buttons'][nxt[0] if nxt else list(st['buttons'])[0]]; pg.wait_for_timeout(700); tap(b['x'], b['y']); pg.wait_for_timeout(1200)
        elif m == 'bath':
            if st['ready']: tap(st['shower']['x'], st['shower']['y']); pg.wait_for_timeout(700)
            else:
                pp = st['pup']; _drag(pg, pp['x']-60, pp['y']-10, pp['x']+60, pp['y']+20, steps=10)
        elif m == 'brush':
            if st['mess']: tap(st['mess'][0]['x'], st['mess'][0]['y']); pg.wait_for_timeout(450)
            else: tap(st['pup']['x'], st['pup']['y']); pg.wait_for_timeout(450)
        elif m == 'dress':
            ids = list(st['itemButtons'])
            if dress < 2: b = st['itemButtons'][ids[(dress*3 + 1) % len(ids)]]; tap(b['x'], b['y']); dress += 1; pg.wait_for_timeout(1300)
            else: b = st['buttons']['dress']; tap(b['x'], b['y']); pg.wait_for_timeout(1000)
        elif m == 'food':
            tap(st['bowl']['x'], st['bowl']['y']); pg.wait_for_timeout(900)
        else:
            pg.wait_for_timeout(400)

def jungle(pg, tap, end, W, H, H_='__ljm'):
    # Lenny walks himself (the game's own autoplay); we show a tap on the arrow he'd need, like a hand on the buttons
    pg.wait_for_timeout(800); pg.evaluate(H_+'.calm && 0'); pg.evaluate(H_+'.autoplay(true)')
    arrows = pg.evaluate("Object.fromEntries([...document.querySelectorAll('button[data-d]')].map(b=>{const r=b.getBoundingClientRect();return [b.dataset.d,[r.x+r.width/2,r.y+r.height/2,r.width]]}))")
    last = None; ov_t = None
    while time.time() < end:
        st = pg.evaluate(H_+'.state'); p = (st['x'], st['y'])
        if st['overlay']:   # level done: enjoy the stars for a moment, then tap Next level
            ov_t = ov_t or time.time()
            if time.time() - ov_t > 2.6 and pg.locator('#ovBtn').count():
                b = pg.locator('#ovBtn').bounding_box(); tap(b['x'] + b['width']/2, b['y'] + b['height']/2)
                pg.wait_for_timeout(900); pg.evaluate(H_+'.autoplay(true)'); ov_t = None; last = None
            else: pg.wait_for_timeout(150)
            continue
        if last and p != last:
            dx, dy = p[0]-last[0], p[1]-last[1]
            d = '0' if dy < 0 else '2' if dy > 0 else '1' if dx > 0 else '3'
            a = arrows.get(d)
            if a and a[2] > 0 and abs(dx) + abs(dy) == 1: pg.evaluate(f'__ripple({a[0]},{a[1]})')
        last = p; pg.wait_for_timeout(90)

def treat(pg, tap, end, W, H):
    jungle(pg, tap, end, W, H, '__ttm')

GAMES = {
    'bubble': ('lenny-bubble-pop', bubble),
    'fetch': ('biscuits-fetch', fetch),
    'pumpkin': ('blossoms-pumpkin-faces', pumpkin),
    'shapes': ('blossoms-shape-sorter', shapes),
    'puppy': ('biscuits-puppy-care', puppy),
    'jungle': ('lenny-jungle-maze', jungle, '#ovBtn'),
    'treat': ('trick-or-treat-maze', treat, '#ovBtn'),
}
