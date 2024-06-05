import { getHTMLTemplate, useTemplate } from "templateHelper";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons";

let template = await getHTMLTemplate("client/modules/chat/chat.html");
class Chat {
    static loginSuccessfulEvent = new Event("loginSuccessful");

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
    }

    addToChat(text) {
        var span = document.createElement("span");
        span.textContent = text;
        this.chatMessages.unshift(span);
    }

    sendChat() {
        console.log(this.inputText);
    }
}

Object.assign(Chat.prototype, jsFrameMixin);

export { Chat };
export default Chat;