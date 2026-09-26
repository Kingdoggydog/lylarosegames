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
    return a;
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
    games.filter(g => inCat(g, c.id)).forEach(g => gridEl.append(gameCard(g)));
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
  const list = games.filter(g => inCat(g, pageCat));
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
})();
