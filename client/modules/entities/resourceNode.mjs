import * as THREE from 'three';
import BaseEntity from "baseEntity";

class ResourceNode extends BaseEntity {
    resourceType;

    constructor(initData) {
        super(initData);
        this.resourceType = initData.towerType ?? initData.resourceType ?? "unknown";

        let geometry = new THREE.PlaneGeometry(3, 3, 1, 1);

        let texture = new THREE.TextureLoader().load('/client/img/bullets/' + this.resourceType + '.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        let material = new THREE.MeshLambertMaterial({ color:"#ffffff", emissive:"#555555" ,emissiveMap: texture , map: texture, transparent: true,depthWrite: false, });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.worldX, 0.05, this.worldY);
        this.mesh.rotation.x = Math.PI * 1.5;
    }
}

export { ResourceNode };
export default ResourceNode;