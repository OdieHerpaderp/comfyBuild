import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { socket } from "singletons";

class BuildingTooltip {
    static template;

    _upgradeAmount = 0;

    get upgradeAmount() {
        return this._upgradeAmount;
    }
    set upgradeAmount(value) {
        this._upgradeAmount = value;
        this.setProperty("upgradeAmount", value);
    }

    constructor() {
        var that = this;

        this.loadTemplate();

        this.registerProperty("buildingType");
        this.registerProperty("upgradeLevel");
        this.registerProperty("targetLevel");
        this.registerProperty("buildTimer");
        this.registerProperty("upgradeAmount");

        this.registerAction("upgrade", () => { that.upgradeClick(); });
        this.registerAction("upgradeAll", () => { that.upgradeAllClick(); });
        this.registerAction("upgradeSameType", () => { that.upgradeSameTypeClick(); });
        this.registerAction("upgradePlus", () => { that.upgradePlusClick(); });
        this.registerAction("upgradeMinus", () => { that.upgradeMinusClick(); });
        this.registerAction("sell", () => { that.sellClick(); });

        socket.on('towerTooltip', (data) => { that.updateTooltip(data); });

        this.upgradeAmount = 1;
    }

    updateTooltip(data) {
        this.setProperty("LVL", data.LVL);
    }

    upgradeClick() {
        socket.emit('upgradeTower', this.upgradeAmount);
    }

    upgradeAllClick() {
        socket.emit('upgradeAll', this.upgradeAmount);
    }

    upgradeSameTypeClick() {
        socket.emit('upgradeSameType', this.upgradeAmount);
    }

    upgradePlusClick() {
        this.upgradeAmount++;
    }

    upgradeMinusClick() {
        this.upgradeAmount--;
    }

    sellClick() {
        socket.emit('sellTower');
    }

    updateDisplay(building) {
        if (building == this.selectedBuilding) { return; }
        if (this.selectedBuilding) {
            this.selectedBuilding.removeEventListener("propertyChanged", this);
        }
        this.selectedBuilding = building;
        this.selectedBuilding.addEventListener("propertyChanged", this);

        console.log(building);

        this.setProperty("buildingType", building.buildingType);
        this.setProperty("upgradeLevel", building.upgradeLevel);
        this.setProperty("targetLevel", building.targetLevel);
        this.setProperty("buildTimer", building.buildTimer);
    }

    handleEvent(event) {
        if (event.type === "propertyChanged"){
            this.setProperty(event.detail.propertyName, event.detail.newValue);
        }
    }
}

Object.assign(BuildingTooltip.prototype, templateMixin);
BuildingTooltip.template = await getHtmlTemplate("client/modules/buildings/buildingTooltip.html");

export { BuildingTooltip };
export default BuildingTooltip;