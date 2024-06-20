import ResourceNode from "../entities/resourceNode.mjs";
import serverSettings from "../../lib/serverSettings.mjs";
import GridEntityManager from "./gridEntityManager.mjs";

const grassArea = {
    xMin: 8,
    xMax: serverSettings.mapWidth - 9,
    yMin: 8,
    yMax: serverSettings.mapWidth - 9
}
grassArea.width = grassArea.xMax - grassArea.xMin;
grassArea.height = grassArea.yMax - grassArea.yMin;
Object.freeze(grassArea);

const mountainArea = {
    xMin: 16,
    xMax: serverSettings.mapWidth - 17,
    yMin: 16,
    yMax: 47
}
mountainArea.width = mountainArea.xMax - mountainArea.xMin;
mountainArea.height = mountainArea.yMax - mountainArea.yMin;
Object.freeze(mountainArea);

class ResourceNodeManager extends GridEntityManager {
    generateResourceNodes() {
        this.spawnRandomResourceNodes(48, "saltWater", {
            xMin: 0,
            xMax: serverSettings.mapWidth - 1,
            yMin: serverSettings.mapHeight - 2,
            yMax: serverSettings.mapHeight - 1
        });

        this.spawnRandomResourceNodes(96, "freshWater", {
            xMin: serverSettings.mapWidth / 2 - 6,
            xMax: serverSettings.mapWidth / 2 + 6,
            yMin: 0,
            yMax: serverSettings.mapHeight - 1
        });

        // Grass stuff
        this.spawnRandomResourceNodes(96, "wildGame", grassArea, mountainArea);
        this.spawnRandomResourceNodes(96, "soil", {
            xMin: serverSettings.mapWidth / 2 + 4,
            xMax: grassArea.xMax,
            yMin: grassArea.yMin,
            yMax: grassArea.yMax
        }, mountainArea);
        this.spawnRandomResourceNodes(96, "forest", {
            xMin: grassArea.xMin,
            xMax: serverSettings.mapWidth / 2 - 4,
            yMin: grassArea.yMin,
            yMax: grassArea.yMax
        }, mountainArea);

        this.spawnRandomResourceNodes(48, "copperDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "tinDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "ironDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "zincDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "nickelDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "sulphurDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "leadDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "silverDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "limeDeposit", mountainArea);
        this.spawnRandomResourceNodes(48, "coalDeposit", {
            xMin: mountainArea.xMin - 2,
            xMax: mountainArea.xMax + 2,
            yMin: mountainArea.yMin - 2,
            yMax: mountainArea.yMax + 2
        });
        this.spawnRandomResourceNodes(64, "quartzDeposit", {
            xMin: mountainArea.xMin - 1,
            xMax: mountainArea.xMax + 1,
            yMin: mountainArea.yMin - 1,
            yMax: mountainArea.yMax + 1
        });
        this.spawnRandomResourceNodes(96, "rockDeposit", {
            xMin: mountainArea.xMin - 3,
            xMax: mountainArea.xMax + 3,
            yMin: mountainArea.yMin - 3,
            yMax: mountainArea.yMax + 3
        });
    }

    spawnRandomResourceNodes(amount, type, placementArea, avoidArea = { xMin: -1, xMax: -1, yMin: -1, yMax: -1 }) {
        if (placementArea.xMin < 0 || placementArea.xMax > serverSettings.mapWidth - 1 ||
            placementArea.yMin < 0 || placementArea.yMax > serverSettings.mapHeight - 1) {
                throw new RangeError("placementArea coordinates are out of range!");
        }

        if (!placementArea.width) { placementArea.width = placementArea.xMax - placementArea.xMin; }
        if (!placementArea.height) { placementArea.height = placementArea.yMax - placementArea.yMin; }

        for (let i = 0; i < amount; i++) {
            this.spawnRandomResourceNode(type, placementArea, avoidArea);
        }
    }

    spawnRandomResourceNode(type, placementArea, avoidArea) {
        let randomX = Math.round(placementArea.xMin + Math.random() * placementArea.width);
        let randomY = Math.round(placementArea.yMin + Math.random() * placementArea.height);
        while (this.grid[randomX][randomY] || this.isInArea(randomX, randomY, avoidArea)) {
            randomX = Math.round(placementArea.xMin + Math.random() * placementArea.width);
            randomY = Math.round(placementArea.yMin + Math.random() * placementArea.height);
        }
        this.grid[randomX][randomY] = new ResourceNode(randomX, randomY, type);
    }

    isInArea(x, y, area) {
        return x >= area.xMin && x <= area.xMax && y >= area.yMin && y <= area.yMax;
    }
}

const resourceNodeManager = new ResourceNodeManager();

export default resourceNodeManager;