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
