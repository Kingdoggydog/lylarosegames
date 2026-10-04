# Lyla Rose Games

Free, simple browser games for kids. Hosted on GitHub Pages at https://lylarosegames.com/

House rules for editing are in `CLAUDE.md` - any AI chat working on this folder should read that first.

## Games

| Game | Categories | Ages | Folder |
| --- | --- | --- | --- |
| Sparklehoof's Maze | Unicorns, Puzzles & Mazes, Mazes | 4+ | `games/unicorn-maze/` |
| Glitter Sky Unicorn | Unicorns, Flying, Action | 3+ | `games/glitter-sky/` |
| Unicorn Penalty Shoot-out | Unicorns, Sport | 4+ | `games/unicorn-soccer/` |
| Lenny's Banana Catch | Animals, Action | 4+ | `games/lenny-banana-catch/` |
| Glitter Getaway | Unicorns, Action, Animals | 4+ | `games/glitter-getaway/` |
| Chomper's Car Crunch | Dinosaurs, Cars, Action, Animals | 2+ | `games/chompers-car-crunch/` |
| Whirlybird Rescue | Flying, Action, Animals | 3+ | `games/whirlybird-rescue/` |
| Blossom's Easter Eggs | Unicorns, Animals, Action | 3+ | `games/blossoms-easter-eggs/` |
| Chomper's Choo-Choo Express | Dinosaurs, Trains, Action | 2+ | `games/chompers-choo-choo/` |
| Lenny's Memory Match | Puzzles & Mazes, Animals | 3+ | `games/lenny-memory-match/` |
| Starlight's Unicorn Race | Unicorns, Sport, Action | 3+ | `games/starlight-unicorn-race/` |
| Chomper's Car Wash | Cars, Dinosaurs | 3+ | `games/chompers-car-wash/` |
| Chomper's Digger | Diggers & Trucks, Cars, Dinosaurs | 3+ | `games/chompers-digger/` |
| Unicorn Pinball | Unicorns, Action | 4+ | `games/unicorn-pinball/` |
| Blossom's Jigsaw Puzzles | Puzzles & Mazes, Unicorns, Animals | 3+ | `games/blossoms-jigsaw/` |
| Busy Building Site | Diggers & Trucks, Cars | 3+ | `games/busy-building-site/` |
| Chomper's Toot Toot Delivery | Trains, Dinosaurs, Puzzles & Mazes | 4+ | `games/chompers-toot-toot/` |
| Chomper's Digger Maze | Mazes, Puzzles & Mazes, Diggers & Trucks, Dinosaurs | 3+ | `games/chompers-digger-maze/` |
| Whirly's Cloud Maze | Mazes, Puzzles & Mazes, Flying, Animals | 4+ | `games/whirly-cloud-maze/` |

## Age groups

Each game has a starting age (2+, 3+ or 4+), set in `games-data.js`. It shows as a badge on the game's card, and the Age buttons on the home page and category pages show one group at a time. What each group means is written in the `ageGroups` list at the top of `games-data.js`.

## Category pages (for Google)

| Category | Page |
| --- | --- |
| Unicorns | `unicorn-games/` |
| Sport | `sport-games/` |
| Puzzles & Mazes | `puzzle-games/` |
| Mazes | `maze-games/` |
| Flying | `flying-games/` |
| Animals | `animal-games/` |
| Action | `action-games/` |
| Dinosaurs | `dinosaur-games/` |
| Cars | `car-games/` |
| Trains | `train-games/` |
| Diggers | `digger-games/` |

## For parents page

`for-parents/` - plain information for grown-ups: no ads, no purchases, no sign-ups, no chat, what the age badges mean, what Google Analytics counts, and the contact email. Linked from the footer of the home and category pages.

## Adding a new game

1. Make a new folder inside `games/`, for example `games/rainbow-catch/`, with the game as `index.html`, a card picture called `thumb.jpg` (4:3 shape, e.g. 800 x 600) and a share picture called `share.jpg` (1200 x 630).
2. In the game's `<head>`, include the description, the SEO block and the `<script src="../../site.js"></script>` line - copy them from an existing game (see `CLAUDE.md`).
3. Open `games-data.js` and add the game to the `games` list (copy the example line). Put every category it fits in `categories`, e.g. `["unicorns", "sport"]`, and its starting age in `ages` (`"2+"`, `"3+"` or `"4+"`).
4. Add a row to the table above (including its age), and a line to `sitemap.xml`.
5. Commit and push in GitHub Desktop. The site updates in a minute or two.

## Adding a new category

See the checklist in `CLAUDE.md` - add it to `games-data.js`, copy a category folder, and write its own Google description.

## Site-wide settings

`site.js` is loaded by every page. It switches on Google Analytics, adds the logo, and gives every game the mobile kit (no zooming, full screen, "turn it sideways" message).
