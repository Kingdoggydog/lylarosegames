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

GAMES = {
    'bubble': ('lenny-bubble-pop', bubble),
    'fetch': ('biscuits-fetch', fetch),
    'pumpkin': ('blossoms-pumpkin-faces', pumpkin),
}
