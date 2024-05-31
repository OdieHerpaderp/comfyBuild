import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons";

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
        var that = this;

        this.loadTemplate();

        this.registerProperty("chat");

        this.registerInput("chat");
        this.registerAction("send", () => { that.sendChat(); });

        var span = document.createElement("span");
        span.innerHTML = "Hello!";
        this.appendChildToProperty("chat", span);

        socket.on('addToChat', function (text) { that.addToChat(text); });
    }

    addToChat(text) {
        var span = document.createElement("span");
        span.innerHTML = text;
        this.prependChildToProperty("chat", span);
    }

    sendChat() {
        console.log(this.getInput("chat"));
    }
}

Object.assign(Chat.prototype, jsFrameMixin);
Object.assign(Chat.prototype, templateMixin);
Chat.template = await getHtmlTemplate("client/modules/chat/chat.html");

export { Chat };
export default Chat;