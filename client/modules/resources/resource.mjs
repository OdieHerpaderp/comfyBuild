import { getHtmlTemplate, templateMixin } from "templateHelpers";

class Resource {
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
    _amount;
    get amount() {
        return this._amount;
    }
    set amount(value) {
        this.change = value - this.amount;
        this._amount = value;
        if (value > 0) {
            this.showOnce?.();
        }
    }
    _displayAmount;
    get displayAmount() {
        return this._displayAmount;
    }
    set displayAmount(value) {
        this._displayAmount = value;
        this.setProperty("amount", value.toLocaleString());
    }
    _change;
    get change() {
        return this._change;
    }
    set change(value) {
        if (this._change === value) { return; }
        this._change = value;
        if (value === 0) {
            this.setProperty("change", "±0");
            this.removeClassFromProperty("change", "red");
            this.removeClassFromProperty("change", "green");
        }
        else if (value > 0) {
            this.setProperty("change", `+${value}`);
            this.removeClassFromProperty("change", "red");
            this.addClassToProperty("change", "green");
        }
        else {
            this.setProperty("change", value);
            this.addClassToProperty("change", "red");
            this.removeClassFromProperty("change", "green");
        }
    }
    // #endregion

    constructor(name, amount) {
        this.loadTemplate();

        this.registerProperty("name");
        this.registerProperty("amount");
        this.registerProperty("change");

        this.name = name;
        this.amount = amount;
        this.displayAmount = amount;
        this.change = 0;
    }

    showOnce() {
        this.showOnce = undefined;
        this.HTML.querySelector(".hidden").classList.remove("hidden");
    }

    setAmount(amount) {
        this.amount = amount;
    }

    updateDisplay() {
        if (this.amount != this.displayAmount) {
            if (this.amount > this.displayAmount) {
                this.displayAmount += Math.floor(1 + ((this.amount - this.displayAmount) / 10));
            }
            else {
                this.displayAmount -= Math.floor(1 + ((this.displayAmount - this.amount) / 10));
            }
        }
    }
}

Object.assign(Resource.prototype, templateMixin);
Resource.template = await getHtmlTemplate("client/modules/resources/resource.html");

export { Resource };
export default Resource;