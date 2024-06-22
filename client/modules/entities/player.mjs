import * as THREE from "three"
import BaseEntity from "baseEntity";

class Player extends BaseEntity {
    color;
    number;
    username;
    isLocal;

    constructor(initData, isLocal) {
        super(initData);

        if (!initData.username) { initData.username = "Anonymous"; }
        this.color = initData.color ?? "#fff";
        this.number = initData.number ?? -1;
        this.username = initData.username;
        this.isLocal = isLocal;

        let geometry = new THREE.PlaneGeometry(1.0, 1.0, 1, 1);
        let texture = new THREE.TextureLoader().load('/client/img/player.png');
        let material = new THREE.MeshLambertMaterial({ map: texture, emissive: this.color, transparent: true, depthWrite: false, depthTest: false, color: this.color, });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.set(this.worldX, 0, this.worldY);
        this.mesh.rotation.x = Math.PI * 1.5;
    }

    update(data) {
        super.update(data);
    }
}

export { Player };
export default Player;