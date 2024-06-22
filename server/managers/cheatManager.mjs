import serverSettings from "../../lib/serverSettings.mjs";
import worldManager from "./worldManager.mjs";
import buildingManager from "./buildingManager.mjs";
import stockpile from "../stockpile.mjs";
import researchManager from "./researchManager.mjs";

class CheatManager {

    /**
     * @param {Player} player 
     * @param {string[]} args 
     */
    cheatTech(player, args) {
        let amount = parseInt(args[1]);
        if (isNaN(amount)) {
            player.socket.emit("systemChatMessage", { message: "Usage: /tech set|add (amount)" });
            return true;
        }

        switch (args[0]) {
            case "add":
                worldManager.tech += amount;
                player.socket.emit("systemChatMessage", { message: amount + " tech added" });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: tech add " + amount, playerName: player.username, playerColor: player.color });
                break;
            case "set":
                worldManager.tech = amount;
                player.socket.emit("systemChatMessage", { message: "Tech set to " + amount });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: tech set " + amount, playerName: player.username, playerColor: player.color });
                break;
            default:
                player.socket.emit("systemChatMessage", { message: "Usage: /tech set|add (amount)" });
                break;
        }
        return true;
    }

    /**
     * @param {Player} player 
     * @param {string[]} args 
     */
    cheatBuilding(player, args) {
        if (args.length !== 2) { 
            player.socket.emit("systemChatMessage", { message: "Usage: /building [level newLevel]" });
            return true;
        }

        let amount = parseInt(args[1]);
        if (isNaN(amount)) {
            player.socket.emit("systemChatMessage", { message: "Usage: /building [level newLevel]" });
            return true;
        }

        let currentBuilding = buildingManager.grid[player.x][player.y];

        switch (args[0]) {
            case "level":
                if (!currentBuilding) {
                    player.socket.emit("systemChatMessage", { message: "Select a building first" });
                    return true;
                }
                if (!currentBuilding.canBeUpgraded) {
                    player.socket.emit("systemChatMessage", { message: "This building cannot be upgraded" });
                    return true;
                }
                currentBuilding.upgradeLevel = amount;
                currentBuilding.targetLevel = amount;
                player.socket.emit("systemChatMessage", { message: "building level set to " + amount });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: building level " + amount, playerName: player.username, playerColor: player.color });
                break;
            default:
                player.socket.emit("systemChatMessage", { message: "Usage: /building [level newLevel]" });
                break;
        }

        return true;
    }

    /**
     * @param {Player} player 
     * @param {string[]} args 
     */
    cheatResource(player, args) {
        if (args.length !== 3) { 
            player.socket.emit("systemChatMessage", { message: "Usage: /resource (resourceName) set|add (amount)" });
            return true;
        }

        let amount = parseInt(args[2]);
        if (isNaN(amount)) {
            player.socket.emit("systemChatMessage", { message: "Usage: /resource (resourceName) set|add (amount)" });
            return true;
        }

        switch (args[1]) {
            case "add":
                stockpile.addResource(args[0], amount);
                player.socket.emit("systemChatMessage", { message: `Added ${amount} to ${args[0]}` });
                player.socket.broadcast.emit("systemChatMessage", { message: `[player] used cheat: resource ${args[0]} add ${amount}`, playerName: player.username, playerColor: player.color });
                break;
            case "set":
                stockpile.setResource(args[0], amount);
                player.socket.emit("systemChatMessage", { message: `Set ${args[0]} to ${amount}` });
                player.socket.broadcast.emit("systemChatMessage", { message: `[player] used cheat: resource ${args[0]} add ${amount}`, playerName: player.username, playerColor: player.color });
                break;
            default:
                player.socket.emit("systemChatMessage", { message: "Usage: /resource (resourceName) set|add (amount)" });
                break;
        }
        return true;
    }

    /**
     * @param {Player} player 
     * @param {string[]} args 
     */
    cheatResearch(player, args) {
        if (args.length !== 2 || args[0] !== "unlock") { 
            player.socket.emit("systemChatMessage", { message: "Usage: /research unlock (researchId)|all" });
            return true;
        }

        if (args[1] === "all") {
            researchManager.forceUnlockAllResearch();
            player.socket.emit("systemChatMessage", { message: `Unlocked all research` });
            player.socket.broadcast.emit("systemChatMessage", { message: `[player] used cheat: research unlock all`, playerName: player.username, playerColor: player.color });
            return true;
        }

        let result = researchManager.forceUnlockResearch(args[1]);
        player.socket.emit("systemChatMessage", { message: result.message });
        if (result.success) {
            player.socket.broadcast.emit("systemChatMessage", { message: `[player] used cheat: research unlock ${args[1]}`, playerName: player.username, playerColor: player.color });
        }
        return true;
    }
}

let instance;
if (serverSettings.cheatsEnabled) {
    instance = new CheatManager();
}
else {
    // Cheats disabled, provide a proxy that returns false on every function
    instance = new Proxy({}, {
        get() {
            return function() { return false; };
        }
    });
}

const cheatManager = instance;
export default(cheatManager);