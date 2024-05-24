const { RGBA_ASTC_10x10_Format } = require("three");

//TODO replace consume/produce/build functions with objects/arrays
buildings = {
  dolmen: {
    tier: 0,
    info: "Several slabs of stone provide ample shelter. People eat berries to sustain themselves.",
    build: { population: 1, stone: 1 },
    consume: { },
    produce: { population: 3 }
  },
  gatherersCamp: {
    tier: 0,
    build: { population: 1, wood: 2 },
    consume: { population: 3 },
    produce: { plantFibre: 1, berry: 1, fibre: 1 }
  },
  quarry: {
    tier: 0,
    info: "Makeshift tools are used to collect stone.",
    node: "rockDeposit",
    build: { population: 1, wood: 1 },
    consume: { population: 1 },
    produce: { stone: 3 }
  },
  flintKnapper: {
    tier: 0,
    info: "Workers shape flint into primitive tools.",
    build: { population: 1, wood: 1, stone: 2 },
    consume: { population: 2, wood: 2, stone: 5 },
    produce: { toolPrimitive: 2 }
  },
  huntersCamp: {
    tier: 0,
    info: "Wild game is hunted using primitive tools.",
    node: "wildGame",
    build: { population: 1, wood: 2 },
    consume: { population: 3, toolPrimitive: 1 },
    produce: { meatRaw: 2, hide: 2, bone: 1 }
  },
  forestry: {
    tier: 0,
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { population: 1, stone: 1 },
    consume: { population: 2 },
    produce: { wood: 3 }
  },
  waterSource: {
    tier: 0,
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { population: 1, plantFibre: 1 },
    consume: { population: 1 },
    produce: { water: 1 }
  },
  hut: {
    tier: 1,
    info: "Basic shelter made of wood, plant fibre and mud. People eat meat in addition to berries.",
    build: { population: 1, wood: 2, plantFibre: 1, mud: 1 },
    consume: { berry:1, meatCooked: 1 },
    produce: { population: 5 }
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
  well: {
    tier: 1,
    node: "freshWater",
    build: { population: 1, stone: 2 },
    consume: { population: 1 },
    produce: { water: 7 }
  },
  wheatField: {
    tier: 1,
    node: "soil",
    build: { population: 1, wood: 2, plantFibre: 1 },
    consume: { population: 2 },
    produce: { wheat: 3 }
  },
  campfire: {
    tier: 0,
    build: { population: 1, plantFibre: 1, wood: 2, stone: 2},
    consume: { population: 1, plantFibre: 1, wood: 1, meatRaw: 3},
    produce: { meatCooked: 3 }
  },
  lumberYard: {
    tier: 2,
    build: { population: 1, wood: 3, stone: 2},
    consume: { population: 2, wood: 3  },
    produce: { lumber: 2 }
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
  quartzMine: {
    tier: 2,
    node: "quartzDeposit",
    build: { population: 1, wood: 1, stone:1 },
    consume: { population: 3 },
    produce: { quartz: 2 }
  },
  burdei: {
    tier: 3,
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    consume: { wheat:1 },
    produce: { population: 7 }
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