import Player from "../entities/player.mjs";
import worldManager from "./worldManager.mjs";

class ChatManager {
    /**
     * @param {Player} player 
     * @param {string} message 
     */
    chatMessage(player, message) {
        if (typeof message != "string" || message.length === 0) { return; }

        if (!message.startsWith("/")) {
            let chatMessage = { playerName: player.username, playerColor: player.color, message: message };
            player.socket.emit("playerChatMessage", chatMessage);
            player.socket.broadcast.emit("playerChatMessage", chatMessage);
            return;
        }

        let args = message.split(" ");
        let command = args.shift().substring(1);

        switch (command) {
            case "tech":
                this.cheatTech(player, args);
                break;
            default:
                player.socket.emit("systemChatMessage", { message: "Uknown command: " + command });
        }
    }

    /**
     * @param {Player} player 
     * @param {string[]} args 
     */
    cheatTech(player, args) {
        let amount = parseInt(args[1]);
        if (isNaN(amount)) {
            player.socket.emit("systemChatMessage", { message: "Usage: /tech set|add (amount)" });
            return;
        }
        switch (args[0]) {
            case "add":
                worldManager.tech += amount;
                player.socket.emit("systemChatMessage", { message: amount + " tech added!" });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: tech add " + amount, playerName: player.username, playerColor: player.color });
                break;
            case "set":
                worldManager.tech = amount;
                player.socket.emit("systemChatMessage", { message: "Tech set to " + amount });
                player.socket.broadcast.emit("systemChatMessage", { message: "[player] used cheat: tech set " + amount, playerName: player.username, playerColor: player.color });
                break;
            default:
                player.socket.emit("systemChatMessage", { message: "Usage: /tech set|add (amount)" });
        }
    }

    getSuccessResultCheat(message) {
        return {
            emit: { message: message, isSystem: true }
        }
    }
}

const chatManager = new ChatManager();
export default chatManager;