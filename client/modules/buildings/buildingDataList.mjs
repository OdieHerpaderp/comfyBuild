import { getHtmlTemplate } from "../templateHelpers.mjs";
import { BuildingData } from "./buildingData.mjs";

class BuildingDataList {
    static template;
    buildingDatas = [];

    constructor(buildings, buildFunction) {
        this.HTML = BuildingDataList.template.content.cloneNode(true);

        let infoField = this.HTML.querySelector("#infoField");

        for (const buildingName in buildings) {
            this.buildingDatas.push(new BuildingData(buildingName, buildings[buildingName], infoField, buildFunction));
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

BuildingDataList.template = await getHtmlTemplate("client/modules/buildings/buildingDataList.html");

export { BuildingDataList };
export default BuildingDataList;