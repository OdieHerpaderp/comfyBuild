class BaseEntity {
    id;
    _x;
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        if (this.mesh) {
            this.mesh.position.x = this.worldX;
        }
    }
    _y;
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        if (this.mesh) {
            this.mesh.position.z = this.worldY;
        }
    }

    mesh;

    get worldX() {
        return this.x / 10;
    }
    get worldY() {
        return this.y / 10;
    }

    constructor(initData) {
        this.id = initData.id ?? -1;
        this.x = initData.x ?? 0;
        this.y = initData.y ?? 0;
    }
}

export { BaseEntity };
export default BaseEntity;