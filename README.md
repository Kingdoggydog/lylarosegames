# Lyla Rose Games

A little collection of games, filtered by category (a game can be in several). Hosted on GitHub Pages at https://kingdoggydog.github.io/lylarosegames/

House rules for editing are in `CLAUDE.md` - any AI chat working on this folder should read that first.

## Games

| Game | Categories | Folder |
| --- | --- | --- |
| Sparklehoof's Maze | Unicorns, Puzzles & Mazes | `games/unicorn-maze/` |
| Glitter Sky Unicorn | Unicorns, Flying | `games/glitter-sky/` |
| Unicorn Penalty Shoot-out | Unicorns, Sport | `games/unicorn-soccer/` |

## Adding a new game

1. Make a new folder inside `games/`, for example `games/rainbow-catch/`.
2. Put the game in that folder as `index.html`. You can also add a picture called `thumb.jpg` (4:3 shape, e.g. 800 x 600) and set `thumb` for the game's card.
3. In the game's `<head>`, include the description, canonical link and `<script src="../../site.js"></script>` line (see `CLAUDE.md`).
4. Open the main `index.html`, find the `games` list near the bottom, and add the game (copy the example line). Put every category it fits in `categories`, e.g. `["unicorns", "sport"]`.
5. Add a row to the table above, and a line to `sitemap.xml`.
6. Commit and push in GitHub Desktop. The site updates in a minute or two.

## Adding a new category

In the main `index.html`, copy a line in the `categories` list and change the id, name, emoji, colour and description. Its button appears at the top as soon as a game uses it. Tapping a category filters the games; tapping it again, or tapping Clear, shows everything.

## Site-wide settings

`site.js` is loaded by every page. Google Analytics is switched on by putting the Measurement ID in it - one change, whole site.
