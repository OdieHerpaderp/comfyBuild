import BaseEntity from "../entities/baseEntity.mjs";
import serverSettings from "../serverSettings.mjs"

class GridEntityManager {
    /** @type { BaseEntity[][] } */
    grid;

    removedEntities = [];

    constructor() {
        this.grid = Array(serverSettings.mapWidth).fill(0).map(() => Array(serverSettings.mapHeight));
    }

    /**
     * @param {BaseEntity} entity 
     */
    addEntity(entity) {
        if (this.grid[entity.x][entity.y]) { return false; }
        this.grid[entity.x][entity.y] = entity;
        return true;
    }

    removeEntityByPosition(x, y) {
        let entity = this.grid[x][y];
        if (!entity) { return false; }
        this.removedEntities.push(entity.id);
        delete this.grid[x][y];
        return entity;
    }

    getTickData() {
        let result = {
            init: [],
            update: [],
            remove: this.removedEntities
        };
        this.removedEntities = [];
        this.forEachEntity((entity) => {
            let initData = entity.getInitData();
            if (initData) { result.init.push(initData); }
            let updateData = entity.getUpdateData();
            if (updateData) { result.update.push(updateData); }
        });
        return result;
    }

    getAllData() {
        let result = [];
        this.forEachEntity((entity) => {
            result.push(entity.getAllData());
        });
        return result;
    }

    forEachEntity(callbackfn) {
        this.grid.forEach((line) => { line.forEach(callbackfn); });
    }
}

export default GridEntityManager;