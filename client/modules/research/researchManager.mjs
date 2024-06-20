import ResearchManagerBase from "research";
import ResearchEntryDisplay from "researchEntryDisplay";
import { socket } from "singletons";

class ResearchManager extends ResearchManagerBase {
    eventTarget;

    constructor() {
        super();

        socket.on("unlockedResearch", (researchIds) => { this.unlockedResearch(researchIds); });
        this.eventTarget = new EventTarget();
    }

    createResearchEntry(id, data) {
        return new ResearchEntryDisplay(id, data);
    }

    tryUnlockResearch(researchId) {
        socket.emit('unlockResearch', researchId);
    }

    unlockedResearch(researchIds) {
        researchIds.forEach(researchId => {
            if (!this.researchEntries[researchId] || this.researchEntries[researchId].unlocked) { return; }
            this.researchEntries[researchId].unlock();
            this.dispatchEvent(new CustomEvent("researchUnlocked", { detail: researchId }));
        });
    }

    /**
     * @param {string} type 
     * @param {EventListenerOrEventListenerObject | null} callback 
     * @param {boolean | AddEventListenerOptions | undefined} options 
     */
    addEventListener(type, callback, options) { this.eventTarget.addEventListener(type, callback, options); }

    /**
     * @param {string} type 
     * @param {EventListenerOrEventListenerObject | null} callback 
     * @param {boolean | EventListenerOptions | undefined} options 
     */
    removeEventListener(type, callback, options) { this.eventTarget.removeEventListener(type, callback, options); }

    /**
     * @param {Event} event 
     * @returns {boolean}
     */
    dispatchEvent(event) { return this.eventTarget.dispatchEvent(event); }
}

const researchManager = new ResearchManager();
export default researchManager;