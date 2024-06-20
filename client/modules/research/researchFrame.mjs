import { getHTMLTemplate, useTemplate } from "templateHelpers";
import { jsFrameMixin } from "JSFrame";
import researchManager from "researchManager";


let listTemplate = await getHTMLTemplate("client/modules/research/researchFrame.html", "researchList");
var listEntryTemplate = await getHTMLTemplate("client/modules/research/researchFrame.html", "researchEntry");
class ResearchFrame {
    jsFrameSettings = {
        name: "frameResearch",
        title: "Research",
        left: 380, top: 360, width: 560, height: 420, minWidth: 560, minHeight: 110,
        style: {
            backgroundColor: '#22222255',
            overflow: 'hidden',
            width: '100%',
            fontSize: 18,
            display: 'flex'
        }
    };

    researchEntries = [];

    constructor() {
        useTemplate.bind(this)(listTemplate);

        for (const [_id, researchEntry] of Object.entries(researchManager.researchEntries)) {
            this.researchEntries.push(researchEntry);
        }
    }
}

Object.assign(ResearchFrame.prototype, jsFrameMixin);

export { ResearchFrame };
export default ResearchFrame;