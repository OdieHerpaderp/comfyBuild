import { lerp } from './lib.mjs';

const buildingPhases = {
  0: "idle",
  1: "buildGather",
  2: "build",
  3: "consume",
  4: "produce"
}

const buildingPhasesNew = {
  idle: 0,
  buildGather: 1,
  build: 2,
  consume: 3,
  produce: 4,
  getDisplayString: function (value) {
    switch (value) {
      case 1: return "Gathering build materials";
      case 2: return "Building";
      case 3: return "Gathering materials";
      case 4: return "Producing";
      default: return "Idle";
    }
  }
}

const buildings = {
  headquarters: {
    age: -1,
    category: "wonderNatural",
    build: {},
    consume: {},
    produce: {}
  },
  // Housing
  dolmen: {
    age: 0,
    category: "housing",
    info: "Several slabs of stone provide ample shelter.",
    build: { stone: 1 },
    consume: { water: 1, berry: 1 },
    produce: { population: 3 }
  },
  boneTent: {
    age: 1,
    category: "housing",
    info: "A simple tent using bone for structure, and hide as cover.",
    build: { plantFibre: 2, bone: 2, hide: 2, toolBlunt: 1},
    consume: { water: 2, berry: 3, meat: 3, hide: 1 },
    produce: { population: 12 }
  },
  hut: {
    age: 2,
    category: "housing",
    info: "Basic shelter made of wood, plant fibre and mud.",
    build: { wood: 3, plantFibre: 2, mud: 2, toolBlunt: 2 },
    consume: { water: 3, meat: 4, fish: 3, hide: 2 },
    produce: { population: 14 }
  },
  mudBrickHouse: {
    age: 2,
    category: "housing",
    info: "A simple mudbrick dwelling common in ancient Egypt.",
    build: { stone: 3, mudBrick: 4, toolFlint: 2 },
    consume: { water: 3, meat: 5, fish: 4, rootVegetable: 2, hide: 2 },
    produce: { population: 16 }
  },
  burdei: {
    age: 2,
    category: "housing",
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    build: { stone: 2, clay: 2, mud: 2, toolFlint: 3 },
    consume: { water: 3, meat: 4, salad: 4, rootVegetable: 3, hide: 2 },
    produce: { population: 18 }
  },
  bungalow: {
    age: 3,
    category: "housing",
    info: "Sturdy single floor building built from wood logs and stone block flooring.",
    build: { stoneBlock: 6, wood: 9, toolCopper: 3 },
    consume: { water: 4, meat: 6, bread: 5, salad: 5, hide: 2 },
    produce: { population: 20 }
  },
  clayBrickHouse: {
    age: 4,
    category: "housing",
    info: "Sturdy single floor building built from clay bricks and stone block flooring.",
    build: { stoneBlock: 6, brick: 6, wood: 1, toolCopper: 2 },
    consume: { water: 5, meat: 7, bread: 7, salad: 6, alcohol: 2, clothing: 1 },
    produce: { population: 23 }
  },
  ziggurat: {
    age: 5,
    info: "A monumental stepped mudbrick temple-tower from ancient Mesopotamia.",
    build: { mudBrick: 12, wood: 8, stone: 4, toolCopper: 2 },
    consume: { water: 6, meat: 8, bread: 8, salad: 7, alcohol: 2, clothing: 1 },
    produce: { population: 26 }
  },
  // Age 0 age of scavenging
  // first nodeless plant gathering building. gives a bit of everything, becomes obsolete with farming
  fieldGatherers: {
    age: 0,
    category: "gatheringOrganics",
    info: "Usable and edible plants are collected by hand.",
    build: { wood: 3 },
    consume: {},
    produce: { plantFibre: 2, berry: 1, rootVegetable: 1, wildGrains: 1 }
  },
  // first rockDeposit user. grants the basic mineral materials stone, flint, mud and sand
  caveGatherers: {
    age: 0,
    category: "gatheringMinerals",
    info: "Rocks are hauled out of a cave.",
    node: "rockDeposit",
    build: { wood: 2 },
    consume: {},
    produce: { stone: 4, flint: 2, mud: 1, sand: 1 }
  },
  // first forest node user. gives wood n more fibre than field gatherers
  forestGatherers: {
    age: 0,
    category: "gatheringOrganics",
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { stone: 2 },
    consume: {},
    produce: { wood: 5, plantFibre: 3 }
  },
  // first tool builder. makes tools and buckets from wood. alt recipe could have it use less wood and add stone?
  woodCarver: {
    age: 0,
    category: "processingOrganics",
    info: "Crafts primitive wooden tools.",
    build: { wood: 3, stone: 3 },
    consume: { wood: 4, plantFibre: 2 },
    produce: { toolBlunt: 1, bucket: 1 }
  },
  // first source of water and mud.
  waterSource: {
    age: 0,
    category: "gatheringOrganics",
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { plantFibre: 2 },
    consume: {},
    produce: { water: 6, mud: 2 }
  },
  // Age 1, advent of fire and hunting
  // first wildGame user. spends age0 tools to get new game resource
  huntersCamp: {
    age: 1,
    category: "gatheringOrganics",
    info: "Wild game is hunted using clubs.",
    node: "wildGame",
    build: { wood: 3 },
    consume: { toolBlunt: 1 },
    produce: { game: 1 }
  },
  //first food processing building. turns the new game resource into usable resources. meatRaw for food, hide as the first step of clothing tech. bone as a crafting resource.
  primitiveButcher: {
    age: 1,
    category: "processingOrganics",
    info: "Wild game is dismantled by hand.",
    build: { wood: 3 },
    consume: { game: 1 },
    produce: { meatRaw: 3, hide: 1, bone: 1 }
  },
  //first way to turn meatRaw into meat. also produces ash, which will be usefull at a later point.
  campfire: {
    age: 1,
    category: "processingOrganics",
    info: "Roasts wild game over open campfire.",
    build: { plantFibre: 2, wood: 3, stone: 3 },
    consume: { wood: 1, meatRaw: 3 },
    produce: { meat: 3, ash: 1 }
  },
  //a more efficient way than woodworker to get toolBlunt. at the cost of not producing buckets.
  boneCarver: {
    age: 1,
    category: "processingOrganics",
    info: "Crafts primitive tools from animal bones and antlers.",
    build: { wood: 3, hide: 2 },
    consume: { bone: 1, plantFibre: 1 },
    produce: { toolBlunt: 1 }
  },
  // an upgrade over caveGatherers. you get more stone but no flint, mud or sand.
  primitiveQuarry: {
    age: 1,
    category: "gatheringMinerals",
    info: "Primitive tools are used to collect stone.",
    node: "rockDeposit",
    build: { wood: 2, stone: 1 },
    consume: { toolBlunt: 1 },
    produce: { stone: 7 }
  },
  // an upgrade over field gathers, get more root veggies instead of berries and wild grains
  rootDiggers: {
    age: 1,
    category: "gatheringOrganics",
    info: "Digs up edible roots, tubers and bulbs from the ground.",
    build: { stone: 1, wood: 1, plantFibre: 1 },
    consume: { toolBlunt: 1 },
    produce: { rootVegetable: 5, plantFibre: 2 }
  },
  // a use for plantfibre. gives rope n string, both needed a lot later.. so could be moved to a later age, though that makes little sense lorewise.
  ropeMaker: {
    age: 1,
    category: "processingOrganics",
    info: "Twists and plies plant fibres into rope and cordage.",
    build: { wood: 2, stone: 1 },
    consume: { plantFibre: 5 },
    produce: { rope: 3, string: 1 }
  },
  //makes first logistics item
  basketWeaver: {
    age: 1,
    category: "processingOrganics",
    info: "Weaves plant fibres into baskets for carrying and storing goods.",
    build: { wood: 3, stone: 3, plantFibre: 2 },
    consume: { plantFibre: 5 },
    produce: { basket: 1 }
  },
  // hoard is the first logistics building. it will use baskets to do it's thing
//  hoard: {
//    age: 1,
//    category: "logistics",
//    info: "Provides ample storage for resources. Untill logistics mechanics have been made, this does nothing but eat baskets.",
//    build: { wood: 2, stone: 2, hide: 1 },
//    consume: { basket: 1 },
//    produce: { tempLogisticsLaborPoints: 10 }
//  },
  // early access to flour, and thus bread. though better mills will make this obsolete in the coming ages.
  handMiller1: {
    age: 1,
    category: "processingOrganics",
    info: "Harnesses manual labour to mill grains.",
    build: { wood: 5, stone: 9, toolBlunt: 1 },
    consume: { wildGrains: 3, toolBlunt: 2 },
    produce: { flour: 3 }
  },
  // alternate version, for when you've unlocked wheat, but not yet unlocked the better mills. these 2 can be consolidated in one when buildings have multiple recipes
  handMiller2: {
    age: 1,
    info: "Harnesses manual labour to mill grains.",
    build: { wood: 5, stone: 9, toolBlunt: 1 },
    consume: { wheat: 3, toolBlunt: 2 },
    produce: { flour: 3 }
  },
  // Age 2 peak stoneage, time for flint tools
//i plan to introduce a new tool tier every other age. so age 2, time for the flint tools.
// to keep the chain going. each tool always uses new materials and the last version of tools to make em.
  flintKnapper: {
    age: 2,
    category: "processingMinerals",
    info: "Workers shape flint into primitive but sharp tools.",
    build: { stone: 3, plantFibre: 2 },
    consume: { flint: 2, wood: 2, plantFibre: 1, toolBlunt: 1 },
    produce: { toolFlint: 2 }
  },
  // an upgrade over forest gatherers. less plantFibre for more wood.
  loggingCamp: {
    age: 2,
    category: "gatheringOrganics",
    info: "Loggers cut trees for wood using primitive tools",
    node: "forest",
    build: { stone: 4, wood: 2 },
    consume: { toolFlint: 1 },
    produce: { wood: 8 }
  },
  //first source of actual fuel
  fuelBundler: {
    age: 2,
    category: "produceFuel",
    info: "Produces charcoal by smoldering bundles of wood in a low oxygen environment.",
    build: { stone: 4, wood: 2 },
    consume: { wood: 3, plantFibre: 1 },
    produce: { charcoal: 2, ash: 1 }
  },
  fishery: {
    age: 1,
    info: "Fish is caught using primitive harpoons.",
    node: "freshWater",
    build: { plantFibre: 3, wood: 3 },
    consume: { toolFlint: 2 },
    produce: { fishRaw: 12 }
  },
  fishStove: {
    age: 2,
    info: "As long as we don't have multiple recipes per building..",
    build: { plantFibre: 2, wood: 3, stone: 3, toolFlint: 1 },
    consume: { charcoal: 1, fishRaw: 6 },
    produce: { fish: 6, ash: 1 }
  },
  meatStove: {
    age: 2,
    info: "..we'll have variants of the same building",
    build: { plantFibre: 2, wood: 3, stone: 3, toolFlint: 1 },
    consume: { charcoal: 1, meatRaw: 6 },
    produce: { meat: 6, ash: 1 }
  },
  clayPit: {
    age: 2,
    node: "soil",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 2 },
    produce: { clay: 10 }
  },
  riverGatherers: {
    age: 2,
    node: "freshWater",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 1, basket: 1 },
    produce: { water: 2, clay: 2, plantFibre: 6, fishRaw: 1 }
  },
  mudPit: {
    age: 2,
    node: "soil",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 2 },
    produce: { mud: 10 }
  },
  saladBar: {
    age: 2,
    category: "processingOrganics",
    info: "Workers create delicious salads using various fruits and vegetables.",
    build: { wood: 3, plantFibre: 2 },
    consume: { berry: 5, rootVegetable: 5, toolBlunt: 1 },
    produce: { salad: 3 }
  },
  sandPit: {
    age: 2,
    node: "soil",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 2 },
    produce: { sand: 10 }
  },
  potteryKiln: {
    age: 2,
    info: "Allows firing of clay pots and buckets.",
    build: { clay: 3, stone: 2, wood: 2 },
    consume: { clay: 8, charcoal: 3 },
    produce: { pottery: 1, bucket: 2, ash: 1 }
  },
  // waterBearers1: {
  //   age: 2,
  //   category: "logistics",
  //   info: "Untill logistics mechanics have been made, this does nothing but eat buckets.",
  //   build: { wood: 2, stone: 2, hide: 1 },
  //   consume: { bucket: 1 },
  //   produce: { tempLogisticsLaborPoints: 10 }
  // },
  // waterBearers2: {
  //   age: 2,
  //   category: "logistics",
  //   info: "Untill logistics mechanics have been made, this does nothing but eat baskets.",
  //   build: { wood: 2, stone: 2, hide: 1 },
  //   consume: { pottery: 1 },
  //   produce: { tempLogisticsLaborPoints: 10 }
  // },
  mudBrickMaker: {
    age: 2,
    info: "Produces mudbricks from a mixture of mud, water and fibrous materials.",
    build: { wood: 6, stone: 4, clay: 1, mud: 1 },
    consume: { mud: 8, water: 4, plantFibre: 2 },
    produce: { mudBrick: 6 }
  },
  well: {
    age: 2,
    node: "freshWater",
    build: { stone: 2, brick: 2, toolFlint: 1 },
    consume: { bucket: 1 },
    produce: { water: 7 }
  },
  militiaCamp: {
    age: 2,
    info: "People are given spears and hide pelts to provide safety",
    build: { wood: 3, stone: 3 },
    consume: { toolFlint: 2, hide: 2 },
    produce: { militia: 2 }
  },
  primitiveBakery: {
    age: 2,
    info: "Bakes flatbread from flour.",
    build: { wood: 5, stone: 9, toolFlint: 1 },
    consume: { flour: 3, charcoal: 1 },
    produce: { bread: 2 }
  },
  // Age 3 flint tools are phased out for quartz and obsidian. advent of farming


  raidingCamp: {
    age: 3,
    info: "Makes friendly visits to neighboring tribes who haven't figured out sharp sticks yet.",
    build: { stone: 3, wood: 3, hide: 1 },
    consume: { militia: 1 },
    produce: { plantFibre: 1, berry: 1, rootVegetable: 1, wildGrains: 1, game: 1, fish: 1, charcoal: 1, pottery: 1, bucket: 1, brick: 1 } // can we randomise output a little?
  },
  quartzMine: {
    age: 3,
    info: "Mines Quartz using primitive tools.",
    node: "quartzDeposit",
    build: { stone: 3, wood: 3 },
    consume: { toolFlint: 2 },
    produce: { quartz: 4, stone: 3 }
  },
  volcanoGatherers: {
    age: 3,
    info: "scavenge for obsidian near the edges of volcanoes.",
    node: "sulphurDeposit",
    build: { wood: 4, stone: 6, toolFlint: 1 },
    consume: { basket: 1 },
    produce: { obsidian: 3 }
  },
  limestoneQuarry: {
    age: 3,
    info: "Mines limestone deposits from quarries.",
    node: "limeDeposit",
    build: { wood: 4, stone: 6, toolFlint: 1 },
    consume: { toolFlint: 2 },
    produce: { limestone: 4 }
  },
  stoneCuttingQuarry: {
    age: 3,
    info: "mines stone from quarries and cuts them for construction.",
    node: "rockDeposit",
    build: { wood: 4, stone: 6, toolFlint: 1 },
    consume: { toolFlint: 1 },
    produce: { stone: 4, stoneBlock: 4 }
  },
  quartzKnapper: {
    age: 3,
    category: "processingMinerals",
    info: "Workers shape quartz into sturdier Neolithic tools.",
    build: { stone: 3, plantFibre: 2, quartz: 1, toolFlint: 1 },
    consume: { quartz: 2, wood: 5, plantFibre: 1, toolFlint: 1 },
    produce: { toolFlint: 5 }
  },
  obsidianKnapper: {
    age: 3,
    category: "processingMinerals",
    info: "Workers shape quartz into razorsharp Neolithic tools.",
    build: { stone: 3, plantFibre: 2, quartz: 1, toolFlint: 1 },
    consume: { obsidian: 2, wood: 5, plantFibre: 1, toolFlint: 1 },
    produce: { toolFlint: 5 }
  },
  wheatField: {
    age: 3,
    node: "soil",
    info: "Now, hear me out.. what if we put the seed.. back in the ground?",
    build: { wood: 3, wildGrains: 2 },
    consume: { water: 4, toolFlint: 2 },
    produce: { wheat: 7 }
  },
  flaxField: {
    age: 3,
    info: "Grows flax plants for harvesting their fibers to produce linen.",
    node: "soil",
    build: { wood: 3, mud: 1 },
    consume: { water: 3, toolFlint: 1 },
    produce: { flax: 5, plantFibre: 5 }
  },
  linenMill: {
    age: 3,
    info: "Processes flax fibers into linen fabric and thread using hard labour.",
    build: { wood: 2, stone: 3 },
    consume: { flax: 3 },
    produce: { cloth: 2 }
  },
  Tailor: {
    age: 3,
    info: "Produces clothing from linen fabric.",
    build: { wood: 4, stone: 2 },
    consume: { cloth: 5, toolFlint: 1 },
    produce: { clothing: 3 }
  },
  hunterLodge: {
    age: 3,
    info: "Skilled hunters provide fresh game meat.",
    node: "wildGame",
    build: { wood: 5, plantFibre: 3 },
    consume: { toolFlint: 1 },
    produce: { game: 3 }
  },
  gameButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "Wild game is cut and processed",
    build: { brick: 3, wood: 2 },
    consume: { game: 2, toolFlint: 1 },
    produce: { meatRaw: 7, hide: 3, bone: 3, tallow: 2 }
  },
  cowButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "make some beef steaks",
    build: { brick: 3, wood: 2 },
    consume: { cow: 1, toolFlint: 1 },
    produce: { meatRaw: 7, hide: 3, bone: 3, tallow: 2 }
  },
  horseButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "make some swedish meatballs",
    build: { brick: 3, wood: 2 },
    consume: { horse: 1, toolFlint: 1 },
    produce: { meatRaw: 6, hide: 4, bone: 4, tallow: 3 }
  },
  sheepButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "make some shawarma",
    build: { brick: 3, wood: 2 },
    consume: { sheep: 1, toolFlint: 1 },
    produce: { meatRaw: 5, hide: 1, wool: 2, bone: 3, tallow: 2 }
  },
  brickery: {
    age: 3,
    info: "firing clay at high temperatures makes lighter, and sturdier bricks.",
    build: { clay: 3, stone: 3, wood: 3 },
    consume: { clay: 3, charcoal: 1 },
    produce: { brick: 3 }
  },
  croftFarm: {
    age: 3,
    info: "Grows herbs fruits and seeds.",
    build: { mud: 4, stone: 2, wood: 1 },
    consume: { water: 5, toolFlint: 2 },
    produce: { herb: 2, berry: 2, rootVegetable: 1, seed: 2 }
  },
  baitPreparation: {
    age: 3,
    info: "Mixes bird seed with grains and berries into an attractive bait.",
    build: { wood: 3, pottery: 1 },
    consume: { seed: 4, wheat: 2, berry: 1 },
    produce: { birdBait: 5 }
  },
  birdTrapper1: {
    age: 3,
    info: "Lays traps baited with seed to capture birds alive.",
    node: "forest",
    build: { wood: 4 },
    consume: { birdBait: 3 },
    produce: { bird: 5 }
  },
//  birdTrapper2: {
//    age: 3,
//    info: "alternate recipe for later",
//    node: "forest",
//    build: { wood: 4 },
//    consume: { birdBait: 1, glue: 1 },
//    produce: { bird: 5 }
//  },
  birdButcher: {
    age: 3,
    info: "Butchers birds for meat and feathers.",
    build: { wood: 4, stone: 2 },
    consume: { bird: 2 },
    produce: { poultryRaw: 5, feather: 4, tallow: 2 }
  },
  chickenCoop: {
    age: 3,
    info: "Raises chickens for food and resources",
    build: { wood: 6, bird: 2, plantFibre: 3 },
    consume: { water: 2, wheat: 6, toolFlint: 1 },
    produce: { bird: 1, egg: 4, feather: 2 }
  },
  fletcher: {
    age: 3,
    info: "Prepares feathers from birds for use as arrow fletching.",
    build: { wood: 3, stone: 2 },
    consume: { feather: 3 },
    produce: { fleching: 3 }
  },
  chandler: {
    age: 3,
    info: "makes candles",
    build: { wood: 6, pottery: 1 },
    consume: { tallow: 3, plantFibre: 1 },
    produce: { candle: 3 }
  },
  cowTrapper: {
    age: 3,
    info: "Raises cows for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { rope: 1, wheat: 6, toolFlint: 1 },
    produce: { cow: 1 }
  },
  horseTrapper: {
    age: 3,
    info: "Raises horses for various applications",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { rope: 1, wheat: 6, toolFlint: 1 },
    produce: { horse: 1, }
  },
  sheepTrapper: {
    age: 3,
    info: "Raises sheep for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { rope: 1, wheat: 6, toolFlint: 1 },
    produce: { sheep: 1 }
  },
  nuggetGatherers: {
    age: 3,
    node: "freshWater",
    info: "Some rivers have shiny rocks in em, must be good for something",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { pottery: 5 },
    produce: { water: 2, clay: 2, sand: 2, goldOre: 1 }
  },
  // Age 4, start of the copper age. start of basic animal husbandry
  copperSurfaceMine: {
    age: 4,
    info: "Mines copper ore deposits using primitive and neolithic tools.",
    node: "copperDeposit",
    build: { wood: 5, stone: 4, toolFlint: 1 },
    consume: { toolFlint: 2 },
    produce: { copperOre: 3 }
  },
  copperSmelter: {
    age: 4,
    info: "Smelts copper ore into metal ingots for tools and construction.",
    build: { stone: 8, clay: 4 },
    consume: { copperOre: 5, charcoal: 3 },
    produce: { copperIngot: 4 }
  },
  tinSurfaceMine: {
    age: 4,
    node: "tinDeposit",
    info: "Extracts tin ore from underground deposits.",
    build: { wood: 5, stone: 4, toolFlint: 1 },
    consume: { toolFlint: 2 },
    produce: { tinOre: 3 }
  },
  tinSmelter: {
    age: 4,
    info: "Smelts tin ore into metal ingots for tools and construction.",
    build: { stone: 8, clay: 4 },
    consume: { tinOre: 5, charcoal: 3 },
    produce: { tinIngot: 4 }
  },
  silverSurfaceMine: {
    age: 4,
    node: "silverDeposit",
    info: "Mines silver ore from rich veins.",
    build: { wood: 10, stone: 12, toolCopper: 2 },
    consume: { toolCopper: 3 },
    produce: { silverOre: 1, electrumOre: 6 }
  },

  copperSmith: {
    age: 4,
    info: "Forges copper ingots into tools, weapons, jewelry and decorative items.",
    build: { wood: 4, stone: 6, copperIngot: 1 },
    consume: { copperIngot: 3, charcoal: 1 },
    produce: { toolCopper: 2 }
  },
  tinSmith: {
    age: 4,
    info: "Forges tin ingots into tools, weapons, jewelry and decorative items.",
    build: { wood: 4, stone: 6, tinIngot: 1 },
    consume: { tinIngot: 3, charcoal: 1 },
    produce: { toolCopper: 2 }
  },
  cowPasture: {
    age: 4,
    info: "Raises cows for food and resources",
    build: { wood: 6, stone: 4, cow: 2 },
    consume: { water: 2, wheat: 8, toolCopper: 1 },
    produce: { cow: 1, milk: 2 }
  },
  horsePasture: {
    age: 4,
    info: "Raises horses for various applications",
    build: { wood: 6, stone: 4, horse: 2 },
    consume: { water: 2, wheat: 6, toolCopper: 1 },
    produce: { horse: 1, }
  },
  sheepPasture: {
    age: 3,
    info: "Raises sheep for food and resources",
    build: { wood: 6, stone: 4, sheep: 2 },
    consume: { water: 2, wheat: 6, toolCopper: 1 },
    produce: { sheep: 1, wool: 1 }
  },
  bowyer: {
    age: 4,
    info: "Crafts finished arrows by fletching and stringing arrow shafts.",
    build: {wood: 4, stone: 3 },
    consume: { lumber: 2, fleching: 3, string: 2 },
    produce: { bow: 2 }
  },
  mortuary: {
    age: 4,
    info: "Uses linen fabric for shrouds and wrappings for the deceased.",
    build: { wood: 3, stone: 5 },
    consume: { cloth: 2 },
    produce: { faith: 1 }
  },
  tannery: {
    age: 4,
    info: "Processes raw hides into leather for clothing, shelters, etc.",
    build: { wood: 8, stone: 4 },
    consume: { hide: 6, toolCopper: 1, lye: 1 },
    produce: { leather: 3 }
  },
  spinningMill: {
    age: 4,
    info: "Processes wool into wooly thread using hard labour.",
    build: { wood: 4, stone: 3, string: 2 },
    consume: { wool: 4 },
    produce: { cloth: 2, string: 3 }
  },
  sawmill: {
    age: 4,
    info: "Processes raw logs into lumber for construction.",
    build: { wood: 3, brick: 2, copperIngot: 2 },
    consume: { toolCopper: 1, wood: 6 },
    produce: { lumber: 6 }
  },
  horseMill: {
    age: 4,
    info: "Harnesses horse power to mill grains.",
    build: { lumber: 4, brick: 6, rope: 3, horse: 1 },
    consume: { wheat: 7 },
    produce: { flour: 6 }
  },
  limestoneKiln: {
    age: 4,
    info: "Calcines raw limestone into quicklime by heating.",
    build: { stone: 8, clay: 6, charcoal: 4 },
    consume: { limestone: 8, charcoal: 6 },
    produce: { quicklime: 6 }
  },
  lyeVats: {
    age: 4,
    info: "Leaches lye from wood ash using an alkaline solution.",
    build: { wood: 4, stone: 6, pottery: 2 },
    consume: { ash: 6, water: 4, limestone: 2 },
    produce: { lye: 4 }
  },
  rainCollector: {
    age: 4,
    category: "producingWater",
    info: "A large funnel and storage system that collects rainwater.",
    build: { wood: 4, copperIngot: 1, brick: 3 },
    consume: {},
    produce: { water: 1 }
  },
  hopsField: {
    age: 4,
    node: "soil",
    build: { wood: 3, mud: 2, wildGrains: 1 },
    consume: { water: 4, toolCopper: 2 },
    produce: { hops: 3 }
  },
  distillery: {
    age: 4,
    build: { lumber: 3, copperIngot: 2, brick: 2 },
    consume: { water: 4, hops: 3, toolCopper: 1, charcoal: 2 },
    produce: { alcohol: 1, ash: 1 }
  },
  // Age 5 first culture buildings & deeper mines
  copperTunnelMine: {
    age: 5,
    info: "Mines copper ore deposits using copper age tools.",
    node: "copperDeposit",
    build: { lumber: 3, brick: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { copperOre: 15 }
  },
  tinTunnelMine: {
    age: 5,
    info: "Mines copper ore deposits using copper age tools.",
    node: "tinDeposit",
    build: { lumber: 3, brick: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { tinOre: 8, zincOre: 2, electrumOre: 1 }
  },
  zincTunnelMine: {
    age: 5,
    info: "Mines copper ore deposits using copper age tools.",
    node: "zincDeposit",
    build: { lumber: 3, brick: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { zincOre: 12, copperOre: 2, leadOre: 1 }
  },
  leadTunnelMine: {
    age: 5,
    info: "Mines copper ore deposits using copper age tools.",
    node: "leadDeposit",
    build: { lumber: 3, brick: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { leadOre: 12, tinOre: 3 }
  },
  preciousTunnelMine: {
    age: 5,
    info: "Mines copper ore deposits using copper age tools.",
    node: "silverDeposit",
    build: { lumber: 3, brick: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { electrumOre: 8, goldOre: 1, silverOre: 3 }
  },
  volcanoMine: {
    age: 5,
    info: "dig into the edges of volcanoes. dangerous stuff even with protective clothing",
    node: "sulphurDeposit",
    build: { wood: 4, stone: 6, toolCopper: 1 },
    consume: { toolCopper: 1, clothing: 1, herb: 2 },
    produce: { obsidian: 2, sulfur: 3 }
  },
  zincSmelter: {
    age: 5,
    info: "Smelts zinc ore into metal ingots for tools and construction.",
    build: { stone: 8, clay: 4 },
    consume: { zincOre: 5, charcoal: 3 },
    produce: { zincIngot: 4 }
  },
  silverSmelter: {
    age: 5,
    info: "Smelts silver ore into metal ingots for trade and decoration.",
    build: { stone: 8, clay: 4 },
    consume: { silverOre: 5, charcoal: 3 },
    produce: { silverIngot: 4 }
  },
  goldSmelter: {
    age: 5,
    info: "Smelts gold ore into metal ingots for trade and decoration.",
    build: { stone: 8, clay: 4 },
    consume: { goldOre: 5, charcoal: 3 },
    produce: { goldIngot: 4 }
  },
  leadSmelter: {
    age: 5,
    info: "Smelts tin ore into metal ingots for tools and construction.",
    build: { stone: 8, clay: 4 },
    consume: {leadOre: 5, charcoal: 3 },
    produce: { leadIngot: 4 }
  },
  primitiveSilverJeweler: {
    age: 5,
    info: "Crafts simple decorations from soft metals and rough gems.",
    build: { stone: 8, clay: 4 },
    consume: { silverIngot: 5, quartz: 2, charcoal: 3 },
    produce: { silverDecor: 3 }
  },
  primitiveGoldJeweler: {
    age: 5,
    info: "Crafts simple decorations from soft metals and rough gems.",
    build: { stone: 8, clay: 4 },
    consume: { goldIngot: 5, quartz: 2, charcoal: 3 },
    produce: { goldDecor: 3 }
  },
  birdRelocation: {
    age: 5,
    info: "Transports and releases captured birds to new habitats.",
    build: { wood: 6, wagon: 1 },
    consume: { bird: 8, seed: 2 },
    produce: { faith: 2 }
  },
  shinyShrine: {
    age: 5,
    info: "make offerings of shiny stuf and inscense.",
    build: { wood: 6, stone: 2, brick: 5 },
    consume: { silverDecor: 1, goldDecor: 1, herb: 2 },
    produce: { faith: 3 }
  },
  sailLoft: {
    age: 5,
    info: "Produces sails for ships from linen fabric.",
    build: { wood: 6, stone: 5 },
    consume: { cloth: 4 },
    produce: { sail: 1 }
  },
  limeMill: {
    age: 5,
    info: "Grinds quicklime into a fine powder for construction and industrial use.",
    build: { lumber: 6, brick: 10, stone: 4 },
    consume: { quicklime: 8, water: 2 },
    produce: { limePowder: 6, limeMortar: 2 }
  },
  glassBlower: {
    age: 5,
    info: "Crafts glass products like windows, bottles, lenses etc.",
    build: { clay: 12, brick: 8, toolCopper: 2 },
    consume: { sand: 6, charcoal: 2 },
    produce: { glass: 4 }
  },
  greenHouse: {
    age: 5,
    info: "rootVegetables are grown.",
    build: { copperIngot: 3, wood: 2, glass: 4 },
    consume: { toolCopper: 2, water: 18 },
    produce: { herb: 8, berry: 7, rootVegetable: 8, seed: 6 }
  },
  tabletKiln: {
    age: 5,
    info: "prepare and fire simple clay tablets to keep tallies and markings. First writing tools",
    build: { toolCopper: 1, brick: 4, clay: 2 },
    consume: { clay: 4 },
    produce: { tablet: 1 },
  },
  papyrusField: {
    age: 5,
    node: "soil",
    build: { wood: 3, plantFibre: 2 },
    consume: { water: 5, plantFibre: 2, toolCopper: 1 },
    produce: { papyrus: 2 }
  },
  papyrusPress: {
    age: 5,
    build: { brick: 5, stone: 2 },
    consume: { water: 5, stone: 1, papyrus: 2, toolCopper: 1 },
    produce: { papyrusSheet: 2 }
  },
//  beanCounters: {
//    age: 5,
//    info: "someone counting the grains and beans. logistics building.",
//    build: { brick: 5, plantFibre: 2 },
//    consume: { tablet: 1 },
//    produce: { tempLogisticsLaborPoints: 30 }
//  },
  // Age 6 bronze age time
  bronzeSmelter: {
    age: 6,
    info: "Smelts copper and tin into bronze ingots for tools and construction.",
    build: { brick: 8, clay: 4 },
    consume: { copperIngot: 4, tinIngot: 1, charcoal: 3 },
    produce: { bronzeIngot: 4 }
  },
  brassSmelter: {
    age: 6,
    info: "Smelts copper and zinc into brass ingots for tools and construction.",
    build: { brick: 8, clay: 4 },
    consume: { copperIngot: 3, zincIngot: 2, charcoal: 3 },
    produce: { brassIngot: 4 }
  },
  pewterSmelter: {
    age: 6,
    info: "Smelts copper and tin into pewter ingots for tools and construction.",
    build: { brick: 8, clay: 4 },
    consume: { copperIngot: 1, tinIngot: 3, leadIngot: 1, charcoal: 3 },
    produce: { pewterIngot: 4 }
  },
  electrumSmelter: {
    age: 6,
    info: "Smelts copper and tin into bronze ingots for tools and construction.",
    build: { brick: 8, clay: 4 },
    consume: { electrumOre: 5, charcoal: 3 },
    produce: { electrumIngot: 4 }
  },
  copperRoofer: {
    age: 6,
    build: { brick: 8, clay: 4 },
    consume: { toolCopper: 1, pottery: 2, copperIngot: 1 },
    produce: { shingle: 4 }
  },
  bronzeSmith: {
    age: 6,
    info: "Casts bronze tools, weapons and items by alloying copper and tin.",
    build: { lumber: 6, brick: 8, shingle: 3 },
    consume: { bronzeIngot: 3, charcoal: 3 },
    produce: { toolBronze: 2, bronzeDecor: 2 }
  },
  whiteSmith: {
    age: 6,
    info: "hammers tin and pewter into bows, plates and cutlery.",
    build: { lumber: 6, brick: 8, shingle: 3 },
    consume: { pewterIngot: 3, tinIngot: 1, charcoal: 2 },
    produce: { tableware: 2, pewterDecor: 2 }
  },
//  primitiveMint: {
//    age: 6,
//    info: "Casts the first coinage to help regulate trade.",
//    build: { wood: 6, stone: 8, leadIngot: 3, toolBronze: 3 },
//    consume: { electrumIngot: 3, charcoal: 3 },
//    produce: { tempLogisticsLaborPoints: 30 }
//  },

  windmill: {
    age: 6,
    info: "Harnesses wind power to mill grains.",
    build: { lumber: 4, brick: 6, rope: 3, sail: 4 },
    consume: { wheat: 12 },
    produce: { flour: 11 }
  },
  //age 7: late bronze age

  goldEnricher: {
    age: 7,
    info: "Casts the first coinage to help regulate trade.",
    build: { wood: 6, stone: 8, shingle: 3, toolBronze: 3 },
    consume: { electrumIngot: 3, salt: 3, charcoal: 1, ironOre: 1, sulfur: 1 },
    produce: { goldIngot: 1, silverIngot: 1, silverChloride: 1 }
  },
  // Mint: {
  //   age: 7,
  //   info: "Casts various coinage with faces on them, to help regulate trade.",
  //   build: { wood: 6, stone: 8, leadIngot: 3, toolBronze: 3 },
  //   consume: { electrumIngot: 1, silverIngot: 1, goldIngot: 1, copperIngot: 1, charcoal: 3 },
  //   produce: { tempLogisticsLaborPoints: 50 }
  // },
  paintedPotteryKiln: {
    age: 7,
    info: "Uses paints and pigments to make beautiful works of art.",
    build: { brick: 3, lumber: 2, lumber: 2, toolBronze: 1 },
    consume: { clay: 12, charcoal: 3, silverChloride: 1, leadIngot: 1, bronzeDecor: 1 },
    produce: { pottery: 20, faith: 1 }
  },
  leadedGlassBlower: {
    age: 7,
    info: "Crafts reinforced glass products like windows, bottles, lenses etc.",
    build: { clay: 12, brick: 8, toolBronze: 2 },
    consume: {sand: 8, charcoal: 3, leadIngot: 1 },
    produce: { glass: 10 }
  },
  //age 8: advent of the iron age
  //note: clockmaker and paper chain could be waaaaaaay later tbh. 

  clockmaker: {
    age: 8,
    info: "Manufactures precise timekeeping devices using intricate machinery.",
    build: { lumber: 8, brick: 10, shingle: 6, glass: 1 },
    consume: { brassIngot: 3, glass: 2 },
    produce: { clock: 1 }
  },
  pulpMill: {
    age: 8,
    info: "Converts wood into pulp for papermaking.",
    build: { lumber: 6, stone: 8, copperIngot: 2 },
    consume: { wood: 5, water: 8, lye: 2 },
    produce: { pulp: 6 }
  },
  paperMill: {
    age: 8,
    info: "Produces paper sheets from pulp slurry.",
    build: { lumber: 10, stone: 12, copperIngot: 4 },
    consume: { pulp: 8, water: 6, limestone: 2 },
    produce: { paper: 5 }
  },
  ironMine: {
    age: 8,
    info: "Mines iron ore deposits using iron tools.",
    node: "ironDeposit",
    build: { lumber: 8, stone: 6, toolBronze: 1 },
    consume: { toolBronze: 1, candle: 1 },
    produce: { ironOre: 4 }
  },
  ironSmelter: {
    age: 8,
    info: "Smelts iron ore into metal ingots using high heat.",
    build: { stone: 12, clay: 6, toolBronze: 1, shingle: 2 },
    consume: { ironOre: 6, charcoal: 4 },
    produce: { ironIngot: 5 }
  },
  shipWright: {
    age: 8,
    info: "Carpenters build ships.",
    build: { lumber: 6, stone: 5, copperIngot: 8, tinIngot: 8, ironIngot: 8 },
    consume: { copperIngot: 8, tinIngot: 8, ironIngot: 8, glass: 3, lumber: 24, sail: 2 },
    produce: { ship: 1 }
  },
}

function countBuildingsByAge() {
  const ageCount = {};
  var ageTotal = 0;
  for (const buildingName in buildings) {
    const age = buildings[buildingName].age ?? -1;
    ageCount[age] ??= 0;
    ageCount[age]++;
    ageTotal++;
  }
  for (const age in ageCount) {
    console.log(`Age ${age}: ${ageCount[age]} building(s)`);
  }
  console.log(`${ageTotal} total building(s)`);
}

function resourcesSanityCheck() {
  const consumptions = {};
  const productions = {};
  const builds = {};

  for (const buildingName in buildings) {
    if (!addResources(buildings[buildingName].consume, consumptions)) { console.warn(`${buildingName} has no consume!`) }
    if (!addResources(buildings[buildingName].produce, productions)) { console.warn(`${buildingName} has no produce!`) }
    if (!addResources(buildings[buildingName].build, builds)) { console.warn(`${buildingName} has no build!`) }
  }

  for (const resourceName in consumptions) {
    if (productions[resourceName]) { continue; }
    console.error(`${resourceName} is consumed, but not produced!`);
  }
  for (const resourceName in productions) {
    if (consumptions[resourceName] || builds[resourceName]) { continue; }
    console.warn(`${resourceName} is produced, but not used!`);
  }
  for (const resourceName in builds) {
    if (productions[resourceName]) { continue; }
    console.error(`${resourceName} is a build material, but not produced!`);
  }
}

function addResources(resources, list) {
  if (!resources) { return false; }
  for (const resourceName in resources) {
    list[resourceName] = true;
  }
  return true;
}

countBuildingsByAge();
resourcesSanityCheck();
console.log("*Lib/buildings loaded");

export { buildings, buildingPhases, buildingPhasesNew };
export default buildings;