buildings = {
  headquarters: {
    build: { },
    consume: { },
    produce: { }
  },
  dolmen: {
    age: 0,
    info: "Several slabs of stone provide ample shelter.",
    build: { population: 1, stone: 1 },
    consume: { },
    produce: { population: 3 }
  },
  gatherersCamp: {
    age: 0,
    build: { population: 2, wood: 3 },
    consume: { population: 2 },
    produce: { plantFibre: 2, berry: 1 }
  },
  quarry: {
    age: 0,
    info: "Makeshift tools are used to collect stone.",
    node: "rockDeposit",
    build: { population: 3, wood: 2 },
    consume: { population: 1 },
    produce: { stone: 3 }
  },
  forestry: {
    age: 0,
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { population: 2, stone: 2 },
    consume: { population: 1 },
    produce: { wood: 3 }
  },
  huntersCamp: {
    age: 0,
    info: "Wild game is hunted using primitive tools.",
    node: "wildGame",
    build: { population: 2, wood: 3 },
    consume: { population: 3, toolPrimitive: 1 },
    produce: { meatRaw: 2, hide: 2, bone: 1 }
  },
  flintKnapper: {
    age: 0,
    info: "Workers shape flint into primitive tools.",
    build: { population: 2, wood: 2, stone: 3 },
    consume: { population: 2, wood: 2, stone: 5 },
    produce: { toolPrimitive: 2 }
  },
  waterSource: {
    age: 0,
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { population: 2, plantFibre: 2 },
    consume: { population: 1 },
    produce: { water: 1 }
  },
  campfire: {
    age: 1,
    build: { population: 2, plantFibre: 2, wood: 3, stone: 3},
    consume: { population: 1, plantFibre: 1, wood: 1, meatRaw: 3},
    produce: { meat: 3 }
  },
  wheatField: {
    age: 1,
    build: { population: 2, wood: 3, plantFibre: 2 },
    consume: { population: 2, water: 4 },
    produce: { wheat: 3 }
  },
  reedField: {
    build: { population: 2, wood: 3, plantFibre: 2 },
    consume: { population: 2, water: 4 },
    produce: { reed: 3 }
  },
  clayPit: {
    node: "soil",
    build: { population: 2, stone: 3, wood:3, plantFibre:3 },
    consume: { population: 2 },
    produce: { clay: 3 }
  },
  mudPit: {
    node: "soil",
    build: { population: 2, stone: 3, wood:3, plantFibre:3 },
    consume: { population: 2 },
    produce: { mud: 3 }
  },
  sandPit: {
    node: "soil",
    build: { population: 2, stone: 3, wood:3, plantFibre:3 },
    consume: { population: 2 },
    produce: { sand: 3 }
  },
  woodWorker: {
    age: 1,
    info: "Crafts primitive wooden tools.",
    build: { population: 2, wood: 3, stone: 3 },
    consume: { population: 2, wood: 6 },
    produce: { toolPrimitive: 3 }
  },
  loggingCamp: {
    age: 2,
    info: "Loggers cut trees for wood using primitive tools",
    node: "forest",
    build: { population: 2, stone: 4, wood: 2 },
    consume: { population: 3, toolPrimitive: 3 },
    produce: { wood: 8 }
  },
  fishery: {
    node: "freshWater",
    build: { population: 2, plantFibre: 3, wood:3 },
    consume: { population: 2 },
    produce: { fishRaw: 1 }
  },
  brickery: {
    build: { population: 2, clay: 3, stone: 3, wood: 3 },
    consume: { population: 1, clay: 3, wood:1 },
    produce: { brick: 2 }
  },
  stoneCutter: {
    age: 2,
    build: { population: 2, stone: 3, wood: 3 },
    consume: { population: 1, stone: 4, wood:3 },
    produce: { stoneBlock: 2 }
  },
  hut: {
    age: 1,
    info: "Basic shelter made of wood, plant fibre and mud.",
    build: { population: 2, wood: 3, plantFibre: 2, mud: 2 },
    consume: { water:1, berry:1, meat: 1 },
    produce: { population: 5 }
  },
  burdei: {
    age: 3,
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    consume: { },
    produce: { population: 9 }
  },
  well: {
    node: "freshWater",
    build: { population: 2, stone: 4 },
    consume: { population: 1, toolPrimitive: 1 },
    produce: { water: 5 }
  },
  basketWeaver: {
    age: 1,
    info: "Weaves plant fibres into baskets for carrying and storing goods.",
    build: { population: 2, wood: 3, stone: 3, plantFibre: 2 },
    consume: { population: 2, plantFibre: 5 },
    produce: { baskets: 1 }  
  },
  boneWorkshop: {
    age: 2,
    info: "Crafts primitive tools from animal bones and antlers.", 
    build: { population: 2, wood: 3, hide: 2 },
    consume: { population: 4, bone: 3 },
    produce: { toolPrimitive: 1 }
  },
  charcoalBurner: {
    age: 2,
    info: "Produces charcoal by smoldering wood in a low oxygen environment.",
    build: { population: 1, stone: 4, wood: 2 },
    consume: { population: 1, wood: 1 },
    produce: { charcoal: 2 }
  },
  potteryKiln: {
    age: 2,
    info: "Allows firing of clay pots and tools.",
    build: { population: 1, clay: 3, stone: 2, wood: 2 },
    consume: { population: 2, clay: 5 },
    produce: { pottery: 1 }
  },
  quartzMine: {
    age: 2,
    node: "quartzDeposit",
    build: { population: 1, stone: 3, wood: 3 },
    consume: { population: 1, toolPrimitive: 1 },
    produce: { quartz: 3, stone: 1 }
  },
  sheepRanch: {
    age: 3,
    info: "Raises sheep for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, wool: 2 }
  },
  cowRanch: {
    age: 3,
    info: "Raises cows for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, milk: 2, hide: 1 }
  },
  chickenCoop: {
    age: 3,
    info: "Raises chickens for food and resources",
    build: { population: 3, wood: 6, stone: 4, plantFibre: 3 },
    consume: { population: 3, water: 2, wheat: 6, toolPrimitive: 1 },
    produce: { meatRaw: 2, eggs: 2, feather: 4 }
  },
  flaxFarm: {
    age: 1,
    info: "Grows flax plants for harvesting their fibers to produce linen.",
    node: "soil",
    build: { population: 2, wood: 3, mud: 1 },
    consume: { population: 2, water: 3, toolPrimitive: 1 },
    produce: { flax: 2 }
  },
  linenMill: {
    age: 2,
    info: "Processes flax fibers into linen fabric and thread.",
    build: { population: 2, wood: 2, stone: 3 },
    consume: { population: 3, flax: 3, water: 1 },
    produce: { linen: 2 }
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
    node: "forest",
    build: { population: 2, wood: 3, stone: 2 },
    consume: { population: 2, wood: 15 },
    produce: { lumber: 10 }
  },
  windmill: {
    age: 4,
    info: "Harnesses wind power to mill grains.",
    node: "flatLand", 
    build: { population: 2, wood: 20, stone: 15, rope: 5 },
    consume: { population: 3, wheat: 15 },
    produce: { flour: 10 }
  }
}

console.log("*Lib/buildings loaded");