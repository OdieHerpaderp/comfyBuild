import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { socket } from "singletons";

class BuildingData {
    static template;

    // #region properties
    _name;
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        this.setProperty("name", value);
    }
    _age;
    get age() {
        return this._age;
    }
    set age(value) {
        this._age = value ?? -1;
        this.setProperty("age", this._age);
    }
    _info;
    get info() {
        return this._info;
    }
    set info(value) {
        this._info = value ?? "[no info available]";
        this.setProperty("info", this._info);
    }
    _node;
    get node() {
        return this._node;
    }
    set node(value) {
        this._node = value;
        this.setProperty("node", this._node);
    }
    _build;
    get build() {
        return this._build;
    }
    set build(value) {
        this._build = value ?? {};
        this.setProperty("build", this.getResourceInfo(this._build ?? {}));
    }
    _consume;
    get consume() {
        return this._consume;
    }
    set consume(value) {
        this._consume = value ?? {};
        this.setProperty("consume", this.getResourceInfo(this._consume ?? {}));
    }
    _produce;
    get produce() {
        return this._produce;
    }
    set produce(value) {
        this._produce = value ?? {};
        this.setProperty("produce", this.getResourceInfo(this._produce ?? {}));
    }
    // #endregion

    constructor(name, data, infoField) {
        var that = this;

        this.loadTemplate();

        this.registerProperty("name");
        this.registerProperty("age");
        this.registerProperty("info");
        this.registerProperty("node");
        this.registerProperty("build");
        this.registerProperty("consume");
        this.registerProperty("produce");

        this.registerAction("build", () => { socket.emit('buildTower', that.name) });

        this.name = name;
        this.age = data.age;
        this.info = data.info;
        this.node = data.node;
        this.build = data.build;
        this.consume = data.consume;
        this.produce = data.produce;

        if (infoField) {
            this.HTML.firstElementChild.addEventListener("mouseover", () => { infoField.innerHTML = this.name + ": " + this.info; });
            this.HTML.firstElementChild.addEventListener("mouseout", () => { infoField.innerHTML = String.fromCharCode(160); });
        }
    }

    getResourceInfo(list) {
        var result = "";
        for (const resource in list) {
            result += `${resource}: ${list[resource]}<br />`;
        }
        return result;
    }
}

Object.assign(BuildingData.prototype, templateMixin);
BuildingData.template = await getHtmlTemplate("client/modules/buildings/buildingData.html");

export { BuildingData };
export default BuildingData;