import ResourceNode from "../entities/resourceNode.mjs";
import serverSettings from "../serverSettings.mjs";
import GridEntityManager from "./gridEntityManager.mjs";

class ResourceNodeManager extends GridEntityManager {
    generateResourceNodes() {
        for (let i = 0; i < 96; i++) { this.spawnRandomResourceNode("freshWater", 58, 0, 76, 127); }
        for (let i = 0; i < 96; i++) { this.spawnRandomResourceNode("soil", 60, 4, 124, 124); }
        for (let i = 0; i < 96; i++) { this.spawnRandomResourceNode("wildGame", 4, 4, 124, 124); }
        for (let i = 0; i < 96; i++) { this.spawnRandomResourceNode("forest", 4, 4, 90, 120); }
        for (let i = 0; i < 96; i++) { this.spawnRandomResourceNode("rockDeposit", 4, 8, 120, 50); }
        for (let i = 0; i < 64; i++) { this.spawnRandomResourceNode("quartzDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("copperDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("tinDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("ironDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("zincDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("leadDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("silverDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("coalDeposit", 4, 8, 120, 40); }
        for (let i = 0; i < 48; i++) { this.spawnRandomResourceNode("saltWater", 0, (serverSettings.mapHeight-1), serverSettings.mapWidth, serverSettings.mapHeight); }
    }

    spawnRandomResourceNode(type, xMin, yMin, xMax, yMax) {
        let xDiff = xMax - xMin;
        let yDiff = yMax - yMin;
        let randomX = Math.round(xMin + Math.random() * xDiff);
        let randomY = Math.round(yMin + Math.random() * yDiff);
        while (this.grid[randomX][randomY]) {
            randomX = Math.round(xMin + Math.random() * xDiff);
            randomY = Math.round(yMin + Math.random() * yDiff);
        }

        this.grid[randomX][randomY] = new ResourceNode(randomX, randomY, type);
    }
}

const resourceNodeManager = new ResourceNodeManager();

export default resourceNodeManager;