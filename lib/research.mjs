const research = {
  housing1: {
    age: 0,
    fullName: "Housing I",
    info: "Unlocks Dolmen",
    cost: 25,
    requiredResearch: []
  },
  plantGathering1: {
    age: 0,
    fullName: "Plant Gathering I",
    info: "Unlocks fieldGatherers.",
    cost: 25,
    requiredResearch: []
  },
  caveGathering1: {
    age: 0,
    fullName: "Cave Gathering I",
    info: "Unlocks caveGatherers.",
    cost: 25,
    requiredResearch: []
  },
  tools1: {
    age: 0,
    fullName: "Tools I",
    info: "Unlocks the ability to produce primitive tools using the woodCarver.",
    cost: 250,
    requiredResearch: []
  },
  hunting: {
    age: 0,
    fullName: "Hunting I",
    info: "Unlocks huntersCamp.",
    cost: 250,
    requiredResearch: ["tools1"]
  },
  fire: {
    age: 1,
    fullName: "Invention of fire",
    info: "Understand and harness the power of fire.",
    cost: 2500,
    requiredResearch: ["tools1", "plantGathering1"]
  },
  plantGathering2: {
    age: 1,
    fullName: "Plant Gathering II",
    info: "The understanding of roots unlocks the gathering of rootVegetables.",
    cost: 5000,
    requiredResearch: ["fire", "plantGathering1"]
  },
  housing2: {
    age: 1,
    fullName: "Housing II",
    info: "Unlocks boneTent",
    cost: 5000,
    requiredResearch: ["fire", "housing1"]
  },
  tools2: {
    age: 1,
    fullName: "Tools II",
    info: "Unlocks the ability to produce primitive tools using bones.",
    cost: 5000,
    requiredResearch: ["fire", "tools1"]
  },
  combustion: {
    age: 1,
    fullName: "Combustion",
    info: "The understanding of combustion leads to the creation of charcoal",
    cost: 2500,
    requiredResearch: ["fire"]
  },
  tools3: {
    age: 2,
    fullName: "Tools III",
    info: "Unlocks the ability to produce sturdy flint tools.",
    cost: 25000,
    requiredResearch: ["tools2"]
  },
}

class ResearchManagerBase {
  /** @type {Object.<string, ResearchEntryBase>} */
  researchEntries = {};

  constructor() {
  }

  initialize() {
    for (const [id, data] of Object.entries(research)) {
      this.researchEntries[id] = this.createResearchEntry(id, data);
    }
  }

  createResearchEntry(id, data) {
    return new ResearchEntryBase(id, data);
  }

  getResearchEntry(id) {
    return this.researchEntries[id];
  }

  /**
   * @param {string[]} researchIds 
   * @returns {string[]}
   */
  getMissingResearchIds(researchIds) {
    researchIds ??= [];
    let missingResearchIds = [];
    researchIds.forEach(researchId => {
      if (this.researchEntries[researchId]?.unlocked) { return; }
      missingResearchIds.push(researchId);
    });
    return missingResearchIds;
  }

  /**
   * @param {string[]} researchIds 
   * @returns {string[]}
   */
  getMissingResearchNames(researchIds) {
    researchIds ??= [];
    let missingResearchNames = [];
    researchIds.forEach(researchId => {
      let researchEntry = this.researchEntries[researchId];
      if (!researchEntry) { missingResearchNames.push("UNKNOWN RESEARCH: " + researchId); return; }
      if (!researchEntry.unlocked) { missingResearchNames.push(researchEntry.fullName); return; }
    });
    return missingResearchNames;
  }
}

class ResearchEntryBase {
  /** @type {string} */
  id;
  /** @type {number} */
  age;
  /** @type {string} */
  fullName;
  /** @type {string} */
  info;
  /** @type {number} */
  cost;
  /** @type {string[]} */
  requiredResearch;

  unlocked = false;

  constructor(id, data) {
    this.id = id;
    this.age = data.age ?? -1;
    this.fullName = data.fullName ?? "MISSING NAME!";
    this.info = data.info ?? "[No info available]";
    this.cost = data.cost ?? 0;
    this.requiredResearch = data.requiredResearch ?? [];
  }

  unlock() {
    this.unlocked = true;
  }
}

export { ResearchManagerBase, ResearchEntryBase }
export default ResearchManagerBase;