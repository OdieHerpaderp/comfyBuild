function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
};

function lerpInverse(start, end, value) {
    return (value - start) / (end - start);
}

var lib = {};

function progressPerBuild(towerType, upgradeLevel){
    return 32 + upgradeLevel * 24;
};

function progressPerProduction(towerType, productionLevel){
    return 24 * productionLevel;
};

console.log("*Lib loaded");

export { lerp, lerpInverse, progressPerBuild, progressPerProduction };