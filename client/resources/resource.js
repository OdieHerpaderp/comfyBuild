class Resource {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;

        this.HTML = document.createElement("comfybuild-resource");
        this.HTML.setAttribute("comfybuild-resourcename", this.name);
        this.HTML.setAttribute("comfybuild-resourceamount", this.amount);
    }

    setAmount(amount) {
        this.amount = amount;
        this.HTML.setAttribute("comfybuild-resourceamount", this.amount);
    }
}

customElements.define("comfybuild-resource", class extends HTMLElement {
    static observedAttributes = ["comfybuild-resourcename", "comfybuild-resourceamount"];

    resourceNameDiv;
    resourceAmountDiv;

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "comfybuild-resourcename" && this.resourceNameDiv !== undefined) {
            this.resourceNameDiv.innerHTML = newValue;
        }
        if (name === "comfybuild-resourceamount" && this.resourceAmountDiv !== undefined) {
            this.resourceAmountDiv.innerHTML = newValue;
        }
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "parent");
        shadow.appendChild(wrapper);

        this.resourceNameDiv = document.createElement("div");
        this.resourceNameDiv.setAttribute("class", "wide");
        wrapper.appendChild(this.resourceNameDiv);

        this.resourceAmountDiv = document.createElement("div");
        this.resourceAmountDiv.setAttribute("class", "narrow");
        wrapper.appendChild(this.resourceAmountDiv);

        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(".narrow {font-size:18px;line-height:16px;float: right;height:20px;width: 140px;text-align: right;font-variant-numeric: tabular-nums lining-nums;} .wide {font-family: 'Roboto Slab';font-size:16px;line-height:16px;float: left;height:20px;width: calc(100% - 148px);font-variant-numeric: tabular-nums lining-nums;} .wide:after {content: ':';}");
        shadow.adoptedStyleSheets = [styleSheet];

        var resourceName = this.getAttribute("comfybuild-resourcename");
        if (resourceName !== undefined) {
            this.resourceNameDiv.innerHTML = resourceName;
        }
        var resourceAmount = this.getAttribute("comfybuild-resourceamount");
        if (resourceAmount !== undefined ) {
            this.resourceAmountDiv.innerHTML = resourceAmount;
        }
    }
});