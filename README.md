# Lyla Rose Games

Free, simple browser games for kids. Hosted on GitHub Pages at https://lylarosegames.com/

House rules for editing are in `CLAUDE.md` - any AI chat working on this folder should read that first.

## Games

| Game | Categories | Folder |
| --- | --- | --- |
| Sparklehoof's Maze | Unicorns, Puzzles & Mazes | `games/unicorn-maze/` |
| Glitter Sky Unicorn | Unicorns, Flying | `games/glitter-sky/` |
| Unicorn Penalty Shoot-out | Unicorns, Sport | `games/unicorn-soccer/` |

## Category pages (for Google)

| Category | Page |
| --- | --- |
| Unicorns | `unicorn-games/` |
| Sport | `sport-games/` |
| Puzzles & Mazes | `puzzle-games/` |
| Flying | `flying-games/` |

## Adding a new game

1. Make a new folder inside `games/`, for example `games/rainbow-catch/`, with the game as `index.html`, a card picture called `thumb.jpg` (4:3 shape, e.g. 800 x 600) and a share picture called `share.jpg` (1200 x 630).
2. In the game's `<head>`, include the description, the SEO block and the `<script src="../../site.js"></script>` line - copy them from an existing game (see `CLAUDE.md`).
3. Open `games-data.js` and add the game to the `games` list (copy the example line). Put every category it fits in `categories`, e.g. `["unicorns", "sport"]`.
4. Add a row to the table above, and a line to `sitemap.xml`.
5. Commit and push in GitHub Desktop. The site updates in a minute or two.

## Adding a new category

See the checklist in `CLAUDE.md` - add it to `games-data.js`, copy a category folder, and write its own Google description.

## Site-wide settings

`site.js` is loaded by every page. It switches on Google Analytics, adds the logo, and gives every game the mobile kit (no zooming, full screen, "turn it sideways" message).
