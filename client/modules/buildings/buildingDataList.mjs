import { getHtmlTemplate } from "templateHelpers";
import { BuildingData } from "buildingData";
import { jsFrameMixin } from "JSFrame";

class BuildingDataList {
    static template;
    buildingDatas = [];
    jsFrameSettings = {
        name: "frameBuildings",
        title: "Buildings",
        left: 380, top: 360, width: 560, height: 420, minWidth: 560, minHeight: 110,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18,
            display: 'flex'
        }
    };

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

Object.assign(BuildingDataList.prototype, jsFrameMixin);
BuildingDataList.template = await getHtmlTemplate("client/modules/buildings/buildingDataList.html");

export { BuildingDataList };
export default BuildingDataList;