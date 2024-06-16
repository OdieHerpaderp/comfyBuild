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
  getDisplayString: function(value) {
    switch (value){
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
    produce: { population: 2 }
  },
  boneTent: {
    age: 1,
    category: "housing",
    info: "A simple tent using bone for structure, and hide as cover.",
    build: { plantFibre: 2, bone: 2, hide: 2, toolPrimitive: 1},
    consume: { water: 2, berry: 3, meat: 3, hide: 1 },
    produce: { population: 11 }
  },
  hut: {
    age: 2,
    category: "housing",
    info: "Basic shelter made of wood, plant fibre and mud.",
    build: { wood: 3, plantFibre: 2, mud: 2, toolPrimitive: 2 },
    consume: { water: 3, meat: 4, fish: 3, hide: 2 },
    produce: { population: 13 }
  },
  mudBrickHouse: {
    age: 2,
    category: "housing",
    info: "A simple mudbrick dwelling common in ancient Egypt.",
    build: { stone: 3, mudBricks: 4, toolPrimitive: 2 },
    consume: { water: 3, meat: 5, fish: 4, rootVegetable: 2, hide: 2 },
    produce: { population: 15 }
  },
  burdei: {
    age: 2,
    category: "housing",
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    build: { stone: 2, clay: 2, mud: 2, toolPrimitive: 3 },
    consume: { water: 3, meat: 4, salad: 4, rootVegetable: 3, hide: 2 },
    produce: { population: 17 }
  },
  bungalow: {
    age: 3,
    category: "housing",
    info: "Sturdy single floor building built from wood logs and stone block flooring.",
    build: { stoneBlock: 6, wood: 9, toolPrimitive: 3 },
    consume: { water: 4, meat: 6, bread: 5, salad: 5, hide: 2 },
    produce: { population: 19 }
  },
  clayBrickHouse: {
    age: 4,
    category: "housing",
    info: "Sturdy single floor building built from clay bricks and stone block flooring.",
    build: { stoneBlock: 6, clayBricks: 6, wood: 1, toolNeolithic: 2 },
    consume: { water: 5, meat: 7, bread: 7, salad: 6, alcohol: 2, clothing: 1 },
    produce: { population: 22 }
  },
  ziggurat: {
    age: 5,
    info: "A monumental stepped mudbrick temple-tower from ancient Mesopotamia.",
    build: { mudbrick: 12, wood: 8, stone: 4, toolNeolithic: 2 },
    consume: { water: 6, meat: 8, bread: 8, salad: 7, alcohol: 2, clothing: 1 },
    produce: { population: 25 }
  },
  // Age 0
  gatherersCamp: {
    age: 0,
    category: "gatheringOrganics",
    build: { wood: 3 },
    consume: {},
    produce: { plantFibre: 2, berry: 2 }
  },
  caveDiggers: {
    age: 0,
    category: "gatheringMinerals",
    info: "Rocks are hauled out of a cave.",
    node: "rockDeposit",
    build: { wood: 2 },
    consume: {},
    produce: { stone: 4, flint: 1 }
  },
  flintKnapper: {
    age: 0,
    category: "processingMinerals",
    info: "Workers shape flint into primitive tools.",
    build: { stone: 3, plantFibre: 2 },
    consume: { stone: 4, plantFibre: 2 },
    produce: { toolPrimitive: 2, club: 2, flint:1 }
  },
  forestry: {
    age: 0,
    category: "gatheringOrganics",
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { stone: 2 },
    consume: {},
    produce: { wood: 4, plantFibre: 1, }
  },
  woodWorker: {
    age: 0,
    info: "Crafts primitive wooden tools.",
    build: { wood: 3, stone: 3 },
    consume: { wood: 4, plantFibre: 2 },
    produce: { toolPrimitive: 2, club: 2, bucket: 1 }
  },
  huntersCamp: {
    age: 0,
    category: "gatheringOrganics",
    info: "Wild game is hunted using clubs and skinned.",
    node: "wildGame",
    build: { wood: 2, stone: 2 },
    consume: { club: 1, toolPrimitive: 1 },
    produce: { meatRaw: 3, hide: 2, bone: 1 }
  },
  waterSource: {
    age: 0,
    category: "gatheringOrganics",
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { plantFibre: 2 },
    consume: { wood: 1, plantFibre: 1 },
    produce: { water: 4 }
  },
  boneCarver: {
    age: 0,
    info: "Crafts primitive tools from animal bones and antlers.",
    build: { wood: 3, hide: 2 },
    consume: { bone: 3, plantFibre: 1 },
    produce: { toolPrimitive: 2, club: 1 }
  },
  hoard: {
    age: 0,
    category: "logistics",
    info: "Provides ample storage for resources.",
    build: { wood: 2, stone: 2, hide: 1 },
    consume: { },
    produce: { }
  },
  // Age 1
  campfire: {
    age: 1,
    build: { plantFibre: 2, wood: 3, stone: 3 },
    consume: { plantFibre: 1, wood: 1, meatRaw: 3 },
    produce: { meat: 3, woodAsh: 1 }
  },
  charcoalBurner: {
    age: 1,
    info: "Produces charcoal by smoldering wood in a low oxygen environment.",
    build: { stone: 4, wood: 2 },
    consume: { wood: 2, plantFibre: 2 },
    produce: { charcoal: 2, woodAsh: 1 }
  },
  quarry: {
    age: 1,
    category: "gatheringMinerals",
    info: "Primitive tools are used to collect stone.",
    node: "rockDeposit",
    build: { wood: 2, stone: 1 },
    consume: { toolPrimitive: 2 },
    produce: { stone: 7 }
  },
  loggingCamp: {
    age: 1,
    info: "Loggers cut trees for wood using primitive tools",
    node: "forest",
    build: { stone: 4, wood: 2 },
    consume: { toolPrimitive: 2 },
    produce: { wood: 7 }
  },
  rootDiggers: {
    age: 1,
    info: "Digs up edible roots, tubers and bulbs from the ground.",
    build: { stone: 1, wood: 1, plantFibre: 1 },
    consume: { toolPrimitive: 1 },
    produce: { rootVegetable: 2, plantFibre: 1 }
  },
  ropeMaker: {
    age: 1,
    info: "Twists and plies plant fibres into rope and cordage.",
    build: { wood: 2, stone: 1 },
    consume: { plantFibre: 5 },
    produce: { rope: 3, string: 1 }
  },
  basketWeaver: {
    age: 1,
    info: "Weaves plant fibres into baskets for carrying and storing goods.",
    build: { wood: 3, stone: 3, plantFibre: 2 },
    consume: { plantFibre: 5 },
    produce: { baskets: 1 }
  },
  harpoonCraftsfolk: {
    age: 1,
    info: "Crafts barbed poles that used for fishing and security.",
    build: { wood: 3, stone: 3 },
    consume: { wood: 2, flint: 2, plantFibre: 2 },
    produce: { harpoon: 2 }
  },
  fishery: {
    age: 1,
    info: "Fish is caught using primitive harpoons.",
    node: "freshWater",
    build: { plantFibre: 3, wood: 3 },
    consume: { harpoon: 1 },
    produce: { fishRaw: 2 }
  },
  // Age 2
  stove: {
    age: 2,
    build: { plantFibre: 2, wood: 3, stone: 3, toolPrimitive: 1 },
    consume: { charcoal: 1, fishRaw: 3 },
    produce: { fish: 3, woodAsh: 1 }
  },
  clayPit: {
    age: 2,
    node: "soil",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolPrimitive: 1 },
    produce: { clay: 3 }
  },
  mudPit: {
    age: 2,
    node: "soil",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolPrimitive: 1 },
    produce: { mud: 3 }
  },
  sandPit: {
    age: 2,
    node: "soil",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolPrimitive: 1 },
    produce: { sand: 3 }
  },
  potteryKiln: {
    age: 2,
    info: "Allows firing of clay pots, buckets and tools.",
    build: { clay: 3, stone: 2, wood: 2 },
    consume: { clay: 8, charcoal: 3 },
    produce: { pottery: 1, toolPrimitive: 2, bucket: 2, woodAsh: 1 }
  },
  mudBrickMaker: {
    age: 2,
    info: "Produces mudbricks from a mixture of mud, water and fibrous materials.",
    build: { wood: 6, stone: 4, clay: 1, mud: 1 },
    consume: { mud: 8, water: 4, plantFibre: 2 },
    produce: { mudbrick: 6 }
  },
  limestoneQuarry: {
    age: 2,
    info: "Mines limestone deposits from quarries.",
    node: "stoneDeposit",
    build: { wood: 4, stone: 6, toolPrimitive: 1 },
    consume: { toolPrimitive: 2 },
    produce: { limestoneRaw: 3 }
  },
  well: {
    age: 2,
    node: "freshWater",
    build: { stone: 4, toolPrimitive: 1, rope:1 },
    consume: { bucket: 1, toolPrimitive: 1 },
    produce: { water: 7 }
  },
  militiaCamp: {
    age: 2,
    info: "People are given clubs and hide pelts to provide safety",
    build: { wood: 3, stone: 3 },
    consume: { club: 2, hide: 2 },
    produce: { militia: 2 }
  },
  wheatField: {
    age: 2,
    node: "soil",
    build: { wood: 3, plantFibre: 2 },
    consume: { water: 4, toolPrimitive: 2 },
    produce: { wheat: 3 }
  },
  flourMill: {
    age: 2,
    info: "Harnesses manual labour to mill grains.",
    build: { wood: 5, stone: 9, toolPrimitive: 1 },
    consume: { wheat: 2, stone: 1, toolPrimitive: 2 },
    produce: { flour: 3 }
  },
  saladBar: {
    age: 2,
    info: "Cooks salads from various vegetables",
    build: { wood: 5, stone: 9, toolPrimitive: 1 },
    consume: { berry: 2, rootVegetable: 2 },
    produce: { salad: 1 }
  },
  stoneCutter: {
    age: 2,
    build: { stone: 3, wood: 3 },
    consume: { stone: 4, toolPrimitive: 1 },
    produce: { stoneBlock: 1 }
  },
  // Age 3
  quartzMine: {
    age: 3,
    info: "Mines Quartz using primitive tools.",
    node: "quartzDeposit",
    build: { stone: 3, wood: 3 },
    consume: { toolPrimitive: 2 },
    produce: { quartz: 3, stone: 1, flint: 1 }
  },
  quartzKnapper: {
    age: 3,
    category: "processingMinerals",
    info: "Workers shape quartz into Neolithic tools.",
    build: { stone: 3, plantFibre: 2, quartz: 1, toolPrimitive: 1 },
    consume: { quartz: 4, stone: 3, flint: 2, plantFibre: 1 },
    produce: { toolNeolithic: 1 }
  },
  bakery: {
    age: 3,
    info: "Bakes bread from flour.",
    build: { wood: 5, stone: 9, toolPrimitive: 1 },
    consume: { flour: 3, charcoal: 1 },
    produce: { bread: 2 }
  },
  featherProcessing: {
    age: 3,
    info: "Prepares feathers from birds for use as arrow fletching.",
    build: { wood: 3, stone: 2 },
    consume: { feather: 3 },
    produce: { arrowFletching: 3 }
  },
  flaxFarm: {
    age: 3,
    info: "Grows flax plants for harvesting their fibers to produce linen.",
    node: "soil",
    build: { wood: 3, mud: 1 },
    consume: { water: 4, toolNeolithic: 1 },
    produce: { flaxStraw: 4 }
  },
  flaxRettingPond: {
    age: 3,
    info: "A water-filled pond used for retting (soaking) flax straw to separate the fibers.",
    build: { wood: 4, stone: 6 },
    consume: { flaxStraw: 4, water: 4 },
    produce: { flaxRetted: 4 }
  },
  flaxDryingBarn: {
    age: 3,
    info: "A large barn for drying and storing retted flax before further processing.",
    build: { wood: 8, stone: 4, rope: 2 },
    consume: { flaxRetted: 4, charcoal: 2 },
    produce: { flaxDried: 4 }
  },
  flaxBreakingMill: {
    age: 3,
    info: "A mill with specialized equipment for breaking and separating flax fibers.",
    build: { wood: 6, stone: 8, toolNeolithic: 1, rope: 1 },
    consume: { flaxDried: 4, toolNeolithic: 1 },
    produce: { flaxBroken: 4 }
  },
  flaxScutchingBarn: {
    age: 3,  
    info: "A barn for scutching (beating) flax to remove woody cores from fibers.",
    build: { wood: 7, stone: 5, toolNeolithic: 1 },
    consume: { flaxBroken: 4, toolNeolithic: 1 },
    produce: { flax: 4 }
  },
  linenMill: {
    age: 3,
    info: "Processes flax fibers into linen fabric and thread using hard labour.",
    build: { wood: 2, stone: 3 },
    consume: { flax: 3, toolNeolithic: 1 },
    produce: { linen: 2 }
  },
  linenTailor: {
    age: 3,
    info: "Produces clothing from linen fabric.",
    build: { wood: 4, stone: 2 },
    consume: { linen: 5, toolNeolithic: 1 },
    produce: { clothing: 2 }
  },
  hunterLodge: {
    age: 3,
    info: "Skilled hunters provide fresh game meat.",
    node: "wildGame",
    build: { wood: 5, plantFibre: 3 },
    consume: { toolNeolithic: 1, bow: 1 },
    produce: { meatRaw: 5 }
  },
  brickery: {
    age: 3,
    build: { clay: 3, stone: 3, wood: 3 },
    consume: { clay: 3, wood: 1 },
    produce: { clayBricks: 2 }
  },
  birdSeedFarm: {
    age: 3,
    info: "Grows crops like millet, sunflower seeds to produce bird seed.",
    build: { wood: 4, stone: 2 },
    consume: { water: 5, toolNeolithic: 2 },
    produce: { birdSeed: 6 }
  },
  baitPreparation: {
    age: 3,
    info: "Mixes bird seed with grains and berries into an attractive bait.",
    build: { wood: 3, pottery: 1 },
    consume: { birdSeed: 4, wheat: 2, berry: 1 },
    produce: { birdBait: 5 }
  },
  birdTrapper: {
    age: 3,
    info: "Lays traps baited with seed to capture birds alive.",
    node: "forest",
    build: { wood: 4, birdTrap: 2 },
    consume: { birdBait: 3 },
    produce: { bird: 5 }
  },
  birdButcher: {
    age: 3,
    info: "Butchers birds for meat and feathers.",
    build: { wood: 4, stone: 2 },
    consume: { bird: 2 },
    produce: { poultryRaw: 5, feather: 4, tallow: 2 }
  },
  chandler: {
    age: 3,
    info: "makes candles",
    build: { wood: 6, pottery: 1 },
    consume: { tallow: 3, plantFibre: 1 },
    produce: { candle: 3 }
  },
  cowPasture: {
    age: 3,
    info: "Raises cows for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { water: 2, wheat: 6, toolNeolithic: 1 },
    produce: { meatRaw: 2, milk: 2, hide: 1 }
  },
  chickenCoop: {
    age: 3,
    info: "Raises chickens for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { water: 2, wheat: 6, toolNeolithic: 1 },
    produce: { meatRaw: 2, eggs: 2, feather: 2 }
  },
  horsePasture: {
    age: 3,
    info: "Raises horses for various applications",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { water: 2, wheat: 6, toolNeolithic: 1 },
    produce: { horse: 2, }
  },
  sheepPasture: {
    age: 3,
    info: "Raises sheep for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { water: 2, wheat: 6, toolNeolithic: 1 },
    produce: { meatRaw: 2, wool: 2 }
  },
  weavery: {
    age: 3,
    info: "Weaves plant fibers and wool into textiles.",
    build: { wood: 5, stone: 3 },
    consume: { plantFibers: 4, wool: 3, toolNeolithic: 1 },
    produce: { textiles: 2 }
  },
  // Age 4
  copperMine: {
    age: 4,
    info: "Mines copper ore deposits using primitive and neolithic tools.",
    node: "copperDeposit",
    build: { wood: 5, stone: 4, toolNeolithic: 1 },
    consume: { toolPrimitive: 1, toolNeolithic: 1 },
    produce: { copperOre: 4 }
  },
  copperSmelter: {
    age: 4,
    info: "Smelts copper ore into metal ingots for tools and construction.",
    build: { stone: 8, clay: 4 },
    consume: { copperOre: 5, charcoal: 3 },
    produce: { copperIngot: 4 }
  },
  tinMine: {
    age: 4,
    node: "tinDeposit",
    info: "Extracts tin ore from underground deposits.",
    build: { wood: 5, stone: 4, toolNeolithic: 1 },
    consume: { toolPrimitive: 1, toolNeolithic: 1 },
    produce: { tinOre: 4 }
  },
  tinSmelter: {
    age: 4,
    info: "Smelts tin ore into metal ingots for tools and construction.",
    build: { stone: 8, clay: 4 },
    consume: { tinOre: 5, charcoal: 3 },
    produce: { tinIngot: 4 }
  },
  copperSmith: {
    age: 4,
    info: "Forges copper ingots into tools, weapons, jewelry and decorative items.",
    build: { wood: 4, stone: 6, copperIngot: 1 },
    consume: { copperIngot: 2, charcoal: 1 },
    produce: { toolNeolithic: 6 }
  },
  tinSmith: {
    age: 4,
    info: "Forges tin ingots into tools, weapons, jewelry and decorative items.",
    build: { wood: 4, stone: 6, tinIngot: 1 },
    consume: { tinIngot: 2, charcoal: 1 },
    produce: { toolNeolithic: 6 }
  },
  arrowCrafter: {
    age: 4,
    info: "Crafts finished arrows by fletching and stringing arrow shafts.",
    build: { wood: 4, stone: 3 },
    consume: { lumber: 2, arrowFletching: 3, string: 2 },
    produce: { bow: 2 }
  },
  mortuary: {
    age: 4,
    info: "Uses linen fabric for shrouds and wrappings for the deceased.",
    build: { wood: 3, stone: 5 },
    consume: { linen: 2 },
    produce: { faith: 1 }
  },
  tannery: {
    age: 4,
    info: "Processes raw hides into leather for clothing, shelters, etc.",
    build: { wood: 8, stone: 4 },
    consume: { hide: 6, plantFibre: 2 },
    produce: { leather: 3 }
  },
  sawmill: {
    age: 4,
    info: "Processes raw logs into lumber for carpentry, construction and advanced woodworking.",
    build: { wood: 3, stone: 2, copperIngot: 2 },
    consume: { wood: 7 },
    produce: { lumber: 3 }
  },
  windmill: {
    age: 4,
    info: "Harnesses wind power to mill grains.",
    build: { wood: 8, stone: 6, rope: 3 },
    consume: { wheat: 7 },
    produce: { flour: 6 }
  },
  limestoneKiln: {
    age: 4,
    info: "Calcines raw limestone into quicklime by heating.",
    build: { stone: 8, clay: 6, charcoal: 4 },
    consume: { limestoneRaw: 8, charcoal: 6 },
    produce: { quicklime: 6 }
  },
  lyeVats: {
    age: 4,
    info: "Leaches lye from wood ash using an alkaline solution.",
    build: { wood: 4, stone: 6, pottery: 2 },
    consume: { woodAsh: 6, water: 4, limestone: 2 },
    produce: { lye: 4 }
  },
  rainCollector: {
    age: 4,
    category: "producingWater",
    info: "A large funnel and storage system that collects rainwater.",
    build: { wood: 4, copperIngot: 1, stone: 3 },
    consume: {  },
    produce: { water: 1 }
  },
  hopsField: {
    age: 4,
    node: "soil",
    build: { wood: 3, plantFibre: 2 },
    consume: { water: 4, toolNeolithic: 2 },
    produce: { hops: 3 }
  },
  distillery: {
    age: 4,
    build: { wood: 3, copperIngot: 2, plantFibre: 2 },
    consume: { water: 4, hops: 3, toolNeolithic: 1, charcoal: 2 },
    produce: { alcohol: 1, woodAsh: 1 }
  },
  // Age 5
  bronzeSmith: {
    age: 5,
    info: "Casts bronze tools, weapons and items by alloying copper and tin.",
    build: { lumber: 6, stone: 8, copperIngot: 3, tinIngot: 3 },
    consume: { copperIngot: 4, tinIngot: 2, charcoal: 3 },
    produce: { toolNeolithic: 5, bronzeDecor: 2 }
  },
  birdRelocation: {
    age: 5,
    info: "Transports and releases captured birds to new habitats.",
    build: { wood: 6, wagon: 1 },
    consume: { bird: 8, birdSeed: 2 },
    produce: { faith: 2 }
  },
  sailLoft: {
    age: 5,
    info: "Produces sails for ships from linen fabric.",
    build: { lumber: 6, stone: 5 },
    consume: { linen: 4 },
    produce: { sail: 1 }
  },
  limeMill: {
    age: 5,
    info: "Grinds quicklime into a fine powder for construction and industrial use.",
    build: { lumber: 6, stone: 10, copperIngot: 2 },
    consume: { quicklime: 8, water: 2 },
    produce: { limePowder: 6, limeMortar: 2 }
  },
  glassBlower: {
    age: 5,
    info: "Crafts glass products like windows, bottles, lenses etc.",
    build: { stone: 12, clay: 8, charcoal: 5 },
    consume: { sand: 6, charcoal: 2 },
    produce: { glass: 4 }
  },
  greenHouse: {
    age: 5,
    info: "rootVegetables are grown.",
    build: { copperIngot: 3, lumber: 2, glass: 4 },
    consume: { toolNeolithic: 2, water: 8, plantFibre:2, charcoal:2 },
    produce: { rootVegetable: 8 }
  },
  papyrusField: {
    age: 5,
    node: "soil",
    build: { wood: 3, plantFibre: 2 },
    consume: { water: 5, plantFibre: 2, toolNeolithic: 1 },
    produce: { papyrus: 2 }
  },
  papyrusPress: {
    age: 5,
    node: "soil",
    build: { stone: 5, plantFibre: 2 },
    consume: { water: 5, stone: 1, papyrus: 2, toolNeolithic: 1 },
    produce: { papyrusSheet: 2 }
  },
  marketplace: {
    age: 5,
    category: "logistics",
    info: "A central location for trading goods and resources.",
    build: { wood: 8, stone: 6, bronzeTools: 4 },
    consume: { },
    produce: { }
  },
  // Age 6
  ironMine: {
    age: 6,
    info: "Mines iron ore deposits using iron tools.",
    node: "ironDeposit",
    build: { lumber: 4, stone: 8, toolNeolithic: 2 },
    consume: { toolNeolithic: 1 },
    produce: { ironOre: 3 }
  },
  silverMine: {
    age: 6,
    info: "Mines silver ore from rich veins.",
    build: { lumber: 4, stone: 8, toolNeolithic: 2 },
    consume: { toolNeolithic: 3 },
    produce: { silverOre: 8 }
  },
  ironSmelter: {
    age: 6,
    info: "Smelts iron ore into metal ingots using high heat.",
    build: { stone: 12, clay: 6, copperIngot: 2 },
    consume: { ironOre: 6, charcoal: 4 },
    produce: { ironIngot: 5 }
  },
  clockmaker: {
    age: 7,
    info: "Manufactures precise timekeeping devices using intricate machinery.",
    build: { wood: 8, stone: 10, copperIngot: 6, glass: 1 },
    consume: { ironIngot: 3, glass: 2 },
    produce: { clock: 1 }
  },
  pulpMill: {
    age: 7,
    info: "Converts wood into pulp for papermaking.",
    build: { lumber: 6, stone: 8, copperIngot: 2 },
    consume: { wood: 5, water: 8, lye: 2 },
    produce: { pulp: 6 }
  },
  paperMill: {
    age: 7,
    info: "Produces paper sheets from pulp slurry.",
    build: { lumber: 10, stone: 12, copperIngot: 4 },
    consume: { pulp: 8, water: 6, limestone: 2 },
    produce: { paper: 5 }
  },
  shipWright: {
    age: 7,
    info: "Carpenters build ships.",
    build: { lumber: 6, stone: 5 },
    consume: { copperIngot: 8, tinIngot: 8, ironIngot: 8, glass: 3, lumber: 24, sail: 2 },
    produce: { ship: 1 }
  },
}

function countBuildingsByAge() {
  const ageCount = {};
  for (const buildingName in buildings) {
    const age = buildings[buildingName].age ?? -1;
    ageCount[age] ??= 0;
    ageCount[age]++;
  }
  for (const age in ageCount) {
    console.log(`Age ${age}: ${ageCount[age]} building(s)`);
  }
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