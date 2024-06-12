import { getHTMLTemplate, useTemplate } from "templateHelper";
import { BuildingDataList } from "buildingData";
import { BuildingTooltip } from "buildingTooltip";
import { jsFrameMixin } from "JSFrame";

let template = await getHTMLTemplate("client/modules/buildings/buildings.html", "buildingsFrame");
class BuildingsFrame {
    jsFrameSettings = {
        name: "frameBuildingTooltip",
        title: "Buildings",
        left: 380, top: 360, width: 560, height: 820, minWidth: 560, minHeight: 110,
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
        useTemplate.bind(this)(template);

        this.buildingList = new BuildingDataList();
        this.buildingTooltip = new BuildingTooltip();

        this.content = this.buildingList;
    }

    selectedBuildingChanged(building) {
        if (building === this.currentBuilding) { return; }
        this.currentBuilding = building;
        if (building) {
            this.buildingTooltip.selectedBuilding = building;
            this.content = this.buildingTooltip;
        }
        else {
            this.content = this.buildingList;
        }
    }

    displayTick() {
        if (this.currentBuilding) {
            this.buildingTooltip.displayTick();
        }
    }
}

Object.assign(BuildingsFrame.prototype, jsFrameMixin);

export { BuildingsFrame };
export default BuildingsFrame;