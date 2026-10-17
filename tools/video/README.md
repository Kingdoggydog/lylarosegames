# YouTube Shorts maker (hub only)

Records a game being played with real taps (picture + the game's own sounds) and turns it into a
vertical 1080x1920 Short with the game name, a small lylarosegames.com label and an end card.

1. Start a local server in the repo folder: `python3 -m http.server 8765`
2. Put `Chewy.ttf` and `Nunito.ttf` (Google Fonts) and `icon-512.png` (from brand/) in the folder you run from.
3. Record: `python3 rec.py <name> <game> [seconds]` - <game> is one of the names in `players.py`.
4. Build: `python3 make.py <name> "<Title>" "<short tagline>"` -> `<name>_short.mp4`

Needs Playwright with Chromium, Pillow and ffmpeg. To add a game, write a play function in
`players.py` (tap where a toddler would tap, using the game's ?test helper to find things) and add it to GAMES.
