import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons";

let template = await getHTMLTemplate("client/modules/worldInfo/worldInfo.html");
class WorldInfo {
    jsFrameSettings = {
        name: `frameInfo`,
        title: `Status`,
        left: 4, top: 66, width: 600, height: 110, minWidth: 600, minHeight: 68,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18
        }
    }

    tech = 0;
    techDisplay = 0;
    currentPopulation = 0;
    maxPopulation = 0;
    morale = 0;

    constructor() {
        useTemplate.bind(this)(template);
        socket.on('gameState', (data) => { this.updateData(data); });
    }

    tick() {
        if (Math.abs(this.techDisplay - this.tech) < 0.1) { this.techDisplay = this.tech; }
        else if (this.tech > this.techDisplay) { this.techDisplay += Math.floor(1 + (this.tech - this.techDisplay) / 10); }
        else { this.techDisplay -= Math.floor(1 + (this.techDisplay - this.tech) / 10); }
    }

    updateData(data) {
        this.tech = data.tech ?? this.tech;
        this.popRemain = data.popRemain ?? this.popRemain;
        this.popTotalProduce = data.popTotalProduce ?? this.popTotalProduce;
        this.popTotalWorker = data.popTotalWorker ?? this.popTotalWorker;
        this.popTotalBuilder = data.popTotalBuilder ?? this.popTotalBuilder;
        this.popTotalCarrier = data.popTotalCarrier ?? this.popTotalCarrier;
        if (data.morale !== undefined) {
            this.morale = Math.round(data.morale / 100);
        }
        this.level = (1 + Math.round(Math.pow(this.techDisplay / 200, 0.45) * 10) / 100).toLocaleString();
    }
}

Object.assign(WorldInfo.prototype, jsFrameMixin);

export { WorldInfo };
export default WorldInfo;