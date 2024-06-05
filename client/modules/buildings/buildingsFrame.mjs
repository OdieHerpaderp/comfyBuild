import { BuildingDataList } from "buildingDataList";
import { BuildingTooltip } from "buildingTooltip";
import { getHtmlTemplate, templateMixin } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";

class BuildingsFrame {
    static template;
    jsFrameSettings = {
        name: "frameBuildingTooltip",
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

    currentBuilding;

    constructor() {
        this.loadTemplate();
        this.registerProperty("content");

        this.displayingBuildingList = false;
        this.displayingTooltip = false;

        this.buildingList = new BuildingDataList();
        this.buildingTooltip = new BuildingTooltip();

        this.replacePropertyWithChild("content", this.buildingList.HTML);
    }

    updateDisplay(building) {
        if (building === this.currentBuilding) { return; }
        this.currentBuilding = building;
        if (building) {
            this.buildingTooltip.selectedBuilding = building;
            this.replacePropertyWithChild("content", this.buildingTooltip.domElement);
        }
        else {
            this.replacePropertyWithChild("content", this.buildingList.HTML);
        }
    }
}

Object.assign(BuildingsFrame.prototype, jsFrameMixin);
Object.assign(BuildingsFrame.prototype, templateMixin);
BuildingsFrame.template = await getHtmlTemplate("client/modules/buildings/buildingsFrame.html");

export { BuildingsFrame };
export default BuildingsFrame;