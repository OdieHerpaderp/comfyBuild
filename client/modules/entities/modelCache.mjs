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
        this.loadModel('foundation');
    }

    loadModel(modelName) {
        var that = this;
        this.constructor.loader.load('client/models/buildings/' + modelName + '.glb',
            (data) => { that.modelLoadedCallback(data, modelName); },
            undefined,
            () => { });
    }

    modelLoadedCallback(data, modelName) {
        this.models[modelName] = data.scene;
        data.scene.scale.set(.242, .242, .242);
    }

    getModel(modelName) {
        return this.models[modelName];
    }
}

export { ModelCache };
export default ModelCache;