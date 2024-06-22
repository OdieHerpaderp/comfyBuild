import Player from "../entities/player.mjs";
import cheatManager from "./cheatManager.mjs";
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
                if (cheatManager.cheatTech(player, args)) { break; }
            default:
                player.socket.emit("systemChatMessage", { message: "Unknown command: " + command });
        }
    }
}

const chatManager = new ChatManager();
export default chatManager;