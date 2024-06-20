import { getHTMLTemplate, useTemplate } from "templateHelpers";
import researchManager from "researchManager";
import { ResearchEntryBase } from "research";

var template = await getHTMLTemplate("client/modules/research/researchFrame.html", "researchEntry");
class ResearchEntryDisplay extends ResearchEntryBase {
    requiredResearchDisplay;

    constructor(id, data) {
        super(id, data);
        useTemplate.bind(this)(template);

        this.requiredResearchDisplay = new RequiredResearchListDisplay(this.requiredResearch);
    }

    tryUnlockResearch() {
        researchManager.tryUnlockResearch(this.id);
    }

    unlock() {
        if (this.unlocked) { return; }
        this.unlocked = true;
        this.domElement.classList.add("unlocked");
    }
}

var requiredResearchListTemplate = await getHTMLTemplate("client/modules/research/researchFrame.html", "requiredResearchList");
class RequiredResearchListDisplay {
    requiredResearchEntries = [];

    constructor(researchIds) {
        useTemplate.bind(this)(requiredResearchListTemplate);

        researchIds.forEach(researchId => {
            this.requiredResearchEntries.push(new RequiredResearchEntryDisplay(researchId));
        });
    }
}

var requiredResearchEntryTemplate = await getHTMLTemplate("client/modules/research/researchFrame.html", "requiredResearchEntry");
class RequiredResearchEntryDisplay {
    id;
    fullName;

    constructor(id) {
        useTemplate.bind(this)(requiredResearchEntryTemplate);
        this.id = id;

        let researchEntry = researchManager.getResearchEntry(id);
        if (!researchEntry) {
            this.domElement.classList.add("text-red");
            this.fullName = "UNKNOWN RESEARCH: " + id
            return;
        }

        this.fullName = researchEntry.fullName;

        if (researchEntry.unlocked) { this.domElement.classList.add("text-green"); }
        else { this.domElement.classList.add("text-red"); }

        researchManager.addEventListener("researchUnlocked", event => {
            if (this.id == event.detail) {
                this.domElement.classList.remove("text-red");
                this.domElement.classList.add("text-green");
            }
        })
    }
}

export { ResearchEntryDisplay, RequiredResearchListDisplay, RequiredResearchEntryDisplay}
export default ResearchEntryDisplay;