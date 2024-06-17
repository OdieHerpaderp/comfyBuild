// TODO: this should be removed, it's the responsibility of the client to deal with whatever scaling it needs
const clientScaleModifier = 48;

let idCounter = 1;

class BaseEntity {
    updateData = {};
    initData = {};
    _id;
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        this.updateData.id = value;
    }

    _x;
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        this.updateData.x = value * clientScaleModifier;
    }

    _y;
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        this.updateData.y = value * clientScaleModifier;
    }

    constructor(x, y) {
        this.id = idCounter++;
        this.x = x;
        this.y = y;
    }

    /**
     * Sets up initData with the original updateData
     * This should be called at the end of the constructor for every class that inherits this one
     */
    afterConstructor() {
        this.initData = this.getUpdateData() ?? {};
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getUpdateData() {
        if (Object.keys(this.updateData).length === 0) return null;
        var result = this.updateData;
        result.id = this.id;
        this.updateData = {};
        return result;
    }

    getInitData() {
        if (Object.keys(this.initData).length === 0) return null;
        var result = this.initData;
        this.initData = {};
        return result;
    }

    getAllData() {
        return {
            id: this.id,
            x: this.x * clientScaleModifier,
            y: this.y * clientScaleModifier
        };
    }
}

export default BaseEntity;
export { BaseEntity, clientScaleModifier };