import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";

let playerListEntryTemplate = await getHTMLTemplate("client/modules/playerList/playerListEntry.html");
class PlayerListEntry {
    id;
    color;
    number;
    username;
    isLocal;
    _x;
    get x() { return this._x; }
    set x(value) {
        this._x = value;
        this.displayX = value;
    }
    _y;
    get y() { return this._y; }
    set y(value) {
        this._y = value;
        this.displayY = value;
    }
    displayX;
    displayY;

    constructor(player) {
        useTemplate.bind(this)(playerListEntryTemplate);

        this.id = player.id;
        this.color = player.color;
        this.number = player.number;
        this.username = player.username;
        this.isLocal = player.isLocal;
        this.x = player.x;
        this.displayX = this.x;
        this.y = player.y;
        this.displayY = this.y;

        var userNameElement = this.domElement.querySelector("[data-content=username]");
        if (userNameElement) { userNameElement.style.color = this.color; }

        player.addEventListener("propertyChanged", (event) => { this.playerPropertyChanged(event); });
    }

    playerPropertyChanged(event) {
        if (event.detail.propertyName === "x" || event.detail.propertyName === "y") {
            this[event.detail.propertyName] = event.detail.newValue;
        }
    }
}

let playerListTemplate = await getHTMLTemplate("client/modules/playerList/playerList.html");
class PlayerList {
    jsFrameSettings = {
        name: `framePlayers`,
        title: `Players`,
        left: 1560, top: 40, width: 300, height: 100, minWidth: 200, minHeight: 100,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18
        }
    }

    listEntries = [];
    players = {};

    constructor() {
        useTemplate.bind(this)(playerListTemplate);
    }

    addPlayer(player) {
        if (this.players[player.id] === player) { return; }
        this.players[player.id] = new PlayerListEntry(player);
        this.listEntries.push(this.players[player.id]);
    }

    removePlayer(player) {
        let playerEntry = this.players[player.id];
        if (playerEntry === undefined) { return; }
        this.listEntries = this.listEntries.filter(entry => entry !== playerEntry);
        delete this.players[player.id];
    }
}

Object.assign(PlayerList.prototype, jsFrameMixin);

export { PlayerList };
export default PlayerList;