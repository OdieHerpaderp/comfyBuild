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
    category: "wonderNatural"
  },
  // Housing // NOTE: we don't know what costs should be balance wise, for now i suggest we test:
  //water cost = age +1
  //population produced = (age+2)^2
  // this way each improvement in housing gives more ppl per water,
  // hopefully that diffrence makes it worth it to make the newer food stuffs.
  // age 0 gives acces to stone and wood
  dolmen: {
    age: 0,
    category: "housing",
    info: "Several slabs of stone provide ample shelter.",
    build: [{ name: "stone", amount: 1 }],
    recipes: [{
      consume: [
        { name: "water", amount: 1 },
        { name: "berry", amount: 1 }
      ],
      produce: [{ name: "population", amount: 4 }]
    }],
    requiredResearch: ["housing1"]
  },
  boneTent: {
    age: 1,
    category: "housing",
    info: "A simple tent using bone for structure, and hide as cover.",
    build: { plantFibre: 2, bone: 2, hide: 2, toolBlunt: 1 },
    consume: { water: 2, berry: 1, meat: 3, hide: 1 },
    produce: { population: 9 },
    requiredResearch: ["housing2"]
  },
  stoneHut: { // todo: needs a good name. uses fish
    age: 2,
    category: "housing",
    info: "Basic shelter made of collected stones, primitively mortared with clay.",
    build: { stone: 3, sand: 2, clay: 2, toolBlunt: 2 },
    consume: { water: 3, meat: 3, fish: 3, hide: 2 },
    produce: { population: 16 }
  },
  logCabin: {
    age: 2,
    category: "housing",
    info: "Basic shelter made of wood, plant fibre and mud.",
    build: { wood: 3, plantFibre: 5, clay: 2, toolBlunt: 2 },
    consume: { water: 3, berry: 3, bread: 3, hide: 2 },
    produce: { population: 16 }
  },
  burdei: {
    age: 3,
    category: "housing",
    info: "Semi-subterranean houses dug into the ground, used in Eastern Europe.",
    build: { stone: 2, clay: 2, mud: 2, plantFibre: 2, toolFlint: 3 },
    consume: { water: 4, meat: 4, salad: 4, rootVegetable: 3, hide: 2 },
    produce: { population: 25 }
  },
  limeStoneHouse: { //alternative to burdei, uses less more varied resources. requires early investment in Limestone
    age: 3,
    category: "housing",
    info: "A more luxurious structure for its time. ",
    build: { stone: 4, limestone: 8, sand: 2, toolFlint: 4 },
    consume: { water: 4, turtle: 1, poultry: 2, bread: 2, salad: 2, rootVegetable: 3, hide: 2 },
    produce: { population: 25 }
  },
  mudBrickHouse: {
    age: 4,
    category: "housing",
    info: "A simple mudBrick dwelling common in ancient Egypt.",
    build: { stone: 2, mudBrick: 4, toolFlint: 2 },
    consume: { water: 5, fish: 5, rootVegetable: 5, hide: 2 },
    produce: { population: 36 }
  },
  ziggurat: { // INFO: should match the Ancient age, as it is built by the mesopotamians. see the notes file for additional information. //update: shoudl be in the right spot now. lowered consumptioncost a little
    age: 5,
    category: "housing",
    info: "A monumental stepped mudBrick temple-tower from ancient Mesopotamia.",
    build: { mudBrick: 12, lumber: 8, stone: 4, toolCopper: 2 },
    consume: { water: 6, bread: 3, salad: 3, egg: 3, milk: 3, poultry: 3, alcohol: 1, clothing: 1 },
    produce: { population: 49 }
  },
  bungalow: { //lightweight alternative for ziggurat. slight upgrade over mudbrick house, but the zig should be worth it.
    age: 5,
    category: "housing",
    info: "Sturdy single floor building built from wood logs and stone flooring.",
    build: { lumber: 8, wood: 9, toolCopper: 2 },
    consume: { water: 5, meat: 3, bread: 3, salad: 3, clothing: 2 },
    produce: { population: 42 }
  },

  eneolithicAgeHut1: { //todo: needs a real name and info. introduces new stoneblock material , lowerclass
    age: 6,
    category: "housing",
    info: "Stoneblock houses at the cusp of going into the bronze age.",
    build: { stoneBlock: 8, lumber: 8, mud: 8, copperIngot: 1 },
    consume: { water: 7, cheese: 4, bread: 5, omelette: 3, alcohol: 2, clothing: 2 },
    produce: { population: 64 }
  },

  eneolithicAgeHut2: { //todo: needs a real name and info. introduces new stoneblock material, middleclass
    age: 6,
    category: "housing",
    info: "Stoneblock houses at the cusp of going into the bronze age.",
    build: { stoneBlock: 8, lumber: 8, limeMortar: 4, silverDecor: 1 },
    consume: { water: 7, fishSoup: 8, salad: 3, omelette: 3, alcohol: 2, clothing: 2 },
    produce: { population: 67 }
  },

  sandStoneFort: { // previously eneolithicAgeHut3. TODO: create age-appropiate version
    age: 6,
    category: "housing",
    info: "A spaceous fortification composed largely of sandStone",
    build: { sandStone: 14, lumber: 6, limeMortar: 4, goldDecor: 1 },
    consume: { water: 7, mixedMeatPie: 8, fishSoup: 2, omelette: 1, turtle: 2, alcohol: 2, clothing: 2 },
    produce: { population: 70 }
  },
  // we haven't made new foods yet after age 6. so these buildings will have ever larger piles of old foods for now
  bronzeAgeHouse: {//todo: needs a real name. 
    age: 7,
    category: "housing",
    info: "real stone block houses in the bronze age. with copper tile roofs ",
    build: { stoneBlock: 10, lumber: 8, limeMortar: 4, bronzeDecor: 1, shingle: 4 },
    consume: { water: 8, mixedMeatPie: 8, fishSoup: 2, omelette: 1, alcohol: 3, clothing: 2 },
    produce: { population: 81 }
  },
  clayBrickHouse: {
    age: 8,
    category: "housing",
    info: "Sturdy single floor building built from clay bricks and stone block flooring.",
    build: { brick: 12, limeMortar: 4, lumber: 4, bronzeDecor: 2, shingle: 4 },
    consume: { water: 9, mixedMeatPie: 8, fishSoup: 4, omelette: 2, alcohol: 6, clothing: 3 },
    produce: { population: 100 }
  },
  romanAbode: {
    age: 9,
    category: "housing",
    info: "A large house that makes ful advantage of new techniques in mortar to stand tall.",
    build: { brick: 12, concrete: 6, bronzeDecor: 1, silverDecor: 1, shingle: 6, leadPipe: 1 },
    consume: { water: 10, mixedMeatPie: 12, fishSoup: 4, cheese: 4, omelette: 4, alcohol: 8, clothing: 4 },
    produce: { population: 121 }
  },
  palace: {
    age: 10,
    category: "housing",
    info: "A marble testament to architecture.",
    build: { marble: 14, lumber: 8, concrete: 14, goldDecor: 3, shingle: 8, leadPipe: 3 },
    consume: { water: 11, mixedMeatPie: 16, fishSoup: 6, cheese: 6, omelette: 4, alcohol: 10, clothing: 4 },
    produce: { population: 144 }
  },

  /*
  zigguratAlt: {
    age: 8,
    category: "housing",
    info: "A monumental stepped mudBrick temple-tower from ancient Mesopotamia.",
    build: { mudBrick: 12, wood: 8, stone: 4, toolCopper: 2 },
    consume: { water: 6, poultry: 8, bread: 8, egg: 7, alcohol: 2, clothing: 1 },
    produce: { population: 42 }
  },
  zigguratAlt2: {
    age: 8,
    category: "housing",
    info: "A monumental stepped mudBrick temple-tower from ancient Mesopotamia.",
    build: { brick: 12, wood: 8, stone: 4, toolCopper: 2 },
    consume: { water: 6, fish: 8, bread: 8, milk: 7, alcohol: 1, clothing: 1 },
    produce: { population: 42 }
  },
  zigguratAlt3: { // original ziggurat
    age: 8,
    category: "housing",
    info: "A monumental stepped mudBrick temple-tower from ancient Mesopotamia.",
    build: { mudBrick: 12, wood: 8, stone: 4, toolCopper: 2 },
    consume: { water: 6, meat: 8, bread: 8, salad: 7, alcohol: 2, clothing: 1 },
    produce: { population: 42 }
  },
  */

  // Age 0 age of scavenging
  // first nodeless plant gathering building. gives a bit of everything, becomes obsolete with farming
  fieldGatherers: {
    age: 0,
    category: "gatheringOrganics",
    info: "Usable and edible plants are collected by hand.",
    build: [{ name: "wood", amount: 3 }],
    recipes: [{
      produce: [
        { name: "plantFibre", amount: 1 },
        { name: "berry", amount: 3 },
        { name: "rootVegetable", amount: 1 },
        { name: "wildGrains", amount: 1 }
      ]
    }],
    requiredResearch: ["plantGathering1"]
  },
  // first rockDeposit user. grants the basic mineral materials stone, flint, mud and sand
  caveGatherers: {
    age: 0,
    category: "gatheringMinerals",
    info: "Rocks are hauled out of a cave.",
    node: "rockDeposit",
    build: [{ name: "wood", amount: 2 }],
    recipes: [{
      produce: [
        { name: "stone", amount: 4 },
        { name: "flint", amount: 2 }
      ] // mud: 1, sand: 1
    }],
    requiredResearch: ["caveGathering1"]
  },
  // first forest node user. gives wood n more fibre than field gatherers
  forestGatherers: {
    age: 0,
    category: "gatheringOrganics",
    info: "Makeshift stone tools are used to collect wood.",
    node: "forest",
    build: [{ name: "stone", amount: 2 }],
    recipes: [{
      consume: [],
      produce: [
        { name: "wood", amount: 4 },
        { name: "berry", amount: 1 },
        { name: "plantFibre", amount: 3 }
      ]
    }]
  },
  // first tool builder. makes tools and buckets from wood. alt recipe could have it use less wood and add stone?
  woodCarver: {
    age: 0,
    category: "processingOrganics",
    info: "Crafts primitive wooden tools.",
    build: [
      { name: "wood", amount: 3 },
      { name: "stone", amount: 3 }
    ],
    recipes: [{
      consume: [
        { name: "wood", amount: 4 },
        { name: "plantFibre", amount: 1 },
        { name: "stone", amount: 1 },
      ],
      produce: [
        { name: "toolBlunt", amount: 2 },
        { name: "bucket", amount: 1 }
      ],
    }],
    requiredResearch: ["tools1"]
  },
  // first source of water and mud.
  waterSource: {
    age: 0,
    category: "gatheringOrganics",
    info: "Collect water inefficiently with leaves and other makeshift containers.",
    node: "freshWater",
    build: [{ name: "plantFibre", amount: 2 }],
    recipes: [{
      produce: [{ name: "water", amount: 6 }] //, mud: 2
    }]
  },
  // Age 1, advent of fire and hunting
  // first wildGame user. spends age0 tools to get new game resource
  huntersCamp: {
    age: 1,
    category: "gatheringOrganics",
    info: "Wild game is hunted using clubs.",
    node: "wildGame",
    build: [{ name: "wood", amount: 3 }],
    recipes: [{
      consume: [{ name: "toolBlunt", amount: 1 }],
      produce: [{ name: "game", amount: 1 }],
    }],
    requiredResearch: ["hunting"]
  },
  //first food processing building. turns the new game resource into usable resources. meatRaw for food, hide as the first step of clothing tech. bone as a crafting resource.
  primitiveButcher: {
    age: 1,
    category: "processingOrganics",
    info: "Wild game is dismantled by hand.",
    build: [
      { name: "wood", amount: 3 },
      { name: "stone", amount: 1 }
    ],
    recipes: [{
      consume: [{ name: "game", amount: 1 }],
      produce: [
        { name: "meatRaw", amount: 3 },
        { name: "hide", amount: 1 },
        { name: "bone", amount: 1 }
      ]
    }],
  },
  //first way to turn meatRaw into meat. also produces ash, which will be usefull at a later point.
  campfire: {
    age: 1,
    category: "processingOrganics",
    info: "Roasts wild game over open campfire.",
    build: [
      { name: "plantFibre", amount: 2 },
      { name: "wood", amount: 3 },
      { name: "stone", amount: 3 }
    ],
    recipes: [{
      consume: [
        { name: "wood", amount: 1 },
        { name: "meatRaw", amount: 3 }
      ],
      produce: [
        { name: "meat", amount: 3 },
        { name: "ash", amount: 1 }
      ]
    }],
    requiredResearch: ["fire"]
  },
  //a more efficient way than woodworker to get toolBlunt. at the cost of not producing buckets.
  boneCarver: {
    age: 1,
    category: "processingOrganics",
    info: "Crafts primitive tools from animal bones and antlers.",
    build: { wood: 3, hide: 2 },
    consume: { bone: 1, plantFibre: 1 },
    produce: { toolBlunt: 2 },
    requiredResearch: ["tools2"]
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
    produce: { rootVegetable: 5, plantFibre: 2 },
    requiredResearch: ["plantGathering2"]
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
    build: { stone: 3, plantFibre: 2, hide: 1 },
    consume: { flint: 3, wood: 2, plantFibre: 1, toolBlunt: 1 },
    produce: { toolFlint: 3 },
    requiredResearch: ["tools3"]
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
    build: { stone: 4, wood: 2, clay: 2 },
    consume: { wood: 3, plantFibre: 1 },
    produce: { charcoal: 2, ash: 1 },
    requiredResearch: ["combustion"]
  },
  //first source of fish. uses fresh water so not the best source. maybe should be renamed to harpoon fishery?
  // it currently skips the butcher process since fish doesn't split into multiple resources
  fishery: {
    age: 2,
    info: "Fish is caught using primitive harpoons.",
    node: "freshWater",
    build: { plantFibre: 3, wood: 3 },
    consume: { toolFlint: 2 },
    produce: { fishRaw: 12 }
  },
  //stoves. can be consolidated if the recipes work out.
  // fish stove, spends fuel to turn raw fish into fish.
  fishStove: {
    age: 2,
    category: "foodProduction",
    info: "simple stoves from stone and mud can focus heat better than a campfire.",
    build: { plantFibre: 2, mud: 6, stone: 3, toolFlint: 1 },
    consume: { charcoal: 1, fishRaw: 6 },
    produce: { fish: 6, ash: 1 },
    requiredResearch: ["combustion"]
  },
  //meat stove, spends fuel to turn raw meat into meat.
  meatStove: {
    age: 2,
    category: "foodProduction",
    info: "simple stoves from stone and mud can focus heat better than a campfire.",
    build: { plantFibre: 2, mud: 6, stone: 3, toolFlint: 1 },
    consume: { charcoal: 1, meatRaw: 6 },
    produce: { meat: 6, ash: 1 },
    requiredResearch: ["combustion"]
  },
  //first dedicated clay source. can be skipped unless you focus on clay early
  clayPit: {
    age: 2,
    node: "soil",
    info: "with primitive shovels and effort, clay can be harvested",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 2 },
    produce: { clay: 10 }
  },
  //first dedicated mud source. can be skipped unless you plan to use a lot of mud
  mudPit: {
    age: 2,
    node: "soil",
    info: "with primitive shovels and effort, mud can be harvested",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 2 },
    produce: { mud: 10 }
  },
  // first dedicated sand source. here for symetry reasons. you really don't need this. you already have some sand and won't need it untill age 5
  // we may need to look for earlier uses for sand
  sandPit: {
    age: 2,
    node: "soil",
    info: "with primitive shovels and effort, sand can be harvested",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 2 },
    produce: { sand: 10 }
  },
  // vegan alternative to stove. less efficient, but skips the game and fishery routes.
  saladBar: {
    age: 2,
    category: "processingOrganics",
    info: "Workers create delicious salads using various fruits and vegetables.",
    build: { wood: 3, plantFibre: 2 },
    consume: { berry: 3, rootVegetable: 5, toolFlint: 1 },
    produce: { salad: 3 }
  },
  // early use for clay. makes pottery and buckets. used in waterbearers
  potteryKiln: {
    age: 2,
    info: "Allows firing of clay pots and buckets.",
    build: { clay: 10, stone: 4, wood: 2, sand: 2 },
    consume: { clay: 8, charcoal: 3 },
    produce: { pottery: 1, bucket: 2, ash: 1 },
    requiredResearch: ["combustion"]
  },
  // waterbearers are your second logistic building. possibly to specialise in liquids?
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
  //since this is in age 2, it needs to use mud.
  well: {
    age: 2,
    node: "freshWater",
    build: { stone: 4, mud: 2, toolFlint: 1 },
    consume: { bucket: 1 },
    produce: { water: 9 }
  },
  // temp idea. will be replaced by a more sophisticated soldier mechanic. for now it's a sink for tools and hides.
  militiaCamp: {
    age: 2,
    info: "People are given spears and hide pelts to provide safety",
    build: { wood: 3, stone: 3, hide: 4 },
    consume: { toolFlint: 2, hide: 2 },
    produce: { militia: 2 }
  },
  // early source of bread, with the little flour you got from handmiller.
  primitiveBakery: {
    age: 2,
    info: "Bakes flatbread from flour.",
    build: { clay: 5, stone: 9, toolFlint: 1 },
    consume: { flour: 3, charcoal: 1 },
    produce: { bread: 2 },
    requiredResearch: ["combustion"]
  },
  // a use for plantfibre. gives rope n string, both needed a lot later than 1. so moved up to age 2. nets and trappers will use it in age 3.
  ropeMaker: {
    age: 2,
    category: "processingOrganics",
    info: "Twists and plies plant fibres into rope and cordage.",
    build: { wood: 2, toolFlint: 1 },
    consume: { plantFibre: 5 },
    produce: { rope: 3, string: 1 }
  },

  // Age 3 flint tools are phased out for quartz and obsidian. 

  //a sink for the militia from militiaCamp. see militiaCamp. for now it gives you a bit of every age 1 and 2 resource.
  raidingCamp: {
    age: 3,
    info: "Makes friendly visits to neighboring tribes who haven't figured out sharp sticks yet.",
    build: { stone: 3, wood: 3, hide: 1 },
    consume: { militia: 4 },
    produce: { plantFibre: 1, berry: 1, wildGrains: 1, game: 1, fish: 1, charcoal: 1, pottery: 1, bucket: 1 } // can we randomise output a little?
  },
  // INFO: nets could be placed earlier. yes late mesolithic i think. moving it there.
  knittingWorkshop: {
    age: 3,
    category: "processingOrganics",
    info: "Twists and plies plant fibres into rope and cordage.",
    build: { wood: 6, stone: 6, toolBlunt: 2 },
    consume: { rope: 5 },
    produce: { net: 1 }
  },
  // all rounder use for fresh water. brings in less than the other options, but more variety
  // INFO: Moved from age 2 and altered to provide new alternative animals for further processing.
  // TODO: Add processing methods for frog and turtle
  netFishery: {
    age: 3,
    node: "freshWater",
    info: "Fish and various aquatic wildlife is caught using nets",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { toolFlint: 1, net: 1, basket: 1 },
    produce: { fishRaw: 15, frog: 1, turtle: 1 } // water: 2, clay: 2, plantFibre: 6, 
  },
  // Ponds allow for specialized production of specific fish types, albeit inefficient as minimal to no human intervention takes place. See the notes tab for additional info
  frogPond: {
    age: 3,
    node: "freshWater",
    info: "A sanctuary for frogs and people alike.",
    build: { stone: 3, wood: 3, plantFibre: 3, toolFlint: 1, frog: 2 },
    consume: { net: 1 },
    produce: { frog: 3, faith: 1 } // water: 2, clay: 2, plantFibre: 6, 
  },
  turtlePond: {
    age: 3,
    node: "freshWater",
    info: "A sanctuary for turtles and people alike.",
    build: { limestone: 3, wood: 3, plantFibre: 3, toolFlint: 1, turtle: 2 }, //changed stone to limestone, to make turtlepond slightly harder to make than frogpond.
    consume: { berry: 3, basket: 1 },
    produce: { turtle: 1, faith: 1 } // water: 2, clay: 2, plantFibre: 6, 
  },
  //quartz is like flint+ right? together with obsidian. it adds a way to upgrade your tool situation a little, before we get to copper in future ages.
  quartzMine: {
    age: 3,
    category: "gatheringMinerals",
    info: "Mines Quartz using primitive tools.",
    node: "quartzDeposit",
    build: { stone: 3, wood: 3 },
    consume: { toolFlint: 2 },
    produce: { quartz: 4, stone: 2, flint: 2 }
  },
  //later you'll get sulphur here. but for now it's just a sharp rock collecting spot. // todo: rename volcano
  volcanoGatherers: {
    age: 3,
    category: "gatheringMinerals",
    info: "scavenge for obsidian near the edges of volcanoes.",
    node: "sulphurDeposit",
    build: { wood: 4, stone: 6, toolFlint: 1 },
    consume: { basket: 1 },
    produce: { obsidian: 3 }
  },
  //inbetween flintknapper and coppersmith. this improves current tool production
  quartzKnapper: {
    age: 3,
    category: "processingMinerals",
    info: "Workers shape quartz into sturdier Neolithic tools.",
    build: { stone: 3, plantFibre: 2, hide: 1, toolFlint: 1 },
    consume: { quartz: 2, wood: 5, sand: 1, toolFlint: 1 },
    produce: { toolFlint: 7 }
  },
  //alternative to quartzknapper. these two could be the same building. or even variants of the flintknapper from last age.
  obsidianKnapper: {
    age: 3,
    category: "processingMinerals",
    info: "Workers shape quartz into razorsharp Neolithic tools.",
    build: { stone: 3, plantFibre: 2, hide: 1, toolFlint: 1 },
    consume: { obsidian: 2, wood: 5, sand: 1, toolFlint: 1 },
    produce: { toolFlint: 7 }
  },

  // early source of limestone... not needed till 5th age. // for now i'll leave it here, and add an optional limestone building
  limestoneQuarry: {
    age: 3,
    category: "gatheringMinerals",
    info: "Mines limestone deposits from quarries.",
    node: "limeDeposit",
    build: { wood: 4, stone: 6, sand: 2, toolFlint: 1 },
    consume: { toolFlint: 2 },
    produce: { limestone: 4 } // , quartz: 1
  },
  // upgrade over huntercamp. uses new tools. w
  hunterLodge: {
    age: 3,
    category: "gatheringOrganics",
    info: "Skilled hunters provide fresh game meat.",
    node: "wildGame",
    build: { wood: 5, clay: 3 },
    consume: { toolFlint: 1 },
    produce: { game: 3 }
  },
  // butcher set. this can all be 1 building with multiple recipes.
  // flat upgrade over primitive butcher. adds new ingredient tallow, which will be good for candles.
  gameButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "Wild game is cut and processed",
    build: { stone: 3, wood: 2 },
    consume: { game: 2, toolFlint: 1, sand: 2 },
    produce: { meatRaw: 7, hide: 3, bone: 3, tallow: 2 }
  },
  cowButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "make some beef steaks",
    build: { stone: 3, wood: 2 },
    consume: { cow: 1, toolFlint: 1, sand: 2 },
    produce: { meatRaw: 7, hide: 3, bone: 3, tallow: 2 }
  },
  horseButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "make some swedish meatballs",
    build: { stone: 3, wood: 2, sand: 2 },
    consume: { horse: 1, toolFlint: 1 },
    produce: { meatRaw: 6, hide: 4, bone: 4, tallow: 3 }
  },
  sheepButcher: {
    age: 3,
    category: "gatheringOrganics",
    info: "make some shawarma",
    build: { stone: 3, wood: 2, sand: 2 },
    consume: { sheep: 1, toolFlint: 1 },
    produce: { meatRaw: 5, hide: 1, wool: 2, bone: 3, tallow: 2 }
  },
  //note: birdbutcher gives poultry rather than raw meat. todo: either make raw meat or add a use for poultry specifically
  birdButcher: {
    age: 3,
    info: "Butchers birds for meat and feathers.",
    build: { wood: 4, stone: 2, sand: 2 },
    consume: { bird: 2 },
    produce: { poultryRaw: 5, feather: 4, tallow: 2 }
  },
  //early farm. takes lot of water but doesn't require a node.
  croftFarm: {
    age: 3,
    info: "Grows herbs fruits and seeds.",
    build: { mud: 4, stone: 2, wood: 1, wildGrains: 2 },
    consume: { water: 5, toolFlint: 1, wildGrains: 2 },
    produce: { herb: 2, berry: 3, rootVegetable: 1, seed: 2 }
  },
  // a use for seed. used with the bird trapper
  baitPreparation: {
    age: 3,
    info: "Mixes bird seed with grains and berries into an attractive bait.",
    build: { wood: 3, pottery: 1 },
    consume: { seed: 4, wildGrains: 2, berry: 1 },
    produce: { birdBait: 5 }
  },
  //alternative to other hunting. gives birds specifically. alternate recipe can use less effort and bait when using glue. when glue is unlocked later.
  birdTrapper: {
    age: 3,
    info: "Lays traps baited with seed to capture birds alive.",
    node: "forest",
    build: { wood: 4 },
    consume: { birdBait: 3 },
    produce: { bird: 5 }
  },
  //basically the chicken pasture, but you get this one earlier than the other pastures since we skip herding chickens
  chickenCoop: {
    age: 3,
    info: "Raises chickens for food and resources",
    build: { wood: 6, bird: 2, plantFibre: 3, net: 2 },
    consume: { water: 2, wheat: 6, toolFlint: 1 },
    produce: { bird: 1, egg: 4, feather: 2 }
  },
  //
  // herders. can also be consolidated. they are a source of animals for the butcher. they can be replaced with pastures later.
  // note: the pastures use the same animals they produce in their build. this way you need a cowHerder before you can build a cowPasture
  cowHerder: {
    age: 3,
    info: "Raises cows for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { rope: 1, wheat: 6, toolFlint: 1 },
    produce: { cow: 1 }
  },
  horseHerder: {
    age: 3,
    info: "Raises horses for various applications",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { rope: 1, wheat: 6, toolFlint: 1 },
    produce: { horse: 1, }
  },
  sheepHerder: {
    age: 3,
    info: "Raises sheep for food and resources",
    build: { wood: 6, stone: 4, plantFibre: 3 },
    consume: { rope: 1, wheat: 6, toolFlint: 1 },
    produce: { sheep: 1 }
  },
  // age 4. farms & pastures


  //this makes age 4 construction material named mudBrick. will be obsolete with stoneblock 
  mudBrickMaker: {
    age: 4,
    info: "Produces mudBricks from a mixture of mud, sand, water and fibrous materials.",
    build: { wood: 6, stone: 4, clay: 1, mud: 1 },
    consume: { mud: 8, sand: 6, water: 4, plantFibre: 2 },
    produce: { mudBrick: 6 }
  },
  cistern: {
    age: 4,
    node: "freshWater",
    build: { mudBrick: 6, clay: 2, toolCopper: 1 },
    consume: { bucket: 1 },
    produce: { water: 12 }
  },
  // first real farming. note, it takes wild grains to build, gives actual wheat. thus replacing wildgrains for wheat in your bread production.
  // note; all fields may be consolidated into same building with variant recipes.
  wheatField: {
    age: 4,
    node: "soil",
    category: "gatheringOrganics",
    info: "Now, hear me out.. what if we put the seed.. back in the ground?",
    build: { wood: 3, wildGrains: 2 },
    consume: { water: 4, toolFlint: 2 },
    produce: { wheat: 7 }
  },
  //flax starts the clothing chain. might also see if we can make it interchangable with plantfibre at some point.
  flaxField: {
    age: 4,
    info: "Grows flax plants for harvesting their fibers to produce linen.",
    node: "soil",
    category: "gatheringOrganics",
    build: { wood: 3, mud: 1 },
    consume: { water: 3, toolFlint: 1 },
    produce: { flax: 5, plantFibre: 5 }
  },
  // flax to cloth
  linenMill: {
    age: 4,
    category: "processingOrganics",
    info: "Processes flax fibers into linen fabric and thread using hard labour.",
    build: { wood: 2, mudBrick: 3 },
    consume: { flax: 3 },
    produce: { cloth: 2 }
  },
  // cloth to clothing. other than houses sometimes, we have very little use for clothing. i made sulphur gathering require clothing for protection.. still..
  Tailor: {
    age: 4,
    category: "processingOrganics",
    info: "Produces clothing from linen fabric.",
    build: { wood: 4, mudBrick: 2 },
    consume: { cloth: 5, toolFlint: 1 },
    produce: { clothing: 3 }
  },
  // alternative to riverGatherers. produces poorly, but its a very early source of goldOre. which will be usefull in jewelry much later, 
  //but can be used as a proto-coin for the trade mechanics if we want to start those early.
  nuggetGatherers: {
    age: 4,
    node: "freshWater",
    info: "Some rivers have shiny rocks in em, must be good for something",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { pottery: 5 },
    produce: { water: 2, clay: 2, sand: 2, goldOre: 1 }
  },
  // could be in earlier ages. but candles won't be usefull till age 6. 
  chandler: {
    age: 4,
    info: "makes candles",
    build: { wood: 6, pottery: 1, mudBrick: 2 },
    consume: { tallow: 3, plantFibre: 1 },
    produce: { candle: 3 }
  },
  // could be in earlier ages. but fletching won't be usefull till age 5
  fletcher: {
    age: 4,
    info: "Prepares feathers from birds for use as arrow fletching.",
    build: { wood: 3, mudBrick: 2 },
    consume: { feather: 3 },
    produce: { fleching: 3 }
  },
  //needs salt. this technique is prehistoric, but i can't find from when. so this can be placed in whatever age we want.
  saltBay: {
    age: 4,
    info: "digs shalow ponds of seawater to harvest salt trough solar power, labor and patience.",
    node: "saltWater",
    build: { sand: 3, stone: 2 },
    consume: { toolFlint: 1 },
    produce: { salt: 3 }
  },
  //Kitchens, next food processing step
  meatKitchen: {
    age: 4,
    category: "foodProduction",
    info: "A collection of stoves, countertops and knives.",
    build: { mudBrick: 3, toolFlint: 1 },
    consume: { meatRaw: 9, charcoal: 1, salt: 1 },
    produce: { meat: 9 }
  },
  fishKitchen: {
    age: 4,
    category: "foodProduction",
    info: "A collection of stoves, countertops and knives.",
    build: { mudBrick: 3, toolFlint: 1 },
    consume: { fishRaw: 9, charcoal: 1, salt: 1 },
    produce: { fish: 9 }
  },
  chickenKitchen: {
    age: 4,
    category: "foodProduction",
    info: "A collection of stoves, countertops and knives.",
    build: { mudBrick: 3, toolFlint: 1 },
    consume: { poultryRaw: 9, charcoal: 1, salt: 1 },
    produce: { poultry: 9 }
  },
  //a non-vegan upgrade to salad bar. makes larger quantities of salad for now, but can make cesarSalad for example.
  saladMixer: {
    age: 4,
    category: "foodProduction",
    info: "A collection of stoves, countertops and knives.",
    build: { mudBrick: 3, toolFlint: 1 },
    consume: { poultry: 1, salad: 1, wildGrains: 1 },
    produce: { salad: 5 }
  },


  // Age 5, start of the copper age.
  copperSurfaceMine: {
    age: 5,
    category: "gatheringMinerals",
    info: "Mines copper ore deposits using primitive and neolithic tools.",
    node: "copperDeposit",
    build: { wood: 5, mudBrick: 4, stone: 2, toolFlint: 1 },
    consume: { toolFlint: 2 },
    produce: { copperOre: 3 }
  },
  tinSurfaceMine: {
    age: 5,
    category: "gatheringMinerals",
    node: "tinDeposit",
    info: "Extracts tin ore from underground deposits.",
    build: { wood: 5, mudBrick: 4, stone: 2, toolFlint: 1 },
    consume: { toolFlint: 2 },
    produce: { tinOre: 3 }
  },
  // so if you go mining for gold or silver, in most parts of the world you get mostly electrum. later, more modern mines can gather more directed
  silverSurfaceMine: {
    age: 5,
    category: "gatheringMinerals",
    node: "silverDeposit",
    info: "Mines silver ore from rich veins.",
    build: { lumber: 10, mudBrick: 12, toolCopper: 2 },
    consume: { toolCopper: 3 },
    produce: { silverOre: 1, electrumOre: 6 }
  },
  // smelters may be consolidated
  copperSmelter: {
    age: 5,
    info: "Smelts copper ore into metal ingots for tools and construction.",
    build: { mudBrick: 8, clay: 4 },
    consume: { copperOre: 5, charcoal: 3 },
    produce: { copperIngot: 4 }
  },
  tinSmelter: {
    age: 5,
    info: "Smelts tin ore into metal ingots for tools and construction.",
    build: { mudBrick: 8, clay: 4 },
    consume: { tinOre: 5, charcoal: 3 },
    produce: { tinIngot: 4 }
  },
  // smiths may be consolidated. note. both of these make toolCopper, tin tools are uncommon, and roughly of same quality as copper.
  copperSmith: {
    age: 5,
    info: "Forges copper ingots into tools, weapons, jewelry and decorative items.",
    build: { wood: 4, mudBrick: 6, copperIngot: 1 },
    consume: { copperIngot: 3, charcoal: 1 },
    produce: { toolCopper: 2 }
  },
  tinSmith: {
    age: 5,
    info: "Forges tin ingots into tools, weapons, jewelry and decorative items.",
    build: { wood: 4, mudBrick: 6, tinIngot: 1 },
    consume: { tinIngot: 3, charcoal: 1 },
    produce: { toolCopper: 2 }
  },
  //pastures. may be consolidated. note: they require you to have 2 of the to-be-produced animal to get your pasture started. 
  cowPasture: {
    age: 5,
    info: "Raises cows for food and resources",
    build: { lumber: 6, mudBrick: 4, cow: 2 },
    consume: { water: 2, wheat: 8, toolCopper: 1 },
    produce: { cow: 1, milk: 2 }
  },
  horsePasture: {
    age: 5,
    info: "Raises horses for various applications",
    build: { lumber: 6, mudBrick: 4, horse: 2 },
    consume: { water: 2, wheat: 6, toolCopper: 1 },
    produce: { horse: 1, }
  },
  sheepPasture: {
    age: 5,
    info: "Raises sheep for food and resources",
    build: { lumber: 6, mudBrick: 4, sheep: 2 },
    consume: { water: 2, wheat: 6, toolCopper: 1 },
    produce: { sheep: 1, wool: 1 }
  },
  //specialised tools for war and hunting chains.
  bowyer: {
    age: 5,
    info: "Crafts finished arrows by fletching and stringing arrow shafts.",
    build: { lumber: 4, mudBrick: 3 },
    consume: { lumber: 2, fleching: 3, string: 2 },
    produce: { bow: 2 }
  },
  // an upgrade to the hunting lodge, uses new bow as resource
  archeryRange: {
    age: 5,
    category: "gatheringOrganics",
    info: "Skilled hunters with bows provide fresh game meat.",
    node: "wildGame",
    build: { lumber: 5, plantFibre: 3 },
    consume: { bow: 1 },
    produce: { game: 5, bird: 3 }
  },
  // a sink for cloth i suppose. faith needs a use at some point
  mortuary: {
    age: 5,
    info: "Uses linen fabric for shrouds and wrappings for the deceased.",
    build: { lumber: 3, stone: 5 },
    consume: { cloth: 2 },
    produce: { faith: 1 }
  },
  //a use for hide and lye finally
  tannery: {
    age: 5,
    info: "Processes raw hides into leather for clothing, shelters, etc.",
    build: { lumber: 8, mudBrick: 4 },
    consume: { hide: 6, toolCopper: 1, lye: 1 },
    produce: { leather: 3 }
  },
  // wool is now a source of cloth too. you no longer have to rely on flax
  spinningMill: {
    age: 5,
    info: "Processes wool into wooly thread using hard labour.",
    build: { lumber: 4, mudBrick: 3, string: 2 },
    consume: { wool: 4 },
    produce: { cloth: 2, string: 3 }
  },
  // lumber is the upgraded version of wood. buildings that have wood in their build cost should have lumber from this point on. also needed for bows.
  sawmill: {
    age: 5,
    info: "Processes raw logs into lumber for construction.",
    build: { wood: 3, mudBrick: 2, copperIngot: 2 },
    consume: { toolCopper: 1, wood: 6 },
    produce: { lumber: 6 }
  },
  //if we don't like the wheelbarrow, because the wheel doesn't get properly invented til age 7, we could do a sled instead?
  carpenter: {
    age: 5,
    info: "Processes lumber into simple wooden containers and wheels.",
    build: { lumber: 3, mudBrick: 2, copperIngot: 2 },
    consume: { toolCopper: 1, lumber: 8 },
    produce: { wheelbarrow: 1, bucket: 3 } // we may want to split those into 2 recipes.
  },

  // handmill is now obsolete. requires you have a horse
  horseMill: {
    age: 5,
    info: "Harnesses horse power to mill grains.",
    build: { lumber: 4, mudBrick: 6, rope: 3, horse: 1 },
    consume: { wheat: 7 },
    produce: { flour: 6 }
  },
  // limestone -> quicklime -> lye. for now usefull for processing hides. later usfeull in alchemy/chemistry
  limestoneKiln: {
    age: 5,
    info: "Calcines raw limestone into quicklime by heating.",
    build: { mudBrick: 8, clay: 6, charcoal: 4 },
    consume: { limestone: 8, charcoal: 6 },
    produce: { quicklime: 6 }
  },
  lyeVats: {
    age: 5,
    info: "Leaches lye from wood ash using an alkaline solution.",
    build: { lumber: 4, mudBrick: 6, pottery: 2 },
    consume: { ash: 6, water: 4, limestone: 2 },
    produce: { lye: 4 }
  },
  // source of water that doesn't require a node. cheap but ineficient
  rainCollector: {
    age: 5,
    category: "producingWater",
    info: "A large funnel and storage system that collects rainwater.",
    build: { lumber: 4, copperIngot: 1, mudBrick: 3 },
    consume: {},
    produce: { water: 1 }
  },
  // new crop. starts alcohol chain. a luxury product
  hopsField: {
    age: 5,
    node: "soil",
    build: { lumber: 3, mud: 2, wildGrains: 1 },
    consume: { water: 4, toolCopper: 2 },
    produce: { hops: 3 }
  },
  // could be general alcohol. we can make this coarse beer and have better recipes later. used in housing i suppose
  distillery: {
    age: 5,
    build: { lumber: 3, copperIngot: 2, mudBrick: 2 },
    consume: { water: 4, hops: 3, toolCopper: 1, charcoal: 2 },
    produce: { alcohol: 1, ash: 1 }
  },
  // Age 6 first culture buildings & deeper mines
  // these mines either replace old mines (copper &  tin) or introduces new minerals. these require candles because they go deeper underground.
  // not sure if these can be consolidated, they need their own deposit.
  // note, most mines give what you're looking for, and a bit of a few other things. incentivising the players to figure out uses for each ore.

  // introduces stoneblocks as an upgrade to mudBricks. moved from age 3 to 6
  stoneCuttingQuarry: {
    age: 6,
    category: "gatheringMinerals",
    info: "mines stone from quarries and cuts them for construction.",
    node: "rockDeposit",
    build: { lumber: 4, mudBrick: 6, toolCopper: 1 },
    consume: { toolCopper: 1 },
    produce: { stoneBlock: 8 } //stone: 4
  },
  // limestone -> quicklime -> limepowder - > limeMortar. now essential for buildings that use stoneBlock and later bricks. until replaced by roman mortar
  limeMill: {
    age: 6,
    info: "Grinds quicklime into a fine powder for construction and industrial use.",
    build: { lumber: 6, mudBrick: 10, stoneBlock: 4 },
    consume: { quicklime: 8, water: 2 },
    produce: { limePowder: 6 }
  },
  mortarMixer: {
    age: 6,
    category: "processingMinerals",
    info: "Makes primitive mortar, so stone blocks can be stacked ever higher.",
    build: { lumber: 4, stoneBlock: 6, toolCopper: 1 },
    consume: { limePowder: 1, ash: 3 },
    produce: { limeMortar: 2 }
  },
  copperTunnelMine: {
    age: 6,
    info: "Mines copper ore deposits using copper age tools.",
    node: "copperDeposit",
    build: { lumber: 3, stoneBlock: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { copperOre: 15 }
  },
  tinTunnelMine: {
    age: 6,
    info: "Mines copper ore deposits using copper age tools.",
    node: "tinDeposit",
    build: { lumber: 3, stoneBlock: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { tinOre: 8, zincOre: 2, electrumOre: 1 }
  },
  zincTunnelMine: {
    age: 6,
    info: "Mines copper ore deposits using copper age tools.",
    node: "zincDeposit",
    build: { lumber: 3, stoneBlock: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { zincOre: 12, copperOre: 2, leadOre: 1 }
  },
  //nickel is pretty much useless at this point. great for batteries, magnets and steel later
  nickelTunnelMine: {
    age: 6,
    info: "Mines copper ore deposits using copper age tools.",
    node: "nickelDeposit",
    build: { lumber: 3, stoneBlock: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { nickelOre: 12, ironOre: 2, zincOre: 1 }
  },
  leadTunnelMine: {
    age: 6,
    info: "Mines copper ore deposits using copper age tools.",
    node: "leadDeposit",
    build: { lumber: 3, stoneBlock: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { leadOre: 12, tinOre: 3 }
  },
  preciousTunnelMine: {
    age: 6,
    info: "Mines copper ore deposits using copper age tools.",
    node: "silverDeposit",
    build: { lumber: 3, stoneBlock: 4, toolCopper: 1 },
    consume: { toolCopper: 2, candle: 1 },
    produce: { electrumOre: 8, goldOre: 1, silverOre: 3 }
  },
  volcanoMine: {
    age: 6,
    info: "dig into the edges of volcanoes. dangerous stuff even with protective clothing",
    node: "sulphurDeposit",
    build: { lumber: 4, stoneBlock: 6, toolCopper: 1 },
    consume: { toolCopper: 1, clothing: 1, herb: 2 },
    produce: { sulfur: 5 }
  },
  // for now, this just makes piles of charcoal. once we have multiple fuel support, this will produce coal.
  coalMine: {
    age: 6,
    info: "dig into coal deposits",
    node: "coalDeposit",
    build: { lumber: 4, stoneBlock: 6, toolCopper: 1 },
    consume: { toolCopper: 3 },
    produce: { charcoal: 15, stone: 5 }
  },

  // more smelters! can be variant recipes for the existing smelter. each uses fuel to make ingots from ore. alloying comes next age.
  zincSmelter: {
    age: 6,
    info: "Smelts zinc ore into metal ingots for tools and construction.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { zincOre: 5, charcoal: 3 },
    produce: { zincIngot: 4 }
  },
  // no use for nickel any time soon. we might be able to think up something with religion for these tech dead ends?
  nickelSmelter: {
    age: 6,
    info: "Smelts zinc ore into metal ingots for tools and construction.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { nickelOre: 5, charcoal: 3 },
    produce: { nickelIngot: 4 }
  },
  silverSmelter: {
    age: 6,
    info: "Smelts silver ore into metal ingots for trade and decoration.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { silverOre: 5, charcoal: 3 },
    produce: { silverIngot: 4 }
  },
  goldSmelter: {
    age: 6,
    info: "Smelts gold ore into metal ingots for trade and decoration.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { goldOre: 5, charcoal: 3 },
    produce: { goldIngot: 4 }
  },
  leadSmelter: {
    age: 6,
    info: "Smelts tin ore into metal ingots for tools and construction.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { leadOre: 5, charcoal: 3 },
    produce: { leadIngot: 4 }
  },
  primitiveSilverJeweler: {
    age: 6,
    info: "Crafts simple decorations from soft metals and rough gems.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { silverIngot: 5, quartz: 2, charcoal: 3 },
    produce: { silverDecor: 3 }
  },
  primitiveGoldJeweler: {
    age: 6,
    info: "Crafts simple decorations from soft metals and rough gems.",
    build: { stoneBlock: 8, clay: 4 },
    consume: { goldIngot: 5, quartz: 2, charcoal: 3 },
    produce: { goldDecor: 3 }
  },
  shinyShrine: { //note: frogs had no current use. added it here since faith's a resource sink for now
    age: 6,
    info: "make offerings of shiny stuf, frogs and inscense.",
    build: { lumber: 6, stoneBlock: 2, silverDecor: 3, goldDecor: 2 },
    consume: { frog: 3, herb: 2, candle: 1 },
    produce: { faith: 3 }
  },
  sailLoft: {
    age: 6,
    info: "Produces sails for ships from linen fabric.",
    build: { lumber: 6, stoneBlock: 5 },
    consume: { cloth: 4 },
    produce: { sail: 1 }
  },
  glassBlower: {
    age: 6,
    info: "Crafts glass products like windows, bottles, lenses etc.",
    build: { clay: 2, limeMortar: 4, stoneBlock: 8, toolCopper: 2 },
    consume: { sand: 6, charcoal: 2 },
    produce: { glass: 4 }
  },
  deepWell: {
    age: 6,
    node: "freshWater",
    build: { stoneBlock: 12, limeMortar: 6, toolCopper: 1 },
    consume: { bucket: 1 },
    produce: { water: 18 }
  },
  greenHouse: {
    age: 6,
    info: "rootVegetables are grown.",
    build: { copperIngot: 3, lumber: 2, glass: 4 },
    consume: { toolCopper: 2, water: 18 },
    produce: { herb: 8, berry: 7, rootVegetable: 8, seed: 6 } // once choosable recipes are available, this list can be a choice instead. maybe also include wheat and flax.
  },
  // improvement to clothing.
  uniformTailor: {
    age: 6,
    category: "processingOrganics",
    info: "Produces clothing from mixed fabrics and leather.",
    build: { lumber: 4, stoneBlock: 2 },
    consume: { cloth: 3, leather: 2, toolCopper: 1 },
    produce: { clothing: 7 }
  },
  //  starts the early writing chain.  used in tech, trade and or logistics.
  tabletKiln: {
    age: 6,
    info: "prepare and fire simple clay tablets to keep tallies and markings. First writing tools",
    build: { toolCopper: 1, stoneBlock: 4, limeMortar: 2 },
    consume: { clay: 4 },
    produce: { tablet: 1 },
  },
  // new crop. starts the early writing chain. used in tech, trade and or logistics.
  papyrusField: {
    age: 6,
    node: "soil",
    build: { wood: 3, plantFibre: 2 },
    consume: { water: 5, plantFibre: 2, toolCopper: 1 },
    produce: { papyrus: 2 }
  },
  //papyrus to papyrus sheet
  papyrusPress: {
    age: 6,
    build: { mudBrick: 5, stoneBlock: 2 },
    consume: { water: 5, stone: 1, papyrus: 2, toolCopper: 1 },
    produce: { papyrusSheet: 2 }
  },
  //the first writing arises in the bronze age, when large empires start collecting grain for re-distribution.
  //  beanCounters: {
  //    age: 6,
  //    info: "someone counting the grains and beans. logistics building.",
  //    build: { brick: 5, plantFibre: 2 },
  //    consume: { tablet: 1 },
  //    produce: { tempLogisticsLaborPoints: 30 }
  //  },

  // next tier food buildings //todo, serious names for cantinas and food products
  cantinaMeal1: {
    age: 6,
    category: "foodProduction",
    info: "A kitchen and serving area with tables, cups and plates.",
    build: { stoneBlock: 7, shingle: 1, tableware: 3 },
    consume: { poultry: 2, meat: 1, tallow: 2, flour: 3, charcoal: 3, salt: 1 },
    produce: { mixedMeatPie: 5 }
  },
  cantinaMeal2: {
    age: 6,
    category: "foodProduction",
    info: "A kitchen and serving area with tables, cups and plates.",
    build: { stoneBlock: 7, shingle: 1, tableware: 3 },
    consume: { milk: 2, cheese: 1, egg: 4, charcoal: 1, salt: 1 },
    produce: { omelette: 5 }
  },
  cheeseMonger: {
    age: 6,
    category: "foodProduction",
    info: "early cheese was probably discovered by accident.",
    build: { stoneBlock: 5, shingle: 1, stoneBlock: 4 },
    consume: { milk: 5, pottery: 1, cloth: 1, basket: 1 },
    produce: { cheese: 5 }
  },
  cantinaMeal3: {
    age: 6,
    category: "foodProduction",
    info: "A kitchen and serving area with tables, cups and plates.",
    build: { stoneBlock: 7, shingle: 1, tableware: 3 },
    consume: { fish: 3, water: 5, rootVegetable: 2, charcoal: 3, salt: 2 },
    produce: { fishSoup: 5 }
  },

  // Age 7 bronze age time
  // alloy smelters. a whole set. bronze is for the next tier of tool, the others have varying uses
  bronzeSmelter: {
    age: 7,
    info: "Smelts copper and tin into bronze ingots for tools and construction.",
    build: { stoneBlock: 8, limeMortar: 4 },
    consume: { copperIngot: 4, tinIngot: 1, charcoal: 3 },
    produce: { bronzeIngot: 4 }
  },
  brassSmelter: {
    age: 7,
    info: "Smelts copper and zinc into brass ingots for tools and construction.",
    build: { stoneBlock: 8, limeMortar: 4 },
    consume: { copperIngot: 3, zincIngot: 2, charcoal: 3 },
    produce: { brassIngot: 4 }
  },
  pewterSmelter: {
    age: 7,
    info: "Smelts copper and tin into pewter ingots for tools and construction.",
    build: { stoneBlock: 8, limeMortar: 4 },
    consume: { copperIngot: 1, tinIngot: 3, leadIngot: 1, charcoal: 3 },
    produce: { pewterIngot: 4 }
  },
  electrumSmelter: {
    age: 7,
    info: "Smelts electrum ingots for coins and jewelry.",
    build: { stoneBlock: 8, limeMortar: 4 },
    consume: { electrumOre: 5, charcoal: 3 },
    produce: { electrumIngot: 4 }
  },
  // adds an alternate use for copper, putting it in roof tiles, required for newer buildings.
  copperRoofer: {
    age: 7,
    build: { stoneBlock: 8, limeMortar: 4 },
    consume: { toolCopper: 1, pottery: 2, copperIngot: 1 },
    produce: { shingle: 4 }
  },

  // new smiths. may be variant recipes of earlier smiths
  bronzeSmith: {
    age: 7,
    info: "Casts bronze tools, weapons and items by alloying copper and tin.",
    build: { lumber: 6, stoneBlock: 8, shingle: 3 },
    consume: { bronzeIngot: 3, charcoal: 3 },
    produce: { toolBronze: 2, bronzeDecor: 2 }
  },
  whiteSmith: {
    age: 7,
    info: "hammers tin and pewter into bowls, plates and cutlery.",
    build: { lumber: 6, stoneBlock: 8, shingle: 3 },
    consume: { pewterIngot: 3, tinIngot: 1, charcoal: 2 },
    produce: { tableware: 2, pewterDecor: 2 }
  },
  // a proposal for the age 7 trade building.
  //  primitiveMint: {
  //    age: 7,
  //    info: "Casts the first coinage to help regulate trade.",
  //    build: { lumber: 6, stoneBlock: 8, leadIngot: 3, toolBronze: 3 },
  //    consume: { electrumIngot: 3, charcoal: 3 },
  //    produce: { tempLogisticsLaborPoints: 30 }
  //  },

  //wheel/barrel/bucket making
  //cooper
  cooperWheel: {
    age: 7,
    info: "Processes lumber into simple wooden containers and wheels.",
    build: { lumber: 3, stoneBlock: 2, shingle: 2 },
    consume: { toolBronze: 1, lumber: 4, bronzeIngot: 1 },
    produce: { wheel: 4 }
  },
  cooperBarrel: {
    age: 7,
    info: "Processes lumber into simple wooden containers and wheels.",
    build: { lumber: 3, stoneBlock: 2, shingle: 2 },
    consume: { toolBronze: 1, lumber: 4, bronzeIngot: 1 },
    produce: { bucket: 2, barrel: 2 }
  },

  //wheelbarrow/cart/boat making
  //joiner
  joinerWagon: {
    age: 7,
    info: "puts complicated wooden constructions together.",
    build: { lumber: 3, brick: 2, copperIngot: 2 },
    consume: { toolBronze: 1, lumber: 4, wheel: 4, horse: 1 },
    produce: { wagon: 1 }
  },
  joinerBoat: {
    age: 7,
    info: "puts complicated wooden constructions together.",
    build: { lumber: 3, stoneBlock: 2, copperIngot: 2 },
    consume: { toolBronze: 1, lumber: 6, sail: 1 },
    produce: { boat: 1 }
  },
  // variants can make wheelbarrows/sleds at better efficiency than carpenter. also, boats will be replaced by ships in age 9

  // sends out fishing boats onto shallow seas
  fishingDock: {
    age: 7,
    info: "Fish is caught using nets.",
    node: "saltWater",
    build: { lumber: 3, lumber: 3, rope: 6 },
    consume: { boat: 1, net: 5 },
    produce: { fishRaw: 30 }
  },

  //logistics building that uses wagons
  //  teamsters: {
  //    age: 7,
  //    info: "uses wagons to transport large quantities of goods. logistics building.",
  //    build: { stoneBlock: 5, plantFibre: 2 },
  //    consume: { wagon: 1 },
  //    produce: { tempLogisticsLaborPoints: 40 }
  //  },

  // a way to spend birds for faith. 
  birdRelocation: {
    age: 7,
    info: "Transports and releases captured birds to new habitats.",
    build: { lumber: 6, wagon: 1 },
    consume: { bird: 8, seed: 2 },
    produce: { faith: 2 }
  },
  // improvement over horsemill. expensive, but processes lots of wheat efficiently. 
  windmill: {
    age: 7,
    info: "Harnesses wind power to mill grains.",
    build: { lumber: 4, stoneBlock: 6, rope: 3, sail: 4 },
    consume: { wheat: 12 },
    produce: { flour: 11 }
  },
  //specialised tools for war and hunting chains.
  arrowPoisoner: {
    age: 7,
    info: "Makes reinforced arrowtips, laced with poison, for improved hunting/",
    build: { lumber: 4, stoneBlock: 3, shingle: 2 },
    consume: { bow: 1, toolBronze: 1, nickelIngot: 1, frog: 3 },
    produce: { bowPoisoned: 1 }
  },
  // an upgrade to the hunting lodge, uses new bow as resource// TODO: is this an intresting continuation of bows? decide if it is, or if we should just follow metal progression.
  toxicToxotai: {
    age: 7,
    category: "gatheringOrganics",
    info: "Skilled hunters with bows provide fresh game meat.",
    node: "wildGame",
    build: { lumber: 5, plantFibre: 3 },
    consume: { bowPoisoned: 1 },
    produce: { game: 15, bird: 5 }
  },



  //age 8: late bronze age

  // introduces brick, an upgrade over stoneblock
  brickery: {
    age: 8,
    info: "firing clay at high temperatures makes lighter, and sturdier bricks.",
    build: { limeMortar: 3, stoneBlock: 3, lumber: 3 },
    consume: { clay: 3, charcoal: 1 },
    produce: { brick: 3 }
  },
  // 
  irrigationReservoir: {
    age: 8,
    node: "freshWater",
    build: { brick: 12, limeMortar: 6, toolBronze: 1 },
    consume: { bucket: 1 },
    produce: { water: 32 }
  },
  goldEnricher: {
    age: 8,
    info: "early metalurgy discovery, how to split gold from silver.",
    build: { lumber: 6, brick: 8, shingle: 3, toolBronze: 3 },
    consume: { electrumIngot: 3, salt: 3, charcoal: 1, ironOre: 1, sulfur: 1 },
    produce: { goldIngot: 1, silverIngot: 1, silverChloride: 1 }
  },
  // upgrade over nugget gatheringss. produces poorly, but its a source of goldOre and other precious materials. which will be usefull in jewelry, 
  //but can be used as a proto-coin for the trade mechanics if we want to start those early.
  nuggetGatherers: {
    age: 4,
    node: "freshWater",
    info: "Some rivers have shiny rocks in em, must be good for something",
    build: { stone: 3, wood: 3, plantFibre: 3 },
    consume: { pottery: 5 },
    produce: { water: 2, clay: 2, sand: 2, goldOre: 1 }
  },
  // mint can either be logistics building, trade building, or a building that makes coins for those purposes.
  // Mint: {
  //   age: 8,
  //   info: "Casts various coinage with faces on them, to help regulate trade.",
  //   build: { lumber: 6, brick: 8, leadIngot: 3, toolBronze: 3 },
  //   consume: { electrumIngot: 1, silverIngot: 1, goldIngot: 1, copperIngot: 1, charcoal: 3 }, // probably best if we can use recipes to let players choose which ingots become coins.
  //   produce: { tempLogisticsLaborPoints: 50 }
  // },
  // it's been a while since we did something with pottery. and we have acces to paints now. question: should this be more pottery, or should it be a new resource potteryPainted.
  paintedPotteryKiln: {
    age: 8,
    info: "Uses paints and pigments to make beautiful works of art.",
    build: { brick: 3, lumber: 2, lumber: 2, toolBronze: 1 },
    consume: { clay: 12, charcoal: 3, silverChloride: 1, leadIngot: 1, bronzeDecor: 1 },
    produce: { pottery: 20, faith: 1 }
  },
  // same question as pottery. better or more glass?
  leadedGlassBlower: {
    age: 8,
    info: "Crafts reinforced glass products like windows, bottles, lenses etc.",
    build: { clay: 12, brick: 8, toolBronze: 2 },
    consume: { sand: 8, charcoal: 3, leadIngot: 1 },
    produce: { glass: 10 }
  },

  //age 9: advent of the iron age
  //note: clockmaker and paper chain could be waaaaaaay later tbh. 
  // we have the resources to make it... but it feels like clockmaker should be thousands of years later?
  clockmaker: {
    age: 9,
    info: "Manufactures precise timekeeping devices using intricate machinery.",
    build: { lumber: 8, brick: 10, shingle: 6, glass: 1 },
    consume: { brassIngot: 3, glass: 2 },
    produce: { clock: 1 }
  },
  //paper chain upgrade, a new way to make paper, which makes papyrussheet and tablet obsolete.
  pulpMill: {
    age: 9,
    info: "Converts wood into pulp for papermaking.",
    build: { lumber: 6, brick: 8, copperIngot: 2 },
    consume: { wood: 5, water: 8, lye: 2 },
    produce: { pulp: 6 }
  },
  paperMill: {
    age: 9,
    info: "Produces paper sheets from pulp slurry.",
    build: { lumber: 10, brick: 12, copperIngot: 4 },
    consume: { pulp: 8, water: 6, limestone: 2 },
    produce: { paper: 5 }
  },
  // the iron age begins here
  ironMine: {
    age: 9,
    info: "Mines iron ore deposits using iron tools.",
    node: "ironDeposit",
    build: { lumber: 8, brick: 6, toolBronze: 1 },
    consume: { toolBronze: 1, candle: 1 },
    produce: { ironOre: 4 }
  },
  // if we split fuels into multiple types, we'll want to introduce a new fuel tier here
  ironSmelter: {
    age: 9,
    info: "Smelts iron ore into metal ingots using high heat.",
    build: { brick: 12, clay: 6, toolBronze: 1, shingle: 2 },
    consume: { ironOre: 6, charcoal: 4 },
    produce: { ironIngot: 5 }
  },
  blackSmith: {
    age: 9,
    info: "forges metal ingots into usefull tools using high heat.",
    build: { brick: 12, concrete: 6, toolBronze: 1, shingle: 2 },
    consume: { ironIngot: 3, charcoal: 4 },
    produce: { toolIron: 3 }
  },

  //romans made lead pipes for irrigation. fun stuf. todo: a name that would be more obvious what it does?
  fistulae: {
    age: 9,
    info: "The use of lead pipes allowed the Romans to build an extensive water distribution system across their empire.",
    build: { brick: 12, clay: 6, toolBronze: 1, shingle: 2 },
    consume: { leadIngot: 6, charcoal: 4 },// as with the ironsmelter, this place should use a modern fuel.
    produce: { leadPipe: 8 }
  },

  volcanoAshHarvesters: {
    age: 9,
    info: "gather, filter and transport large quantities of rich ash for concrete and fertiliser",
    node: "sulphurDeposit",
    build: { brick: 6, limeMortar: 3, toolBronze: 1 },
    consume: { wheelbarrow: 1, clothing: 1, herb: 2 },
    produce: { volcanicAsh: 5 }
  },
  romanConcreteMixer: {
    age: 9,
    category: "processingMinerals",
    info: "Makes classical roman concrete, which can harden underwater. this opens the path to more and more ambitious construction",
    build: { lumber: 4, brick: 6, toolBronze: 1 },
    consume: { limeMortar: 5, volcanicAsh: 6 },
    produce: { concrete: 8 }
  },
  marbleCuttingQuarry: {
    age: 9,
    category: "gatheringMinerals",
    info: "mines marble from quarries and cuts them for construction.",
    node: "rockDeposit",
    build: { lumber: 4, brick: 6, toolIron: 1 },
    consume: { toolIron: 1 },
    produce: { marble: 6 }
  },
  // ships that make boats obsolete. ships can make longer trips
  shipWright: {
    age: 9,
    info: "Carpenters build ships.",
    build: { lumber: 6, brick: 5, concrete: 3, copperIngot: 8, tinIngot: 8, ironIngot: 8 },
    consume: { brassIngot: 8, barrel: 8, ironIngot: 8, glass: 3, lumber: 24, sail: 2 },
    produce: { ship: 1 }
  },

  // sends out fishing ships onto deep seas
  fishingPort: {
    age: 9,
    info: "Large fishing ships go out onto the ocean.",
    node: "saltWater",
    build: { lumber: 4, brick: 20, concrete: 8, rope: 6 },
    consume: { ship: 1, rope: 15 },
    produce: { fishRaw: 80 }
  },

  // age 10
  aqueduct: {
    age: 10,
    node: "freshWater",
    build: { marble: 8, concrete: 8, leadPipe: 2, toolIron: 1 },
    consume: { bucket: 1 },
    produce: { water: 50 }
  },

}
// ships will also be the next step in trade buildings. as well as posibly war buildings? piracy is likely one of the ends of the bronze age, timing fits.

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
    if (!buildings[buildingName].recipes) {
      if (!addResources(buildings[buildingName].consume, consumptions)) { console.warn(`${buildingName} has no consume!`) }
      if (!addResources(buildings[buildingName].produce, productions)) { console.warn(`${buildingName} has no produce!`) }
      if (!addResources(buildings[buildingName].build, builds)) { console.warn(`${buildingName} has no build!`) }
      continue;
    }

    if (buildings[buildingName].build) {
      buildings[buildingName].build.forEach(resource => {
        builds[resource.name] = true;
      });
    }

    buildings[buildingName].recipes.forEach(recipe => {
      if (recipe.consume) {
        recipe.consume.forEach(resource => {
          consumptions[resource.name] = true;
        });
      }
      if (recipe.produce) {
        recipe.produce.forEach(resource => {
          productions[resource.name] = true;
        });
      }
    });
  }

  for (const resourceName in consumptions) {
    if (productions[resourceName]) { continue; }
    console.error(`${resourceName} is consumed, but not produced!`);
  }
  for (const resourceName in productions) {
    if (consumptions[resourceName] || builds[resourceName] || resourceName === "population") { continue; }
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