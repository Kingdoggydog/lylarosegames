"""
Writes the game cards and Google's data straight into the home page, the category pages
and the age pages, so search engines see every game link without having to run any code.

Run it after ANY change to games-data.js (new game, new category, changed blurb or picture):

    python3 tools/prerender.py

It only changes two marked areas in each page:
  - the cards inside <div class="grid" id="grid"> ... </div>
  - the Google data between <!-- google-data --> and <!-- /google-data --> in the <head>
Visitors see no difference: home.js redraws the cards as soon as the page loads (with the
moving pictures, stars and share buttons). Everything else in the pages is hand-written.
Needs Node (to read games-data.js).
"""
import html, json, re, subprocess, sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
ROOT = 'https://lylarosegames.com/'
NAME = 'Lyla Rose Games'

js = (SITE / 'games-data.js').read_text(encoding='utf-8')
data = json.loads(subprocess.check_output(
    ['node', '-e', js + ';process.stdout.write(JSON.stringify({categories, ageGroups, games}))'], cwd=SITE))
cats, ages, games = data['categories'], data['ageGroups'], data['games']
cat_by_id = {c['id']: c for c in cats}
age_by_id = {a['id']: a for a in ages}
newest_first = list(reversed(games))
esc = lambda s: html.escape(str(s), quote=True)


def on_age_page(g, p):
    return g['ages'] in p['ages'] or (g['ages'] in p.get('alsoAges', []) and any(c in p.get('alsoIn', []) for c in g.get('categories', [])))


def in_cat(g, cid):
    if cid == 'all':
        return True
    c = cat_by_id.get(cid)
    if c and c.get('agePage'):
        return on_age_page(g, c['agePage'])
    return cid in g.get('categories', [])


def card(g, r):
    url = f'{r}games/{g["folder"]}/'
    if g.get('thumb'):
        art_inner = f'<img src="{url}{esc(g["thumb"])}" alt="" loading="lazy" width="400" height="300">'
    else:
        art_inner = esc(g.get('emoji', ''))
    a = age_by_id.get(g.get('ages'))
    badge = f'<span class="age-badge" style="background:{a["colour"]}">Age {esc(g["ages"])}</span>' if a else ''
    chips = ''.join(f'<span class="chip" style="background:{cat_by_id[c]["colour"]}">{cat_by_id[c]["emoji"]} {esc(cat_by_id[c]["title"])}</span>'
                    for c in g.get('categories', []) if c in cat_by_id)
    controls = f'<p class="controls">🎮 {esc(g["controls"])}</p>' if g.get('controls') else ''
    label = f' aria-label="{esc(g["title"])}, for ages {esc(g["ages"])}"' if a else ''
    return (f'<div class="card"><a class="game" href="{url}"{label}>'
            f'<div class="art" style="background:{g["colour"]}" aria-hidden="true">{art_inner}{badge}</div>'
            f'<div class="body"><h3>{esc(g["title"])}</h3><p>{esc(g["blurb"])}</p><div class="meta">{chips}</div>{controls}'
            f'<span class="play">Play ▶</span></div></a></div>')


def faq_items(page_html):
    """Reads the hand-written 'Questions parents ask' section so Google's copy always matches the page."""
    m = re.search(r'<section class="about-text faq".*?</section>', page_html, re.S)
    if not m:
        return []
    pairs = re.findall(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>', m.group(0), re.S)
    clean = lambda s: html.unescape(re.sub(r'<[^>]+>', '', s)).strip()
    return [{'@type': 'Question', 'name': clean(q), 'acceptedAnswer': {'@type': 'Answer', 'text': clean(a)}} for q, a in pairs]


def google_data(cid, page_html):
    page = None if cid == 'all' else cat_by_id[cid]
    url = ROOT if cid == 'all' else ROOT + page['slug'] + '/'
    items = []
    for i, g in enumerate([g for g in newest_first if in_cat(g, cid)], 1):
        yrs = int(g['ages'].rstrip('+')) if g.get('ages', '').rstrip('+').isdigit() else None
        aud = {'@type': 'PeopleAudience', 'audienceType': 'Children'}
        if yrs: aud['suggestedMinAge'] = yrs
        item = {'@type': 'VideoGame', 'name': g['title'], 'url': f'{ROOT}games/{g["folder"]}/', 'description': g['blurb'],
                'image': f'{ROOT}games/{g["folder"]}/{g["thumb"]}' if g.get('thumb') else ROOT + 'brand/og-image.jpg',
                'genre': [cat_by_id[c]['title'] for c in g.get('categories', []) if c in cat_by_id],
                'gamePlatform': 'Web browser', 'applicationCategory': 'Game', 'operatingSystem': 'Any',
                'isAccessibleForFree': True, 'inLanguage': 'en-AU', 'audience': aud,
                'publisher': {'@type': 'Organization', 'name': NAME, 'url': ROOT}}
        if yrs: item['typicalAgeRange'] = f'{yrs}-'
        items.append({'@type': 'ListItem', 'position': i, 'item': item})
    item_list = {'@type': 'ItemList', 'itemListElement': items}
    if cid == 'all':
        graph = [{'@type': 'WebSite', 'name': NAME, 'url': ROOT, 'inLanguage': 'en-AU', 'publisher': {'@id': ROOT + '#org'}},
                 {'@type': 'Organization', '@id': ROOT + '#org', 'name': NAME, 'url': ROOT, 'logo': ROOT + 'brand/icon-512.png'},
                 {'@type': 'CollectionPage', 'name': NAME, 'url': ROOT, 'mainEntity': item_list}]
    else:
        heading = page.get('heading') or page['title']
        graph = [{'@type': 'CollectionPage', 'name': heading + ('' if cid.startswith('age') else ' for kids'), 'url': url,
                  'isPartOf': {'@type': 'WebSite', 'name': NAME, 'url': ROOT}, 'mainEntity': item_list},
                 {'@type': 'BreadcrumbList', 'itemListElement': [
                     {'@type': 'ListItem', 'position': 1, 'name': NAME, 'item': ROOT},
                     {'@type': 'ListItem', 'position': 2, 'name': heading, 'item': url}]}]
    faq = faq_items(page_html)
    if faq:
        graph.append({'@type': 'FAQPage', 'url': url, 'mainEntity': faq})
    return json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':'))


def update(path, cid, r):
    s = path.read_text(encoding='utf-8')
    # 1. cards
    cards = ''.join(card(g, r) for g in newest_first if in_cat(g, cid))
    block = f'<div class="grid" id="grid"><!-- cards: written by tools/prerender.py from games-data.js - do not edit by hand -->{cards}<!-- /cards --></div>'
    s, n = re.subn(r'<div class="grid" id="grid">(?:<!-- cards:.*?<!-- /cards -->)?</div>', lambda m: block, s, flags=re.S)
    if n != 1:
        sys.exit(f'{path}: could not find the card grid')
    # 2. Google data
    ld = ('<!-- google-data: written by tools/prerender.py - do not edit by hand -->\n'
          f'<script type="application/ld+json">{google_data(cid, s)}</script>\n<!-- /google-data -->\n')
    s = re.sub(r'<!-- google-data:.*?<!-- /google-data -->\n', '', s, flags=re.S)
    m = re.search(r'<script src="(\.\./)?site\.js"></script>', s)
    if not m:
        sys.exit(f'{path}: could not find site.js in the head')
    s = s[:m.start()] + ld + s[m.start():]
    path.write_text(s, encoding='utf-8')
    return cards.count('class="card"')


pages = [(SITE / 'index.html', 'all', '')]
for c in cats:
    p = SITE / c['slug'] / 'index.html'
    if p.exists():
        pages.append((p, c['id'], '../'))
    else:
        print(f'  (no page yet for category "{c["id"]}" - folder {c["slug"]}/ is missing)')
for path, cid, r in pages:
    n = update(path, cid, r)
    print(f'{path.relative_to(SITE)}: {n} games')
