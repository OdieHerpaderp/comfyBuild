class Item {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;

        this.HTML = document.createElement("comfybuild-item");
        this.HTML.setAttribute("comfybuild-itemname", this.name);
        this.HTML.setAttribute("comfybuild-itemamount", this.amount);
    }

    setAmount(amount) {
        this.amount = amount;
        this.HTML.setAttribute("comfybuild-itemamount", this.amount);
    }
}

customElements.define("comfybuild-item", class extends HTMLElement {
    static observedAttributes = ["comfybuild-itemname", "comfybuild-itemamount"];

    itemNameDiv;
    itemAmountDiv;

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "comfybuild-itemname" && this.itemNameDiv !== undefined) {
            this.itemNameDiv.innerHTML = newValue;
        }
        if (name === "comfybuild-itemamount" && this.itemAmountDiv !== undefined) {
            this.itemAmountDiv.innerHTML = newValue;
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "parent");
        shadow.appendChild(wrapper);

        this.itemNameDiv = document.createElement("div");
        this.itemNameDiv.setAttribute("class", "wide");
        wrapper.appendChild(this.itemNameDiv);

        this.itemAmountDiv = document.createElement("div");
        this.itemAmountDiv.setAttribute("class", "narrow");
        wrapper.appendChild(this.itemAmountDiv);

        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(".narrow {font-size:18px;line-height:16px;float: right;height:20px;width: 140px;text-align: right;font-variant-numeric: tabular-nums lining-nums;} .wide {font-family: 'Roboto Slab';font-size:16px;line-height:16px;float: left;height:20px;width: calc(100% - 148px);font-variant-numeric: tabular-nums lining-nums;} .wide:after {content: ':';}");
        shadow.adoptedStyleSheets = [styleSheet];

        var itemName = this.getAttribute("comfybuild-itemname");
        if (itemName !== undefined) {
            this.itemNameDiv.innerHTML = itemName;
        }
        var itemAmount = this.getAttribute("comfybuild-itemamount");
        if (itemAmount !== undefined ) {
            this.itemAmountDiv.innerHTML = itemAmount;
        }
    }
});