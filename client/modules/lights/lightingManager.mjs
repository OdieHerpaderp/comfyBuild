import * as THREE from 'three';
import OrbitingLight from 'orbitingLight';
import TimeBasedLight from 'timeBasedLight';

const millisPerDayCycle = 10000;

// Don't edit these values
const tau = Math.PI * 2;
const anglePerMs = tau / millisPerDayCycle;

class LightingManager {
    currentAngle = tau*.25;

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
            { angle: tau * .25, color: 0xfffefa, intensity: 2 },
            { angle: tau * .4, color: 0xfffefa, intensity: 3 },
            { angle: tau * .6, color: 0xfffefa, intensity: 3 },
            { angle: tau * .75, color: 0xfffefa, intensity: 2 },
            { angle: tau - Math.acos(0.5), color: 0xff3f00, intensity: 0 }
        ]);
        let moon = new OrbitingLight(scene, tau * 0.5, new THREE.Vector3(0, 50, 100), 100, [
            { angle: Math.acos(0.5), color: 0x224466, intensity: 0 },
            { angle: tau * .25, color: 0x99ddff, intensity: 0.75 },
            { angle: tau * .4, color: 0x99ddff, intensity: 1.0 },
            { angle: tau * .6, color: 0x99ddff, intensity: 1.0 },
            { angle: tau * .75, color: 0x99ddff, intensity: 0.75 },
            { angle: tau - Math.acos(0.5), color: 0x224466, intensity: 0 }
        ]);

        this.orbitingLights.push(sun, moon);

        this.globalLight = new THREE.HemisphereLight(0x3399cc, 0xffffff, 0.5);

        this.spotLight = new TimeBasedLight(new THREE.SpotLight(0xeeeeff, 1, undefined, tau/50, 1), [
            { angle: Math.acos(0.5), color: 0xeeeeff, intensity: 1 },
            { angle: tau * .25, color: 0xeeeeff, intensity: 0 },
            { angle: tau * .75, color: 0xeeeeff, intensity: 0 },
            { angle: tau - Math.acos(0.5), color: 0xeeeeff, intensity: 1 }
        ]);

        scene.add(this.globalLight, this.spotLight.light, this.spotLight.light.target);
    }

    tick(deltaTimeMs, targetPosition) {
        this.currentAngle += anglePerMs * deltaTimeMs;
        if (this.currentAngle > tau) {
            this.currentAngle -= tau;
        }

        this.orbitingLights.forEach(light => {
            light.update(this.currentAngle, targetPosition);
        });

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