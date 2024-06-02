import * as THREE from "three"
import BaseEntity from "baseEntity";

class Player extends BaseEntity {
    color;
    number;
    username;
    isLocal;

    constructor(initData, isLocal) {
        super(initData);

        this.color = initData.color ?? "#fff";
        this.number = initData.number ?? -1;
        this.username = initData.username ?? "anonymous";
        this.isLocal = isLocal;

        let geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
        let texture = new THREE.TextureLoader().load('/client/img/player.png');
        let material = new THREE.MeshLambertMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false, color: this.color, });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.set(this.worldX, 0, this.worldY);
        this.mesh.rotation.x = Math.PI * 1.5;
    }

    update(data) {
        if (data.x) { this.x = Math.round(data.x); }
        if (data.y) { this.y = Math.round(data.y); }
    }
}

export { Player };
export default Player;