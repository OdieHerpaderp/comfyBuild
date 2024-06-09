import * as THREE from 'three';
import { lerp, lerpInverse } from 'lib';

const tau = Math.PI * 2;

class TimeBasedLight {
    light;
    keyFrames;

    /**
     * Controls a light intensity and color based on keyframes.
     * "time" is passed as an angle (in radians) for easy integration with the day/night system
     * @param {THREE.Light} light The light to control 
     * @param {any[]} keyFrames Array of keyframes, each containing an angle, color and intensity
     */
    constructor(light, keyFrames) {
        if (!(keyFrames instanceof Array)) { throw new TypeError("keyFrames must be an Array"); }
        if (!(light) instanceof THREE.Light) { throw new TypeError("light must be a THREE.Light"); }
        this.light = light;
        this.keyFrames = keyFrames;
        this.keyFrames.forEach(keyFrame => {
            keyFrame.angle ??= 0;
            keyFrame.color ??= 0xffffff;
            keyFrame.intensity ??= 1;
        });
        this.keyFrames.sort((a, b) => a.angle - b.angle);
    }

    /**
     * Updates the light
     * @param {number} angle the current time as an angle (0 - 2Pi)
     */
    update(angle) {
        if (this.keyFrames.length <= 1) { return; } // Nothing to update if there's no keyframes to lerp between
        this.cycleKeyFrames(angle);

        let minAngle = this.keyFrames[0].angle;
        let maxAngle = this.keyFrames[1].angle;
        if (maxAngle < minAngle) {
            if (angle > maxAngle) {
                maxAngle += tau;
            }
            else {
                minAngle -= tau;
            }

        }

        var lerpAmount = lerpInverse(minAngle, maxAngle, angle);
        this.light.intensity = lerp(this.keyFrames[0].intensity, this.keyFrames[1].intensity, lerpAmount);
        this.light.color.set(this.keyFrames[0].color).lerp(new THREE.Color(this.keyFrames[1].color), lerpAmount);

        if (this.keyFrames[0].groundColor !== undefined && this.keyFrames[1].groundColor !== undefined) {
            this.light.groundColor.set(this.keyFrames[0].groundColor).lerp(new THREE.Color(this.keyFrames[1].groundColor), lerpAmount);
        }
    }

    cycleKeyFrames(angle) {
        while (this.shouldCycleKeyFrame(angle)) {
            this.keyFrames.push(this.keyFrames.shift());
        }
    }

    shouldCycleKeyFrame(angle) {
        if (this.keyFrames[1].angle > this.keyFrames[0].angle) {
            return this.keyFrames[0].angle > angle || this.keyFrames[1].angle < angle;
        }
        return this.keyFrames[0].angle > angle && this.keyFrames[1].angle < angle;
    }
}

export default TimeBasedLight;