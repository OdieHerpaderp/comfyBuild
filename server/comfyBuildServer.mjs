import ResourceNode from "./entities/resourceNode.mjs";
import Player from "./entities/player.mjs";
import { Server, Socket } from "socket.io";
import buildingManager from "./managers/buildingManager.mjs";
import resourceNodeManager from "./managers/resourceNodeManager.mjs";
import worldManager from "./managers/worldManager.mjs";
import stockpile from "./stockpile.mjs";
import playerManager from "./managers/playerManager.mjs";

class ComfyBuildServer {
    /** @type { Player[] } */
    players = [];
    /** @type { Socket[] } */
    sockets = [];
    /** @type {Server} */
    io;

    tickCount = 0;

    /**
     * 
     * @param {Server} io 
     */
    constructor(io) {
        console.log("ComfyBuild server is initializing...");

        buildingManager.tryBuildBuilding(54, 54, "headquarters");

        resourceNodeManager.addEntity(new ResourceNode(50, 50, "rockDeposit"));
        buildingManager.tryBuildBuilding(50, 50, "caveGatherers");

        resourceNodeManager.addEntity(new ResourceNode(58, 58, "forest"));
        buildingManager.tryBuildBuilding(58, 58, "forestGatherers");

        resourceNodeManager.generateResourceNodes();

        stockpile.addResource("wood", 128);
        stockpile.addResource("stone", 128);

        this.io = io;
        this.io.on("connection", (socket) => this.onSocketConnect(socket));
        console.log("ComfyBuild server started!");
    }

    gameTick() {
        // worldManager must get a tick before anything else
        worldManager.tick();
        buildingManager.tick();

        this.sendTickData();

        if (this.tickCount % 10 === 0) {
            this.sendStockpileChanges();
        }

        this.tickCount++;
    }

    /**
     * @param {Socket} socket 
     */
    onSocketConnect(socket) {
        socket.on('disconnect', () => this.onSocketDisconnect(socket));
        socket.on('signUp', (data) => this.onSignUp(socket, data));
        socket.on('signIn', (data) => this.onSignIn(socket, data));
        socket.on('sendInit', () => this.sendInit(socket));
    }

    /**
     * @param {Socket} socket 
     */
    onSocketDisconnect(socket) {
        playerManager.onSocketDisconnect(socket);
    }

    onSignUp(socket, data) {
        console.log("SignUp");
        // TODO: actually save in a database
        socket.emit('signUpResponse', { success: true });
    }

    onSignIn(socket, data) {
        console.log("User \"" + data.username + "\" logging in...");
        // TODO: actually check login data
        const player = new Player(54, 54, data.username, socket);
        playerManager.addPlayer(player);
        socket.emit('signInResponse', { success: true, playerId: player.id });
    }

    sendInit(socket) {
        let init = {
            buildings: buildingManager.getAllData(),
            resourceNodes: resourceNodeManager.getAllData(),
            players: playerManager.getAllData()
        };

        socket.emit('init', init);
        socket.emit('stockpile', stockpile.getCurrentStockpile());
    }

    sendTickData() {
        let buildingData = buildingManager.getTickData();
        let resourceNodeData = resourceNodeManager.getTickData();
        let playerData = playerManager.getTickData();

        let init = {
            buildings: buildingData.init,
            resourceNodes: resourceNodeData.init,
            players: playerData.init
        };
        let update = {
            buildings: buildingData.update,
            resourceNodes: resourceNodeData.update,
            players: playerData.update
        };
        let remove = {
            buildings: buildingData.remove,
            resourceNodes: resourceNodeData.remove,
            players: playerData.remove
        };

        // TODO: why not just 1 emit per tick? 
        this.io.emit('init', init);
        this.io.emit('update', update);
        this.io.emit('remove', remove);
        this.io.emit('gameState', worldManager.getWorldState());
    }

    sendStockpileChanges() {
        this.io.emit('stockpile', stockpile.getStockpileChanges());
    }
}
export default ComfyBuildServer;