import { getHtmlTemplate } from "templateHelpers";
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
        this.HTML = LoginScreen.template.content.cloneNode(true);

        this.usernameInput = this.HTML.querySelector("[data-input=username]");
        this.passwordInput = this.HTML.querySelector("[data-input=password]");

        var signInButton = this.HTML.querySelector("[data-action=signIn]");
        if (signInButton) {
            signInButton.onclick = () => { this.signIn() };
        }

        var signUpButton = this.HTML.querySelector("[data-action=signUp]");
        if (signUpButton) {
            signUpButton.onclick = () => { this.signUp() };
        }

        var that = this;
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
        var hashed = blowfish.encrypt(this.passwordInput.value, 'sukkeltje', { cipherMode: 0, outputType: 1 });
        socket.emit('signIn', { username: this.usernameInput.value, password: hashed });
    }

    signUp() {
        var hashed = blowfish.encrypt(this.passwordInput.value, 'sukkeltje', { cipherMode: 0, outputType: 1 });
        socket.emit('signUp', { username: this.usernameInput.value, password: hashed });
    }

    addEventListener(name, callback) {
        this.HTML.addEventListener(name, callback);
    }

    dispatchEvent(event) {
        this.HTML.dispatchEvent(event);
    }
}

Object.assign(LoginScreen.prototype, jsFrameMixin);
LoginScreen.template = await getHtmlTemplate("client/modules/loginScreen/loginScreen.html");

export { LoginScreen };
export default LoginScreen;