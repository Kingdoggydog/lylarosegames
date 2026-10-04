/* =====================================================================
   Draws the game list, filter buttons and Google data on the home page
   and the category pages. Nothing in here needs changing - edit
   games-data.js instead.
   ===================================================================== */
(function () {
  const ROOT = new URL('.', document.currentScript.src).href;   // the site's main address
  const SITE = 'Lyla Rose Games';
  const ALL = { id: 'all', title: 'All games', emoji: '🎮', colour: '#FFF1C9', about: 'Every game on the site.' };
  // "My favourites" - games starred on this device. Saved only in this browser, never sent anywhere.
  const FAV = { id: 'favourites', title: 'Favourites', heading: 'My favourites', emoji: '⭐', colour: '#FFE7A0', about: 'Games you starred. They stay on this device.' };
  const FAV_KEY = 'lr-favourites';
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]').filter(f => games.some(g => g.folder === f)); } catch (e) { favs = []; }
  const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {} };
  const isFav = g => favs.includes(g.folder);
  const catById = Object.fromEntries(categories.map(c => [c.id, c]));
  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));
  games.forEach(g => (g.categories || []).forEach(id => { if (!catById[id]) console.warn('Game "' + g.title + '" uses unknown category "' + id + '"'); }));
  // Newest games first: the list in games-data.js is oldest-to-newest, so show it backwards
  const newestFirst = games.slice().reverse();
  const inCat = (g, id) => id === 'all' || (id === 'favourites' ? favs.includes(g.folder) : (g.categories || []).includes(id));
  // ----- Age groups (from games-data.js). "all" = every age. Not saved anywhere - it resets when the page reloads.
  const AGES = typeof ageGroups !== 'undefined' ? ageGroups : [];
  const ageById = Object.fromEntries(AGES.map(a => [a.id, a]));
  games.forEach(g => { if (AGES.length && !ageById[g.ages]) console.warn('Game "' + g.title + '" has no age group (ages: "' + g.ages + '")'); });
  let age = 'all';
  const inAge = g => age === 'all' || g.ages === age;
  const ageYears = g => parseInt(g.ages, 10);   // "3+" -> 3
  const used = categories.filter(c => games.some(g => inCat(g, c.id)));
  const pageCat = document.body.dataset.category || 'all';   // which page we're on
  const headingTag = pageCat === 'all' ? 'h2' : 'h1';
  const canIntercept = location.protocol !== 'file:' && !!history.pushState;

  const catUrl = c => c.id === 'all' ? ROOT : c.id === 'favourites' ? ROOT + '#favourites' : ROOT + c.slug + '/';
  const gameUrl = g => ROOT + 'games/' + g.folder + '/';
  const thumbUrl = g => g.thumb ? ROOT + 'games/' + g.folder + '/' + g.thumb : ROOT + 'brand/og-image.jpg';

  // ----- Logo next to the site name (category pages get it added here; the home page has it written in)
  (function () {
    const brand = document.querySelector('header .brand');
    if (!brand || document.querySelector('header .logo')) return;
    const row = document.createElement('div'); row.className = 'brandrow';
    const logo = document.createElement('img'); logo.className = 'logo'; logo.src = ROOT + 'brand/icon.svg'; logo.alt = ''; logo.width = 80; logo.height = 80;
    brand.replaceWith(row); row.append(logo, brand);
  })();

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
      // "thumbAnim" = an optional gently-moving card picture (an .svg in the game's folder). Google still gets thumb.jpg.
      const img = el('img'); img.src = g.thumbAnim ? ROOT + 'games/' + g.folder + '/' + g.thumbAnim : thumbUrl(g); img.alt = ''; img.loading = 'lazy';
      art.append(img);
    } else {
      art.textContent = g.emoji;
    }
    if (ageById[g.ages]) { const ab = el('span', 'age-badge', 'Age ' + g.ages); ab.style.background = ageById[g.ages].colour; art.append(ab); }
    const body = el('div', 'body');
    body.append(el('h3', null, g.title), el('p', null, g.blurb));
    const meta = el('div', 'meta');
    (g.categories || []).forEach(id => { const c = catById[id]; if (!c) return; const chip = el('span', 'chip', c.emoji + ' ' + c.title); chip.style.background = c.colour; meta.append(chip); });
    body.append(meta);
    if (g.controls) body.append(el('p', 'controls', '🎮 ' + g.controls));
    body.append(el('span', 'play', 'Play ▶'));
    a.append(art, body);
    if (ageById[g.ages]) a.setAttribute('aria-label', g.title + ', for ages ' + g.ages);
    // The share button sits on top of the card (a button can't live inside a link)
    const wrap = el('div', 'card');
    wrap.append(a, favButton(g), shareButton(g));
    return wrap;
  }

  // ----- Favourite star (top right of each card). Tap to keep a game in "My favourites".
  const STAR = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9z" stroke-linejoin="round" stroke-width="2"/></svg>';
  function favButton(g) {
    const b = el('button', 'fav');
    b.type = 'button';
    b.innerHTML = STAR;
    const paint = () => {
      const on = isFav(g);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', on ? 'Remove ' + g.title + ' from favourites' : 'Add ' + g.title + ' to favourites');
      b.title = on ? 'In your favourites' : 'Add to favourites';
    };
    paint();
    b.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      if (isFav(g)) favs = favs.filter(f => f !== g.folder); else favs.push(g.folder);
      saveFavs(); paint();
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      if (window.gtag) gtag('event', isFav(g) ? 'favourite_add' : 'favourite_remove', { item_id: g.folder });
      updateFavButton();
      if (current === 'favourites') show('favourites');   // take it off the favourites list straight away
    });
    return b;
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

  // ----- "New game!" banner at the top of the home page: always the newest game in games-data.js
  let heroEl = document.getElementById('hero');
  function fillHero() {
    const g = games[games.length - 1];
    if (!heroEl || !g) return;
    heroEl.replaceChildren();
    const a = el('a', 'hero-link'); a.href = gameUrl(g);
    const pic = el('div', 'hero-pic'); pic.style.background = g.colour;
    const img = el('img'); img.src = ROOT + 'games/' + g.folder + '/share.jpg'; img.alt = ''; img.width = 1200; img.height = 630;
    pic.append(img, el('span', 'hero-badge', '✨ New game!'));
    const txt = el('div', 'hero-text');
    txt.append(el('p', 'hero-kicker', 'Just added'), el('h2', null, g.title), el('p', 'hero-blurb', g.blurb), el('span', 'play hero-play', 'Play now ▶'));
    a.append(pic, txt);
    a.addEventListener('click', () => { if (window.gtag) gtag('event', 'select_content', { content_type: 'hero', item_id: g.folder }); });
    heroEl.append(a);
  }
  fillHero();

  // ----- "Keep playing" row: the last games opened on this device (site.js remembers them)
  const recentEl = document.getElementById('recent');
  function fillRecent() {
    if (!recentEl) return false;
    let list = [];
    try { list = JSON.parse(localStorage.getItem('lr-recent') || '[]'); } catch (e) {}
    const recent = list.map(f => games.find(g => g.folder === f)).filter(Boolean).slice(0, 4);
    recentEl.replaceChildren();
    if (!recent.length) return false;
    recentEl.append(el('h2', 'recent-title', '🕹️ Keep playing'));
    const row = el('div', 'recent-row');
    recent.forEach(g => {
      const a = el('a', 'recent-tile'); a.href = gameUrl(g);
      const pic = el('div', 'recent-pic'); pic.style.background = g.colour;
      const img = el('img'); img.src = thumbUrl(g); img.alt = ''; img.loading = 'lazy';
      pic.append(img);
      a.append(pic, el('span', 'recent-name', g.title));
      a.addEventListener('click', () => { if (window.gtag) gtag('event', 'select_content', { content_type: 'keep_playing', item_id: g.folder }); });
      row.append(a);
    });
    recentEl.append(row);
    return true;
  }
  const hasRecent = fillRecent();

  function emptyFavCard() {
    const d = el('div', 'game soon');
    const art = el('div', 'art', '⭐'); art.setAttribute('aria-hidden', 'true');
    const body = el('div', 'body');
    body.append(el('h3', null, 'No favourites yet'), el('p', null, 'Tap the star on any game to keep it here.'));
    d.append(art, body);
    return d;
  }

  function emptyAgeCard(c) {
    const d = el('div', 'game soon');
    const art = el('div', 'art', '🔎'); art.setAttribute('aria-hidden', 'true');
    const body = el('div', 'body');
    const btn = el('button', 'play age-reset', 'Show all ages');
    btn.type = 'button';
    btn.addEventListener('click', () => setAge('all'));
    body.append(el('h3', null, 'No ' + age + ' games here yet'), el('p', null, 'Try another age, or see every ' + (c.id === 'all' ? 'game' : (c.heading || c.title).toLowerCase().replace(/ games$/, '') + ' game') + '.'), btn);
    d.append(art, body);
    return d;
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
  [ALL, FAV, ...used].forEach(c => {
    const a = el('a');
    const n = games.filter(g => inCat(g, c.id)).length;
    a.append(el('span', null, c.emoji), el('span', null, c.title), el('span', 'count', String(n)));
    a.addEventListener('click', e => {
      // Tap the selected category again to clear it
      const target = (c.id !== 'all' && current === c.id) ? 'all' : c.id;
      go(target, e);
    });
    buttons[c.id] = a;
    if (c.id === 'favourites') a.classList.add('favs');
    filtersEl.append(a);
  });
  // The favourites button only shows once something has been starred
  function updateFavButton() {
    const a = buttons.favourites;
    a.querySelector('.count').textContent = String(favs.length);
    a.hidden = favs.length === 0 && current !== 'favourites';
  }
  const clearBtn = el('a', 'clear', '✕ Clear');
  clearBtn.href = ROOT;
  clearBtn.setAttribute('aria-label', 'Clear filter and show all games');
  clearBtn.addEventListener('click', e => go('all', e));
  filtersEl.append(clearBtn);

  let current = pageCat;

  // ----- Age buttons: a small row under the category buttons ("All ages / 2+ / 3+ / 4+")
  const ageBtns = {};
  if (AGES.length && filtersEl) {
    const row = el('div', 'ages');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Show games by age');
    row.append(el('span', 'ages-label', 'Age'));
    [{ id: 'all', colour: '#FFFFFF' }, ...AGES].forEach(a => {
      const b = el('button', 'age-btn', a.id === 'all' ? 'All ages' : a.id);
      b.type = 'button';
      b.style.setProperty('--age', a.colour);
      if (a.id !== 'all') b.setAttribute('aria-label', 'Ages ' + a.id);
      b.addEventListener('click', () => setAge(age === a.id && a.id !== 'all' ? 'all' : a.id));   // tap again to clear
      ageBtns[a.id] = b;
      row.append(b);
    });
    filtersEl.after(row);
  }
  function setAge(id) {
    age = id;
    if (window.gtag && id !== 'all') gtag('event', 'select_age', { age: id });
    show(current);
  }

  function go(id, e) {
    if (window.gtag && id !== 'all') gtag('event', 'select_category', { category: id });
    if (!canIntercept) return;            // testing from a file: just follow the link
    e.preventDefault();
    show(id);
    const c = id === 'all' ? ALL : id === 'favourites' ? FAV : catById[id];
    history.pushState({ id }, '', catUrl(c));
  }

  function show(id) {
    const c = id === 'all' ? ALL : id === 'favourites' ? FAV : (catById[id] || ALL);
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
      a.href = on && k !== 'all' ? ROOT : catUrl(k === 'all' ? ALL : k === 'favourites' ? FAV : catById[k]);
    });
    updateFavButton();
    // Category counts follow the chosen age
    Object.entries(buttons).forEach(([k, a]) => { if (k !== 'favourites') a.querySelector('.count').textContent = String(games.filter(g => inCat(g, k) && inAge(g)).length); });
    Object.entries(ageBtns).forEach(([k, b]) => b.setAttribute('aria-pressed', k === age ? 'true' : 'false'));

    crumbsEl.replaceChildren();
    crumbsEl.hidden = c.id === 'all';
    if (c.id !== 'all') { const back = el('a', null, '← All games'); back.href = ROOT; back.addEventListener('click', e => go('all', e)); crumbsEl.append(back); }

    headEl.replaceChildren();
    const badge = el('div', 'badge', c.emoji); badge.style.background = c.colour; badge.setAttribute('aria-hidden', 'true');
    const about = age !== 'all' && ageById[age] ? 'Ages ' + age + ': ' + ageById[age].about : c.about;
    const txt = el('div'); txt.append(el(headingTag, null, c.heading || c.title), el('p', null, about));
    headEl.append(badge, txt);

    if (heroEl) heroEl.hidden = c.id !== 'all' || age !== 'all';
    if (recentEl) recentEl.hidden = c.id !== 'all' || age !== 'all' || !hasRecent;
    gridEl.replaceChildren();
    const shown = newestFirst.filter(g => inCat(g, c.id) && inAge(g));
    shown.forEach(g => gridEl.append(gameCard(g)));
    if (c.id === 'favourites' && !favs.length) gridEl.append(emptyFavCard());
    else if (!shown.length && age !== 'all') gridEl.append(emptyAgeCard(c));
    else if (c.id !== 'favourites' && showComingSoon && age === 'all') gridEl.append(soonCard());

    if (current !== pageCat || document.title === '') document.title = c.id === 'all' ? SITE + ' - Free Games for Kids' : (c.heading || c.title) + ' for kids - ' + SITE;
  }

  window.addEventListener('popstate', () => {
    if (location.hash === '#favourites') { show('favourites'); return; }
    const slug = location.href.slice(ROOT.length).split(/[/#]/)[0];
    show(catBySlug[slug] ? catBySlug[slug].id : 'all');
  });

  show(pageCat === 'all' && location.hash === '#favourites' ? 'favourites' : pageCat);

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
        audience: Object.assign({ '@type': 'PeopleAudience', audienceType: 'Children' }, ageYears(g) ? { suggestedMinAge: ageYears(g) } : {}),
        ...(ageYears(g) ? { typicalAgeRange: ageYears(g) + '-' } : {}),
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
