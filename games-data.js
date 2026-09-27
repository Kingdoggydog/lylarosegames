/* =====================================================================
   LYLA ROSE GAMES - THE MASTER LIST
   The home page and every category page read from this one file.
   Add or change a game here and it updates everywhere.
   ===================================================================== */

// ===== CATEGORIES =====
// The buttons along the top. Each category also has its own page for Google,
// in a folder named after its "slug" (e.g. unicorn-games/index.html).
// A category's button only shows once at least one game uses it.
//   id          short name used in the games list below (lowercase, no spaces)
//   slug        the web address of its page: https://lylarosegames.com/<slug>/
//   title       button text
//   heading     big heading on its page
//   about       one line shown under the heading
const categories = [
  { id: "unicorns", slug: "unicorn-games", title: "Unicorns",        heading: "Unicorn games",       emoji: "🦄", colour: "#FDE2EC", about: "Magical games with unicorns, rainbows and sparkles." },
  { id: "sport",    slug: "sport-games",   title: "Sport",           heading: "Sport games",         emoji: "⚽", colour: "#D6F0C8", about: "Kick it, score it, win it." },
  { id: "puzzles",  slug: "puzzle-games",  title: "Puzzles & Mazes", heading: "Puzzle & maze games", emoji: "🧩", colour: "#FFF1C9", about: "Think it through and find the way." },
  { id: "flying",   slug: "flying-games",  title: "Flying",          heading: "Flying games",        emoji: "☁️", colour: "#DDE3FF", about: "Up, up and away into the sky." },
  { id: "animals",  slug: "animal-games",  title: "Animals",         heading: "Animal games",        emoji: "🐒", colour: "#FFE8C7", about: "Cheeky monkeys, bananas and jungle fun." },
  { id: "action",   slug: "action-games",  title: "Action",          heading: "Action games",        emoji: "⚡", colour: "#FFE0DC", about: "Quick hands, fast fun - catch it, dodge it, zoom!" },
  // { id: "cars", slug: "car-games", title: "Cars", heading: "Car games", emoji: "🚗", colour: "#FFE0CC", about: "Zoom zoom." },
];

// ===== GAMES =====
// To add a game: put it in its own folder inside "games", then add it to the END of this list (copy the example line).
// Keep the list oldest-to-newest - the site shows it the other way round, so the newest game appears top left.
// "categories" can list as many category ids as you like - the game shows under each one.
const games = [
  {
    title: "Sparklehoof's Maze",
    folder: "unicorn-maze",
    emoji: "🦄",
    colour: "#CFEFD8",
    thumb: "thumb.svg",   // picture file inside the game's folder (optional)
    blurb: "Gallop through the hedge maze, grab the stars and find the rainbow gate.",
    categories: ["unicorns", "puzzles"],
    controls: "Keyboard or touch"
  },
  {
    title: "Glitter Sky Unicorn",
    folder: "glitter-sky",
    emoji: "🌈",
    colour: "#FDE2EC",
    thumb: "thumb.jpg",
    blurb: "Fly across the sky catching glitter, eat cotton candy sandwiches and giggle at the tooting clouds.",
    categories: ["unicorns", "flying", "action"],
    controls: "Touch or keyboard"
  },
  {
    title: "Unicorn Penalty Shoot-out",
    folder: "unicorn-soccer",
    emoji: "⚽",
    colour: "#D6F0C8",
    thumb: "thumb.jpg",
    blurb: "Aim, kick and score past Lenny the Lemur. How many goals can you get in a row?",
    categories: ["unicorns", "sport"],
    controls: "Tap or Space"
  },
  {
    title: "Lenny's Banana Catch",
    folder: "lenny-banana-catch",
    emoji: "🍌",
    colour: "#D8F2DC",
    thumb: "thumb.jpg",
    blurb: "Help Lenny the Lemur catch the bananas cheeky monkeys throw from the trees. Watch out for coconuts!",
    categories: ["animals", "action"],
    controls: "Drag or arrow keys"
  },
  {
    title: "Glitter Getaway",
    folder: "glitter-getaway",
    emoji: "✨",
    colour: "#FDE2EC",
    thumb: "thumb.jpg",
    blurb: "Gallop to the rainbow bridge, jump the logs and grab the glitter before cheeky Lenny the Lemur pinches it!",
    categories: ["unicorns", "action", "animals"],
    controls: "Tap, Space or ↑"
  },
  // { title: "Next game", folder: "next-game", emoji: "🌈", colour: "#FDE2EC", thumb: "thumb.jpg", blurb: "What it's about.", categories: ["unicorns"], controls: "Touch or keyboard" },
];

// Show a "Coming soon" card at the end of the list
const showComingSoon = true;
