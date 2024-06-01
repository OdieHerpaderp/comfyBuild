import { ResourceNode } from "resourceNode";
import { socket } from "singletons";
import { Building } from "building";

class EntityManager {
    buildings = {};
    resourceNodes = {};

    constructor(scene) {
        var that = this;
        this.scene = scene;

        socket.on('init', (data) => { that.onInitEntities(data) });
        socket.on('update', (data) => { that.onUpdateEntities(data) });
        socket.on('remove', (data) => { that.onRemoveEntities(data) });
    }

    onInitEntities(data) {
        for (var i = 0; i < data.tower.length; i++) {
            let building = new Building(data.tower[i]);
            this.buildings[building.id] = building;
            this.scene.add(building.mesh);
        }
        for (var i = 0; i < data.bullet.length; i++) {
            let resourceNode = new ResourceNode(data.bullet[i]);
            this.resourceNodes[resourceNode.id] = resourceNode;
            this.scene.add(resourceNode.mesh);
        }
    }

    onUpdateEntities(data) {
        for (var i = 0; i < data.tower.length; i++) {
            let updateData = data.tower[i];
            if (!updateData) { continue; }
            let building = this.buildings[updateData.id];
            if (!building) { continue; }
            building.update(updateData);
        }
    }

    onRemoveEntities(data) {
        for (var i = 0; i < data.tower.length; i++) {
            let id = data.tower[i];
            let building = this.buildings[id];
            if (!building) { continue; }
            if (building.mesh) { this.scene.remove(building.mesh); }
            delete this.buildings[id];
        }

        for (var i = 0; i < data.bullet.length; i++) {
            let id = data.bullet[i];
            let resourceNode = this.resourceNodes[id];
            if (!resourceNode) { continue; }
            if (resourceNode.mesh) { this.scene.remove(resourceNode.mesh); }
            delete this.resourceNodes[id];
        }
    }
}

export { EntityManager };
export default EntityManager;