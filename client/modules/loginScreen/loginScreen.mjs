import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons"

class LoginScreen {
    static loginSuccessfulEvent = new Event("loginSuccessful");
    static template;

    jsFrameSettings = {
        name: `frameLogin`,
        title: `Login`,
        left: 360, top: 40, width: 320, height: 220, minWidth: 200, minHeight: 110,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18
        }
    }

    constructor() {
        var that = this;
        this.loadTemplate();

        this.registerInput("username");
        this.registerInput("password");

        this.registerAction("signIn", () => { that.signIn(); });
        this.registerAction("signUp", () => { that.signUp(); });

        socket.on('signInResponse', function (data) {
            if (data.success) {
                that.dispatchEvent(LoginScreen.loginSuccessfulEvent);
            }
            else {
                alert("Sign in unsuccessul.");
            }
        });

        socket.on('signUpResponse', function (data) {
            if (data.success) {
                alert("Sign up successul.");
            }
            else {
                alert("Sign up unsuccessul.");
            }
        });
    }

    signIn() {
        var hashed = blowfish.encrypt(this.getInput("password"), 'sukkeltje', { cipherMode: 0, outputType: 1 });
        socket.emit('signIn', { username: this.getInput("username"), password: hashed });
    }

    signUp() {
        var hashed = blowfish.encrypt(this.getInput("password"), 'sukkeltje', { cipherMode: 0, outputType: 1 });
        socket.emit('signUp', { username: this.getInput("username"), password: hashed });
    }

    addEventListener(name, callback) {
        this.HTML.addEventListener(name, callback);
    }

    dispatchEvent(event) {
        this.HTML.dispatchEvent(event);
    }
}

Object.assign(LoginScreen.prototype, jsFrameMixin);
Object.assign(LoginScreen.prototype, templateMixin);
LoginScreen.template = await getHtmlTemplate("client/modules/loginScreen/loginScreen.html");

export { LoginScreen };
export default LoginScreen;