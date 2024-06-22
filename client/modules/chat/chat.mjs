import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons";

let template = await getHTMLTemplate("client/modules/chat/chat.html");
class Chat {
    jsFrameSettings = {
        name: `frameChat`,
        title: `Chat`,
        left: 10, top: 800, width: 600, height: 150, minWidth: 110, minHeight: 110,
        style: {
            backgroundColor: '#22222255',
            overflow: 'auto',
            width: '100%',
            fontSize: 18,
            display: 'flex'
        }
    }

    inputText = "";
    chatMessages = [];

    constructor() {
        useTemplate.bind(this)(template);

        this.addToChat("Hello!");
        socket.on('addToChat', (text) => { this.addToChat(text); });
        socket.on('playerChatMessage', data => this.playerChatMessage(data));
        socket.on('systemChatMessage', data => this.systemChatMessage(data));
    }

    addToChat(text) {
        this.systemChatMessage({ message: text });
    }

    playerChatMessage(data) {
        console.log("playerChatMessage", data);
        let container = document.createElement("span");
        container.appendChild(this.createAuthorSpan(data.playerName, data.playerColor))
        let messageSpan = document.createElement("span");
        messageSpan.textContent = data.message;
        container.appendChild(messageSpan);
        this.chatMessages.unshift(container);
    }

    systemChatMessage(data) {
        console.log("systemChatMessage", data);
        let container = document.createElement("span");
        container.appendChild(this.createAuthorSpan("System"));
        let messageSpan = document.createElement("span");
        if (data.playerColor && data.playerName) {
            data.message = data.message.replace("[player]", `<span style="color:${data.playerColor};">${data.playerName}</span>`);
        }
        messageSpan.innerHTML = data.message;
        container.appendChild(messageSpan);
        this.chatMessages.unshift(container);
    }

    inputKeyUp(event) {
        if (event.key !== "Enter") { return; }
        this.sendChat();
    }

    sendChat() {
        socket.emit('chatMessage', this.inputText);
        this.inputText = "";
    }

    createAuthorSpan(author, color = "#ffffff") {
        let result = document.createElement("span");
        result.style.color = color;
        result.textContent = author;
        result.classList = ["chatAuthor"];
        return result;
    }
}

Object.assign(Chat.prototype, jsFrameMixin);

export { Chat };
export default Chat;