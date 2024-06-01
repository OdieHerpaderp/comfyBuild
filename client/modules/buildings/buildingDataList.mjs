import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { BuildingData } from "buildingData";
import { jsFrameMixin } from "JSFrame";

class BuildingDataList {
    static template;
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

    buildingDatas = [];

    constructor(buildings) {
        var that = this;
        this.loadTemplate();

        this.registerProperty("buildingData");

        this.registerInput("search");
        this.addEventListenerToInput("search", "input", (event) => { that.searchInputChanged(event.target.value); });

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

        this.buildingDatas.forEach((buildingData) => {
            this.appendChildToProperty("buildingData", buildingData.HTML);
        });
    }

    searchInputChanged(newValue) {
        if (typeof newValue !== "string") {
            newValue = "";
        }
        newValue = newValue.toLowerCase();
        this.buildingDatas.forEach((buildingData) => {
            buildingData.checkSearch(newValue);
        });
    }
}

Object.assign(BuildingDataList.prototype, jsFrameMixin);
Object.assign(BuildingDataList.prototype, templateMixin);
BuildingDataList.template = await getHtmlTemplate("client/modules/buildings/buildingDataList.html");

export { BuildingDataList };
export default BuildingDataList;