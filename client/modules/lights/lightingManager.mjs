import * as THREE from 'three';
import OrbitingLight from 'orbitingLight';
import TimeBasedLight from 'timeBasedLight';

const millisPerDayCycle = 120_000;

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
    initialize(scene) {
        this.scene = scene;

        // Size = 100, Y offset = 50 => ground is at acos(50/100) = acos(0.5)
        let sun = new OrbitingLight(scene, 0, new THREE.Vector3(0, 50, 100), 100, [
            { angle: Math.acos(0.4), color: 0xff3f00, intensity: 0 },
            { angle: tau * .25, color: 0xffddaa, intensity: 1.1 },
            { angle: tau * .45, color: 0xfffeea, intensity: 1.3 },
            { angle: tau * .60, color: 0xffcc66, intensity: 1.3 },
            { angle: tau * .75, color: 0xffaa33, intensity: 1.1 },
            { angle: tau - Math.acos(0.4), color: 0xff3f00, intensity: 0 }
        ]);
        let moon = new OrbitingLight(scene, tau * 0.5, new THREE.Vector3(0, 50, 100), 100, [
            { angle: Math.acos(0.4), color: 0x333333, intensity: 0 },
            { angle: tau * .25, color: 0x77aadd, intensity: 0.4 },
            { angle: tau * .4, color: 0x88bbff, intensity: 0.5 },
            { angle: tau * .6, color: 0x88bbff, intensity: 0.5 },
            { angle: tau * .75, color: 0x77aadd, intensity: 0.4 },
            { angle: tau - Math.acos(0.4), color: 0x333333, intensity: 0 }
        ]);

        this.orbitingLights.push(sun, moon);

        this.globalLight = new TimeBasedLight(new THREE.HemisphereLight(0x111111, 0xff1111, 0.1), [
            { angle: Math.acos(0.5), color: 0xaabbcc, groundColor: 0xddeeff, intensity: 0.1 },
            { angle: tau * .25, color: 0xdddddd, groundColor: 0xeeffee, intensity: 0.2 },
            { angle: tau * .50, color: 0xdddddd, groundColor: 0xeeffee, intensity: 0.3 },
            { angle: tau * .75, color: 0xdddddd, groundColor: 0xeeffee, intensity: 0.2 },
            { angle: tau - Math.acos(0.5), color: 0xaabbcc, groundColor: 0xddeeff, intensity: 0.1 }
        ]);

        this.spotLight = new TimeBasedLight(new THREE.SpotLight(0xeeeeff, 1, undefined, tau / 50, 1, 0), [
            { angle: tau * .19, color: 0xffffff, intensity: 0.2 },
            { angle: tau * .2, color: 0xffffff, intensity: 0 },
            { angle: tau * .75, color: 0xffffff, intensity: 0 },
            { angle: tau * .76, color: 0xffffff, intensity: 0.2 }
        ]);
        scene.add(this.globalLight.light, this.spotLight.light, this.spotLight.light.target);
    }

    tick(deltaTimeMs, cameraPosition, targetPosition) {
        let cameraDistance = cameraPosition.distanceTo(targetPosition);
        this.currentAngle += anglePerMs * deltaTimeMs;
        this.currentAngle = this.currentAngle % tau;

        this.orbitingLights.forEach(light => {
            light.update(this.currentAngle, targetPosition, cameraDistance);
        });

        this.globalLight.update(this.currentAngle);
        this.spotLight.update(this.currentAngle);
    }

    animationFrame(cameraPosition, targetPosition) {
        let cameraDistance = cameraPosition.distanceTo(targetPosition);
        this.spotLight.light.position.set(targetPosition.x, cameraDistance, targetPosition.z);
        this.spotLight.light.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        
    }
}

const lightingManager = new LightingManager();

export default lightingManager;