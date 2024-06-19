import serverSettings from "../../lib/serverSettings.mjs";

const moraleMultiplier = 10000;

class WorldManager {
    currentPopulationTotal = 1;
    currentBuilders = 0;
    currentCarriers = 0;
    currentWorkers = 0;
    get currentBusyPopulation() { return this.currentBuilders + this.currentCarriers + this.currentWorkers; }
    get currentIdlePopulation() { return this.currentPopulationTotal - this.currentBusyPopulation; }
    
    currentPopulationMultiplier = 1;

    futurePopulationTotal = 1;
    futureBuilders = 0;
    futureCarriers = 0;
    futureWorkers = 0;
    get futureBusyPopulation() { return this.futureBuilders + this.futureCarriers + this.futureWorkers; }

    morale = 1;
    tech = 0;

    // Note: this tick must be called before any other ticks. 
    tick() {
        // If < 25% of population is idle, morale drops linear.
        let targetMorale = (this.currentIdlePopulation / (this.currentPopulationTotal * .25));
        targetMorale = Math.max(0.01, Math.min(1, targetMorale));

        // Every tick, step 1 percent towards the target morale to prevent wild fluctuations
        let diff = targetMorale - this.morale;

        if (Math.abs(diff) < 0.01) {
            this.morale = targetMorale;
        }
        else {
            this.morale += diff * 0.01;
        }

        this.currentPopulationMultiplier = Math.min(1, (this.futurePopulationTotal / Math.max(1, this.futureBusyPopulation) * this.morale));

        this.currentPopulationTotal = this.futurePopulationTotal;
        this.currentBuilders = 0;
        this.currentCarriers = 0;
        this.currentWorkers = 0;

        this.futurePopulationTotal = serverSettings.freePopulationGeneration;
        this.futureBuilders = 0;
        this.futureCarriers = 0;
        this.futureWorkers = 0;
    }

    producePopulation(amount) {
        this.futurePopulationTotal += amount;
    }

    requestBuilders(amount) {
        this.futureBuilders += amount;
    }

    requestCarriers(amount) {
        this.futureCarriers += amount;
    }

    requestWorkers(amount) {
        this.futureWorkers += amount;
    }

    useBuilders(amount) {
        this.currentBuilders += amount;
    }

    useCarriers(amount) {
        this.currentCarriers += amount;
    }

    useWorkers(amount) {
        this.currentWorkers += amount;
    }

    resourcesProduced(productionLevel) {
        this.tech += productionLevel;
    }

    getWorldState() {
        return {
            morale: Math.round(this.morale * moraleMultiplier),
            tech: this.tech,
            popRemain: this.currentIdlePopulation,
            popTotalProduce: this.currentPopulationTotal,
            popTotalBuilder: this.currentBuilders,
            popTotalCarrier: this.currentCarriers,
            popTotalWorker: this.currentWorkers
        };
    }
}

const worldManager = new WorldManager();

export default worldManager;