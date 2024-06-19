import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import * as THREE from 'three';

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

    constructor(renderer, scene) {
        useTemplate.bind(this)(template);

        this.renderTonemap = 7;
        this.renderScale = 100;
        this.renderExp = 150;

        this.renderer = renderer;
        this.scene = scene;
    }


    displayTick() {
    }

    renderTonemapChanged(event) {
        let newValue = event.target.value;
        console.log("Changing tonemap to " + newValue);
        if (newValue == 0) {
            this.renderer.toneMapping = THREE.NoToneMapping;
        } else if (newValue == 1) {
            this.renderer.toneMapping = THREE.LinearToneMapping;
        } else if (newValue == 2) {
            this.renderer.toneMapping = THREE.ReinhardToneMapping;
        } else if (newValue == 3) {
            this.renderer.toneMapping = THREE.CineonToneMapping;
        } else if (newValue == 4) {
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        } else if (newValue == 5) {
            this.renderer.toneMapping = THREE.AgXToneMapping;
        } else if (newValue == 6) {
            this.renderer.toneMapping = THREE.NeutralToneMapping;
        } else if (newValue == 7) {
            this.renderer.toneMapping = THREE.CustomToneMapping;
        } else {
            this.renderer.toneMapping = THREE.NoToneMapping;
        }

        this.scene.traverse(object => {
            if (object.material) {
              object.material.toneMapped = true;
              object.material.needsUpdate = true;
            }
        });
    }

    renderExpChanged(event) {
        let newValue =  event.target.value;
        this.renderer.toneMappingExposure = newValue / 100;
    }

    renderScaleChanged(event) {
        let newValue =  event.target.value;
        this.renderer.setPixelRatio(window.devicePixelRatio * newValue / 100);
    }
}

Object.assign(SettingsFrame.prototype, jsFrameMixin);

export { SettingsFrame };
export default SettingsFrame;