import { buildings } from "buildings";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ModelCache {
    static loader = new GLTFLoader();

    models = {};

    constructor() {
        for (const buildingName in buildings) {
            this.loadModel(buildingName);
        }
        // Load any non-building models in advance.
        this.loadModel('fallback');
    }

    loadModel(modelName) {
        var that = this;
        this.constructor.loader.load('client/models/buildings/' + modelName + '.glb',
            (data) => { that.modelLoadedCallback(data, modelName); },
            undefined,
            () => {  });
    }

    modelLoadedCallback(data, modelName) {
        this.models[modelName] = data.scene;
    }

    getModel(modelName) {
        return this.models[modelName];
    }
}

export { ModelCache };
export default ModelCache;