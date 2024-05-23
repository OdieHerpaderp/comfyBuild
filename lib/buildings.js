//TODO replace consume/produce/build functions with objects/arrays
buildings = {
  dolmen: {
    consume: { },
    produce: { population: 3 }
  },
  hut: {
    consume: { wheat: 1},
    produce: { population: 7 }
  },
  burdei: {
    consume: { },
    produce: { population: 9 }
  },
  well: {
    node: "freshWater",
    consume: { population: 1 },
    produce: { water: 5 }
  },
  wheatField: {
    node: "fertileSoil",
    consume: { population: 2},
    produce: { wheat: 3 }
  },
  quarry: {
    build: { population: 1, wood: 1 },
    consume: { population: 1 },
    produce: { stone: 3 }
  },
  quartzMine: {
    build: { population: 1, wood: 1 },
    consume: { population: 1 },
    produce: { stone: 3, stone: 3,  }
  }
}

/*
buildings["dolmen"] = {
    tier: 0,
    consume: production => true,
    produce: production => { Base.population += production * 3; return true; },
    build: level => {
      if (Base.stockpile.stone > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level;Base.stockpile.stone -= 1 + level * 2; return true;
      } else return false;
    }
  };

buildings["slums"] = {};
buildings["slums"].tier = 0;
buildings["slums"].consume = function(production){ return true; };
buildings["slums"].produce = function(production){ Base.population += 1; Base.morale -= 1; return true; };
buildings["slums"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; return true;} else return false };

buildings["huntersDen"] = {};
buildings["huntersDen"].tier = 0;
buildings["huntersDen"].consume = function(production){ if(Base.populationCurrent > production * 5 && Base.stockpile.flintTool > production * 3) {Base.populationCurrent -= production * 5; Base.stockpile.flintTool -= production * 3; return true;} else return false };
buildings["huntersDen"].produce = function(production){ Base.stockpile.bone += production; Base.stockpile.hide += production; Base.stockpile.rawMeat += production; return true; };
buildings["huntersDen"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["quarry"] = {};
buildings["quarry"].tier = 1;
buildings["quarry"].node = "stoneDeposit";
buildings["quarry"].consume = function(production){ if(Base.populationCurrent > production) {Base.populationCurrent -= production; return true;} else return false };
buildings["quarry"].produce = function(production){ Base.stockpile.stone += production; return true; };
buildings["quarry"].build = function(level){ if(Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["quartzMine"] = {};
buildings["quartzMine"].tier = 1;
buildings["quartzMine"].node = "quartzDeposit";
buildings["quartzMine"].consume = function(production){ if(Base.populationCurrent > production) {Base.populationCurrent -= production; return true;} else return false };
buildings["quartzMine"].produce = function(production){ Base.stockpile.quartz += production; Base.stockpile.flint += production; return true; };
buildings["quartzMine"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["smithy"] = {};
buildings["smithy"].tier = 1;
buildings["smithy"].node = "none";
buildings["smithy"].consume = function(production){ if(Base.populationCurrent > production && Base.stockpile.flint > production * 2 && Base.stockpile.stone > production) {Base.populationCurrent -= production; Base.stockpile.flint -= production * 2; Base.stockpile.stone -= production; return true;} else return false };
buildings["smithy"].produce = function(production){ Base.stockpile.flintTool += production; return true; };
buildings["smithy"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.quartz > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.quartz -= 1 + level * 2; return true;} else return false };

buildings["well"] = {};
buildings["well"].tier = 1;
buildings["well"].node = "freshWater";
buildings["well"].consume = function(production){ if(Base.populationCurrent > production) {Base.populationCurrent -= production; return true;} else return false };
buildings["well"].produce = function(production){ Base.stockpile.water += production; return true; };
buildings["well"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; return true;} else return false };

buildings["forestry"] = {};
buildings["forestry"].tier = 1;
buildings["forestry"].node = "forest";
buildings["forestry"].consume = function(production){ if(Base.populationCurrent > production) {Base.populationCurrent -= production; return true;} else return false };
buildings["forestry"].produce = function(production){ Base.stockpile.wood += production; return true; };
buildings["forestry"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; return true;} else return false };

buildings["wheatField"] = {};
buildings["wheatField"].tier = 1;
buildings["wheatField"].node = "fertileSoil";
buildings["wheatField"].consume = function(production){ if(Base.populationCurrent > production * 2 && Base.stockpile.water > production) {Base.populationCurrent -= production * 2; Base.stockpile.water -= production; return true;} else return false };
buildings["wheatField"].produce = function(production){ Base.stockpile.wheat += production * 2; return true; };
buildings["wheatField"].build = function(level){ if(Base.stockpile.sand > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.sand -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["reedField"] = {};
buildings["reedField"].tier = 2;
buildings["reedField"].node = "fertileSoil";
buildings["reedField"].consume = function(production){ if(Base.populationCurrent > production * 2 && Base.stockpile.water > production) {Base.populationCurrent -= production * 2; Base.stockpile.water -= production; return true;} else return false };
buildings["reedField"].produce = function(production){ Base.stockpile.reed += production * 2; return true; };
buildings["reedField"].build = function(level){ if(Base.stockpile.sand > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.sand -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["sawa"] = {};
buildings["sawa"].tier = 2;
buildings["sawa"].consume = function(production){ if(Base.populationCurrent > production * 2 && Base.stockpile.water > production * 2) {Base.populationCurrent -= production * 2; Base.stockpile.water -= production * 2; return true;} else return false };
buildings["sawa"].produce = function(production){ Base.stockpile.rice += production; return true; };
buildings["sawa"].build = function(level){ if(Base.stockpile.sand > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.sand -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["lumberMill"] = {};
buildings["lumberMill"].tier = 2;
buildings["lumberMill"].consume = function(production){ if(Base.populationCurrent > production && Base.stockpile.wood > production * 3) {Base.populationCurrent -= production; Base.stockpile.wood -= production * 3; return true;} else return false };
buildings["lumberMill"].produce = function(production){ Base.stockpile.lumber += production; return true; };
buildings["lumberMill"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["kiln"] = {};
buildings["kiln"].tier = 2;
buildings["kiln"].consume = function(production){ if(Base.populationCurrent > production && Base.stockpile.wood > production * 2) {Base.populationCurrent -= production; Base.stockpile.wood -= production * 2; return true;} else return false };
buildings["kiln"].produce = function(production){ Base.stockpile.charcoal += production * 3; return true; };
buildings["kiln"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["brickWorks"] = {};
buildings["brickWorks"].tier = 2;
buildings["brickWorks"].consume = function(production){ if(Base.populationCurrent > production && Base.stockpile.clay > production * 2 && Base.stockpile.charcoal > production) {Base.populationCurrent -= production; Base.stockpile.clay -= production * 2; Base.stockpile.charcoal -= production; return true;} else return false };
buildings["brickWorks"].produce = function(production){ Base.stockpile.brick += production * 1; return true; };
buildings["brickWorks"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["glassSmelter"] = {};
buildings["glassSmelter"].tier = 2;
buildings["glassSmelter"].consume = function(production){ if(Base.populationCurrent > production && Base.stockpile.sand > production * 2 && Base.stockpile.charcoal > production) {Base.populationCurrent -= production; Base.stockpile.sand -= production * 2; Base.stockpile.charcoal -= production; return true;} else return false };
buildings["glassSmelter"].produce = function(production){ Base.stockpile.glass += production * 1; return true; };
buildings["glassSmelter"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.clay > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.clay -= 1 + level * 2; return true;} else return false };

buildings["sandPit"] = {};
buildings["sandPit"].tier = 1;
buildings["sandPit"].consume = function(production){ if(Base.populationCurrent > production) {Base.populationCurrent -= production; return true;} else return false };
buildings["sandPit"].produce = function(production){ Base.stockpile.sand += production; return true; };
buildings["sandPit"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["clayPit"] = {};
buildings["clayPit"].tier = 1;
buildings["clayPit"].consume = function(production){ if(Base.populationCurrent > production) {Base.populationCurrent -= production; return true;} else return false };
buildings["clayPit"].produce = function(production){ Base.stockpile.clay += production; return true; };
buildings["clayPit"].build = function(level){ if(Base.stockpile.stone > 1 + level * 2 && Base.stockpile.wood > 1 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.stone -= 1 + level * 2; Base.stockpile.wood -= 1 + level * 2; return true;} else return false };

buildings["hut"] = {};
buildings["hut"].tier = 2;
buildings["hut"].consume = function(production){ if(Base.stockpile.wheat > production * 2) {Base.stockpile.wheat -= production * 2; return true;} else return false };
buildings["hut"].produce = function(production){ Base.population += production * 7; return true; };
buildings["hut"].build = function(level){ if(Base.stockpile.wood > 2 + level * 3 && Base.stockpile.stone > 2 + level * 3 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.wood -= 2 + level * 3; Base.stockpile.stone -= 2 + level * 3; return true;} else return false };

buildings["burdei"] = {};
buildings["burdei"].tier = 2;
buildings["burdei"].consume = function(production){ if(Base.stockpile.charcoal > production * 2 && Base.stockpile.wheat > production) {Base.stockpile.charcoal -= production * 2; Base.stockpile.wheat -= production * 1; return true;} else return false };
buildings["burdei"].produce = function(production){ Base.population += production * 9; return true; };
buildings["burdei"].build = function(level){ if(Base.stockpile.clay > 2 + level * 3 && Base.stockpile.sand > 2 + level * 2 && Base.populationCurrent > level) {Base.populationCurrent -= level; Base.stockpile.clay -= 2 + level * 3; Base.stockpile.sand -= 2 + level * 2; return true;} else return false };
// Pit-houses/Burdei - Semi-subterranean houses dug into the ground, used in Eastern Europe.
*/
console.log("*Lib/buildings loaded");