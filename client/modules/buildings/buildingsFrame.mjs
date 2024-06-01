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

    constructor() {
        this.loadTemplate();
        this.registerProperty("content");

        this.displayingBuildingList = false;
        this.displayingTooltip = false;

        this.buildingList = new BuildingDataList();
        this.buildingTooltip = new BuildingTooltip();
    }

    showTooltip() {
        if (this.displayingTooltip) { return; }
        this.replacePropertyWithChild("content", this.buildingTooltip.HTML);
        this.displayingTooltip = true;
        this.displayingBuildingList = false;
    }

    showBuildingList() {
        if (this.displayingBuildingList) { return; }
        this.replacePropertyWithChild("content", this.buildingList.HTML);
        this.displayingTooltip = false;
        this.displayingBuildingList = true;
    }
}

Object.assign(BuildingsFrame.prototype, jsFrameMixin);
Object.assign(BuildingsFrame.prototype, templateMixin);
BuildingsFrame.template = await getHtmlTemplate("client/modules/buildings/buildingsFrame.html");

export { BuildingsFrame };
export default BuildingsFrame;