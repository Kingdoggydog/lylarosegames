# Lyla Rose Games

A little collection of games, grouped into sections. Hosted on GitHub Pages at https://kingdoggydog.github.io/lylarosegames/

House rules for editing are in `CLAUDE.md` - any AI chat working on this folder should read that first.

## Sections and games

| Section | Game | Folder |
| --- | --- | --- |
| Unicorns | Sparklehoof's Maze | `games/unicorn-maze/` |
| Unicorns | Glitter Sky Unicorn | `games/glitter-sky/` |
| Unicorns | Unicorn Penalty Shoot-out | `games/unicorn-soccer/` |

## Adding a new game

1. Make a new folder inside `games/`, for example `games/rainbow-catch/`.
2. Put the game in that folder as `index.html`. You can also add a picture called `thumb.jpg` (4:3 shape, e.g. 800 x 600) and set `thumb` for the game's card.
3. In the game's `<head>`, include the description, canonical link and `<script src="../../site.js"></script>` line (see `CLAUDE.md`).
4. Open the main `index.html`, find the `sections` list near the bottom, and add the game to the right section's `games` list (copy the example line).
5. Add a row to the table above, and a line to `sitemap.xml`.
6. Commit and push in GitHub Desktop. The site updates in a minute or two.

## Adding a new section

In the main `index.html`, copy the example section (Space) at the bottom of the `sections` list, remove the `//` at the start of each line, and change the name, emoji, colour and games.

## Site-wide settings

`site.js` is loaded by every page. Google Analytics is switched on by putting the Measurement ID in it - one change, whole site.
