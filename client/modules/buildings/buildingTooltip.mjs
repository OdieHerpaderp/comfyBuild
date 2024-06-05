import { getHTMLTemplate, useTemplate } from "templateHelper";
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
        this.buildTimer = this.selectedBuilding.buildTimer;
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
            this[event.detail.propertyName] = event.detail.newValue;
            this.setProperty(event.detail.propertyName, event.detail.newValue);
        }
    }
}

export { BuildingTooltip };
export default BuildingTooltip;