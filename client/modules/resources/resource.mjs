class Resource {
    static template;

    constructor(name, amount) {
        this.name = name;
        this.amount = amount;

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
    }

    setAmount(amount) {
        if (this.amount === amount) {
            return;
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

var templateHTML = await ( await fetch("client/modules/resources/resource.html") ).text();
var parser = new DOMParser();
Resource.template = parser.parseFromString(templateHTML, "text/html").querySelector("template");

export { Resource };
export default Resource;