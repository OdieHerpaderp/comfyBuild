import worldManager from "../managers/worldManager.mjs";
import { buildingPhasesNew as buildingPhases } from "../../lib/buildings.mjs";
import { progressPerProduction } from "../../lib/lib.mjs";
import Building from "./building.mjs";
import { resourceLimits } from "worker_threads";

class Housing extends Building {
    constructor(x, y, buildingType) {
        super(x, y, buildingType);
    }

    tickConsume() {
        // houses skip the consume stage and instead consume during production
        this.tickProduce();
    }

    tickConsume() {
        this.buildingPhase = buildingPhases.consume;

        let didConsume = false;
        while (this.productionLevel < this.upgradeLevel && this.checkProductionResources(true)) {
            this.productionLevel++;
            didConsume = true;
        }

        if (didConsume) {
            // Houses produce immediately, to keep the population count consistent
            this.workRemaining = progressPerProduction(this.buildingType, this.productionLevel);
            this.tickProduce();
            return;
        }
        this.tickIdle();
        return;
    }

    tickProduce() {
        this.buildingPhase = buildingPhases.produce;
        this.currentWorkers = this.productionLevel;

        if (this.workRemaining < this.currentWorkers) {
            this.currentWorkers = this.workRemaining;
        }

        this.workRemaining -= this.currentWorkers;

        if (this.currentWorkers === 0) {
            this.productionLevel = 0;
            this.tickIdle();
            return;
        }

        if (this.recipes.length === 0) {
            worldManager.producePopulation(this.productionLevel * this.baseProduce.population);
            return;
        }

        this.currentRecipe.produce.forEach(resource => {
            if (resource.name !== "population") { return; }
            worldManager.producePopulation(this.productionLevel * resource.amount);
        });
    }
}

export default Housing;