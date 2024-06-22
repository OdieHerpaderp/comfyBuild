import { ResourceNode } from "resourceNode";
import { socket } from "singletons";
import { Building } from "building";
import { Player } from "player";

class EntityManager extends EventTarget {
    selectedBuildingChangedEvent = new Event("selectedBuildingChanged");

    players = {};
    buildings = {};
    resourceNodes = {};

    localPlayerId;
    _selectedBuilding;
    _selectedResourceNode;

    get selectedBuilding() {
        return this._selectedBuilding;
    }
    set selectedBuilding(value) {
        if (this._selectedBuilding === value) { return; }
        this._selectedBuilding = value;
        this.dispatchEvent(new CustomEvent("selectedBuildingChanged", { detail: { "building": this.selectedBuilding } }));
    }

    get selectedResourceNode() {
        return this._selectedResourceNode;
    }
    set selectedResourceNode(value) {
        if (this._selectedResourceNode === value) { return; }
        this._selectedResourceNode = value;
        this.dispatchEvent(new CustomEvent("selectedResourceNodeChanged", { detail: { "resourceNode": this.selectedResourceNode } }));
    }

    get localPlayer() {
        return this.players[this.localPlayerId];
    }

    constructor(scene) {
        super();
        this.scene = scene;

        socket.on('init', (data) => { this.onInitEntities(data) });
        socket.on('update', (data) => { this.onUpdateEntities(data) });
        socket.on('remove', (data) => { this.onRemoveEntities(data) });
    }

    onInitEntities(data) {
        for (var i = 0; i < data.players.length; i++) {
            if (this.players[data.players[i].id]) {
                console.warn(`Player ${data.players[i].id} was already initialized! Skipping...`);
                continue;
            }
            let player = new Player(data.players[i], data.players[i].id == this.localPlayerId);
            this.players[player.id] = player;
            this.scene.add(player.mesh);
            if (player.isLocal) {
                player.addEventListener("propertyChanged", (event) => { this.localPlayerPropertyChanged(event); });
                this.updateSelectedBuilding();
            }
            this.dispatchEvent(new CustomEvent("playerConnected", { detail: { "player": player } }));
        }
        for (var i = 0; i < data.buildings.length; i++) {
            if (this.buildings[data.buildings[i].id]) {
                console.warn(`Building ${data.buildings[i].id} was already initialized! Skipping...`);
                continue;
            }
            let building = new Building(data.buildings[i]);
            this.buildings[building.id] = building;
            building.mesh.position.y = 0.001;
            this.scene.add(building.mesh);
            if (this.localPlayer && building.x == this.localPlayer.x && building.y == this.localPlayer.y) {
                this.selectedBuilding = building;
            }
        }
        for (var i = 0; i < data.resourceNodes.length; i++) {
            if (this.resourceNodes[data.resourceNodes[i].id]) {
                console.warn(`ResourceNode ${data.resourceNodes[i].id} was already initialized! Skipping...`);
                continue;
            }
            let resourceNode = new ResourceNode(data.resourceNodes[i]);
            this.resourceNodes[resourceNode.id] = resourceNode;
            this.scene.add(resourceNode.mesh);
        }
    }

    onUpdateEntities(data) {
        for (var i = 0; i < data.players.length; i++) {
            let updateData = data.players[i];
            if (!updateData) { continue; }
            let player = this.players[updateData.id];
            if (!player) { continue; }
            player.update(updateData);
        }
        for (var i = 0; i < data.buildings.length; i++) {
            let updateData = data.buildings[i];
            if (!updateData) { continue; }
            let building = this.buildings[updateData.id];
            if (!building) { continue; }
            building.update(updateData);
        }
    }

    onRemoveEntities(data) {
        for (var i = 0; i < data.players.length; i++) {
            let id = data.players[i];
            let player = this.players[id];
            if (!player) { continue; }
            if (player.mesh) { this.scene.remove(player.mesh); }
            delete this.players[id];
            this.dispatchEvent(new CustomEvent("playerDisconnected", { detail: { "player": player } }));
        }

        for (var i = 0; i < data.buildings.length; i++) {
            let id = data.buildings[i];
            let building = this.buildings[id];
            if (!building) { continue; }
            if (building.mesh) { this.scene.remove(building.mesh); }
            if (this.selectedBuilding === building) {
                this.selectedBuilding = undefined;
            }
            delete this.buildings[id];
        }

        for (var i = 0; i < data.resourceNodes.length; i++) {
            let id = data.resourceNodes[i];
            let resourceNode = this.resourceNodes[id];
            if (!resourceNode) { continue; }
            if (resourceNode.mesh) { this.scene.remove(resourceNode.mesh); }
            delete this.resourceNodes[id];
        }
    }

    localPlayerPropertyChanged(event) {
        if (event.type === "propertyChanged" && event.detail.propertyName === "position") {
            this.updateSelectedBuilding();
        }
    }

    updateSelectedBuilding() {
        if (!this.localPlayer) { return; }
        this.selectedBuilding = this.getBuildingAtCoordinates(this.localPlayer.x, this.localPlayer.y);
        this.selectedResourceNode = this.getResourceNodeAtCoordinates(this.localPlayer.x, this.localPlayer.y);
    }

    getBuildingAtCoordinates(x, y) {
        // Do we need something more efficient for this?
        for (let buildingId in this.buildings) {
            let building = this.buildings[buildingId];
            if (building.x === x && building.y === y) {
                return building;
            }
        }
    }

    getResourceNodeAtCoordinates(x, y) {
        // Do we need something more efficient for this?
        for (let resourceNodeId in this.resourceNodes) {
            let resourceNode = this.resourceNodes[resourceNodeId];
            if (resourceNode.x === x && resourceNode.y === y) {
                return resourceNode;
            }
        }
    }

    getSelectedBuilding() {
        return this.selectedBuilding;
    }

    getSelectedResourceNode() {
        return this.selectedResourceNode;
    }
}

export { EntityManager };
export default EntityManager;