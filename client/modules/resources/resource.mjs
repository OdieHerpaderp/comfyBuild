import { getHtmlTemplate } from "templateHelpers";

class Resource {
    static template;

    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.displayAmount = amount;
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

        if (amount > 0) {
            this.containerDiv.classList.remove("hidden");
        }
    }

    updateDisplay() {
        if (this.amountDiv && this.amount != this.displayAmount) {
            if (this.amount > this.displayAmount) {
                this.displayAmount += Math.floor(1 + ((this.amount - this.displayAmount) / 10));
            }
            else {
                this.displayAmount -= Math.floor(1 + ((this.displayAmount - this.amount) / 10));
            }
            this.amountDiv.innerHTML = this.displayAmount.toLocaleString();
        }
    }
}

Resource.template = await getHtmlTemplate("client/modules/resources/resource.html");

export { Resource };
export default Resource;