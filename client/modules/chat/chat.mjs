import { getHtmlTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons"

class Chat {
    static loginSuccessfulEvent = new Event("loginSuccessful");
    static template;

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

    constructor() {
        this.HTML = Chat.template.content.cloneNode(true);

        this.chatOutput = this.HTML.querySelector("[data-property=chat]");
        if (this.chatOutput) {
            var element = document.createElement("span");
            element.innerHTML = "Hello!";
            this.chatOutput.appendChild(element);
        }

        this.chatInput = this.HTML.querySelector("[data-input=chat]");
        this.sendButton = this.HTML.querySelector("[data-action=send]");

        var that = this;
        socket.on('addToChat', function (text) {
            that.addToChat(text);
        });
    }

    addToChat(text) {
        var span = document.createElement("span");
        span.innerHTML = text;
        this.chatOutput.insertBefore(span, this.chatOutput.firstChild);
    }
}

Object.assign(Chat.prototype, jsFrameMixin);
Chat.template = await getHtmlTemplate("client/modules/chat/chat.html");

export { Chat };
export default Chat;