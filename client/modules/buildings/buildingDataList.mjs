import BuildingData from "./buildingData.mjs";

class BuildingDataList {
    static template;
    buildingDatas = [];

    constructor(buildings) {
        this.HTML = BuildingDataList.template.content.cloneNode(true);

        let infoField = this.HTML.querySelector("#infoField");

        for (const buildingName in buildings) {
            this.buildingDatas.push(new BuildingData(buildingName, buildings[buildingName], infoField));
        }

        this.buildingDatas.sort((a, b) => {
            if (a.age !== b.age) {
                return a.age - b.age;
            }
            return a.name.localeCompare(b.name);
        });

        var element = this.HTML.querySelector("[data-property=buildingData]");
        if (!element) {
            element = this.HTML;
        }

        this.buildingDatas.forEach((buildingData) => {
            element.appendChild(buildingData.HTML);
        });
    }
}

var templateHTML = await ( await fetch("client/modules/buildings/buildingDataList.html") ).text();
var parser = new DOMParser();
BuildingDataList.template = parser.parseFromString(templateHTML, "text/html").querySelector("template");

export { BuildingDataList };
export default BuildingDataList;