import serverSettings from "../../lib/serverSettings.mjs";
import worldManager from "./worldManager.mjs";

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
                player.socket.emit("systemChatMessage", { message: amount + " tech added!" });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: tech add " + amount, playerName: player.username, playerColor: player.color });
                return true;
            case "set":
                worldManager.tech = amount;
                player.socket.emit("systemChatMessage", { message: "Tech set to " + amount });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: tech set " + amount, playerName: player.username, playerColor: player.color });
                return true;
            default:
                player.socket.emit("systemChatMessage", { message: "Usage: /tech set|add (amount)" });
                return true;
        }
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