import buildings from "../../lib/buildings.mjs";
import Building from "../entities/building.mjs";
import Housing from "../entities/housing.mjs";
import WonderNatural from "../entities/wonderNatural.mjs";
import GridEntityManager from "./gridEntityManager.mjs";
import researchManager from "./researchManager.mjs";
import resourceNodeManager from "./resourceNodeManager.mjs";

class BuildingManager extends GridEntityManager {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {string} buildingType 
     * @returns an object containing a success boolean and an error if building failed
     */
    tryBuildBuilding(x, y, buildingType) {
        if (this.grid[x][y]) { return { success: false, message: "There is already another building in this location!" }; }

        let buildingData = buildings[buildingType];
        if (!buildingData) { return { success: false, message: "This building type does not exist." }; }

        let missingResearch = researchManager.getMissingResearchNames(buildingData.requiredResearch);
        if (missingResearch.length !== 0) {
            return { success: false, message: "You must unlock the required research first: " + missingResearch.join(", ") };
        }

        if (buildingData.node && buildingData.node !== resourceNodeManager.grid[x][y]?.resourceType) {
            return { success: false, message: buildingType + " must be placed on a " + buildingData.node + " node" };
        }

        if (buildingData.category === "housing") {
            this.grid[x][y] = new Housing(x, y, buildingType);
            return { success: true };
        }
        if (buildingData.category === "wonderNatural") {
            this.grid[x][y] = new WonderNatural(x, y, buildingType);
            return { success: true };
        }

        this.grid[x][y] = new Building(x, y, buildingType);
        return { success: true };
    }

    tick() {
        this.forEachEntity((building) => {
            building.tick();
        });
    }

    upgradeBuilding(x, y, amount) {
        let building = this.grid[x][y];
        if (!building) { return { success: false, message: "Failed to upgrade building: there is no building here" }; }
        if (!building.canBeUpgraded) { return { success: false, message: `${building.buildingType} cannot be upgraded.` }; }
        building.targetLevel += amount;
        return { success: true, message: `Upgrading ${building.buildingType} to level ${building.targetLevel}` };
    }

    upgradeSameTypeBuildings(x, y, amount) {
        let selectedBuilding = this.grid[x][y];
        if (!selectedBuilding) { return { success: false, message: "Failed to upgrade buildings: there is no building here" }; }
        if (!selectedBuilding.canBeUpgraded) { return { success: false, message: `${selectedBuilding.buildingType} cannot be upgraded.` }; }

        let targetType = selectedBuilding.buildingType;

        this.forEachEntity((building) => {
            if (building.buildingType !== targetType) { return; }
            building.targetLevel += amount;
        });

        return { success: true, message: `Upgrading all ${targetType} by ${amount} levels` };
    }

    upgradeAllBuildings(targetLevel) {
        let success = false;
        this.forEachEntity((building) => {
            if (building.canBeUpgraded && building.targetLevel < targetLevel) {
                building.targetLevel = targetLevel;
                success = true;
            }
        });

        if (!success) {
            return { success: false, message: `Failed to upgrade buildings: no buildings are below level ${targetLevel}` };
        }
        return { success: true, message: `Upgrading all buildings to level ${targetLevel}` };
    }

    sellBuilding(x, y) {
        let removedBuilding = this.removeEntityByPosition(x, y);
        if (!removedBuilding) {
            return { success: false, message: `Failed to sell building: there is no building here` };
        }
        return { success: true, message: `${removedBuilding.buildingType} was sold` };
    }
}

const buildingManager = new BuildingManager();

export default buildingManager;