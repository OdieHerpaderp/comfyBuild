import BaseEntity from "./baseEntity.mjs";

class ResourceNode extends BaseEntity {
    _resourceType;
    get resourceType() {
        return this._resourceType;
    }
    set resourceType(value) {
        this._resourceType = value;
        this.updateData.resourceType = value;
    }

    constructor(x, y, resourceType) {
        super(x,y);
        this.resourceType = resourceType;
        this.afterConstructor();
    }

    getAllData() {
        var result = super.getAllData();
        result.resourceType = this.resourceType;
        return result;
    }
}

export default ResourceNode;