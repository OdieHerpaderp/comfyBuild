var buildings = {
  headquarters: {
    age: -1,
    category: "wonderNatural",
    build: { },
    consume: { },
    produce: { }
  },
  // Housing
  dolmen: {
    age: 0,
    category: "housing",
    info: "Several slabs of stone provide ample shelter.",
    build: { population: 1, stone: 1 },
    consume: { water: 1, berry: 1 },
    produce: { population: 2 }
  },
  boneTent: {
    age: 1,
    category: "housing",
    info: "A simple tent using bone for structure, and hide as cover.",
    build: { population: 2, plantFibre: 2, bone: 2, hide: 2, toolPrimitive: 1 },
    consume: { water:2, berry:1, meat: 2 },
    produce: { population: 6 }
  },
  hut: {
    age: 2,
    category: "housing",
    info: "Basic shelter made of wood, plant fibre and mud.",
    build: { population: 2, wood: 3, plantFibre: 2, mud: 2, toolPrimitive: 1 },
    consume: { water:2, meat: 3, rootVegetable: 2 },
    produce: { population: 9 }
  },
  mudBrickHouse: {
    age: 2,
    category: "housing",
    info: "Single floor building built from mud bricks and stone flooring.",
    build: { population: 3, stone: 3, mudBricks: 4, toolPrimitive: 1 },
    consume: { water:3, meat: 3, wheat: 2, rootVegetable: 2 },
    produce: { population: 11 }
  },
  burdei: {
    age: 2,
    category: "housing",
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    build: { population: 3, stone: 2, clay: 2, mud: 2, toolPrimitive: 2 },
    consume: { water:3, meat: 9, wheat: 4, rootVegetable: 4 },
    produce: { population: 14 }
  },
  bungalow: {
    age: 3,
    category: "housing",
    info: "Sturdy single floor building built from wood logs and stone block flooring.",
    build: { population: 3, stoneBlock: 6, wood: 9, toolPrimitive: 2 },
    consume: { water:4, meat: 9, bread: 4 },
    produce: { population: 17 }
  },
  clayBrickHouse: {
    age: 4,
    category: "housing",
    info: "Sturdy single floor building built from clay bricks and stone block flooring.",
    build: { population: 3, stoneBlock: 6, clayBricks: 6, wood: 1 },
    consume: { water:5, meat: 10, bread: 5 },
    produce: { population: 20 }
  },
  // Age 0
  gatherersCamp: {
    age: 0,
    category: "gatheringOrganics",
    build: { population: 2, wood: 3 },
    consume: { population: 2 },
    produce: { plantFibre: 2, berry: 4 }
  },
  caveDiggers: {
    age: 0, 
    category: "gatheringMinerals",
    info: "Rocks are hauled out of a cave.",
    node: "rockDeposit",
    build: { population: 1, wood: 2 },
    consume: { population: 3 },
    produce: { stone: 2 }
  },
  flintKnapper: {
    age: 0,
    category: "processingMinerals",
    info: "Workers shape flint into primitive tools.",
    build: { population: 2, stone: 3, plantFibre: 2  },
    consume: { population: 2, stone: 5, plantFibre: 2 },
    produce: { toolPrimitive: 2, club: 1 }
  },
  forestry: {
    age: 0,
    category: "gatheringOrganics",
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { population: 2, stone: 2 },
    consume: { population: 3 },
    produce: { wood: 2, plantFibre: 1, }
  },
  woodWorker: {
    age: 0,
    info: "Crafts primitive wooden tools.",
    build: { population: 2, wood: 3, stone: 3 },
    consume: { population: 2, wood: 9, plantFibre: 2 },
    produce: { toolPrimitive: 1, bucket: 1, club: 1 }
  },
  huntersCamp: {
    age: 0,
    category: "gatheringOrganics",
    info: "Wild game is hunted using clubs.",
    node: "wildGame",
    build: { population: 2, wood: 3 },
    consume: { population: 3, club: 2 },
    produce: { meatRaw: 2, hide: 2, bone: 1 }
  },
  waterSource: {
    age: 0,
    category: "gatheringOrganics",
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { population: 2, plantFibre: 2 },
    consume: { population: 2 },
    produce: { water: 3 }
  },
  boneCarver: {
    age: 0,
    info: "Crafts primitive tools from animal bones and antlers.", 
    build: { population: 2, wood: 3, hide: 2 },
    consume: { population: 2, bone: 3 },
    produce: { toolPrimitive: 2, club: 1 }
  },
  // Age 1
  campfire: {
    age: 1,
    build: { population: 2, plantFibre: 2, wood: 3, stone: 3},
    consume: { population: 1, plantFibre: 1, wood: 1, meatRaw: 3},
    produce: { meat: 3 }
  },
  quarry: {
    age: 1,
    category: "gatheringMinerals",
    info: "Primitive tools are used to collect stone.",
    node: "rockDeposit",
    build: { population: 3, wood: 2, stone: 1 },
    consume: { population: 3, toolPrimitive: 3 },
    produce: { stone: 5 }
  },
  loggingCamp: {
    age: 1,
    info: "Loggers cut trees for wood using primitive tools",
    node: "forest",
    build: { population: 2, stone: 4, wood: 2 },
    consume: { population: 3, toolPrimitive: 3 },
    produce: { wood: 5 }
  },
  rootDiggers: {
    age: 1, 
    info: "Digs up edible roots, tubers and bulbs from the ground.",
    build: { population: 2, stone:1, wood:1, plantFibre:1 },
    consume: { population: 3, toolPrimitive: 2 },
    produce: { rootVegetables: 3 }
  },
  ropeMaker: {
    age: 1,
    info: "Twists and plies plant fibres into rope and cordage.",
    build: { population: 2, wood: 2, stone: 1 },
    consume: { population: 2, plantFibre: 5 },
    produce: { rope: 3, string: 1 }
  },
  basketWeaver: {
    age: 1,
    info: "Weaves plant fibres into baskets for carrying and storing goods.",
    build: { population: 2, wood: 3, stone: 3, plantFibre: 2 },
    consume: { population: 2, plantFibre: 5 },
    produce: { baskets: 1 }  
  },
  // Age 2
  clayPit: {
    age: 2,
    node: "soil",
    build: { population: 2, stone: 3, wood:3, plantFibre:3 },
    consume: { population: 2, toolPrimitive: 2 },
    produce: { clay: 3 }
  },
  mudPit: {
    age: 2,
    node: "soil",
    build: { population: 2, stone: 3, wood:3, plantFibre:3 },
    consume: { population: 2, toolPrimitive: 2 },
    produce: { mud: 3 }
  },
  sandPit: {
    age: 2,
    node: "soil",
    build: { population: 2, stone: 3, wood:3, plantFibre:3 },
    consume: { population: 2, toolPrimitive: 2 },
    produce: { sand: 3 }
  },
  charcoalBurner: {
    age: 2,
    info: "Produces charcoal by smoldering wood in a low oxygen environment.",
    build: { population: 1, stone: 4, wood: 2 },
    consume: { population: 1, wood: 2, plantFibre: 2 },
    produce: { charcoal: 2 }
  },
  potteryKiln: {
    age: 2,
    info: "Allows firing of clay pots, buckets and tools.",
    build: { population: 1, clay: 3, stone: 2, wood: 2 },
    consume: { population: 3, clay: 8, charcoal: 1 },
    produce: { pottery: 1, toolPrimitive:1, bucket:1 }
  },
  quartzMine: {
    age: 2,
    info: "Mines Quartz using primitive tools.",
    node: "stoneDeposit",
    build: { population: 1, stone: 3, wood: 3 },
    consume: { population: 1, toolPrimitive: 1 },
    produce: { quartz: 3, stone: 1 }
  },
  well: {
    age: 2,
    node: "freshWater",
    build: { population: 2, stone: 4, toolPrimitive: 1 },
    consume: { population: 2, bucket: 1 },
    produce: { water: 5 }
  },
  militiaCamp: {
    age: 2,
    info: "People are given clubs and hide pelts to provide safety",
    build: { population: 2, wood: 3, stone: 3 },
    consume: { population: 2, club: 2, hide: 2 },
    produce: { militia: 2 }
  },
  // Age 3
  featherProcessing: {
    age: 3,
    info: "Prepares feathers from birds for use as arrow fletching.", 
    build: { population: 2, wood: 3, stone: 2},
    consume: { population: 2, feather: 3 },
    produce: { arrowFletching: 3 }
  },
  flaxFarm: {
    age: 3,
    info: "Grows flax plants for harvesting their fibers to produce linen.",
    node: "soil",
    build: { population: 2, wood: 3, mud: 1 },
    consume: { population: 2, water: 3, toolPrimitive: 1 },
    produce: { flax: 2 }
  },
  linenMill: {
    age: 3,
    info: "Processes flax fibers into linen fabric and thread using hard labour.",
    build: { population: 2, wood: 2, stone: 3 },
    consume: { population: 4, flax: 3 },
    produce: { linen: 2 }
  },
  cornField: {
    age: 3,
    build: { population: 2, wood: 3, plantFibre: 2 },
    consume: { population: 2, water: 4, toolPrimitive: 2 },
    produce: { corn: 3 }
  },
  wheatField: {
    age: 3,
    build: { population: 2, wood: 3, plantFibre: 2 },
    consume: { population: 2, water: 4, toolPrimitive: 2 },
    produce: { wheat: 3 }
  },
  hopsField: {
    age: 3,
    build: { population: 2, wood: 3, plantFibre: 2 },
    consume: { population: 2, water: 4, toolPrimitive: 2 },
    produce: { hops: 3 }
  },
  reedField: {
    age: 3,
    build: { population: 2, wood: 3, plantFibre: 2 },
    consume: { population: 2, water: 4, toolPrimitive: 2 },
    produce: { reed: 3 }
  },
  hunterLodge: {
    age: 3,
    info: "Skilled hunters provide fresh game meat.",
    node: "wildGame",
    build: { population: 3, wood: 5, plantFibre: 3 },
    consume: { population: 4, toolPrimitive: 1, bow:1 },  
    produce: { meatRaw: 5 }
  },
  fishery: {
    age: 3,
    node: "freshWater",
    build: { population: 2, plantFibre: 3, wood:3 },
    consume: { population: 2, fishingRod: 1 },
    produce: { fishRaw: 1 }
  },
  brickery: {
    age: 3,
    build: { population: 2, clay: 3, stone: 3, wood: 3 },
    consume: { population: 1, clay: 3, wood:1 },
    produce: { clayBricks: 2 }
  },
  stoneCutter: {
    age: 3,
    build: { population: 2, stone: 3, wood: 3 },
    consume: { population: 1, stone: 9, wood: 3, toolPrimitive: 1 },
    produce: { stoneBlock: 2 }
  },
  copperMine: {
    age: 3,
    info: "Mines copper ore deposits using primitive tools.",
    node: "copperDeposit", 
    build: { population: 2, wood: 5, stone: 4 },
    consume: { population: 3, toolPrimitive: 2 },
    produce: { copperOre: 3 }
  },
  birdSeedFarm: {
    age: 3,
    info: "Grows crops like millet, sunflower seeds to produce bird seed.",
    build: { population: 3, wood: 4, stone: 2 },
    consume: { population: 3, water: 5, toolPrimitive: 2 },
    produce: { birdSeed: 6 }
  },
  baitPreparation: {
    age: 3,
    info: "Mixes bird seed with grains and berries into an attractive bait.",
    build: { population: 2, wood: 3, pottery: 1 },
    consume: { population: 2, birdSeed: 4, wheat: 2, berry: 1 },
    produce: { birdBait: 5 }
  },
  birdTrapper: {
    age: 3,
    info: "Lays traps baited with seed to capture birds alive.",
    node: "forest",
    build: { population: 2, wood: 4, birdTrap: 2 },
    consume: { population: 2, birdBait: 3 },
    produce: { bird: 5 }
  },
  birdButcher: {
    age: 3,
    info: "Butchers birds for meat and feathers.",
    build: { population: 2, wood: 4, stone: 2 },
    consume: { population: 1, bird: 2 },
    produce: { poultryRaw: 5, feather: 4}
  }, 
  flourMill: {
    age: 3,
    info: "Harnesses manual labour to mill grains.",
    build: { population: 3, wood: 5, stone: 9 },
    consume: { population: 5, wheat: 5 },
    produce: { flour: 4 }
  },
  bakery: {
    age: 3,
    info: "Bakes bread from flour.",
    build: { population: 3, wood: 5, stone: 9, toolPrimitive: 1 },
    consume: { population: 2, flour: 4 },
    produce: { bread: 3 }
  },
  // Age 4
  arrowCrafter: {
    age: 4,
    info: "Crafts finished arrows by fletching and stringing arrow shafts.",
    build: { population: 3, wood: 4, stone: 3 },
    consume: { population: 2, lumber: 2, arrowFletching: 3, string: 2 },
    produce: { bow: 2 }
  },
  ironMine: {
    age: 4, 
    info: "Mines iron ore deposits using iron tools.",
    node: "ironDeposit",
    build: { population: 3, wood: 8, stone: 6 },
    consume: { population: 4, toolIron: 1 },
    produce: { ironOre: 3 }  
  },
  copperSmelter: {
    age: 4,
    info: "Smelts copper ore into metal ingots for tools and construction.",
    build: { population: 2, stone: 8, clay: 4 },
    consume: { population: 3, copperOre: 5, charcoal: 3 },
    produce: { copperIngot: 4 }
  },
  coppersmith: {
    age: 4,
    info: "Forges copper ingots into tools, weapons, jewelry and decorative items.",
    build: { population: 3, wood: 4, stone: 6, copperIngot: 2 },
    consume: { population: 4, copperIngot: 2, charcoal: 1 },
    produce: { toolSimple: 3 }
  },
  rainCollector: {
    age: 4,
    category: "producingWater",
    info: "A large funnel and storage system that collects rainwater.",
    build: { population: 2, wood: 4, copper: 4, stone: 3 },
    consume: { population: 1 },
    produce: { water: 1 }
  },
  sheepRanch: {
    age: 4,
    info: "Raises sheep for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, wool: 2 }
  },
  cowRanch: {
    age: 4,
    info: "Raises cows for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, milk: 2, hide: 1 }
  },
  chickenCoop: {
    age: 4,
    info: "Raises chickens for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, eggs: 2, feather: 2 }
  },
  horseRanch: {
    age: 4,
    info: "Raises horses for various applications",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { horse: 2, }
  },
  tailor: {
    age: 4,
    info: "Produces clothing from linen fabric.",
    build: { population: 2, wood: 4, stone: 2 },
    consume: { population: 3, linen: 5 },
    produce: { clothing: 3 }
  },
  mortuary: {
    age: 4,
    info: "Uses linen fabric for shrouds and wrappings for the deceased.",
    build: { population: 2, wood: 3, stone: 5 },
    consume: { population: 1, linen: 2 },
    produce: { faith: 1 }
  },
  // Age 5
  ironSmelter: {
    age: 5,
    info: "Smelts iron ore into metal ingots using high heat.",
    build: { population: 3, stone: 12, clay: 6, copperIngot: 2 },
    consume: { population: 4, ironOre: 6, charcoal: 4 },
    produce: { ironIngot: 5 }
  },
  birdRelocation: {
    age: 5, 
    info: "Transports and releases captured birds to new habitats.",
    build: { population: 3, wood: 6, wagon: 1 },
    consume: { population: 5, bird: 8, birdSeed: 2 },
    produce: { faith: 2 }  
  },
  sailLoft: {
    age: 5,
    info: "Produces sails for ships from linen fabric.",
    build: { population: 2, wood: 6, stone: 5 },
    consume: { population: 2, linen: 4 },
    produce: { sail: 1 }
  },
  tannery: {
    age: 4,
    info: "Processes raw hides into leather for clothing, shelters, etc.",
    build: { population: 2, wood: 8, stone: 4 },
    consume: { population: 3, hide: 6, plantFibre: 2 },
    produce: { leather: 3 }
  },
  sawmill: {
    age: 4, 
    info: "Processes raw logs into lumber for construction.",
    build: { population: 2, wood: 3, stone: 2 },
    consume: { population: 2, wood: 6 },
    produce: { lumber: 4 }
  },
  windmill: {
    age: 4,
    info: "Harnesses wind power to mill grains.",
    build: { population: 2, wood: 20, stone: 15, rope: 5 },
    consume: { population: 2, wheat: 7 },
    produce: { flour: 6 }
  },
  woodAshCollector: {
    age: 2,
    info: "Collects wood ash residue from fires and kilns.",
    build: { population: 2, wood: 2 },
    consume: { population: 3 },
    produce: { woodAsh: 5 }
  }, 
  lyeVats: {
    age: 4,
    info: "Leaches lye from wood ash using an alkaline solution.",
    build: { population: 2, wood: 4, stone: 6, pottery: 2 },
    consume: { population: 3, woodAsh: 6, water: 4, limestone: 2 },
    produce: { lye: 4 }
  },  
  pulpMill: {
    age: 5,
    info: "Converts wood chips into pulp for papermaking.",
    build: { population: 3, wood: 6, stone: 8, copperIngot: 2 },
    consume: { population: 5, woodChips: 5, water: 8, lye: 2 },
    produce: { pulp: 6 }
  }, 
  limestoneQuarry: {
    age: 2,
    info: "Mines limestone deposits from quarries.",
    node: "stoneDeposit",
    build: { population: 3, wood: 4, stone: 6, toolPrimitive: 2 },
    consume: { population: 5, toolPrimitive: 2 },
    produce: { limestoneRaw: 10 }
  },
  limestoneKiln: {
    age: 4,
    info: "Calcines raw limestone into quicklime by heating.",
    build: { population: 2, stone: 8, clay: 6, charcoal: 4 },
    consume: { population: 4, limestoneRaw: 8, charcoal: 6 },
    produce: { quicklime: 6 }  
  },
  limeMill: {
    age: 5, 
    info: "Grinds quicklime into a fine powder for construction and industrial use.",
    build: { population: 3, wood: 6, stone: 10, copperIngot: 2},
    consume: { population: 4, quicklime: 8, water: 2 },
    produce: { limePowder: 6, limeMortar: 2 }
  },
  paperMill: {
    age: 6,
    info: "Produces paper sheets from pulp slurry.",
    build: { population: 4, wood: 10, stone: 12, copperIngot: 4 },
    consume: { population: 6, pulp: 8, water: 6, limestone: 2 },
    produce: { paper: 5 }
  },
  glassBlower: {
    age: 7, 
    info: "Crafts glass products like windows, bottles, lenses etc.",
    build: { population: 3, stone: 12, clay: 8, charcoal: 5 },
    consume: { population: 5, sand: 6, potash: 2 },
    produce: { glass: 4 }
  },
  clockmaker: {
    age: 7,
    info: "Manufactures precise timekeeping devices using intricate machinery.",
    build: { population: 4, wood: 8, stone: 10, copperIngot: 6, glass: 1 },
    consume: { population: 6, ironIngot: 3, glass: 2 },
    produce: { clock: 1 }
  }
}

console.log("*Lib/buildings loaded");

export { buildings };
export default buildings;