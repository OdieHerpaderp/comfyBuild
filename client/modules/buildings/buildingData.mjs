import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { HighlightableText } from "textHelpers";
import { ShortResourceDisplayList } from "shortResourceDisplay";
import { buildings } from "buildings";
import { socket } from "singletons";
import { romanize } from "textHelpers";

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

    hiddenSearch = false;
    hiddenAge = false;

    constructor(name, data, infoField) {
        useTemplate.bind(this)(template);

        this.name = new HighlightableText(name);
        this.age = data.age ?? -1;
        this.ageText = romanize(data.age + 1);
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
        socket.emit('buildBuilding', this.name.value);
    }

    mouseover() {
        if (!this.infoField) { return; }
        this.infoField.textContent = this.name.value + ": " + this.info;
    }

    mouseout() {
        if (!this.infoField) { return; }
        this.infoField.textContent = "";
    }

    updateVisibility() {
        if (this.hiddenSearch || this.hiddenAge) {
            this.domElement.classList.add("hidden");
        }
        else {
            this.domElement.classList.remove("hidden");
        }
    }

    searchAndHighlight(searchText) {
        let nameResult = this.name.searchAndHighlight(searchText);
        let buildResult = this.build.searchAndHighlight(searchText);
        let consumeResult = this.consume.searchAndHighlight(searchText);
        let produceResult = this.produce.searchAndHighlight(searchText);

        if (nameResult || buildResult || consumeResult || produceResult) {
            this.hiddenSearch = false;
        }
        else {
            this.hiddenSearch = true;
        }
        this.updateVisibility();
    }

    hideIfAge(age) {
        if (this.age !== age) { return; }
        this.hiddenAge = true;
        this.updateVisibility();
    }

    showIfAge(age) {
        if (this.age !== age) { return; }
        this.hiddenAge = false;
        this.updateVisibility();
    }
}

let listTemplate = await getHTMLTemplate("client/modules/buildings/buildings.html", "buildingDataList");
class BuildingDataList {
    buildingDatas = [];
    ageSelectors = [];

    constructor() {
        useTemplate.bind(this)(listTemplate);

        let infoField = this.domElement.querySelector("#infoField");

        let maxAge = 0;

        // Temporary array because templates don't handle Array.sort properly yet
        let buildingDatasTemp = [];
        for (const buildingName in buildings) {
            buildingDatasTemp.push(new BuildingData(buildingName, buildings[buildingName], infoField));
            maxAge = Math.max(maxAge, buildings[buildingName].age ?? -1);
        }

        buildingDatasTemp.sort((a, b) => {
            if (a.age !== b.age) {
                return a.age - b.age;
            }
            return a.name.value.localeCompare(b.name.value);
        });

        this.buildingDatas = buildingDatasTemp;

        this.ageSelectorsElement = this.domElement.querySelector("#ageSelectors")

        for (let i = 0; i <= maxAge; i++) {
            let button = new ToggleButton(romanize(i + 1), true);
            button.addEventListener("input", event => { this.ageToggleChanged(i, event.target.checked); });
            this.ageSelectors.push(button);
        }
    }

    searchInputChanged(event) {
        let newValue = event.target.value;
        if (typeof newValue !== "string") {
            newValue = "";
        }
        newValue = newValue.toLowerCase();
        this.buildingDatas.forEach((buildingData) => {
            buildingData.searchAndHighlight(newValue);
        });
    }

    agesToggleChanged(event) {
        if (event.target.checked) {
            this.ageSelectorsElement.classList.remove("hidden");
        }
        else {
            this.ageSelectorsElement.classList.add("hidden");
        }
    }

    ageToggleChanged(age, newValue) {
        if (newValue) {
            this.buildingDatas.forEach((buildingData) => {
                buildingData.showIfAge(age);
            });
        }
        else {
            this.buildingDatas.forEach((buildingData) => {
                buildingData.hideIfAge(age);
            });
        }
    }

    clearSearch() {
        this.search = "";
        this.buildingDatas.forEach((buildingData) => {
            buildingData.searchAndHighlight(this.search);
        });
    }
}

let toggleButtonTemplate = await getHTMLTemplate("client/modules/buildings/buildings.html", "toggleButton");
class ToggleButton {
    constructor(text, checked) {
        useTemplate.bind(this)(toggleButtonTemplate);
        this.text = text;
        this.input = this.domElement.querySelector("input");

        if (checked) {
            this.input.checked = true;
        }
    }

    addEventListener(...args) {
        this.input.addEventListener(...args);
    }
}

export { BuildingData, BuildingDataList };