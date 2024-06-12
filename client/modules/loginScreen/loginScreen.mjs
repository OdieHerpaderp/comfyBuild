import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import { socket } from "singletons";

let template = await getHTMLTemplate("client/modules/loginScreen/loginScreen.html");
class LoginScreen extends EventTarget {
    static loginSuccessfulEvent = new Event("loginSuccessful");

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

    username = "";
    password = "";

    constructor() {
        super();
        useTemplate.bind(this)(template);

        socket.on('signInResponse', (data) => {
            if (data.success) { this.dispatchEvent(LoginScreen.loginSuccessfulEvent); }
            else { alert("Sign in unsuccessful."); }
        });

        socket.on('signUpResponse', (data) => {
            if (data.success) { alert("Sign up successful."); }
            else { alert("Sign up unsuccessful."); }
        });
    }

    signIn() {
        var hashed = blowfish.encrypt(this.password, 'sukkeltje', { cipherMode: 0, outputType: 1 });
        socket.emit('signIn', { username: this.username, password: hashed });
    }

    signUp() {
        var hashed = blowfish.encrypt(this.password, 'sukkeltje', { cipherMode: 0, outputType: 1 });
        socket.emit('signUp', { username: this.username, password: hashed });
    }
}

Object.assign(LoginScreen.prototype, jsFrameMixin);

export { LoginScreen };
export default LoginScreen;