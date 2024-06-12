import { getHTMLTemplate, useTemplate } from "templateHelper";
import { HighlightableText } from "textHelpers";

let template = await getHTMLTemplate("client/modules/resources/resources.html", "shortResource");
let listTemplate = await getHTMLTemplate("client/modules/resources/resources.html", "shortResourceList");

class ShortResourceDisplay {
    name;
    originalName;
    amount;
    isVisible = false;

    constructor(name = "[unknown]", amount = 0) {
        useTemplate.bind(this)(template);

        this.name = new HighlightableText(name);
        this.originalName = name;
        this.amount = amount;
    }

    searchAndHighlight(searchText) {
        return this.name.searchAndHighlight(searchText);
    }
}

class ShortResourceDisplayList {
    resourceDisplays = {};
    resources = [];

    constructor() {
        useTemplate.bind(this)(listTemplate);
    }

    clearResources() {
        let resource;
        while (resource = this.resources.pop()) {
            resource.isVisible = false;
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

    searchAndHighlight(searchText) {
        var result = false;
        this.resources.forEach((resource) => { result = resource.searchAndHighlight(searchText) || result; });
        return result;
    }
}

export { ShortResourceDisplay, ShortResourceDisplayList };