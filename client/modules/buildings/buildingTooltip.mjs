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

        this.registerProperty("LVL");
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
}

Object.assign(BuildingTooltip.prototype, templateMixin);
BuildingTooltip.template = await getHtmlTemplate("client/modules/buildings/buildingTooltip.html");

export { BuildingTooltip };
export default BuildingTooltip;