# Lyla Rose Games - house rules

Read this before changing anything in this folder. It keeps the site in order when games are edited in different chats.

Explain changes in plain English, no jargon. Never commit or push to GitHub - the owner does that in GitHub Desktop.

The repository is public: never put passwords, keys or personal details in any file.

Live site: https://lylarosegames.com/ (custom domain - the `CNAME` file tells GitHub Pages about it; don't delete it)
Repo: https://github.com/Kingdoggydog/lylarosegames (GitHub Pages, branch `main`, root folder)
All full web addresses in the site use https://lylarosegames.com/ - never the old kingdoggydog.github.io address.

## How the site is laid out

```
games-data.js       THE MASTER LIST - every category and every game. Edit this to add/change games.
index.html          the home page (reads games-data.js)
home.js             draws the game cards, filter buttons and Google data - no need to edit
styles.css          shared look for the home page and category pages
site.js             loaded by EVERY page: Google Analytics, logo, and the mobile kit for games
unicorn-games/      one folder per category page, for Google (unicorn-games, sport-games,
sport-games/          puzzle-games, flying-games, animal-games, action-games). Each is a
puzzle-games/         small index.html with its own Google title + description. The games
flying-games/         on it come from games-data.js.
animal-games/
action-games/
brand/              logo (icon.svg + png sizes) and og-image.jpg (the share picture)
site.webmanifest    lets phones add the site to the home screen as a full-screen app
sitemap.xml         list of pages for Google
robots.txt          tells search engines they're welcome, and where the sitemap is
CNAME               the custom domain for GitHub Pages - don't delete
README.md           plain-English guide + table of all games
games/<folder>/     one folder per game, fully self-contained
  index.html        the game
  thumb.jpg|svg     card picture (4:3, around 800 x 600)
  share.jpg         share picture, 1200 x 630 (game picture + logo + name label)
```

## Working on ONE game (the normal case)

- Only touch files inside that game's own folder. Don't edit other games.
- Keep the game self-contained: everything it needs lives in its folder (or is inline in its index.html).
- Every game page must keep these in its `<head>`:
  - `<meta name="description" ...>` - one kid-friendly sentence about the game
  - `<script src="../../site.js"></script>` (just before `</head>`) - switches on analytics, the logo and the mobile kit
  - the SEO block between `<!-- ===== SEO for this game` and `<!-- ===== end SEO ===== -->`, containing:
    - `<link rel="canonical" href="https://lylarosegames.com/games/<folder>/">`
    - share tags (`og:title`, `og:description`, `og:url`, `og:image` pointing at the game's `share.jpg`, `twitter:card`)
    - Google game data (`application/ld+json`): a `VideoGame` (name, url, description, image, genre = its categories, free, audience Children) and a `BreadcrumbList` (Lyla Rose Games > its main category page > the game)
    Copy the block from an existing game and change the details.
  - `<title>` in the form: `<Game name> - Free <Kind> Game for Kids | Lyla Rose Games`
  - `<html lang="en-AU">`
  - optional: `<meta name="game-orientation" content="landscape">` (or `portrait`) - phones held the wrong way get a friendly "turn it sideways" screen
- Every game page must keep a way back home: `<a class="back" href="../../">← All games</a>`
- Kid-safe: no external links out of the site, no ads, no sign-ups, no collecting personal details.
- If the game's name, blurb or categories change, update its entry in `games-data.js` and the README table.

### Phones and iPads - every game must:

- Fit the screen with no page scrolling, on phone (upright and sideways) and iPad (both ways) as well as computers. Use `height:100dvh` on the body, and size the play area to the space left over (e.g. a `.stage` with `container-type:size` and a board of `width:min(100cqw, 100cqh * ratio)`) rather than by width alone.
- Redraw the canvas when its box changes size (`ResizeObserver`), not only on window resize.
- Keep clear of notches: pad with `env(safe-area-inset-*)`.
- Work with touch AND keyboard/mouse. Touch buttons at least 48px.
- Don't fight the mobile kit in `site.js` (it already stops double-tap/pinch zoom, page bounce and text selection, and goes full screen on the first tap where the device allows it). If a panel needs to scroll inside a game that blocks touch, give that panel `touch-action: pan-y`.
- Any text box needs a font size of at least 16px (otherwise iPhones zoom in).
- Make sounds with the browser's built-in synthesiser (`new (window.AudioContext || window.webkitAudioContext)()`), created on a tap. The mobile kit keeps track of it and wakes it back up after the phone pauses it (switching apps, locking, going Back) - so don't build a separate unlock system, and never use the AudioContext some other way that bypasses `window.AudioContext`.
- Test at 390x664 (phone), 844x390 (phone sideways), 820x1180 and 1180x820 (iPad).

## Adding a NEW game - checklist (do all of these)

1. New folder `games/<short-name-with-dashes>/` containing `index.html`, `thumb.jpg` and `share.jpg`.
2. The game's `<head>` has the items listed above, and it passes the phone/iPad rules.
3. Add it to the `games` list in `games-data.js`, with every category it fits in `categories` (e.g. `["unicorns", "sport"]`). It appears on the home page and every matching category page automatically.
4. Add a row to the table in `README.md`.
5. Add a `<url>` line for it in `sitemap.xml`.

## Adding a NEW category - checklist

1. Add a line to the `categories` list in `games-data.js` (id, slug, title, heading, emoji, colour, about). Slug = web address, e.g. `car-games`.
2. Copy an existing category folder (e.g. `sport-games/`) to a new folder named after the slug.
3. In the copy's `index.html`, change: `<title>`, `<meta name="description">`, `canonical` and `og:url` addresses, the `og:title`/`og:description`, `data-category="..."` on `<body>`, and the badge emoji/colour, heading and line under it. Write a fresh Google description - never copy another page's.
4. Add a `<url>` line for it in `sitemap.xml`.

## Site-wide things (hub only)

Analytics, Search Console, the home page design, `home.js`, `styles.css`, `site.js`, the logo and category page wording are "hub" jobs. Only change them when that is what was asked for.

- Google Analytics ID is `G-EM2WKCXBEL`, set in `site.js`, which switches it on for every page. Never paste Google's tag into game pages.
- The ONE exception: the home page `index.html` has Google's tag written directly in its `<head>` - Search Console uses it to verify ownership. Do not remove it. `site.js` notices it and skips, so visits aren't counted twice. If the ID ever changes, change it in both places.
- `robots.txt` points search engines at `sitemap.xml`. Keep the sitemap up to date whenever a game or category page is added.
