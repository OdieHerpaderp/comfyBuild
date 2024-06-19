import * as THREE from 'three';
import TimeBasedLight from 'timeBasedLight';

const tau = Math.PI * 2;

class OrbitingLight extends TimeBasedLight {
    baseAngle;
    offset;
    distance;
    lastCameraDistance;

    helper;

    /**
     * 
     * @param {THREE.Scene} scene The scene this light belongs to
     * @param {number} midnightAngle The angle of the light at midnight. 0 is straight down, Pi is straight up. 
     * @param {THREE.Vector3} offset The offset of the orbiting point compared to the target
     * @param {number} distance The distance the camera orbits around the target
     * @param keyFrames Array of keyframes, each containing an angle, color and intensity
     */
    constructor(scene, midnightAngle, offset, distance, keyFrames) {
        let light = new THREE.DirectionalLight();
        super(light, keyFrames);

        this.scene = scene;
        this.baseAngle = midnightAngle ?? 0;
        this.offset = offset ?? new THREE.Vector3(0, 0, 0);
        this.distance = distance ?? 100;
        this.lastCameraDistance = -1;

        this.light.castShadow = true;
        this.light.shadow.zoom = 1;
        this.light.shadow.mapSize.width = 4096; // default 512
        this.light.shadow.mapSize.height = 4096; // default 512
        this.light.shadow.camera.near = 0.5; // default
        this.light.shadow.camera.far = 400; // default 500

        this.scene.add(this.light, this.light.target);
    }

    /**
     * Updates the light target and position
     * @param {number} timeAngle the current time as an angle (0 - 2Pi)
     * @param {THREE.Vector3} targetPosition the camera target position
     */
    update(timeAngle, targetPosition, cameraDistance) {
        let currentAngle = (timeAngle + this.baseAngle) % tau;

        let offsetX = Math.sin(currentAngle) * this.distance;
        let offsetY = -Math.cos(currentAngle) * this.distance;

        this.light.position.set(targetPosition.x + this.offset.x + offsetX, targetPosition.y + this.offset.y + offsetY, targetPosition.z + this.offset.z);
        this.light.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

        if (Math.abs(cameraDistance - this.lastCameraDistance) > 0.5) {
            this.lastCameraDistance = cameraDistance;
            let shadowDistance = cameraDistance * .3;
            this.light.shadow.camera.left = -shadowDistance;
            this.light.shadow.camera.right = shadowDistance;
            this.light.shadow.camera.top = shadowDistance;
            this.light.shadow.camera.bottom = -shadowDistance;
            this.light.shadow.camera.updateProjectionMatrix();
            this.helper?.update();
        }

        super.update(currentAngle);
    }


    addHelper() {
        this.helper = new THREE.CameraHelper(this.light.shadow.camera);
        this.scene.add(this.helper);
    }
}

export default OrbitingLight;