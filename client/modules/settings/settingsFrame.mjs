import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";

let template = await getHTMLTemplate("client/modules/settings/settingsFrame.html", "settingsFrame");
class SettingsFrame {
    jsFrameSettings = {
        name: "settingsFrame",
        title: "Settings",
        left: 380, top: 360, width: 280, height: 280, minWidth: 560, minHeight: 110,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18,
            display: 'flex'
        }
    };

    constructor(renderer) {
        useTemplate.bind(this)(template);

        this.renderer = renderer;
    }


    displayTick() {
    }

    renderExpChanged(event) {
        let newValue =  event.target.value;
        //TODO gain access to renderer.
        this.renderer.toneMappingExposure = newValue / 100;
    }

    renderScaleChanged(event) {
        let newValue =  event.target.value;
        //TODO gain access to renderer.
        this.renderer.setPixelRatio(window.devicePixelRatio * newValue / 100);
    }
}

Object.assign(SettingsFrame.prototype, jsFrameMixin);

export { SettingsFrame };
export default SettingsFrame;