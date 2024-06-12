import { getHTMLTemplate, useTemplate } from "templateHelper";
import { HighlightableText } from "textHelpers";
import { ShortResourceDisplayList } from "shortResourceDisplay";
import { socket } from "singletons";

let template = await getHTMLTemplate("client/modules/buildings/buildings.html", "buildingDataRow");
class BuildingData {
    static template;

    name;
    age;
    info;
    node;
    build;
    consume;
    produce;

    constructor(name, data, infoField) {
        useTemplate.bind(this)(template);

        this.name = new HighlightableText(name);
        this.age = data.age ?? -1;
        this.info = data.info ?? "[no info available]";
        this.node = data.node;
        this.build = new ShortResourceDisplayList();
        this.build.setResources(data.build);
        this.consume = new ShortResourceDisplayList();
        this.consume.setResources(data.consume);
        this.produce = new ShortResourceDisplayList();
        this.produce.setResources(data.produce);

        this.infoField = infoField;
    }

    buildClick() {
        socket.emit('buildTower', this.name);
    }

    mouseover() {
        if (!this.infoField) { return; }
        this.infoField.textContent = this.name + ": " + this.info;
    }

    mouseout() {
        if (!this.infoField) { return; }
        this.infoField.textContent = "";
    }

    hide() {
        this.domElement.classList.add("hidden");
    }

    show() {
        this.domElement.classList.remove("hidden");
    }

    searchAndHighlight(searchText) {
        let nameResult = this.name.searchAndHighlight(searchText);
        let buildResult = this.build.searchAndHighlight(searchText);
        let consumeResult = this.consume.searchAndHighlight(searchText);
        let produceResult = this.produce.searchAndHighlight(searchText);

        if (nameResult || buildResult || consumeResult || produceResult) {
            this.show();
        }
        else {
            this.hide();
        }
    }
}

export { BuildingData };
export default BuildingData;