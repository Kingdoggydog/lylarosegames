/* =====================================================================
   Draws the game list, filter buttons and Google data on the home page
   and the category pages. Nothing in here needs changing - edit
   games-data.js instead.
   ===================================================================== */
(function () {
  const ROOT = new URL('.', document.currentScript.src).href;   // the site's main address
  const SITE = 'Lyla Rose Games';
  const ALL = { id: 'all', title: 'All games', emoji: '⭐', colour: '#FFF1C9', about: 'Every game on the site.' };
  const catById = Object.fromEntries(categories.map(c => [c.id, c]));
  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));
  games.forEach(g => (g.categories || []).forEach(id => { if (!catById[id]) console.warn('Game "' + g.title + '" uses unknown category "' + id + '"'); }));
  // Newest games first: the list in games-data.js is oldest-to-newest, so show it backwards
  const newestFirst = games.slice().reverse();
  const inCat = (g, id) => id === 'all' || (g.categories || []).includes(id);
  const used = categories.filter(c => games.some(g => inCat(g, c.id)));
  const pageCat = document.body.dataset.category || 'all';   // which page we're on
  const headingTag = pageCat === 'all' ? 'h2' : 'h1';
  const canIntercept = location.protocol !== 'file:' && !!history.pushState;

  const catUrl = c => c.id === 'all' ? ROOT : ROOT + c.slug + '/';
  const gameUrl = g => ROOT + 'games/' + g.folder + '/';
  const thumbUrl = g => g.thumb ? ROOT + 'games/' + g.folder + '/' + g.thumb : ROOT + 'brand/og-image.jpg';

  const filtersEl = document.getElementById('filters');
  const gridEl = document.getElementById('grid');
  const headEl = document.getElementById('heading');
  const crumbsEl = document.getElementById('crumbs');

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function gameCard(g) {
    const a = el('a', 'game');
    a.href = gameUrl(g);
    const art = el('div', 'art'); art.style.background = g.colour; art.setAttribute('aria-hidden', 'true');
    if (g.thumb) {
      const img = el('img'); img.src = thumbUrl(g); img.alt = ''; img.loading = 'lazy';
      art.append(img);
    } else {
      art.textContent = g.emoji;
    }
    const body = el('div', 'body');
    body.append(el('h3', null, g.title), el('p', null, g.blurb));
    const meta = el('div', 'meta');
    (g.categories || []).forEach(id => { const c = catById[id]; if (!c) return; const chip = el('span', 'chip', c.emoji + ' ' + c.title); chip.style.background = c.colour; meta.append(chip); });
    body.append(meta);
    if (g.controls) body.append(el('p', 'controls', '🎮 ' + g.controls));
    body.append(el('span', 'play', 'Play ▶'));
    a.append(art, body);
    // The share button sits on top of the card (a button can't live inside a link)
    const wrap = el('div', 'card');
    wrap.append(a, shareButton(g));
    return wrap;
  }

  // ----- Share a game: the phone's own share menu (Messages, WhatsApp, Facebook...),
  //       or a small pop-up on computers that don't have one
  const SHARE_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
  function shareButton(g) {
    const b = el('button', 'share');
    b.type = 'button';
    b.innerHTML = SHARE_ICON + '<span>Share</span>';
    b.setAttribute('aria-label', 'Share ' + g.title);
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); share(g, b); });
    return b;
  }
  function track(method, g) { if (window.gtag) gtag('event', 'share', { method, content_type: 'game', item_id: g.folder }); }
  async function share(g, btn) {
    const url = gameUrl(g);
    const text = g.title + ' - a free game for kids on Lyla Rose Games. ' + g.blurb;
    if (navigator.share) {
      try { await navigator.share({ title: g.title, text, url }); track('native', g); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }   // they closed the menu
    }
    openShareMenu(g, btn, url, text);
  }
  let openMenu = null;
  function closeShareMenu() { if (openMenu) { openMenu.remove(); openMenu = null; } }
  document.addEventListener('click', e => { if (openMenu && !openMenu.contains(e.target)) closeShareMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeShareMenu(); });
  function openShareMenu(g, btn, url, text) {
    closeShareMenu();
    const m = el('div', 'share-menu');
    m.setAttribute('role', 'menu');
    const enc = encodeURIComponent;
    const opts = [
      ['📋', 'Copy link', null],
      ['💬', 'WhatsApp', 'https://wa.me/?text=' + enc(text + ' ' + url)],
      ['📘', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url)],
      ['✉️', 'Email', 'mailto:?subject=' + enc(g.title + ' - Lyla Rose Games') + '&body=' + enc(text + '\n\n' + url)],
    ];
    opts.forEach(([icon, label, href]) => {
      const o = el(href ? 'a' : 'button', null, icon + ' ' + label);
      o.setAttribute('role', 'menuitem');
      if (href) { o.href = href; if (!href.startsWith('mailto:')) { o.target = '_blank'; o.rel = 'noopener'; } o.addEventListener('click', () => { track(label.toLowerCase(), g); closeShareMenu(); }); }
      else {
        o.type = 'button';
        o.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(url); o.textContent = '✅ Link copied!'; }
          catch (e) { window.prompt('Copy this link:', url); }
          track('copy', g);
          setTimeout(closeShareMenu, 1200);
        });
      }
      m.append(o);
    });
    btn.parentElement.append(m);
    openMenu = m;
    m.querySelector('a, button').focus();
  }

  function soonCard() {
    const d = el('div', 'game soon');
    const art = el('div', 'art', '✨'); art.setAttribute('aria-hidden', 'true');
    const body = el('div', 'body');
    body.append(el('h3', null, 'Coming soon'), el('p', null, 'A new game is on its way.'));
    d.append(art, body);
    return d;
  }

  // ----- Filter buttons (real links, so Google can follow them to each category page)
  const buttons = {};
  filtersEl.replaceChildren();
  [ALL, ...used].forEach(c => {
    const a = el('a');
    const n = games.filter(g => inCat(g, c.id)).length;
    a.append(el('span', null, c.emoji), el('span', null, c.title), el('span', 'count', String(n)));
    a.addEventListener('click', e => {
      // Tap the selected category again to clear it
      const target = (c.id !== 'all' && current === c.id) ? 'all' : c.id;
      go(target, e);
    });
    buttons[c.id] = a;
    filtersEl.append(a);
  });
  const clearBtn = el('a', 'clear', '✕ Clear');
  clearBtn.href = ROOT;
  clearBtn.setAttribute('aria-label', 'Clear filter and show all games');
  clearBtn.addEventListener('click', e => go('all', e));
  filtersEl.append(clearBtn);

  let current = pageCat;

  function go(id, e) {
    if (window.gtag && id !== 'all') gtag('event', 'select_category', { category: id });
    if (!canIntercept) return;            // testing from a file: just follow the link
    e.preventDefault();
    show(id);
    const c = id === 'all' ? ALL : catById[id];
    history.pushState({ id }, '', catUrl(c));
  }

  function show(id) {
    const c = id === 'all' ? ALL : (catById[id] || ALL);
    current = c.id;
    clearBtn.hidden = c.id === 'all';
    // On phones the buttons are one sideways row - slide the chosen one into view
    requestAnimationFrame(() => {
      const on = buttons[c.id];
      if (on && filtersEl.scrollWidth > filtersEl.clientWidth) {
        const left = on.offsetLeft - (filtersEl.clientWidth - on.offsetWidth) / 2;
        filtersEl.scrollTo({ left: c.id === 'all' ? 0 : Math.max(0, left), behavior: 'smooth' });
      }
    });
    Object.entries(buttons).forEach(([k, a]) => {
      const on = k === c.id;
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      // A selected category links back to all games, so tapping it again clears it
      a.href = on && k !== 'all' ? ROOT : catUrl(k === 'all' ? ALL : catById[k]);
    });

    crumbsEl.replaceChildren();
    crumbsEl.hidden = c.id === 'all';
    if (c.id !== 'all') { const back = el('a', null, '← All games'); back.href = ROOT; back.addEventListener('click', e => go('all', e)); crumbsEl.append(back); }

    headEl.replaceChildren();
    const badge = el('div', 'badge', c.emoji); badge.style.background = c.colour; badge.setAttribute('aria-hidden', 'true');
    const txt = el('div'); txt.append(el(headingTag, null, c.heading || c.title), el('p', null, c.about));
    headEl.append(badge, txt);

    gridEl.replaceChildren();
    newestFirst.filter(g => inCat(g, c.id)).forEach(g => gridEl.append(gameCard(g)));
    if (showComingSoon) gridEl.append(soonCard());

    if (current !== pageCat || document.title === '') document.title = c.id === 'all' ? SITE + ' - Free Games for Kids' : (c.heading || c.title) + ' for kids - ' + SITE;
  }

  window.addEventListener('popstate', () => {
    const slug = location.href.slice(ROOT.length).split('/')[0];
    show(catBySlug[slug] ? catBySlug[slug].id : 'all');
  });

  show(pageCat);

  // ----- Structured data for Google (describes the page and its games)
  const pc = pageCat === 'all' ? ALL : catById[pageCat];
  const list = newestFirst.filter(g => inCat(g, pageCat));
  const itemList = {
    '@type': 'ItemList',
    itemListElement: list.map((g, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: {
        '@type': 'VideoGame', name: g.title, url: gameUrl(g), description: g.blurb, image: thumbUrl(g),
        genre: (g.categories || []).map(id => catById[id] && catById[id].title).filter(Boolean),
        gamePlatform: 'Web browser', applicationCategory: 'Game', operatingSystem: 'Any',
        isAccessibleForFree: true, inLanguage: 'en-AU',
        audience: { '@type': 'PeopleAudience', audienceType: 'Children' },
        publisher: { '@type': 'Organization', name: SITE, url: ROOT }
      }
    }))
  };
  const graph = pageCat === 'all'
    ? [{ '@type': 'WebSite', name: SITE, url: ROOT, inLanguage: 'en-AU' }, { '@type': 'CollectionPage', name: SITE, url: ROOT, mainEntity: itemList }]
    : [{ '@type': 'CollectionPage', name: (pc.heading || pc.title) + ' for kids', url: catUrl(pc), isPartOf: { '@type': 'WebSite', name: SITE, url: ROOT }, mainEntity: itemList },
       { '@type': 'BreadcrumbList', itemListElement: [
         { '@type': 'ListItem', position: 1, name: SITE, item: ROOT },
         { '@type': 'ListItem', position: 2, name: pc.heading || pc.title, item: catUrl(pc) } ] }];
  const ld = el('script'); ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.append(ld);

  // ----- Footer: add-to-home-screen link, privacy line + For parents link, grown-ups contact, maker link
  // The email address is put together here (not written in the page) so spam robots that read pages can't grab it.
  const footer = document.querySelector('footer');
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = navigator.standalone === true || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;
  let installEvent = null;   // Android/Chrome can show its own "Install" box
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvent = e; if (addBtn) addBtn.hidden = false; });

  let addBtn = null;
  if (footer) {
    footer.replaceChildren();
    const line1 = el('p', 'foot-line', 'Made with love. More games on the way.');
    footer.append(line1);
    if (isTouch && !isStandalone) {
      addBtn = el('button', 'foot-add', '📲 Add to your home screen');
      addBtn.type = 'button';
      addBtn.hidden = !isIOS && !installEvent;
      addBtn.addEventListener('click', () => openAddSheet(true));
      footer.append(addBtn);
    }
    const trust = el('p', 'foot-line small');
    const parents = el('a', null, 'For parents'); parents.href = ROOT + 'for-parents/';
    trust.append('Free. No ads, no sign-ups, no personal details collected. ', parents);
    footer.append(trust);
    const mail = ['hello', 'lylarosegames.com'].join('@');
    const line2 = el('p', 'foot-line small');
    const m = el('a', null, mail); m.href = 'mailto:' + mail + '?subject=' + encodeURIComponent('Lyla Rose Games');
    const maker = el('a', null, 'u/coolcato'); maker.href = 'https://kingdoggydog.github.io/'; maker.rel = 'noopener';
    line2.append('Grown-ups: ideas or problems? Say hi at ', m, ' · Made by ', maker);
    footer.append(line2);
  }

  // ----- One-off "add to home screen" pop-up (iPhone/iPad only - Android uses its own install box)
  const SEEN = 'lr-add-home-seen';
  let seen = false; try { seen = localStorage.getItem(SEEN) === '1'; } catch (e) {}
  if (isIOS && !isStandalone && !seen) setTimeout(() => openAddSheet(false), 4000);

  function openAddSheet(fromButton) {
    if (!fromButton) { try { localStorage.setItem(SEEN, '1'); } catch (e) {} }
    if (!isIOS && installEvent) { installEvent.prompt(); installEvent.userChoice.finally(() => { installEvent = null; if (addBtn) addBtn.hidden = true; }); if (window.gtag) gtag('event', 'add_to_home', { method: 'install_prompt' }); return; }
    if (document.querySelector('.add-sheet')) return;
    const sheet = el('div', 'add-sheet');
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Add to your home screen');
    const shareIcon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    const where = /iPad/.test(ua) || navigator.platform === 'MacIntel' ? 'at the top of the screen' : 'at the bottom of the screen';
    sheet.innerHTML =
      '<button type="button" class="add-x" aria-label="Close">✕</button>' +
      '<img src="' + ROOT + 'brand/icon-180.png" alt="" width="56" height="56">' +
      '<b>Play like an app!</b>' +
      '<p>Put Lyla Rose Games on your home screen. It opens full screen, with no address bar.</p>' +
      '<ol><li>Tap the <strong>Share</strong> button ' + shareIcon + ' ' + where + ' <span>(on newer iPhones, tap <strong>•••</strong> first)</span></li>' +
      '<li>Tap <strong>Add to Home Screen</strong> <span>(you may need to scroll down)</span></li>' +
      '<li>Tap <strong>Add</strong></li></ol>' +
      '<button type="button" class="add-ok">Got it</button>';
    const close = () => { sheet.classList.remove('show'); setTimeout(() => sheet.remove(), 250); };
    sheet.querySelector('.add-x').addEventListener('click', close);
    sheet.querySelector('.add-ok').addEventListener('click', close);
    document.body.append(sheet);
    requestAnimationFrame(() => sheet.classList.add('show'));
    if (window.gtag) gtag('event', 'add_to_home', { method: fromButton ? 'footer_button' : 'auto_popup' });
  }
})();
