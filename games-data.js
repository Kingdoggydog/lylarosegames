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
  { id: "puzzles",  slug: "puzzle-games",  title: "Puzzles",         heading: "Puzzle games",        emoji: "🧩", colour: "#FFF1C9", about: "Think it through - jigsaws, matching, mazes and more." },
  { id: "mazes",    slug: "maze-games",    title: "Mazes",           heading: "Maze games",          emoji: "🌀", colour: "#DDF5D2", about: "Find the way through - unicorn, digger and helicopter mazes." },
  { id: "flying",   slug: "flying-games",  title: "Flying",          heading: "Flying games",        emoji: "☁️", colour: "#DDE3FF", about: "Up, up and away into the sky." },
  { id: "animals",  slug: "animal-games",  title: "Animals",         heading: "Animal games",        emoji: "🐒", colour: "#FFE8C7", about: "Cheeky monkeys, bananas and jungle fun." },
  { id: "action",   slug: "action-games",  title: "Action",          heading: "Action games",        emoji: "⚡", colour: "#FFE0DC", about: "Quick hands, fast fun - catch it, dodge it, zoom!" },
  { id: "dinosaurs", slug: "dinosaur-games", title: "Dinosaurs",     heading: "Dinosaur games",      emoji: "🦖", colour: "#DDF3E4", about: "Stomp, roar and chomp with friendly dinosaurs." },
  { id: "cars",     slug: "car-games",     title: "Cars",            heading: "Car games",           emoji: "🚗", colour: "#FFD9B8", about: "Zoom, beep and crunch - games with cars and trucks." },
  { id: "trains",   slug: "train-games",   title: "Trains",          heading: "Train games",         emoji: "🚂", colour: "#D6EEFF", about: "All aboard! Toot, chug and choo-choo." },
  { id: "diggers",  slug: "digger-games",  title: "Diggers",         heading: "Digger games",        emoji: "🚜", colour: "#FFE8A3", about: "Dig, scoop, tip and build with big friendly diggers and trucks." },
];

// ===== AGE GROUPS =====
// The age buttons under the category buttons, and the little age badge on each game card.
// Every game below has an "ages" line using one of these ids. A game shows under exactly one age group.
//   id      what goes in a game's "ages" line (and what the badge says, e.g. "Age 3+")
//   about   one line shown under the heading when that age is picked
const ageGroups = [
  { id: "2+", colour: "#C9F2D9", about: "Simple games for toddlers - big buttons, nothing to lose." },
  { id: "3+", colour: "#CFE6FF", about: "A little more to do - steering, matching and finishing jobs." },
  { id: "4+", colour: "#E6DBFF", about: "Bigger challenges - scores, timing, mazes and thinking ahead." },
];

// ===== GAMES =====
// To add a game: put it in its own folder inside "games", then add it to the END of this list (copy the example line).
// Keep the list oldest-to-newest - the site shows it the other way round, so the newest game appears top left.
// "categories" can list as many category ids as you like - the game shows under each one.
// "ages" = the youngest age the game suits, one of the ageGroups ids above: "2+", "3+" or "4+".
// "thumbAnim" (optional) = a gently moving version of the card picture, e.g. "thumb-anim.svg". It is a copy of
// thumb.jpg with moving extras on top - if thumb.jpg ever changes, remove the thumbAnim line (or ask the hub to remake it).
const games = [
  {
    title: "Sparklehoof's Maze",
    folder: "unicorn-maze",
    ages: "4+",             // age group - see ageGroups above
    emoji: "🦄",
    colour: "#CFEFD8",
    thumb: "thumb.svg",   // picture file inside the game's folder (optional)
    blurb: "Gallop through the hedge maze, grab the stars and find the rainbow gate.",
    categories: ["unicorns", "puzzles", "mazes"],
    controls: "Keyboard or touch"
  },
  {
    title: "Glitter Sky Unicorn",
    folder: "glitter-sky",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🌈",
    colour: "#FDE2EC",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Fly across the sky catching glitter, eat cotton candy sandwiches and giggle at the tooting clouds.",
    categories: ["unicorns", "flying", "action"],
    controls: "Touch or keyboard"
  },
  {
    title: "Unicorn Penalty Shoot-out",
    folder: "unicorn-soccer",
    ages: "4+",             // age group - see ageGroups above
    emoji: "⚽",
    colour: "#D6F0C8",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Aim, kick and score past Lenny the Lemur. How many goals can you get in a row?",
    categories: ["unicorns", "sport"],
    controls: "Tap or Space"
  },
  {
    title: "Lenny's Banana Catch",
    folder: "lenny-banana-catch",
    ages: "4+",             // age group - see ageGroups above
    emoji: "🍌",
    colour: "#D8F2DC",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Help Lenny the Lemur catch the bananas cheeky monkeys throw from the trees. Watch out for coconuts!",
    categories: ["animals", "action"],
    controls: "Drag or arrow keys"
  },
  {
    title: "Glitter Getaway",
    folder: "glitter-getaway",
    ages: "4+",             // age group - see ageGroups above
    emoji: "✨",
    colour: "#FDE2EC",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Gallop to the rainbow bridge, jump the logs and grab the glitter before cheeky Lenny the Lemur pinches it!",
    categories: ["unicorns", "action", "animals"],
    controls: "Tap, Space or ↑"
  },
  {
    title: "Chomper's Car Crunch",
    folder: "chompers-car-crunch",
    ages: "2+",             // age group - see ageGroups above
    emoji: "🦖",
    colour: "#E6DCFF",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Stomp around as Chomper the friendly purple dinosaur, crunch cars and trucks into bouncing bits, and fill up your giant ROAR!",
    categories: ["dinosaurs", "cars", "action", "animals"],
    controls: "Drag, arrow keys or WASD"
  },
  {
    title: "Whirlybird Rescue",
    folder: "whirlybird-rescue",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🚁",
    colour: "#DDE3FF",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Fly Whirly the helicopter with Lenny the Lemur, rescue animal friends stuck up trees and on rooftops, and land them at the picnic!",
    categories: ["flying", "action", "animals"],
    controls: "Drag, arrow keys or WASD"
  },
  {
    title: "Blossom's Easter Eggs",
    folder: "blossoms-easter-eggs",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🐰",
    colour: "#E8F6D8",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Help Blossom the Bunnycorn catch the Easter eggs (not the stinky rotten ones!) and deliver them to her animal friends and the baby unicorns.",
    categories: ["unicorns", "animals", "action"],
    controls: "Drag, tap or arrow keys"
  },
  {
    title: "Chomper's Choo-Choo Express",
    folder: "chompers-choo-choo",
    ages: "2+",             // age group - see ageGroups above
    emoji: "🚂",
    colour: "#D6EEFF",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Drive Chomper's colourful steam train, stop right at the platform to pick up dinosaur friends, and toot the cows off the track!",
    categories: ["dinosaurs", "trains", "action"],
    controls: "Hold, Space or →, T to toot"
  },
  {
    title: "Lenny's Memory Match",
    folder: "lenny-memory-match",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🧠",
    colour: "#FFF1C9",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Flip the cards and find the matching jungle pairs. Find both Lenny cards and he lets you peek at them all!",
    categories: ["puzzles", "animals"],
    controls: "Tap, or arrow keys and Enter"
  },
  {
    title: "Starlight's Unicorn Race",
    folder: "starlight-unicorn-race",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🏅",
    colour: "#D6F0C8",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Tap to gallop, jump the hurdles and race Lenny, Blossom and Chomper to the finish line. Catch rainbow stars for a Rainbow boost and win the gold medal!",
    categories: ["unicorns", "sport", "action"],
    controls: "Tap or Space, Jump button or ↑"
  },
  {
    title: "Chomper's Car Wash",
    folder: "chompers-car-wash",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🧽",
    colour: "#FFD9B8",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Help Chomper scrub the mud off cars, spray away the bubbles and dry them with a fluffy towel - then paint them and add stickers!",
    categories: ["cars", "dinosaurs"],
    controls: "Drag, or arrow keys and Space"
  },
  {
    title: "Chomper's Digger",
    folder: "chompers-digger",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🚜",
    colour: "#FFE8A3",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Dig with Chomper's big yellow digger, fill up Tipper the dump truck, find buried treasure and dinosaur bones, then build a duck pond, a train tunnel and more!",
    categories: ["diggers", "cars", "dinosaurs"],
    controls: "Tap or drag, arrow keys and Space"
  },
  {
    title: "Unicorn Pinball",
    folder: "unicorn-pinball",
    ages: "4+",             // age group - see ageGroups above
    emoji: "🦄",
    colour: "#EDE3FF",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Flick the sparkly ball with Starlight's and Rainbow's magic unicorn horns! Bounce off cotton candy clouds, light up the glitter stars and bop cheeky Lenny for a banana.",
    categories: ["unicorns", "action"],
    controls: "Tap left or right, ← → or Z and M"
  },
  {
    title: "Blossom's Jigsaw Puzzles",
    folder: "blossoms-jigsaw",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🧩",
    colour: "#FFF1C9",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Help Blossom the Bunnycorn put together bright jigsaw pictures of Starlight, Chomper, Lenny, Whirly and friends - then watch each one come alive and win a sticker!",
    categories: ["puzzles", "unicorns", "animals"],
    controls: "Drag, or Tab, arrow keys and Enter"
  },
  {
    title: "Busy Building Site",
    folder: "busy-building-site",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🚧",
    colour: "#FFE3B3",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Drive the digger, tipper, bulldozer and steamroller around a big building site, do jobs for Lenny the Lemur and build a whole little town!",
    categories: ["diggers", "cars"],
    controls: "Drag or arrow keys, big button or Space"
  },
  {
    title: "Chomper's Toot Toot Delivery",
    folder: "chompers-toot-toot",
    ages: "4+",             // age group - see ageGroups above
    emoji: "🚂",
    colour: "#D6EEFF",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "Flick the switches on a toy train set so Chomper's steam train takes milk, toys, bananas and baby unicorns to the right station!",
    categories: ["trains", "dinosaurs", "puzzles"],
    controls: "Tap the switches or keys 1-5, Space to stop and go"
  },
  {
    title: "Chomper's Digger Maze",
    folder: "chompers-digger-maze",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🚜",
    colour: "#FFE8A3",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "A digger maze game! Drive Chomper's big yellow digger through the building site maze, dig through soft dirt walls for shortcuts, find gold nuggets and dinosaur bones, and reach Tipper the dump truck.",
    categories: ["mazes", "puzzles", "diggers", "dinosaurs"],
    controls: "Arrow keys, swipe or tap the arrows"
  },
  {
    title: "Whirly's Cloud Maze",
    folder: "whirly-cloud-maze",
    ages: "4+",             // age group - see ageGroups above
    emoji: "🚁",
    colour: "#DDE3FF",
    thumb: "thumb.jpg",
    thumbAnim: "thumb-anim.svg",   // gently moving card picture (made from thumb.jpg)
    blurb: "A helicopter maze game hidden under the clouds! Fly Whirly the rescue helicopter to blow the clouds off the maze, pop balloons to open gates, ride the wind puffs and fly the animal friends to the picnic.",
    categories: ["mazes", "puzzles", "flying", "animals"],
    controls: "Arrow keys, WASD, swipe or tap the arrows"
  },
  {
    title: "Lenny's Jungle Maze",
    folder: "lenny-jungle-maze",
    ages: "3+",             // age group - see ageGroups above
    emoji: "🐒",
    colour: "#D8F2DC",
    thumb: "thumb.jpg",
    blurb: "A jungle maze game! Help Lenny the Lemur find the lost baby lemurs, lead them home to his treehouse in a wobbly line, swing across the river on vines and collect bananas.",
    categories: ["mazes", "puzzles", "animals"],
    controls: "Arrow keys, WASD, swipe or tap the arrows"
  },
  // { title: "Next game", folder: "next-game", ages: "3+", emoji: "🌈", colour: "#FDE2EC", thumb: "thumb.jpg", blurb: "What it's about.", categories: ["unicorns"], controls: "Touch or keyboard" },
];

// Show a "Coming soon" card at the end of the list
const showComingSoon = true;
