class ItemList {
    items = {};

    constructor() {
        this.HTML = document.createElement("div");
    }

    updateItems(items) {
        for (const name in items) {
            if(items[name] <= 0) { continue; }
            this.updateItem(name, items[name].toLocaleString());
        }
    }

    updateItem(name, amount) {
        if (this.items[name] === undefined) {
            this.items[name] = new Item(name, amount);
            this.HTML.appendChild(this.items[name].HTML);
        }
        else {
            this.items[name].setAmount(amount);
        }
    }
}