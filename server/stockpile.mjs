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

    /**
     * @param {{name:string, amount:number}[]} resources 
     */
    addResources(resources) {
        resources.forEach(resource => {
            this.addResource(resource.name, resource.amount);
        });
    }

    addResourcesOld(resources) {
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

    /**
     * @param {{name:string, amount:number}[]} resources The resources to check
     * @param {boolean} consumeResources Whether to consume the resources 
     * @returns True if all resources are present or were consumed
     */
    checkResources(resources, consumeResources = false) {
        const hasAllResources = resources.every((resource) => {
            return resource.amount <= this.currentStockpile[resource.name];
        });

        if (consumeResources && hasAllResources) {
            resources.forEach(resource => {
                this.addResource(resource.name, -resource.amount);
            })
        }

        return hasAllResources;
    }

    checkResourcesOld(resources, consumeResources = false) {
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

let stockpile = new Stockpile();

export default stockpile;