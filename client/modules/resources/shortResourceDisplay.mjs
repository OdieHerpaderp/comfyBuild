import { getHTMLTemplate, useTemplate } from "templateHelper";

let template = await getHTMLTemplate("client/modules/resources/resources.html", "shortResource");
let listTemplate = await getHTMLTemplate("client/modules/resources/resources.html", "shortResourceList");

class ShortResourceDisplay {
    name;
    amount;
    isVisible = false;

    constructor(name = "[unknown]", amount = 0) {
        useTemplate.bind(this)(template);
        
        this.name = name;
        this.amount = amount;
    }
}

class ShortResourceDisplayList {
    resourceDisplays = {};
    resources = [];

    constructor() {
        useTemplate.bind(this)(listTemplate);
    }

    clearResources() {
        let resource = this.resources.pop();
        while(resource){
            resource.isVisible = false;
            resource = this.resources.pop();
        }
    }

    setResources(resources) {
        this.clearResources();
        for (const [name, amount] of Object.entries(resources)) {
            this.updateResource(name, amount);
        }
    }

    updateResource(name, amount) {
        if (this.resourceDisplays[name] === undefined) {
            this.resourceDisplays[name] = new ShortResourceDisplay(name, amount);
        }
        else {
            this.resourceDisplays[name].amount = amount;
        }

        if (!this.resourceDisplays[name].isVisible) {
            this.resources.push(this.resourceDisplays[name]);
            this.resourceDisplays[name].isVisible = true;
        }
    }
}

export { ShortResourceDisplay, ShortResourceDisplayList };