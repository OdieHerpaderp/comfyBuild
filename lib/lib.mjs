import buildings from "./buildings.mjs";

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
};

function lerpInverse(start, end, value) {
    return (value - start) / (end - start);
}

// Total work it costs to upgrade to the next level
function progressPerBuild(buildingName, upgradeLevel){
    return 48 + upgradeLevel * 64;
};

// Total work it costs to produce at the given productionLevel
function progressPerProduction(buildingName, productionLevel){
    return 48 * productionLevel;
};

// Gets the multiplier for the build materials
function buildCostMultiplier(buildingName, upgradeLevel) {
    upgradeLevel = upgradeLevel * (buildings[buildingName]?.age ?? 0);
    return upgradeLevel * 8 + 32;
}

// Gets the multiplier for the consumption cost
function consumeMultiplier(buildingName, productionLevel) {
    return productionLevel;
}

// Gets the multiplier for the production result
function produceMultiplier(buildingName, productionLevel) {
    return productionLevel;
}

// Returns the amount of ticks for a given time interval.
function timeToTicks(timeUnit) {
    if(timeUnit == "minute") return 1;
    else if(timeUnit == "hour") return 100;
    else if(timeUnit == "day") return 2400;
    // Special intervals.
    else if(timeUnit == "raid") return 2400;
    else return 0;
};

console.log("*Lib loaded");

export { lerp, lerpInverse, progressPerBuild, progressPerProduction, buildCostMultiplier, consumeMultiplier, produceMultiplier, timeToTicks };