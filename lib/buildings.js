//TODO replace consume/produce/build functions with objects/arrays
buildings = {
  dolmen: {
    tier: 0,
    info: "Several slabs of stone provide ample shelter. People eat berries to sustain themselves.",
    build: { population: 1, stone: 1 },
    consume: { berry: 1 },
    produce: { population: 3 }
  },
  hut: {
    tier: 1,
    info: "Several slabs of stone provide ample shelter. People eat berries to sustain themselves.",
    build: { population: 1, wood: 1, hide: 1 },
    consume: { berry:1, water: 1 },
    produce: { population: 5 }
  },
  burdei: {
    tier: 2,
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    consume: { wheat:1 },
    produce: { population: 7 }
  },
  quarry: {
    tier: 0,
    info: "Makeshift wooden tools are used to collect stone.",
    node: "rockDeposit",
    build: { population: 1, wood: 1 },
    consume: { population: 1 },
    produce: { stone: 3 }
  },
  forestry: {
    tier: 0,
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: { population: 1, stone: 1 },
    consume: { population: 2 },
    produce: { wheat: 3 }
  },
  waterSource: {
    tier: 0,
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: { population: 1, plantFibre: 1 },
    consume: { population: 1 },
    produce: { water: 1 }
  },
  well: {
    tier: 1,
    node: "freshWater",
    consume: { population: 1 },
    produce: { water: 7 }
  },
  wheatField: {
    tier: 0,
    node: "soil",
    consume: { population: 2 },
    produce: { wheat: 3 }
  },
  forestry: {
    tier: 0,
    node: "forest",
    consume: { population: 2 },
    produce: { wheat: 3 }
  },
  huntersDen: {
    tier: 0,
    node: "wildGame",
    consume: { population: 3 },
    produce: { meatRaw: 2, hide: 2, bone: 1 }
  },
  campfire: {
    tier: 0,
    consume: { population: 1, plantFibre: 1, wood: 1, meatRaw: 3},
    produce: { meatCooked: 3 }
  },
  lumberYard: {
    consume: { population: 2, wood: 3  },
    produce: { plank: 2 }
  },
  kiln: {
    consume: { population: 1, wood: 1 },
    produce: { charcoal: 2 }
  },
  gatherersDen: {
    consume: { population: 2 },
    produce: { plantFibre: 1, berry: 1, fibre: 1 }
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
  quartzMine: {
    node: "quartzDeposit",
    build: { population: 1, wood: 1, stone:1 },
    consume: { population: 3 },
    produce: { quartz: 2, flint: 2,  }
  }
}
console.log("*Lib/buildings loaded");