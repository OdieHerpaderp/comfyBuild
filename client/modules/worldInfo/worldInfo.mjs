import { getHTMLTemplate, useTemplate } from "templateHelper";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons";

let template = await getHTMLTemplate("client/modules/worldInfo/worldInfo.html");
class WorldInfo {
    jsFrameSettings = {
        name: `frameInfo`,
        title: `Tech`,
        left: 4, top: 66, width: 200, height: 110, minWidth: 200, minHeight: 110,
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
        if (this.tech > this.techDisplay) this.techDisplay += Math.floor(1 + (this.tech - this.techDisplay) / 10);
    }

    updateData(data) {
        this.tech = data.tech ?? this.tech;
        this.currentPopulation = data.health ?? this.currentPopulation;
        this.maxPopulation = data.maxHealth ?? this.maxPopulation;
        if (data.morale !== undefined) {
            this.morale = data.morale / 100;
        }
        this.level = (1 + Math.round(Math.pow(this.techDisplay / 200, 0.45) * 10) / 100).toLocaleString();
    }
}

Object.assign(WorldInfo.prototype, jsFrameMixin);

export { WorldInfo };
export default WorldInfo;