import Building from "./building.mjs";

class WonderNatural extends Building {
    get canBeUpgraded() { return false; }

    constructor(x, y, buildingType) {
        super(x, y, buildingType);
        this.upgradeLevel = 1;
        this.targetLevel = 1;
        this.productionLevel = 0;
        this.maxWorkers = 0;
    }

    tick() {
        // Do nothing
    }
}

export default WonderNatural;