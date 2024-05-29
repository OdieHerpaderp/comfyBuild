import { Resource } from "./resource.mjs";

class ResourceList {
    static template;
    resources = {};

    constructor() {
        this.HTML = ResourceList.template.content.cloneNode(true);
        this.resourcesElement = this.HTML.querySelector("[data-property=resources]");
        if (!this.resourcesElement) {
            this.resourcesElement = this.HTML;
        }
    }

    updateResources(resources) {
        for (const name in resources) {
            this.updateResource(name, resources[name]);
        }
    }

    updateResource(name, amount) {
        if (this.resources[name] === undefined) {
            this.resources[name] = new Resource(name, amount);
            this.resourcesElement.appendChild(this.resources[name].HTML);
        }
        else {
            this.resources[name].setAmount(amount);
        }
    }
}

var templateHTML = await ( await fetch("client/modules/resources/resourceList.html") ).text();
var parser = new DOMParser();
ResourceList.template = parser.parseFromString(templateHTML, "text/html").querySelector("template");

export { ResourceList };
export default ResourceList;