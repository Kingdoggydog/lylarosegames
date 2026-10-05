/* =====================================================================
   LYLA ROSE GAMES - SITE-WIDE SETTINGS
   Every page on the site (home page, category pages and every game)
   loads this one file. Change something here and it changes everywhere.
   ===================================================================== */

// Google Analytics 4 "Measurement ID" - looks like G-ABC123XYZ.
// Leave it as "" to switch analytics off.
const GA_MEASUREMENT_ID = "G-EM2WKCXBEL";

// ----- Google Analytics -----
(function () {
  if (!GA_MEASUREMENT_ID) return;
  // Already loaded directly on this page (the home page has the tag for Search Console)
  if (window.gtag) return;
  // Don't count visits while testing on your own computer
  if (location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag("js", new Date());
  // Kid-friendly settings: no ad tracking, no cross-device profiling
  gtag("config", GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
})();

// ----- Logo in the browser tab / home screen (added to any page that doesn't list its own) -----
(function () {
  const ROOT = new URL(".", document.currentScript.src).href;
  const add = (attrs) => { const l = document.createElement(attrs.tag || "link"); delete attrs.tag; Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v)); document.head.appendChild(l); };
  if (!document.querySelector('link[rel~="icon"]')) {
    add({ rel: "icon", href: ROOT + "brand/icon.svg", type: "image/svg+xml" });
    add({ rel: "icon", href: ROOT + "brand/icon-48.png", sizes: "48x48", type: "image/png" });
  }
  if (!document.querySelector('link[rel="apple-touch-icon"]')) add({ rel: "apple-touch-icon", href: ROOT + "brand/icon-180.png" });
  if (!document.querySelector('link[rel="manifest"]')) add({ rel: "manifest", href: ROOT + "site.webmanifest" });
  if (!document.querySelector('meta[name="theme-color"]')) add({ tag: "meta", name: "theme-color", content: "#F2559B" });
  // Opened from a phone's home screen, the site runs full screen with no browser bar
  add({ tag: "meta", name: "mobile-web-app-capable", content: "yes" });
  add({ tag: "meta", name: "apple-mobile-web-app-capable", content: "yes" });
  add({ tag: "meta", name: "apple-mobile-web-app-title", content: "Lyla Rose" });
})();

// ----- "Keep playing": remember the last few games opened on this device (for the home page row).
//       Saved only in this browser - never sent anywhere.
(function () {
  const m = location.pathname.match(/\/games\/([^/]+)\//);
  if (!m) return;
  try {
    const KEY = "lr-recent";
    const list = JSON.parse(localStorage.getItem(KEY) || "[]").filter(f => f !== m[1]);
    list.unshift(m[1]);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 8)));
  } catch (e) {}
})();

// ----- "Share my score" button for game end screens - the same look and behaviour in every game.
//       A game calls:  panel.appendChild(LR.shareButton("I got gold in Starlight's Unicorn Race! 🥇"))
//       It shares the message + this game's address (phone's own share menu, or "Link copied!" on computers).
//       Nothing is sent anywhere by the site itself.
window.LR = window.LR || {};
(function () {
  const css = document.createElement("style");
  css.textContent =
    ".lr-share{font:inherit;font-weight:800;font-size:16px;line-height:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;" +
    "min-height:48px;padding:10px 20px;border-radius:14px;cursor:pointer;color:#23413B;background:#fff;border:3px solid #F2559B55;" +
    "box-shadow:0 4px 0 #F2559B33;-webkit-tap-highlight-color:transparent}" +
    ".lr-share:hover{background:#FDE2EC}.lr-share:active{transform:translateY(2px);box-shadow:0 2px 0 #F2559B33}" +
    ".lr-share:focus-visible{outline:3px solid #FFC23D;outline-offset:2px}.lr-share svg{flex:none}" +
    ".lr-share.done{background:#E9F9EC;border-color:#69DB7C}";
  (document.head || document.documentElement).appendChild(css);
  const ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
  function pageUrl() {
    const c = document.querySelector('link[rel="canonical"]');
    return c ? c.href : location.href.split("#")[0].split("?")[0];
  }
  window.LR.share = async function (message) {
    const url = pageUrl();
    const title = document.title.split(" - ")[0];
    const text = message + " Play it free on Lyla Rose Games:";
    if (window.gtag) gtag("event", "share", { method: "score", content_type: "game", item_id: url });
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return "shared"; }
      catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
    }
    try { await navigator.clipboard.writeText(text + " " + url); return "copied"; } catch (e) {}
    try { window.prompt("Copy this link:", url); } catch (e) {}
    return "copied";
  };
  window.LR.shareButton = function (message, label) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "lr-share";
    b.innerHTML = ICON + "<span></span>";
    const span = b.querySelector("span"); span.textContent = label || "Share my score";
    b.setAttribute("aria-label", (label || "Share my score") + ": " + message);
    // stop the tap reaching the game underneath (some games start a new round on any tap)
    ["pointerdown", "pointerup", "touchstart", "touchend", "mousedown"].forEach(t => b.addEventListener(t, e => e.stopPropagation()));
    b.addEventListener("click", async e => {
      e.preventDefault(); e.stopPropagation();
      const r = await window.LR.share(typeof message === "function" ? message() : message);
      if (r === "copied") { span.textContent = "Link copied!"; b.classList.add("done"); setTimeout(() => { span.textContent = label || "Share my score"; b.classList.remove("done"); }, 1800); }
    });
    return b;
  };
})();

/* =====================================================================
   MOBILE KIT - switched on automatically for every game page
   (anything inside the games folder). Makes games behave like apps on
   phones and iPads:
   - no double-tap zoom, no pinch zoom, no page bounce or pull-to-refresh
   - no text selection or long-press pop-ups while playing
   - full screen (hides the browser bar) on the first tap, where the device allows it
   - sound that wakes back up after the phone pauses it (switching apps, locking, going Back)
   - "turn your device sideways" message, if the game asks for it with
       <meta name="game-orientation" content="landscape">   (or "portrait")
   ===================================================================== */
(function () {
  if (!/\/games\/[^/]+\//.test(location.pathname)) return;

  // 1. Stop zooming. Keeps the page at normal size even if a kid pinches or double-taps.
  const vp = document.querySelector('meta[name="viewport"]');
  const vpContent = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
  if (vp) vp.setAttribute("content", vpContent);
  else { const m = document.createElement("meta"); m.name = "viewport"; m.content = vpContent; document.head.appendChild(m); }
  // iPhone and iPad ignore "user-scalable=no", so block their pinch gestures directly
  ["gesturestart", "gesturechange", "gestureend"].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
  document.addEventListener("touchmove", e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

  // 2. App-like touch behaviour (":where" keeps these weak, so a game's own styles still win)
  const css = document.createElement("style");
  css.textContent = `
    :where(html, body) { overscroll-behavior: none; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    :where(html, body, body *) { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    :where(body) { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
    :where(input, textarea, select) { -webkit-user-select: text; user-select: text; font-size: max(16px, 1em); }
    :where(img, canvas, svg) { -webkit-user-drag: none; }

    .lr-rotate { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; padding: 24px;
      background: linear-gradient(170deg, #CDEBF5, #F7DDEB); color: #23413B; text-align: center;
      font-family: "Nunito", system-ui, sans-serif; }
    .lr-rotate[hidden] { display: none; }
    .lr-rotate .lr-box { display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 320px; }
    .lr-rotate .lr-phone { width: 64px; height: 104px; border: 6px solid #F2559B; border-radius: 16px; background: #fff;
      animation: lr-turn 2.2s ease-in-out infinite; }
    .lr-rotate.lr-want-portrait .lr-phone { animation-name: lr-turn-back; }
    .lr-rotate b { font-family: "Chewy", "Comic Sans MS", cursive; font-weight: 400; font-size: 32px; color: #F2559B; line-height: 1.05; }
    .lr-rotate p { margin: 0; font-size: 17px; font-weight: 700; }
    .lr-rotate button { font: inherit; font-weight: 800; font-size: 15px; background: transparent; color: #557A72;
      border: 3px dashed #2E6E6155; border-radius: 999px; padding: 8px 16px; cursor: pointer; }
    @keyframes lr-turn { 0%, 25% { transform: rotate(0) } 60%, 100% { transform: rotate(-90deg) } }
    @keyframes lr-turn-back { 0%, 25% { transform: rotate(-90deg) } 60%, 100% { transform: rotate(0) } }
    @media (prefers-reduced-motion: reduce) { .lr-rotate .lr-phone { animation: none; transform: rotate(-90deg); } }
  `;
  document.head.appendChild(css);

  const isTouch = matchMedia("(pointer: coarse)").matches;
  const want = (document.querySelector('meta[name="game-orientation"]') || {}).content;

  // 3. Full screen on the first tap (Android phones and tablets, iPads). iPhones can't do this
  //    from a web page - there, adding the site to the home screen gives full screen instead.
  const root = document.documentElement;
  const canFull = !!(root.requestFullscreen || root.webkitRequestFullscreen);
  function goFull() {
    if (!isTouch || !canFull) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) return;
    try {
      const p = (root.requestFullscreen || root.webkitRequestFullscreen).call(root, { navigationUI: "hide" });
      if (p && p.then) p.then(lock).catch(() => {});
    } catch (e) {}
  }
  function lock() {
    if (want && screen.orientation && screen.orientation.lock) screen.orientation.lock(want).catch(() => {});
  }
  document.addEventListener("pointerup", goFull, { once: true, capture: true });

  // 4. Sound that always comes back. Phones pause a page's sound when you switch apps, lock the
  //    screen, get a notification or come "back" to the page - iPhones call this "interrupted",
  //    which games often don't recognise, so the sound stays off until a refresh. Here we keep
  //    track of every game's sound engine and wake it up on the next tap or key press.
  const sounds = new Set();
  try {
    const Orig = window.AudioContext || window.webkitAudioContext;
    if (Orig) {
      const Tracked = class extends Orig { constructor(...a) { super(...a); sounds.add(this); } };
      window.AudioContext = Tracked;
      if (window.webkitAudioContext) window.webkitAudioContext = Tracked;
    }
  } catch (e) {}
  function wakeSound() {
    // treat game sound like music/video on iPhone: plays even when the silent switch is on
    try { if (navigator.audioSession && navigator.audioSession.type !== "playback") navigator.audioSession.type = "playback"; } catch (e) {}
    sounds.forEach(ac => {
      if (ac.state === "running" || ac.state === "closed") return;
      try {
        const p = ac.resume(); if (p && p.catch) p.catch(() => {});
        // a tiny silent blip - older iPhones need something to actually play before sound unlocks
        const src = ac.createBufferSource(); src.buffer = ac.createBuffer(1, 1, 22050);
        src.connect(ac.destination); src.start(0);
      } catch (e) {}
    });
  }
  // taps and key presses are what phones accept as "the player wants sound"
  ["pointerup", "touchend", "click", "keydown"].forEach(t => addEventListener(t, wakeSound, { capture: true, passive: true }));
  // coming back to the game (from another app, or the Back button): try straight away too
  document.addEventListener("visibilitychange", () => { if (!document.hidden) wakeSound(); });
  addEventListener("pageshow", wakeSound);

  // 5. "Turn your device sideways" message - only on phones (tablets are big enough either way), only if the game asks
  const isPhone = isTouch && Math.min(screen.width, screen.height) < 600;
  if (!want || !isPhone) return;
  let dismissed = false;
  try { dismissed = sessionStorage.getItem("lr-rotate-ok") === "1"; } catch (e) {}
  function build() {
    const o = document.createElement("div");
    o.className = "lr-rotate" + (want === "portrait" ? " lr-want-portrait" : "");
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-live", "polite");
    o.innerHTML = '<div class="lr-box"><div class="lr-phone" aria-hidden="true"></div>' +
      '<b>' + (want === "portrait" ? "Turn it the other way!" : "Turn it sideways!") + '</b>' +
      '<p>This game works best with your ' + (want === "portrait" ? "device standing up tall." : "device on its side.") + '</p>' +
      '<button type="button">Play this way anyway</button></div>';
    o.querySelector("button").addEventListener("click", () => {
      dismissed = true;
      try { sessionStorage.setItem("lr-rotate-ok", "1"); } catch (e) {}
      update();
    });
    document.body.appendChild(o);
    const mq = matchMedia("(orientation: portrait)");
    function update() {
      const portrait = mq.matches;
      const wrong = want === "landscape" ? portrait : !portrait;
      o.hidden = dismissed || !wrong;
    }
    (mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update));
    addEventListener("resize", update);
    update();
  }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();

/* =====================================================================
   "FOR GROWN-UPS" INFO BUTTON - game pages only (added 5 Oct)
   Each game page has a short hand-written note for parents, near the end of its page:
     <details class="lr-about"><summary>For grown-ups</summary><div class="lr-about-body">...</div></details>
   This turns it into a small "i" button beside the "All games" button, which opens the note
   as a pop-up card. The words are in the page itself, so Google can read them too.
   The button looks for a free spot (never on top of another button or a small panel).
   ===================================================================== */
(function () {
  if (!/\/games\/[^/]+\//.test(location.pathname)) return;
  const css = document.createElement("style");
  css.textContent =
    "details.lr-about{position:fixed;left:0;top:0;width:0;height:0;margin:0;padding:0;border:0;z-index:2147483000;font-family:Nunito,system-ui,sans-serif}" +
    "details.lr-about>summary{position:fixed;left:-999px;top:0;list-style:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;" +
    "height:40px;min-width:40px;padding:0 12px;border-radius:999px;background:#FFFFFFE8;color:#23413B;font:800 14px/1 Nunito,system-ui,sans-serif;" +
    "box-shadow:0 3px 10px #0000002a;border:2px solid #FFFFFF;white-space:nowrap;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}" +
    "details.lr-about>summary::-webkit-details-marker{display:none}" +
    "details.lr-about>summary:focus-visible{outline:3px solid #FFC23D;outline-offset:2px}" +
    "details.lr-about>summary .lr-i{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#4DABF7;color:#fff;font:800 14px/1 Georgia,serif;font-style:italic}" +
    "details.lr-about.lr-small>summary{padding:0;width:40px}details.lr-about.lr-small>summary .lr-t{display:none}" +
    "details.lr-about[open]>summary{visibility:hidden}" +
    "details.lr-about .lr-about-body{display:none}" +
    "details.lr-about[open] .lr-about-body{display:block;position:fixed;inset:0;background:#23413B99;overflow-y:auto;touch-action:pan-y;-webkit-overflow-scrolling:touch;" +
    "padding:max(16px,env(safe-area-inset-top)) 16px max(16px,env(safe-area-inset-bottom))}" +
    ".lr-about-card{position:relative;max-width:560px;margin:24px auto;background:#fff;border-radius:22px;padding:22px 24px 20px;color:#23413B;box-shadow:0 18px 40px #0005;" +
    "user-select:text;-webkit-user-select:text}" +
    ".lr-about-card h2{font:400 26px/1.1 Chewy,'Comic Sans MS',cursive;margin:0 40px 10px 0;color:#F2559B}" +
    ".lr-about-card p{margin:0 0 10px;font-size:15.5px;line-height:1.55;color:#3E5F58}" +
    ".lr-about-card a{color:#C2307A;font-weight:800}" +
    ".lr-about-x{position:absolute;right:12px;top:12px;width:40px;height:40px;border-radius:50%;border:0;background:#FDE2EC;color:#23413B;font:800 18px/1 system-ui;cursor:pointer}" +
    ".lr-about-ok{display:block;margin:14px auto 0;min-height:44px;padding:0 28px;border:0;border-radius:14px;background:#F2559B;color:#fff;font:800 17px/1 Nunito,system-ui,sans-serif;cursor:pointer}";
  (document.head || document.documentElement).appendChild(css);

  function build() {
    const d = document.querySelector("details.lr-about");
    if (!d) return;
    const sum = d.querySelector("summary");
    const body = d.querySelector(".lr-about-body");
    sum.innerHTML = '<span class="lr-i" aria-hidden="true">i</span><span class="lr-t">For grown-ups</span>';
    sum.setAttribute("aria-label", "For grown-ups: about this game");
    sum.title = "For grown-ups: about this game";
    // wrap the words in a card with a close button
    const card = document.createElement("div"); card.className = "lr-about-card";
    while (body.firstChild) card.appendChild(body.firstChild);
    const x = document.createElement("button"); x.type = "button"; x.className = "lr-about-x"; x.setAttribute("aria-label", "Close"); x.textContent = "✕";
    const ok = document.createElement("button"); ok.type = "button"; ok.className = "lr-about-ok"; ok.textContent = "Back to the game";
    card.prepend(x); card.append(ok); body.appendChild(card);
    const close = () => { d.open = false; place(); };
    x.addEventListener("click", close); ok.addEventListener("click", close);
    body.addEventListener("click", e => { if (e.target === body) close(); });
    document.addEventListener("keydown", e => { if (d.open && e.key === "Escape") { e.stopPropagation(); close(); } }, true);
    // keep taps and keys inside the note from reaching the game underneath
    ["pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "mouseup", "click", "keydown", "keyup"].forEach(t => {
      d.addEventListener(t, e => e.stopPropagation());
    });
    d.addEventListener("toggle", () => { if (d.open && window.gtag) gtag("event", "select_content", { content_type: "about", item_id: location.pathname }); });

    const INTERACTIVE = "a,button,input,select,textarea,label,summary,[role=button],[onclick],[tabindex]:not([tabindex='-1'])";
    // Things the button must never sit on: other buttons and links, plus small floating bits (score pills, panels, arrows).
    // Big things (the game board, full-screen backgrounds) are fine to sit on.
    const LABELS = "h1,h2,h3,h4,p,[class*=title],[class*=hud],[class*=score],[class*=pill],[class*=stat],[class*=chip],[class*=badge],[class*=count]";
    function obstacles() {
      const out = [], vw = innerWidth, vh = innerHeight;
      document.querySelectorAll("body *").forEach(el => {
        if (d.contains(el) || el.closest(".lr-rotate")) return;
        const st = getComputedStyle(el);
        const floating = st.position === "fixed" || st.position === "absolute" || st.position === "sticky";
        const label = el.matches(LABELS);
        if (!floating && !el.matches(INTERACTIVE) && !label) return;   // titles, pills and text count too
        if (st.display === "none" || st.visibility === "hidden" || +st.opacity < 0.05) return;
        const r = el.getBoundingClientRect();
        if (r.width < 3 || r.height < 3 || r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) return;
        if (r.width * r.height > vw * vh * 0.25 || r.width >= vw * 0.9 || el.tagName === "CANVAS") return;
        r.hit = label || el.matches(INTERACTIVE) || !!el.closest(INTERACTIVE); out.push(r);
      });
      // a bar that just holds other buttons isn't a blocker itself - only the buttons inside it are
      const inside = (a, b) => a !== b && b.left >= a.left - 1 && b.right <= a.right + 1 && b.top >= a.top - 1 && b.bottom <= a.bottom + 1;
      return out.filter(a => a.hit || !out.some(b => inside(a, b)));
    }
    let obs = [], hiddenNow = false;
    function free(x, y, w, h) {
      if (x < 4 || y < 4 || x + w > innerWidth - 4 || y + h > innerHeight - 4) return false;
      const m = 4;
      return !obs.some(r => x - m < r.right && x + w + m > r.left && y - m < r.bottom && y + h + m > r.top);
    }
    function place() {
      if (d.open) return;
      const phone = matchMedia("(max-width: 600px) and (orientation: portrait), (max-height: 500px) and (orientation: landscape)").matches;
      d.classList.toggle("lr-small", phone);
      sum.style.visibility = "hidden"; sum.style.left = "-999px";
      const w = sum.offsetWidth, h = sum.offsetHeight;
      obs = obstacles();
      const back = document.querySelector("a.back, a.back-link, a[href='../../']");
      let spot = null;
      const br = back && back.offsetParent !== null ? back.getBoundingClientRect() : null;
      if (br && br.width) {
        const y0 = br.top + (br.height - h) / 2;
        for (let x = br.right + 8; !spot && x < innerWidth * 0.75; x += 6) if (free(x, y0, w, h)) spot = [x, y0];
        for (let y = br.bottom + 8; !spot && y < innerHeight * 0.5; y += 6) if (free(br.left, y, w, h)) spot = [br.left, y];
      }
      // nothing free beside or under the "All games" button: search along all four edges of the screen, nearest to it first
      if (!spot) {
        const ox = br ? br.left : 10, oy = br ? br.top : 10, band = 90, step = 6, found = [];
        const boards = [...document.querySelectorAll("canvas, svg.board, .board, #board, .maze, .stage canvas")].filter(el => !d.contains(el)).map(el => el.getBoundingClientRect()).filter(r => r.width > 50 && r.height > 50);
        const ys = [], xs = [];
        for (let y = 4; y <= innerHeight - h - 4; y += step) ys.push(y);
        for (let x = 4; x <= innerWidth - w - 4; x += step) xs.push(x);
        ys.push(Math.floor(innerHeight - h - 4)); xs.push(Math.floor(innerWidth - w - 4));   // tight up against the edges too
        for (const y of ys) for (const x of xs) {
          const edge = y < band || y > innerHeight - h - band || x < band * 0.7 || x > innerWidth - w - band * 0.7;
          if (!edge || !free(x, y, w, h)) continue;
          const onBoard = boards.some(r => x < r.right && x + w > r.left && y < r.bottom && y + h > r.top);   // over the game itself
          found.push([x, y, Math.hypot(x - ox, y - oy) + (onBoard ? 5000 : 0)]);
        }
        found.sort((a, b) => a[2] - b[2]);
        if (found.length) spot = found[0];
      }
      if (!spot) { sum.style.left = "-999px"; hiddenNow = true; return; }   // no room right now (e.g. a big menu on a tiny screen) - try again in a second
      hiddenNow = false;
      sum.style.left = Math.round(spot[0]) + "px"; sum.style.top = Math.round(spot[1]) + "px"; sum.style.visibility = "";
    }
    let t = 0; const later = () => { clearTimeout(t); t = setTimeout(place, 250); };
    addEventListener("resize", later); addEventListener("orientationchange", later);
    if (window.ResizeObserver) new ResizeObserver(later).observe(document.documentElement);
    setTimeout(place, 60); setTimeout(place, 700);
    // the game's buttons and score pills come and go (start screen, playing, end screen): every second, move if something now sits under the button
    setInterval(() => {
      if (d.open || document.hidden) return;
      if (hiddenNow) { place(); return; }
      const r = sum.getBoundingClientRect(); obs = obstacles();
      if (!free(r.left, r.top, r.width, r.height)) place();
    }, 1000);
    window.LR = window.LR || {}; window.LR.placeAbout = place;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
