// TO DO:
// - Get rid of globals (buildings, socket)

import BuildingDataList from "./modules/buildings/buildingDataList.js";
import ResourceList from "./modules/resources/resourceList.js";

// Buildings
let buildingList = new BuildingDataList(buildings);
document.getElementById('buildingsDiv').replaceWith(buildingList.HTML);

// Stockpile
var stockpile = new ResourceList();
document.getElementById('stockpileDiv').replaceWith(stockpile.HTML);
socket.on('stockpile',function(data){
    stockpile.updateResources(data);
});