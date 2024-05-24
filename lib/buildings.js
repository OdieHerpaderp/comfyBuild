buildings = {
  dolmen: {
    tier: 0,
    info: "Several slabs of stone provide ample shelter.",
    build: { population: 1, stone: 1 },
    consume: { },
    produce: { population: 3 }
  },
  gatherersCamp: {
    tier: 0,
    build: { population: 1, wood: 2 },
    consume: { population: 2 },
    produce: { plantFibre: 2, berry: 1 }
  },
  quarry: {
    tier: 0,
    info: "Makeshift tools are used to collect stone.",
    node: "rockDeposit",
    build: { population: 2, wood: 1 },
    consume: { population: 1 },
    produce: { stone: 3 }
  },
  forestry: {
    tier: 0,
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { population: 2, stone: 1 },
    consume: { population: 1 },
    produce: { wood: 3 }
  },
  huntersCamp: {
    tier: 0,
    info: "Wild game is hunted using primitive tools.",
    node: "wildGame",
    build: { population: 1, wood: 2 },
    consume: { population: 3, toolPrimitive: 1 },
    produce: { meatRaw: 2, hide: 2, bone: 1 }
  },
  flintKnapper: {
    tier: 0,
    info: "Workers shape flint into primitive tools.",
    build: { population: 1, wood: 1, stone: 2 },
    consume: { population: 2, wood: 2, stone: 5 },
    produce: { toolPrimitive: 2 }
  },
  waterSource: {
    tier: 0,
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { population: 1, plantFibre: 1 },
    consume: { population: 1 },
    produce: { water: 1 }
  },
  campfire: {
    tier: 1,
    build: { population: 1, plantFibre: 1, wood: 2, stone: 2},
    consume: { population: 1, plantFibre: 1, wood: 1, meatRaw: 3},
    produce: { meat: 3 }
  },
  wheatField: {
    tier: 1,
    node: "soil",
    build: { population: 1, wood: 2, plantFibre: 1 },
    consume: { population: 2, water: 1 },
    produce: { wheat: 3 }
  },
  reedField: {
    node: "soil",
    consume: { population: 2 },
    produce: { reed: 3 }
  },
  clayPit: {
    node: "soil",
    build: { population: 1, stone: 1, wood:1, plantFibre:1 },
    consume: { population: 2 },
    produce: { clay: 3 }
  },
  mudPit: {
    node: "soil",
    build: { population: 1, stone: 1, wood:1, plantFibre:1 },
    consume: { population: 2 },
    produce: { mud: 3 }
  },
  sandPit: {
    node: "soil",
    build: { population: 1, stone: 1, wood:1, plantFibre:1 },
    consume: { population: 2 },
    produce: { sand: 3 }
  },
  woodWorker: {
    tier: 1,
    info: "Crafts primitive wooden tools.",
    build: { population: 1, wood: 2, stone: 2 },
    consume: { population: 2, wood: 6 },
    produce: { toolPrimitive: 3 }
  },
  loggingCamp: {
    tier: 2,
    info: "Loggers cut trees for wood using primitive tools",
    node: "forest",
    build: { population: 1, stone: 1 },
    consume: { population: 3, toolPrimitive: 3 },
    produce: { wood: 8 }
  },
  fishery: {
    node: "freshWater",
    build: { population: 1, plantFibre: 1, wood:1 },
    consume: { population: 2 },
    produce: { fishRaw: 1 }
  },
  brickery: {
    node: "soil",
    build: { population: 1, clay: 1, wood:1 },
    consume: { population: 1, clay: 3, wood:1 },
    produce: { brick: 2 }
  },
  hut: {
    tier: 1,
    info: "Basic shelter made of wood, plant fibre and mud.",
    build: { population: 1, wood: 2, plantFibre: 1, mud: 1 },
    consume: { water:1, berry:1, meat: 1 },
    produce: { population: 5 }
  },
  burdei: {
    tier: 3,
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    consume: { },
    produce: { population: 9 }
  },
  well: {
    node: "freshWater",
    build: { population: 1, stone: 1 },
    consume: { population: 1, toolPrimitive: 1 },
    produce: { water: 5 }
  },
  basketWeaver: {
    tier: 1,
    info: "Weaves plant fibres into baskets for carrying and storing goods.",
    build: { population: 1, wood: 2, stone: 2, plantFibre: 1 },
    consume: { population: 2, plantFibre: 5 },
    produce: { baskets: 1 }  
  },
  boneWorkshop: {
    tier: 2,
    info: "Crafts primitive tools from animal bones and antlers.", 
    build: { population: 3, wood: 3, hide: 1 },
    consume: { population: 4, bone: 3 },
    produce: { toolPrimitive: 1 }
  },
  charcoalBurner: {
    tier: 2,
    info: "Produces charcoal by smoldering wood in a low oxygen environment.",
    build: { population: 1, stone: 3, wood: 1 },
    consume: { population: 1, wood: 1 },
    produce: { charcoal: 2 }
  },
  potteryKiln: {
    tier: 2,
    info: "Allows firing of clay pots and tools.",
    build: { population: 1, clay: 3, stone: 2, wood: 2 },
    consume: { population: 2, clay: 5 },
    produce: { pottery: 1 }
  },
  quartzMine: {
    build: { population: 1, wood: 1 },
    consume: { population: 1 },
    produce: { stone: 3, stone: 3,  }
  },
  sheepRanch: {
    tier: 3,
    info: "Raises sheep for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, wool: 2 }
  },
  cowRanch: {
    tier: 3,
    info: "Raises cows for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, milk: 2, hide: 1 }
  },
  chickenCoop: {
    tier: 3,
    info: "Raises chickens for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, eggs: 2, feather: 4 }
  },
  flaxFarm: {
    tier: 1,
    info: "Grows flax plants for harvesting their fibers to produce linen.",
    node: "soil",
    build: { population: 2, wood: 3, mud: 1 },
    consume: { population: 2, water: 2, toolPrimitive: 1 },
    produce: { flax: 1 }
  },
  linenMill: {
    tier: 2,
    info: "Processes flax fibers into linen fabric and thread.",
    build: { population: 2, wood: 2, stone: 3 },
    consume: { population: 3, flax: 3, water: 1 },
    produce: { linen: 2 }
  },
  tailor: {
    tier: 4,
    info: "Produces clothing from linen fabric.",
    build: { population: 2, wood: 4, stone: 2 },
    consume: { population: 4, linen: 6 },
    produce: { clothing: 3 }
  },
  mortuary: {
    tier: 4,
    info: "Uses linen fabric for shrouds and wrappings for the deceased.",
    build: { population: 1, wood: 3, stone: 5 },
    consume: { population: 1, linen: 4 },
    produce: { bone:1 }
  },
  sailLoft: {
    tier: 5,
    info: "Produces sails for ships from linen fabric.",
    build: { population: 3, wood: 8, stone: 12 },
    consume: { population: 3, linen: 10 },
    produce: { sail: 5 }
  },
  tannery: {
    tier: 4,
    info: "Processes raw hides into leather for clothing, shelters, etc.",
    build: { population: 2, wood: 8, stone: 4 },
    consume: { population: 3, hide: 10, plantFibre: 5 },
    produce: { leather: 12 }
  },
  sawmill: {
    tier: 4, 
    info: "Processes raw logs into lumber for construction.",
    node: "forest",
    build: { population: 2, wood: 3, stone: 2 },
    consume: { population: 2, wood: 10 },
    produce: { lumber: 15 }
  },
  windmill: {
    tier: 4,
    info: "Harnesses wind power to mill grains.",
    node: "flatLand", 
    build: { population: 2, wood: 20, stone: 15, rope: 5 },
    consume: { population: 3, wheat: 10 },
    produce: { flour: 15 }
  }
}

console.log("*Lib/buildings loaded");