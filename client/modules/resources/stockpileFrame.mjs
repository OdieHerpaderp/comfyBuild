import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons"
import { LongResourceDisplayList } from "longResourceDisplay";

class StockpileFrame extends EventTarget {
    jsFrameSettings = {
        name: "frameStockpile",
        title: "Stockpile",
        left: 4, top: 180, width: 250, height: 420, minWidth: 200, minHeight: 110
    };

    constructor() {
        super();
        this.frameContent = new LongResourceDisplayList();
        this.frameContent.addEventListener('resourceClicked', event => this.dispatchEvent(new CustomEvent("resourceClicked", { detail: event.detail })));
        socket.on('stockpile', (...args) => this.frameContent.updateResources(...args));
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