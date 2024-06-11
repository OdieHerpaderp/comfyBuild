import { jsFrameMixin } from "JSFrame";
import { LongResourceDisplayList } from "longResourceDisplay";

class StockpileFrame {
    jsFrameSettings = {
        name: "frameStockpile",
        title: "Stockpile",
        left: 4, top: 180, width: 250, height: 420, minWidth: 200, minHeight: 110
    };

    constructor() {
        this.frameContent = new LongResourceDisplayList();
    }

    updateResources(...args) {
        this.frameContent.updateResources(...args);
    }

    displayTick(...args) {
        this.frameContent.displayTick(...args);
    }
}

Object.assign(StockpileFrame.prototype, jsFrameMixin);

export { StockpileFrame };
export default StockpileFrame;