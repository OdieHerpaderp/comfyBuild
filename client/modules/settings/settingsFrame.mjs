import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";

class SettingsFrame {
    static template;
    jsFrameSettings = {
        name: "frameBuildingTooltip",
        title: "Settings",
        left: 380, top: 360, width: 320, height: 320, minWidth: 560, minHeight: 110,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18,
            display: 'flex'
        }
    };

    constructor() {
        this.loadTemplate();
        this.registerProperty("content");
    }

    updateDisplay() {
    }
}

// TODO: make this work again
//document.getElementById("frameTimeSlider").oninput = function () {
//    targetFrameTime = this.value;
//    document.getElementById("targetFrameTime").innerHTML = this.value;
//}

//document.getElementById("renderScaleSlider").oninput = function () {
//    renderScale = this.value;
//    document.getElementById("renderScale").innerHTML = this.value;
//}

Object.assign(SettingsFrame.prototype, jsFrameMixin);
Object.assign(SettingsFrame.prototype, templateMixin);
SettingsFrame.template = await getHtmlTemplate("client/modules/settings/settingsFrame.html");

export { SettingsFrame };
export default SettingsFrame;