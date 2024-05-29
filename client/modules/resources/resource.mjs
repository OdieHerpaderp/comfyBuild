class Resource {
    static template;

    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.change = 0;

        this.HTML = Resource.template.content.cloneNode(true);

        this.containerDiv = this.HTML.querySelector(".resource");
        this.nameDiv = this.HTML.querySelector("[data-property=name]");
        if (this.nameDiv) {
            this.nameDiv.innerHTML = this.name;
        }
        this.amountDiv = this.HTML.querySelector("[data-property=amount]");
        if (this.amountDiv) {
            this.amountDiv.innerHTML = this.amount;
        }
        this.changeDiv = this.HTML.querySelector("[data-property=change]");
        if (this.changeDiv) {
            this.changeDiv.innerHTML = 0;
        }
    }

    setAmount(amount) {
        if (this.amount === amount) {
            if (this.change != 0) {
                this.change = 0;
                this.changeDiv.innerHTML = "±0";
                this.changeDiv.classList.remove("green");
                this.changeDiv.classList.remove("red");
            }
            return;
        }

        var change = amount - this.amount;
        if (this.changeDiv && this.change != change) {
            this.change = change;
            if (amount > this.amount) {
                this.changeDiv.classList.remove("red");
                this.changeDiv.classList.add("green");
                this.changeDiv.innerHTML = "+" + (amount - this.amount);
            }
            else {
                this.changeDiv.classList.add("red");
                this.changeDiv.classList.remove("green");
                this.changeDiv.innerHTML = (amount - this.amount);
            }
        }

        this.amount = amount;
        if (this.amountDiv) {
            this.amountDiv.innerHTML = this.amount.toLocaleString();
        }

        if (amount > 0) {
            this.containerDiv.classList.remove("hidden");
        }
    }
}

var templateHTML = await (await fetch("client/modules/resources/resource.html")).text();
var parser = new DOMParser();
Resource.template = parser.parseFromString(templateHTML, "text/html").querySelector("template");

export { Resource };
export default Resource;