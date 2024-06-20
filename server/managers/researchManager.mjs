import ResearchManagerBase from "../../lib/research.mjs";
import worldManager from "./worldManager.mjs";

class ResearchManager extends ResearchManagerBase {
    constructor() {
        super();
    }

    /**
     * @type {string[]}
     */
    newlyUnlockedResearch = [];

    /**
     * @param {string} researchId 
     */
    tryUnlockResearch(researchId) {
        if (!researchId || !this.researchEntries[researchId]) {
            return { success: false, message: "This research does not exist (" + researchId + ")" };
        }
        let researchEntry = this.researchEntries[researchId];
        if (researchEntry.unlocked) {
            return { success: false, message: "This research is already unlocked" };
        }
        let missingResearch = this.getMissingResearchNames(researchEntry.requiredResearch);
        if (missingResearch.length !== 0) {
            return { success: false, message: "You must unlock the required research first: " + missingResearch.join(", ") };
        }
        if (!worldManager.tryPayTech(researchEntry.cost)) {
            return { success: false, message: "You don't have enough tech for this research" };
        }
        researchEntry.unlocked = true;
        this.newlyUnlockedResearch.push(researchId);
        return { success: true, message: "Successfully unlocked " + researchEntry.fullName };
    }

    /**
     * @returns {string[]}
     */
    getNewlyUnlockedResearch() {
        let result = this.newlyUnlockedResearch;
        this.newlyUnlockedResearch = [];
        return result;
    }

    /**
     * @returns {string[]}
     */
    getAllUnlockedResearch() {
        let result = [];
        for (const [_id, researchEntry] of Object.entries(this.researchEntries)) {
            if (!researchEntry.unlocked) { continue; }
            result.push(researchEntry.id);
        }
        return result;
    }
}

const researchManager = new ResearchManager();
researchManager.initialize();
export default researchManager;