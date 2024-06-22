import Player from "../entities/player.mjs";
import cheatManager from "./cheatManager.mjs";

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

        let handledCommand = false;
        switch (command) {
            case "tech":
                handledCommand = cheatManager.cheatTech(player, args);
                break;
            case "building":
                handledCommand = cheatManager.cheatBuilding(player, args);
                break;
            case "resource":
                handledCommand = cheatManager.cheatResource(player, args);
                break;
            case "research":
                handledCommand = cheatManager.cheatResearch(player, args);
                break;
            default:
                break;
        }

        if (!handledCommand) {
            player.socket.emit("systemChatMessage", { message: "Unknown command: " + command });
        }
    }
}

const chatManager = new ChatManager();
export default chatManager;