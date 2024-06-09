import * as THREE from 'three';
import OrbitingLight from 'orbitingLight';
import TimeBasedLight from 'timeBasedLight';

const millisPerDayCycle = 10000;

// Don't edit these values
const tau = Math.PI * 2;
const anglePerMs = tau / millisPerDayCycle;

class LightingManager {
    currentAngle = tau * .25;

    /**
     * @type {OrbitingLight[]}
     */
    orbitingLights = [];

    scene;
    /**
     * @param {THREE.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;

        // Size = 100, Y offset = 50 => ground is at acos(50/100) = acos(0.5)
        let sun = new OrbitingLight(scene, 0, new THREE.Vector3(0, 50, 100), 100, [
            { angle: Math.acos(0.5), color: 0xff3f00, intensity: 0 },
            { angle: tau * .25, color: 0xfffefa, intensity: 0.9 },
            { angle: tau * .4, color: 0xfffefa, intensity: 1.8 },
            { angle: tau * .6, color: 0xfffefa, intensity: 1.8 },
            { angle: tau * .75, color: 0xfffefa, intensity: 0.9 },
            { angle: tau - Math.acos(0.5), color: 0xff3f00, intensity: 0 }
        ]);
        let moon = new OrbitingLight(scene, tau * 0.5, new THREE.Vector3(0, 50, 100), 100, [
            { angle: Math.acos(0.5), color: 0x224466, intensity: 0 },
            { angle: tau * .25, color: 0x99ddff, intensity: 0.3 },
            { angle: tau * .4, color: 0x99ddff, intensity: 0.5 },
            { angle: tau * .6, color: 0x99ddff, intensity: 0.5 },
            { angle: tau * .75, color: 0x99ddff, intensity: 0.3 },
            { angle: tau - Math.acos(0.5), color: 0x224466, intensity: 0 }
        ]);

        this.orbitingLights.push(sun, moon);

        this.globalLight = new TimeBasedLight(new THREE.HemisphereLight(0x77bbee, 0xffffff, 0.4), [
            { angle: Math.acos(0.5), color: 0xffffff - 0xff3f00, groundcolor: 0xffffff, intensity: 0.4 },
            { angle: tau * .25, color: 0xffffff - 0xfffefa, groundcolor: 0xffffff, intensity: 0.4 },
            { angle: tau * .75, color: 0xffffff - 0xfffefa, groundcolor: 0xffffff, intensity: 0.4 },
            { angle: tau - Math.acos(0.5), color: 0xffffff - 0xff3f00, groundcolor: 0xffffff, intensity: 0.4 }
        ]);

        this.spotLight = new TimeBasedLight(new THREE.SpotLight(0xeeeeff, 1, undefined, tau / 50, 1), [
            { angle: Math.acos(0.5), color: 0xeeeeff, intensity: 0.2 },
            { angle: tau * .25, color: 0xeeeeff, intensity: 0 },
            { angle: tau * .75, color: 0xeeeeff, intensity: 0 },
            { angle: tau - Math.acos(0.5), color: 0xeeeeff, intensity: 0.2 }
        ]);

        scene.add(this.globalLight.light, this.spotLight.light, this.spotLight.light.target);
    }

    tick(deltaTimeMs, targetPosition) {
        this.currentAngle += anglePerMs * deltaTimeMs;
        this.currentAngle = this.currentAngle % tau;

        this.orbitingLights.forEach(light => {
            light.update(this.currentAngle, targetPosition);
        });

        this.globalLight.update(this.currentAngle);
        this.spotLight.update(this.currentAngle);
    }

    animationFrame(cameraPosition, targetPosition) {
        var cameraDistance = cameraPosition.distanceTo(targetPosition);
        this.spotLight.light.position.set(targetPosition.x, cameraDistance, targetPosition.z);
        this.spotLight.light.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
    }
}

export { LightingManager };
export default LightingManager;