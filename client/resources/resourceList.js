class ResourceList {
    resources = {};

    constructor() {
        this.HTML = document.createElement("div");
    }

    updateResources(resources) {
        for (const name in resources) {
            if(resources[name] <= 0) { continue; }
            this.updateResource(name, resources[name].toLocaleString());
        }
    }

    updateResource(name, amount) {
        if (this.resources[name] === undefined) {
            this.resources[name] = new Resource(name, amount);
            this.HTML.appendChild(this.resources[name].HTML);
        }
        else {
            this.resources[name].setAmount(amount);
        }
    }
}