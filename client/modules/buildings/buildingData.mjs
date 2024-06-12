import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { HighlightableText } from "textHelpers";
import { ShortResourceDisplayList } from "shortResourceDisplay";
import { buildings } from "buildings";
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
        socket.emit('buildTower', this.name.value);
    }

    mouseover() {
        if (!this.infoField) { return; }
        this.infoField.textContent = this.name.value + ": " + this.info;
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

let listTemplate = await getHTMLTemplate("client/modules/buildings/buildings.html", "buildingDataList");
class BuildingDataList {
    buildingDatas = [];

    constructor() {
        useTemplate.bind(this)(listTemplate);

        let infoField = this.domElement.querySelector("#infoField");

        // Temporary array because templates don't handle Array.sort properly yet
        let buildingDatasTemp = [];
        for (const buildingName in buildings) {
            buildingDatasTemp.push(new BuildingData(buildingName, buildings[buildingName], infoField));
        }

        buildingDatasTemp.sort((a, b) => {
            if (a.age !== b.age) {
                return a.age - b.age;
            }
            return a.name.value.localeCompare(b.name.value);
        });

        this.buildingDatas = buildingDatasTemp;
    }

    searchInputChanged(event) {
        let newValue =  event.target.value;
        if (typeof newValue !== "string") {
            newValue = "";
        }
        newValue = newValue.toLowerCase();
        this.buildingDatas.forEach((buildingData) => {
            buildingData.searchAndHighlight(newValue);
        });
    }
}

export { BuildingData, BuildingDataList };