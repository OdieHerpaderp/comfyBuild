import { getHTMLTemplate, useTemplate } from "templateHelper";
import * as THREE from 'three';

let template = await getHTMLTemplate("client/modules/loadingScreen/loadingScreen.html");
class LoadingScreen extends EventTarget {
    static loadCompleteEvent = new Event("loadComplete");

    itemsLoaded = 0;
    itemsTotal = "?";
    percentage = 0;

    constructor() {
        super();
        useTemplate.bind(this)(template);

        this.loadProgressBar = this.domElement.querySelector("progress");

        THREE.DefaultLoadingManager.onProgress = (...args) => { this.onProgress(...args); }
        THREE.DefaultLoadingManager.onLoad = (...args) => { this.onLoad(...args); }
    }

    onProgress(_url, itemsLoaded, itemsTotal) {
        this.itemsLoaded = itemsLoaded;
        this.itemsTotal = itemsTotal;
        this.percentage = Math.floor((itemsLoaded / itemsTotal) * 100);
        this.loadProgressBar.setAttribute("value", this.percentage);
    }

    onLoad() {
        this.dispatchEvent(LoadingScreen.loadCompleteEvent);
        this.domElement.remove();
        delete this.domElement;
        THREE.DefaultLoadingManager.onLoad = undefined;
        THREE.DefaultLoadingManager.onProgress = undefined;
    }
}

export { LoadingScreen }
export default LoadingScreen;