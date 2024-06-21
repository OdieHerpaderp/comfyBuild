import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { HighlightableText } from "textHelpers";

let template = await getHTMLTemplate("client/modules/resources/resources.html", "shortResource");
let listTemplate = await getHTMLTemplate("client/modules/resources/resources.html", "shortResourceList");

class ShortResourceDisplay {
    name;
    originalName;
    amount;
    isVisible = false;

    constructor(name = "[unknown]", amount = 0, parent) {
        useTemplate.bind(this)(template);

        this.name = new HighlightableText(name);
        this.originalName = name;
        this.amount = amount;
        this.parent = parent;
    }

    searchAndHighlight(searchText) {
        return this.name.searchAndHighlight(searchText);
    }

    resourceNameClick() {
        this.parent?.resourceClicked(this.name.value);
    }
}

class ShortResourceDisplayList extends EventTarget {
    resourceDisplays = {};
    resources = [];

    constructor() {
        super();
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
        if (!resources) { return; }

        // TODO: remove this if block after all buildings use new format
        if (!Array.isArray(resources)) {
            for (const [name, amount] of Object.entries(resources)) {
                this.updateResource(name, amount);
            }
            return;
        }

        resources.forEach(resource => {
            this.updateResource(resource.name, resource.amount);
        });
    }

    updateResource(name, amount) {
        if (this.resourceDisplays[name] === undefined) {
            this.resourceDisplays[name] = new ShortResourceDisplay(name, amount, this);
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

    resourceClicked(name) {
        this.dispatchEvent(new CustomEvent("resourceClicked", { detail: name }));
    }
}

export { ShortResourceDisplay, ShortResourceDisplayList };