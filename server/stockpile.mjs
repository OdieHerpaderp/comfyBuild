class Stockpile {
    currentStockpile = {};
    stockpileChanges = {};

    getMaxResourceMultiplier(resources) {
        let result = Infinity;
        for (const [key, value] of Object.entries(resources)) {
            result = Math.min(result, this.currentStockpile[key] / value);
        }
        return result;
    }

    addResources(resources) {
        for (const [key, value] of Object.entries(resources)) {
            this.addResource(key, value);
        }
    }

    addResource(resourceName, amount) {
        if (typeof amount !== "number") { return; }
        if (this.currentStockpile[resourceName] === undefined) {
            this.currentStockpile[resourceName] = amount;
        }
        else {
            this.currentStockpile[resourceName] += amount;
        }
        this.stockpileChanges[resourceName] = this.currentStockpile[resourceName];
    }

    setResource(resourceName, amount) {
        if (typeof amount !== "number") { return; }
        this.currentStockpile[resourceName] = amount;
        this.stockpileChanges[resourceName] = this.currentStockpile[resourceName];
    }

    getStockpileChanges() {
        let result = this.stockpileChanges;
        this.stockpileChanges = {};
        return result;
    }

    getCurrentStockpile() {
        return this.currentStockpile;
    }

    checkResources(resources, consumeResources = false) {
        const resourceKeys = Object.keys(resources);
        const hasAllResources = resourceKeys.every((resource) => {
            return resources[resource] <= this.currentStockpile[resource];
        });

        if (consumeResources && hasAllResources) {
            for (const [key, value] of Object.entries(resources)) {
                this.addResource(key, -value);
            }
        }

        return hasAllResources;
    }
}

let instance = new Stockpile();

export default instance;