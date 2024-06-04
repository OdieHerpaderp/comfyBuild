import * as THREE from 'three';

class BaseEntity extends EventTarget {
    id;
    _position = new THREE.Vector2();

    get x() {
        return this._position.x;
    }
    get y() {
        return this._position.y;
    }
    mesh;

    get worldX() {
        return this.x / 10;
    }
    get worldY() {
        return this.y / 10;
    }

    constructor(initData) {
        super();
        this.id = initData.id ?? -1;
        this.setPosition(Math.round(initData.x ?? 0), Math.round(initData.y ?? 0));
    }

    propertyChanged(propertyName, newValue) {
        this.dispatchEvent(new CustomEvent("propertyChanged", { detail: { propertyName, newValue } }));
    }

    update(data) {
        this.setPosition(Math.round(data.x), Math.round(data.y));
    }

    setPosition(x, y) {
        let positionChanged = false;
        if (x && x !== this._position.x) {
            this._position.x = x;
            this.propertyChanged("x", x);
            positionChanged = true;
        }
        if (y && y !== this._position.y) {
            this._position.y = y;
            this.propertyChanged("y", y);
            positionChanged = true;
        }
        if (positionChanged) {
            if (this.mesh) {
                this.mesh.position.x = this.worldX;
                this.mesh.position.z = this.worldY;
            }
            this.propertyChanged("position", { x: this.x, y: this.y });
        }
    }
}

export { BaseEntity };
export default BaseEntity;