// TO DO:
// - Get rid of globals (socket)

import BuildingDataList from "./modules/buildings/buildingDataList.mjs";
import ResourceList from "./modules/resources/resourceList.mjs";
import buildings from "../lib/buildings.mjs";

// Buildings
let buildingList = new BuildingDataList(buildings);
document.getElementById('buildingsDiv').replaceWith(buildingList.HTML);

// Stockpile
var stockpile = new ResourceList();
document.getElementById('stockpileDiv').replaceWith(stockpile.HTML);
socket.on('stockpile',function(data){
    stockpile.updateResources(data);
});