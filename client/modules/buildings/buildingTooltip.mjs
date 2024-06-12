import { getHTMLTemplate, useTemplate } from "templateHelper";
import { buildings, buildingPhases } from "buildings";
import { socket } from "singletons";
import { ShortResourceDisplayList } from "shortResourceDisplay";
import { progressPerBuild, progressPerProduction, buildCostMultiplier, consumeMultiplier, produceMultiplier } from "lib";

let template = await getHTMLTemplate("client/modules/buildings/buildings.html", "buildingTooltip");
class BuildingTooltip {
    upgradeAmount = 1;

    _selectedBuilding;
    get selectedBuilding() { return this._selectedBuilding; }
    set selectedBuilding(value) {
        if (this._selectedBuilding === value) { return; }
        if (this.selectedBuilding) {
            this.selectedBuilding.removeEventListener("propertyChanged", this);
        }
        this._selectedBuilding = value;
        this.selectedBuilding.addEventListener("propertyChanged", this);

        this.buildingType = this.selectedBuilding.buildingType;
        this.upgradeLevel = this.selectedBuilding.upgradeLevel;
        this.targetLevel = this.selectedBuilding.targetLevel;
        this.productionLevel = this.selectedBuilding.productionLevel;
        this.workRemaining = this.selectedBuilding.workRemaining;
        this.workRemainingDisplay = this.workRemaining;
        this.workCapacity = this.selectedBuilding.workCapacity;
        this.workUsage = this.selectedBuilding.workUsage;
        this.buildingPhaseId = this.selectedBuilding.buildingPhase;
        this.buildingPhase = buildingPhases[this.selectedBuilding.buildingPhase];
        this.updateWorkTotal();
        this.updateBuildCost();
        this.updateMaxConsumeProduce();
        this.updateCurrentConsumeProduce();
    }

    currentConsume;
    maxConsume;
    currentProduce;
    maxProduce;
    currentBuild;

    constructor() {
        useTemplate.bind(this)(template);

        this.currentConsume = new ShortResourceDisplayList();
        this.maxConsume = new ShortResourceDisplayList();
        this.currentProduce = new ShortResourceDisplayList();
        this.maxProduce = new ShortResourceDisplayList();
        this.currentBuild = new ShortResourceDisplayList();

        this.workProgressElement = this.domElement.querySelector("progress");
    }

    upgrade() {
        socket.emit('upgradeTower', this.upgradeAmount);
    }

    upgradeAll() {
        socket.emit('upgradeAll', this.upgradeAmount);
    }

    upgradeSameType() {
        socket.emit('upgradeSameType', this.upgradeAmount);
    }

    upgradePlus() {
        this.upgradeAmount++;
    }

    upgradeMinus() {
        this.upgradeAmount--;
    }

    sell() {
        socket.emit('sellTower');
    }

    updateWorkTotal() {
        let updateWorkRemaining = false;
        switch (this.buildingPhaseId) {
            case 1:
                updateWorkRemaining = true;
            case 2:
                this.workTotal = progressPerBuild(this.buildingType, this.upgradeLevel);
                break;
            case 3:
                updateWorkRemaining = true;
            case 4:
                this.workTotal = progressPerProduction(this.buildingType, this.productionLevel);
                break;
            default:
                this.workTotal = 0;
                break;
        }

        if (updateWorkRemaining) {
            this.workRemaining = this.workTotal;
            this.workRemainingDisplay = this.workTotal;
        }

        if (!this.workProgressElement) { return; }
        this.workProgressElement.setAttribute("value", this.workTotal - this.workRemainingDisplay);
        if (this.workTotal <= 0) {
            this.workProgressElement.setAttribute("max", 0);
        }
        else {
            this.workProgressElement.setAttribute("max", this.workTotal);
        }

    }

    updateCurrentConsumeProduce() {
        let building = buildings[this.buildingType];
        if (!building) { return; }

        if (building.consume) {
            this.currentConsume.clearResources();
            for (const [name, amount] of Object.entries(building.consume)) {
                this.currentConsume.updateResource(name, amount * consumeMultiplier(this.buildingType, this.productionLevel));
            }
        }
        if (building.produce) {
            this.currentProduce.clearResources();
            for (const [name, amount] of Object.entries(building.produce)) {
                this.currentProduce.updateResource(name, amount * produceMultiplier(this.buildingType, this.productionLevel));
            }
        }
    }

    updateMaxConsumeProduce() {
        let building = buildings[this.buildingType];
        if (!building) { return; }

        if (building.consume) {
            this.maxConsume.clearResources();
            for (const [name, amount] of Object.entries(building.consume)) {
                this.maxConsume.updateResource(name, amount * consumeMultiplier(this.buildingType, this.upgradeLevel));
            }
        }
        if (building.produce) {
            this.maxProduce.clearResources();
            for (const [name, amount] of Object.entries(building.produce)) {
                this.maxProduce.updateResource(name, amount * produceMultiplier(this.buildingType, this.upgradeLevel));
            }
        }
    }

    updateBuildCost() {
        let building = buildings[this.buildingType];
        if (!building || !building.build) { return; }

        this.currentBuild.clearResources();
        for (const [name, amount] of Object.entries(building.build)) {
            this.currentBuild.updateResource(name, amount * buildCostMultiplier(this.buildingType, this.upgradeLevel));
        }
    }

    handleEvent(event) {
        if (event.type !== "propertyChanged") { return; }

        if (event.detail.propertyName == "buildingPhase") {
            this.buildingPhaseId = event.detail.newValue;
            this.buildingPhase = buildingPhases[event.detail.newValue];
        }
        else {
            this[event.detail.propertyName] = event.detail.newValue;
        }

        switch (event.detail.propertyName) {
            case "upgradeLevel":
                this.updateWorkTotal();
                this.updateBuildCost();
                this.updateMaxConsumeProduce();
                break;
            case "productionLevel":
                this.updateWorkTotal();
                this.updateCurrentConsumeProduce();
                break;
            case "buildingPhase":
                this.updateWorkTotal();
                break;
            case "buildingType":
                this.updateWorkTotal();
                this.updateBuildCost();
                this.updateMaxConsumeProduce();
                this.updateCurrentConsumeProduce();
                break;
            default:
                break;
        }
        if (event.detail.propertyName == "buildingPhase" ||
            event.detail.propertyName == "buildingType" ||
            event.detail.propertyName == "upgradeLevel" ||
            event.detail.propertyName == "productionLevel") {
            this.updateWorkTotal();
        }
    }

    displayTick() {
        if (this.workRemaining != this.workRemainingDisplay) {
            if (this.workRemaining < this.workRemainingDisplay) {
                this.workRemainingDisplay -= Math.floor(1 + ((this.workRemainingDisplay - this.workRemaining) / 10));
            }
            else {
                this.workRemainingDisplay = this.workRemaining;
            }

            this.workProgressElement.setAttribute("value", this.workTotal - this.workRemainingDisplay);
        }
    }
}

export { BuildingTooltip };
export default BuildingTooltip;