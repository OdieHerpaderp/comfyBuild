import { getHTMLTemplate, useTemplate } from "templateHelper";
import { buildingPhases } from "buildings";
import { socket } from "singletons";
import { progressPerBuild, progressPerProduction } from "lib";

let template = await getHTMLTemplate("client/modules/buildings/buildingTooltip.html");
class BuildingTooltip {
    static template;

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
    }

    constructor() {
        useTemplate.bind(this)(template);

        this.workProgressElement = this.domElement.querySelector("progress")
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

    handleEvent(event) {
        if (event.type !== "propertyChanged") { return; }

        if (event.detail.propertyName == "buildingPhase") {
            this.buildingPhaseId = event.detail.newValue;
            this.buildingPhase = buildingPhases[event.detail.newValue];
        }
        else {
            this[event.detail.propertyName] = event.detail.newValue;
        }

        if (event.detail.propertyName == "buildingPhase" ||
            event.detail.propertyName == "buildingType" ||
            event.detail.propertyName == "upgradeLevel" ||
            event.detail.propertyName == "productionLevel") {
            this.updateWorkTotal();
        }
    }

    updateDisplay() {
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