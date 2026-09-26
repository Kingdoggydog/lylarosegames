# Lyla Rose Games - house rules

Read this before changing anything in this folder. It keeps the site in order when games are edited in different chats.

Explain changes in plain English, no jargon. Never commit or push to GitHub - the owner does that in GitHub Desktop.

Live site: https://kingdoggydog.github.io/lylarosegames/
Repo: https://github.com/Kingdoggydog/lylarosegames (GitHub Pages, branch `main`, root folder)

## How the site is laid out

```
index.html          the home page - the `categories` and `games` lists near the bottom drive everything
site.js             site-wide settings loaded by EVERY page (Google Analytics lives here)
sitemap.xml         list of pages for Google
README.md           plain-English guide + table of all games
games/<folder>/     one folder per game, fully self-contained
  index.html        the game
  thumb.jpg|svg     card picture for the home page (4:3, around 800 x 600)
```

## Working on ONE game (the normal case)

- Only touch files inside that game's own folder. Don't edit other games.
- Keep the game self-contained: everything it needs lives in its folder (or is inline in its index.html).
- Every game page must keep these in its `<head>`:
  - `<title>` with the game's name
  - `<meta name="description" ...>` - one kid-friendly sentence about the game
  - `<link rel="canonical" href="https://kingdoggydog.github.io/lylarosegames/games/<folder>/">`
  - `<script src="../../site.js"></script>` (just before `</head>`) - this is what switches on analytics
- Every game page must keep a way back home: `<a class="back" href="../../">← All games</a>`
- Must work on a tablet with touch AND on a computer with keyboard/mouse.
- Keep it kid-safe: no external links out of the site, no ads, no sign-ups, no collecting names or personal details.
- If the game's name, blurb or categories change, also update its entry in the home page `games` list and the README table.

## Adding a NEW game - checklist (do all of these)

1. New folder `games/<short-name-with-dashes>/` containing `index.html` (+ optional `thumb.jpg`).
2. The game's `<head>` has the four items listed above.
3. Add it to the `games` list in the home page `index.html`, with every category it fits in `categories` (e.g. `["unicorns", "sport"]`). If it needs a brand-new category, add that to the `categories` list too.
4. Add a row to the table in `README.md`.
5. Add a `<url>` line for it in `sitemap.xml`.

## Site-wide things (hub only)

Analytics, Search Console, the home page design and `site.js` are "hub" jobs. Only change them when that is what was asked for.

- Google Analytics ID is `G-EM2WKCXBEL`, set in `site.js`, which switches it on for every game. Never paste Google's tag into game pages.
- The ONE exception: the home page `index.html` has Google's tag written directly in its `<head>` - Search Console uses it to verify ownership. Do not remove it. `site.js` notices it and skips, so visits aren't counted twice. If the ID ever changes, change it in both places.
- Search Console: verification tag goes in the home page `<head>` where the comment says.
- `robots.txt` is not used: this is a project site under kingdoggydog.github.io, so Google ignores robots.txt here. Submit `sitemap.xml` in Search Console instead.
