import { getHtmlTemplate, templateMixin } from "templateHelpers";
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
        this.loadTemplate();

        this.registerProperty("resources");
    }

    updateResources(resources) {
        for (const name in resources) {
            this.updateResource(name, resources[name]);
        }
    }

    updateResource(name, amount) {
        if (this.resources[name] === undefined) {
            this.resources[name] = new Resource(name, amount);
            this.appendChildToProperty("resources", this.resources[name].HTML);
        }
        else {
            this.resources[name].setAmount(amount);
        }
    }

    updateResourceDisplays() {
        for (const name in this.resources) {
            this.resources[name].updateDisplay();
        };
    }
}

Object.assign(ResourceList.prototype, jsFrameMixin);
Object.assign(ResourceList.prototype, templateMixin);
ResourceList.template = await getHtmlTemplate("client/modules/resources/resourceList.html");

export { ResourceList };
export default ResourceList;