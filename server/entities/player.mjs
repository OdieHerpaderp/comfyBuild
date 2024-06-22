import { BaseEntity } from "./baseEntity.mjs";
import { Socket } from "socket.io";
import buildingManager from "../managers/buildingManager.mjs";
import researchManager from "../managers/researchManager.mjs";
import chatManager from "../managers/chatManager.mjs";

let playerColors = [
    "#FF6666",
    "#66FF66",
    "#6666FF",
    "#FFFF66",
    "#FF66FF",
    "#66FFFF"
];

function getNextPlayerColor() {
    var result = playerColors.shift();
    playerColors.push(result);
    return result;
}

class Player extends BaseEntity {
    _username;
    get username() {
        return this._username;
    }
    set username(value) {
        this._username = value;
        this.updateData.username = value;
    }

    _color;
    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
        this.updateData.color = value;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} username 
     * @param {Socket} socket 
     */
    constructor(x, y, username, socket) {
        super(x, y);

        if (!username) { username = "Anonymous"; }
        this.username = username;
        this.socket = socket;

        this.color = getNextPlayerColor();

        socket.on('changePosition', (data) => this.setPosition(data.x, data.y));

        // TODO: do we want this here or pass it to parent for registering?
        socket.on('upgradeBuilding', (data) => this.upgradeBuilding(data));
        socket.on('upgradeAll', (data) => this.upgradeAllBuildings(data));
        socket.on('upgradeSameType', (data) => this.upgradeSameType(data));
        socket.on('sellBuilding', () => this.sellBuilding());
        socket.on('buildBuilding', (data) => this.buildBuilding(data));
        socket.on('unlockResearch', (data) => this.unlockResearch(data));

        socket.on('chatMessage', (data) => this.chatMessage(data));

        socket.on('fakePlayer', (data) => this.movePlayer(data));

        this.afterConstructor();
    }

    getAllData() {
        var result = super.getAllData();
        result.username = this.username;
        result.color = this.color;
        return result;
    }

    onDisconnect() {

    }

    movePlayer(data) {
        this.x = Math.round(data.x);
        this.y = Math.round(data.y);
    }

    upgradeBuilding(amount) {
        var upgradeResult = buildingManager.upgradeBuilding(this.x, this.y, amount);
        if (upgradeResult.message) {
            this.socket.emit('addToChat', upgradeResult.message);
        }
    }

    upgradeAllBuildings(targetLevel) {
        var upgradeResult = buildingManager.upgradeAllBuildings(targetLevel);
        if (upgradeResult.message) {
            this.socket.emit('addToChat', upgradeResult.message);
        }
    }

    upgradeSameType(amount) {
        var upgradeResult = buildingManager.upgradeSameTypeBuildings(this.x, this.y, amount);
        if (upgradeResult.message) {
            this.socket.emit('addToChat', upgradeResult.message);
        }
    }

    sellBuilding() {
        let removeResult = buildingManager.sellBuilding(this.x, this.y);
        if (removeResult.message) {
            this.socket.emit('addToChat', removeResult.message);
        }
    }

    buildBuilding(buildingName) {
        var result = buildingManager.tryBuildBuilding(this.x, this.y, buildingName);
        if (result.message) {
            this.socket.emit('addToChat', result.message);
        }
    }

    unlockResearch(researchId) {
        let result = researchManager.tryUnlockResearch(researchId);
        if (result.message) {
            this.socket.emit('addToChat', result.message);
        }
    }

    chatMessage(message) {
        chatManager.chatMessage(this, message);
    }


}

export default Player;