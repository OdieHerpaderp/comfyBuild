import { buildings, buildingPhasesNew as buildingPhases } from "../../lib/buildings.mjs";
import BaseEntity from "./baseEntity.mjs";
import { buildCostMultiplier, progressPerBuild, consumeMultiplier, produceMultiplier, progressPerProduction } from "../../lib/lib.mjs";
import worldManager from "../managers/worldManager.mjs";
import stockpile from "../stockpile.mjs";

class Building extends BaseEntity {
    // base data
    _buildingType;
    get buildingType() {
        return this._buildingType;
    }
    set buildingType(value) {
        this._buildingType = value;
        this.updateData.buildingType = value;
    }
    age;
    category;
    info;
    node;
    baseConsume;
    baseProduce;
    baseBuild;
    requiredResearch;
    recipes;

    // dynamic values
    _upgradeLevel;
    get upgradeLevel() { return this._upgradeLevel; }
    set upgradeLevel(value) {
        this._upgradeLevel = value;
        this.updateData.upgradeLevel = value;
        this.maxWorkers = value;
    }
    _targetLevel;
    get targetLevel() { return this._targetLevel; }
    set targetLevel(value) {
        this._targetLevel = value;
        this.updateData.targetLevel = value;
    }
    _buildingPhase;
    get buildingPhase() { return this._buildingPhase; }
    set buildingPhase(value) {
        this._buildingPhase = value;
        this.updateData.buildingPhase = value;
    }
    _productionLevel;
    get productionLevel() { return this._productionLevel; }
    set productionLevel(value) {
        this._productionLevel = value;
        this.updateData.productionLevel = value;
    }
    idleTicks;
    _workRemaining;
    get workRemaining() { return this._workRemaining; }
    set workRemaining(value) {
        this._workRemaining = value;
        this.updateData.workRemaining = value;
    }
    _currentWorkers;
    get currentWorkers() { return this._currentWorkers; }
    set currentWorkers(value) {
        this._currentWorkers = value;
        this.updateData.currentWorkers = value;
    }
    _maxWorkers;
    get maxWorkers() { return this._maxWorkers; }
    set maxWorkers(value) {
        this._maxWorkers = value;
        this.updateData.maxWorkers = value;
    }
    _currentRecipeIndex;
    get currentRecipeIndex() { return this._currentRecipeIndex; }
    set currentRecipeIndex(value) {
        this._currentRecipeIndex = value;
        this.updateData.currentRecipeIndex = value;
    }
    get currentRecipe() { return this.recipes[this.currentRecipeIndex]; }

    // static values
    get canBeUpgraded() { return true; }

    constructor(x, y, buildingType) {
        super(x, y);

        this.buildingType = buildingType;
        let buildingData = buildings[buildingType];

        if (!buildingData) {
            console.error("Building \"" + buildingType + "\" does not exist!");
            return;
        }

        this.age = buildingData.age;
        this.category = buildingData.category;
        this.info = buildingData.info;
        this.node = buildingData.node;
        this.recipes = buildingData.recipes ?? [];
        this.build = buildingData.build ?? [];
        this.requiredResearch = buildingData.requiredResearch ?? [];

        this.recipes.forEach(recipe => {
            if (!recipe.consume) { recipe.consume = []; }
            if (!recipe.produce) { recipe.produce = []; }
        });

        // TODO: remove these once obsolete
        this.baseConsume = buildingData.consume ?? {};
        this.baseProduce = buildingData.produce ?? {};
        this.baseBuild = buildingData.build ?? {};

        this.currentRecipeIndex = 0;
        this.workRemaining = 0;
        this.upgradeLevel = 0;
        this.maxWorkers = 1;
        this.targetLevel = 1;
        this.buildingPhase = 0;
        this.productionLevel = 0;

        this.afterConstructor();
    }

    getAllData() {
        var result = super.getAllData();
        result.buildingType = this.buildingType;
        result.upgradeLevel = this.upgradeLevel;
        result.targetLevel = this.targetLevel;
        result.buildingPhase = this.buildingPhase;
        result.productionLevel = this.productionLevel;
        result.maxWorkers = this.maxWorkers;
        return result;
    }

    tick() {
        switch (this.buildingPhase) {
            case buildingPhases.buildGather: this.tickBuildGather(); break;
            case buildingPhases.build: this.tickBuild(); break;
            case buildingPhases.consume: this.tickConsume(); break;
            case buildingPhases.produce: this.tickProduce(); break;
            default: this.tickIdle(); break;
        }
    }

    tickIdle() {
        this.buildingPhase = buildingPhases.idle;
        if (this.targetLevel > this.upgradeLevel && this.checkBuildResources(false)) {
            this.repeatIdle = 0;
            this.productionLevel = 0;
            this.tickBuildGather();
            return;
        }
        if (this.upgradeLevel > 0 && this.checkProductionResources(false)) {
            this.buildingPhase = buildingPhases.consume;
            this.productionLevel = 0;
            this.repeatIdle = 0;
            this.tickConsume();
            return;
        }
        // Next tick we'll try to gather
        worldManager.requestCarriers(this.maxWorkers);
        this.repeatIdle++;
    }

    tickBuildGather() {
        this.buildingPhase = buildingPhases.buildGather;
        if (this.productionLevel == 0) {
            if (this.checkBuildResources(true)) {
                this.currentWorkers = this.getCurrentCarriers();
                worldManager.useCarriers(this.currentWorkers);
                this.workRemaining = progressPerBuild(this.buildingType, this.upgradeLevel);
                this.productionLevel = this.maxWorkers;
                worldManager.requestBuilders(this.maxWorkers);
                return;
            }
            this.tickIdle();
            return;
        }
        this.tickBuild();
    }

    tickBuild() {
        this.buildingPhase = buildingPhases.build;
        this.currentWorkers = this.getCurrentBuilders();

        if (this.workRemaining < this.currentWorkers) {
            this.currentWorkers = this.workRemaining;
        }

        worldManager.useBuilders(this.currentWorkers);
        this.workRemaining -= this.currentWorkers;

        if (this.currentWorkers === 0) {
            this.upgradeLevel++;
            this.productionLevel = 0;
            this.tickIdle();
            return;
        }

        if (this.workRemaining === 0) {
            worldManager.requestCarriers(this.maxWorkers);
            return;
        }

        // Don't request workRemaining here, that messes with the calculations.
        worldManager.requestBuilders(this.maxWorkers);
    }

    tickConsume() {
        this.buildingPhase = buildingPhases.consume;
        const maxWorkers = this.getCurrentCarriers();
        this.currentWorkers = 0;
        let didConsume = false;
        while (this.productionLevel < this.upgradeLevel && this.currentWorkers < maxWorkers && this.checkProductionResources(true)) {
            this.productionLevel++;
            this.currentWorkers++;
            didConsume = true;
        }
        if (didConsume) {
            // TODO: use more carriers to speed up consume, if available
            worldManager.useCarriers(this.currentWorkers);
            if (this.productionLevel < this.upgradeLevel) {
                worldManager.requestCarriers(this.maxWorkers);
                return;
            }
            worldManager.requestWorkers(this.maxWorkers);
            return;
        }
        if (this.productionLevel == 0) {
            this.tickIdle();
            return;
        }

        this.workRemaining = progressPerProduction(this.buildingType, this.productionLevel);
        this.tickProduce();
    }

    tickProduce() {
        this.buildingPhase = buildingPhases.produce;
        this.currentWorkers = this.getCurrentWorkers();

        if (this.workRemaining < this.currentWorkers) {
            this.currentWorkers = this.workRemaining;
        }

        worldManager.useWorkers(this.currentWorkers);
        this.workRemaining -= this.currentWorkers;

        if (this.currentWorkers === 0) {
            this.produceResources();
            this.productionLevel = 0;
            this.tickIdle();
            return;
        }

        if (this.workRemaining === 0) {
            worldManager.requestCarriers(this.maxWorkers);
            return;
        }

        worldManager.requestWorkers(Math.min(this.maxWorkers, this.workRemaining));
    }

    checkBuildResources(consumeResources = false) {
        if (this.recipes.length === 0) { return this.checkBuildResourcesOld(consumeResources); }

        const resources = [];
        const multiplier = buildCostMultiplier(this.buildingType, this.upgradeLevel * (this.age + 1));
        this.build.forEach(resource => {
            resources.push({
                name: resource.name,
                amount: resource.amount * multiplier
            });
        });
        return stockpile.checkResources(resources, consumeResources);
    }

    // TODO: remove this once all old format buildings are gone
    checkBuildResourcesOld(consumeResources = false) {
        const resources = {};
        const multiplier = buildCostMultiplier(this.buildingType, this.upgradeLevel * (this.age + 1));
        for (const [key, value] of Object.entries(this.baseBuild)) {
            resources[key] = value * multiplier;
        }
        return stockpile.checkResourcesOld(resources, consumeResources);
    }

    checkProductionResources(consumeResources = false) {
        if (this.recipes.length === 0) { return this.checkProductionResourcesOld(consumeResources); }

        const resources = [];
        const previousMultiplier = consumeMultiplier(this.buildingType, this.productionLevel);
        const multiplier = consumeMultiplier(this.buildingType, this.productionLevel + 1) - previousMultiplier;
        this.currentRecipe.consume.forEach(resource => {
            resources.push({
                name: resource.name,
                amount: resource.amount * multiplier
            });
        });
        return stockpile.checkResources(resources, consumeResources);
    }

    // TODO: remove this once all old format buildings are gone
    checkProductionResourcesOld(consumeResources = false) {
        const resources = {};
        const previousMultiplier = consumeMultiplier(this.buildingType, this.productionLevel);
        const multiplier = consumeMultiplier(this.buildingType, this.productionLevel + 1) - previousMultiplier;
        for (const [key, value] of Object.entries(this.baseConsume)) {
            resources[key] = value * multiplier;
        }
        return stockpile.checkResourcesOld(resources, consumeResources);
    }

    produceResources() {
        if (this.recipes.length === 0) { return this.produceResourcesOld(); }

        const resources = [];
        const multiplier = produceMultiplier(this.buildingType, this.productionLevel);
        this.currentRecipe.produce.forEach(resource => {
            resources.push({
                name: resource.name,
                amount: resource.amount * multiplier
            });
        });
        worldManager.resourcesProduced(this.productionLevel);
        return stockpile.addResources(resources);
    }

    // TODO: remove this once all old format buildings are gone
    produceResourcesOld() {
        const resources = {};
        const multiplier = produceMultiplier(this.buildingType, this.productionLevel);
        for (const [key, value] of Object.entries(this.baseProduce)) {
            resources[key] = value * multiplier;
        }
        worldManager.resourcesProduced(this.productionLevel);
        return stockpile.addResourcesOld(resources);
    }

    getCurrentBuilders() {
        return Math.max(1, Math.floor(this.maxWorkers * worldManager.currentPopulationMultiplier));
    }

    getCurrentCarriers() {
        return Math.max(1, Math.floor(this.maxWorkers * worldManager.currentPopulationMultiplier));
    }

    getCurrentWorkers() {
        return Math.max(1, Math.floor(this.maxWorkers * worldManager.currentPopulationMultiplier));
    }
}

export default Building;