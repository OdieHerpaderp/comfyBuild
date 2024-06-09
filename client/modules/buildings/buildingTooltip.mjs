import { getHTMLTemplate, useTemplate } from "templateHelper";
import { buildingPhases } from "buildings";
import { socket } from "singletons";

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
        this.workRemaining = this.selectedBuilding.workRemaining;
        this.buildingPhase = buildingPhases[this.selectedBuilding.buildingPhase];
    }

    constructor() {
        useTemplate.bind(this)(template);
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

    handleEvent(event) {
        if (event.type === "propertyChanged") {
            if (event.detail.propertyName == "buildingPhase") {
                this[event.detail.propertyName] = buildingPhases[event.detail.newValue];
            }
            else {
                this[event.detail.propertyName] = event.detail.newValue;
            }
        }
    }
}

export { BuildingTooltip };
export default BuildingTooltip;