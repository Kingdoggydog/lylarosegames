# Records a game with real taps, capturing the game's own sounds (WebAudio) alongside the picture.
import sys, json, base64, time, random
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]  # usage: python3 rec.py <name> <game> [seconds]
HOOK = r'''
(() => {
  const Orig = window.AudioContext || window.webkitAudioContext;
  if (!Orig) return;
  window.__rec = {chunks: [], started: null};
  const Wrapped = function(...a){
    const ctx = new Orig(...a);
    try {
      const real = ctx.destination;
      const tap = ctx.createGain(); tap.connect(real);
      const msd = ctx.createMediaStreamDestination(); tap.connect(msd);
      Object.defineProperty(ctx, 'destination', {get: () => tap});
      if (!window.__rec.mr) {
        const mr = new MediaRecorder(msd.stream, {mimeType: 'audio/webm;codecs=opus'});
        mr.ondataavailable = e => { if (e.data.size) window.__rec.chunks.push(e.data); };
        mr.start(250); window.__rec.mr = mr; window.__rec.started = performance.now();
      }
    } catch(e) { console.log('rechook', e); }
    return ctx;
  };
  Wrapped.prototype = Orig.prototype;
  window.AudioContext = Wrapped; window.webkitAudioContext = Wrapped;
  // show where a finger taps, so viewers can follow along
  const css = document.createElement('style');
  css.textContent = `.__tap{position:fixed;width:70px;height:70px;margin:-35px 0 0 -35px;border-radius:50%;pointer-events:none;z-index:99999;
    background:radial-gradient(circle,rgba(255,255,255,.85) 0 30%,rgba(255,255,255,.35) 31% 60%,rgba(255,255,255,0) 61%);animation:__tp .5s ease-out forwards}
    @keyframes __tp{from{transform:scale(.4);opacity:1}to{transform:scale(1.3);opacity:0}}
    .back,#music,#sound,.lr-about,.lr-share,[class*="share"]{opacity:0!important;pointer-events:none!important}`;
  document.addEventListener('DOMContentLoaded', () => document.head.appendChild(css));
  window.addEventListener('pointerdown', e => { const d = document.createElement('div'); d.className='__tap'; d.style.left=e.clientX+'px'; d.style.top=e.clientY+'px'; document.body.appendChild(d); setTimeout(()=>d.remove(),600); }, true);
})();
'''
W, H = 540, 960
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=2'])
    ctx = br.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, has_touch=True, is_mobile=True)
    ctx.route('**/fonts.g*/**', lambda r: r.abort()); ctx.route('**/googletagmanager.com/**', lambda r: r.abort())
    ctx.add_init_script(HOOK)
    pg = ctx.new_page(); t_page = time.time()
    import os
    os.makedirs(OUT + '_frames', exist_ok=True)
    frames = []
    cdp = ctx.new_cdp_session(pg)
    def on_frame(ev):
        n = len(frames)
        open(f'{OUT}_frames/{n:05d}.jpg', 'wb').write(base64.b64decode(ev['data']))
        frames.append(ev['metadata']['timestamp'])
        cdp.send('Page.screencastFrameAck', {'sessionId': ev['sessionId']})
    cdp.on('Page.screencastFrame', on_frame)
    cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 92, 'maxWidth': 1080, 'maxHeight': 1920, 'everyNthFrame': 1})
    import players
    game, secs = sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else 28
    folder, play = players.GAMES[game]
    pg.goto(f'http://localhost:8765/games/{folder}/?test'); pg.wait_for_timeout(1500)
    bb = pg.locator('#playBtn').bounding_box(); t_tap = time.time(); pg.touchscreen.tap(bb['x']+bb['width']/2, bb['y']+bb['height']/2)
    play(pg, pg.touchscreen.tap, time.time() + secs, W, H)
    nav0 = pg.evaluate('performance.timeOrigin')
    started = pg.evaluate('window.__rec && window.__rec.started')
    pg.evaluate('window.__rec && window.__rec.mr && window.__rec.mr.stop()'); pg.wait_for_timeout(600)
    b64 = pg.evaluate('''(async () => { const b = new Blob(window.__rec.chunks, {type:'audio/webm'}); const buf = await b.arrayBuffer();
        let s=''; const u=new Uint8Array(buf); for(let i=0;i<u.length;i+=32768) s+=String.fromCharCode.apply(null,u.subarray(i,i+32768)); return btoa(s); })()''')
    open(OUT + '_audio.webm', 'wb').write(base64.b64decode(b64))
    cdp.send('Page.stopScreencast'); vid = OUT + '_frames'; ctx.close(); br.close()
    # audio started this many seconds after the page (and the video) began
    offset = (nav0/1000 + started/1000) - frames[0]
    json.dump(frames, open(OUT + '_times.json', 'w'))
    json.dump({'video': vid, 'audio': OUT + '_audio.webm', 'offset': offset, 'audio_start': nav0/1000 + started/1000, 'tap': t_tap}, open(OUT + '.json', 'w'))
    print('video', vid, 'audio offset', round(offset, 2))
