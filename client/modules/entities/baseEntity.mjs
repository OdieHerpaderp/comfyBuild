class BaseEntity {
    id;
    x;
    y;

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