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
    get selectedBuilding() {
        return this._selectedBuilding;
    }
    set selectedBuilding(value) {
        if (this._selectedBuilding === value) { return; }
        this._selectedBuilding = value;
        this.dispatchEvent(new CustomEvent("selectedBuildingChanged", { detail: { "building": this.selectedBuilding } }));
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
        this.localPlayerId = data.selfId ?? this.localPlayerId;

        for (var i = 0; i < data.player.length; i++) {
            if (this.players[data.player[i].id]) {
                console.warn(`Player ${data.player[i].id} was already initialized! Skipping...`);
                continue;
            }
            let player = new Player(data.player[i], data.player[i].id == this.localPlayerId);
            this.players[player.id] = player;
            this.scene.add(player.mesh);
            if (player.isLocal) {
                var that = this;
                player.addEventListener("propertyChanged", (event) => { that.localPlayerPropertyChanged(event); });
            }
        }
        for (var i = 0; i < data.tower.length; i++) {
            if (this.buildings[data.tower[i].id]) {
                console.warn(`Building ${data.tower[i].id} was already initialized! Skipping...`);
                continue;
            }
            let building = new Building(data.tower[i]);
            this.buildings[building.id] = building;
            this.scene.add(building.mesh);
            if (this.localPlayer && building.x == this.localPlayer.x && building.y == this.localPlayer.y) {
                this.selectedBuilding = building;
            }
        }
        for (var i = 0; i < data.bullet.length; i++) {
            if (this.resourceNodes[data.bullet[i].id]) {
                console.warn(`ResourceNode ${data.bullet[i].id} was already initialized! Skipping...`);
                continue;
            }
            let resourceNode = new ResourceNode(data.bullet[i]);
            this.resourceNodes[resourceNode.id] = resourceNode;
            this.scene.add(resourceNode.mesh);
        }
    }

    onUpdateEntities(data) {
        for (var i = 0; i < data.player.length; i++) {
            let updateData = data.player[i];
            if (!updateData) { continue; }
            let player = this.players[updateData.id];
            if (!player) { continue; }
            player.update(updateData);
        }
        for (var i = 0; i < data.tower.length; i++) {
            let updateData = data.tower[i];
            if (!updateData) { continue; }
            let building = this.buildings[updateData.id];
            if (!building) { continue; }
            building.update(updateData);
        }
    }

    onRemoveEntities(data) {
        for (var i = 0; i < data.player.length; i++) {
            let id = data.player[i];
            let player = this.players[id];
            if (!player) { continue; }
            if (player.mesh) { this.scene.remove(player.mesh); }
            delete this.players[id];
        }

        for (var i = 0; i < data.tower.length; i++) {
            let id = data.tower[i];
            let building = this.buildings[id];
            if (!building) { continue; }
            if (building.mesh) { this.scene.remove(building.mesh); }
            if (this.selectedBuilding === building) {
                this.selectedBuilding = undefined;
            }
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

    localPlayerPropertyChanged(event) {
        if (event.type === "propertyChanged" && event.detail.propertyName === "position") {
            this.updateSelectedBuilding();
        }
    }

    updateSelectedBuilding() {
        if (!this.localPlayer) { return; }
        this.selectedBuilding = this.getBuildingAtCoordinates(this.localPlayer.x, this.localPlayer.y);
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

    getSelectedBuilding() {
        return this.selectedBuilding;
    }
}

export { EntityManager };
export default EntityManager;