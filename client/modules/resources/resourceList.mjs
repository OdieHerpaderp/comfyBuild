import { getHtmlTemplate } from "templateHelpers";
import { Resource } from "resource";
import { jsFrameMixin } from "JSFrame";

class ResourceList {
    static template;
    resources = {};
    jsFrameSettings = {
        name: "frameStockpile",
        title: "Stockpile",
        left: 30, top: 360, width: 320, height: 420, minWidth: 200, minHeight: 110
    };

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

Object.assign(ResourceList.prototype, jsFrameMixin);
ResourceList.template = await getHtmlTemplate("client/modules/resources/resourceList.html");

export { ResourceList };
export default ResourceList;