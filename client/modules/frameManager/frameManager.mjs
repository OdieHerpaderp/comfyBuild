import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import LoginScreen from "loginScreen";
import BuildingsFrame from "buildingsFrame";
import Chat from "chat";
import PlayerList from "playerList";
import StockpileFrame from "stockpileFrame";
import WorldInfo from "worldInfo";
import SettingsFrame from "settingsFrame";


let template = await getHTMLTemplate("client/modules/frameManager/frameManager.html");
class FrameManager {
    jsFrameSettings = {
        name: "frameManager",
        title: "Frames",
        left: 380, top: 360, width: 560, height: 56, minWidth: 50, minHeight: 56,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18,
            display: 'flex'
        }
    };

    constructor(renderer, scene) {
        useTemplate.bind(this)(template);

        this.loginScreen = new LoginScreen();
        this.loginScreen.addEventListener("loginSuccessful", data => this.loginSuccessful(data));

        this.buildingsFrame = new BuildingsFrame();
        this.chat = new Chat();
        this.playerList = new PlayerList();
        this.stockpile = new StockpileFrame();
        this.worldInfo = new WorldInfo();

        this.settingsFrame = new SettingsFrame(renderer, scene);
    }

    addEventListener(eventName, callbackFunction) {
        switch (eventName) {
            case "loginSuccessful": this.loginScreen.addEventListener(eventName, data => callbackFunction(data));
        }
    }

    loadComplete() {
        this.loginScreen.showFrame();
        this.loginScreen.setFramePosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');
    }

    loginSuccessful(data) {
        //settingsFrame.showFrame();

        this.loginScreen.closeFrame();

        this.buildingsFrame.showFrame();
        this.buildingsFrame.setFramePosition(window.innerWidth - 4, window.innerHeight - 4, 'RIGHT_BOTTOM');

        this.chat.showFrame();
        this.chat.setFramePosition(4, window.innerHeight - 4, "LEFT_BOTTOM");

        this.playerList.showFrame();
        this.playerList.setFramePosition(window.innerWidth - 4, 4, "RIGHT_TOP");

        this.stockpile.showFrame();

        this.worldInfo.showFrame();
        this.worldInfo.setFramePosition(window.innerWidth / 2, 4, 'CENTER_TOP');

        this.showFrame();
        this.setFramePosition(window.innerWidth / 2, window.innerHeight - 4, 'CENTER_BOTTOM');
    }

    displayTick() {
        this.buildingsFrame.displayTick();
        this.stockpile.displayTick();
        this.worldInfo.tick();
    }

    buildingsToggleChanged(event) {
        if (event.target.checked) { this.buildingsFrame.showFrame(); }
        else { this.buildingsFrame.hideFrame(); }
    }

    chatToggleChanged(event) {
        if (event.target.checked) { this.chat.showFrame(); }
        else { this.chat.hideFrame(); }
    }

    playersToggleChanged(event) {
        if (event.target.checked) { this.playerList.showFrame(); }
        else { this.playerList.hideFrame(); }
    }

    settingsToggleChanged(event) {
        if (event.target.checked) { this.settingsFrame.showFrame(); }
        else { this.settingsFrame.hideFrame(); }
    }

    statusToggleChanged(event) {
        if (event.target.checked) { this.worldInfo.showFrame(); }
        else { this.worldInfo.hideFrame(); }
    }

    stockpileToggleChanged(event) {
        if (event.target.checked) { this.stockpile.showFrame(); }
        else { this.stockpile.hideFrame(); }
    }
}

Object.assign(FrameManager.prototype, jsFrameMixin);
export default FrameManager;