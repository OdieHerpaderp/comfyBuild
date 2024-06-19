import ResearchManagerBase from "research";
import { socket } from "singletons";

class ResearchManager extends ResearchManagerBase {
    constructor() {
        super();

        socket.on("unlockedResearch", (researchIds) => { this.unlockedResearch(researchIds); });
    }

    tryUnlockResearch(researchId) {
        socket.emit('unlockResearch', researchId);
    }

    unlockedResearch(researchIds) {
        researchIds.forEach(researchId => {
            this.researchEntries[researchId].unlock();
        });
    }
}

const researchManager = new ResearchManager();
export default researchManager;