lib = {};
(async () => {
	lib = await import("../lib/lib.mjs");
	console.log("lib.lerp(0,42,0.75)", lib.lerp(0,42,0.75));
})();

Tower = function(param){
	var self = Entity(param);
	self.id = Math.random();
	self.angle = 0;
	self.spdX = 0;
	self.spdY = 0;
	self.towerType = param.towerType;
	self.parentType = param.parenttype;
	self.bulletType = param.bulletType;
	self.loaded = 0;
	self.mana = 0;
	self.manaMax = param.mana;
	self.parent = param.parent;
	self.damage = param.damage;
	self.range = param.range;
	self.STR = 25;
	self.AGI = param.agi;
	self.attackTimer = 0;
	self.upgradeLevel = 0;
	self.targetLevel = 1;
	self.buildTimer = 0;
	self.workRemaining = 0;
	self.productionLevel = 0;
	self.transforms = 0;
	self.value = param.value;
	self.buildingPhase = 0; // 0 idle, 1 buildGather, 2 build, 3 consume, 4 produce
	self.status = "build";
	self.active = true;
	self.produceSuccess = 0;
	self.workCapacity = 0;
	self.workUsage = 0;
	self.repeatIdle = 0;

	self.heroic = false;

	self.timer = 0;
	self.toRemove = false;
	var super_update = self.update;

	self.getMaxWorkers = function(upgradeLevel){
		return Math.min(Math.max(Math.floor(Base.moraleCR / 9000 * (upgradeLevel + 0.25)), 1) , upgradeLevel + 1);
	};


	self.comfyTick = function(){
		if (self.buildingPhase == 0){ //idle
			// Towers will stay idle if resources aren't available.
			if (self.targetLevel > self.upgradeLevel && self.checkBuildingConsumptionBuild(self.towerType,self.upgradeLevel)){
				self.buildingPhase = 1;
				self.productionLevel = 0;
				console.log("To buildGather");
			}
			else if(self.checkBuildingConsumptionProduce(self.towerType)) {
				self.buildingPhase = 3;
				self.productionLevel = 0;
				console.log("To consume");
			}
			else{
				self.repeatIdle++;
				if(self.repeatIdle % 50 == 0 && self.repeatIdle > 49) { Base.announce(self.towerType + " has idled for " + self.repeatIdle + " consequtive times!")}
			}
		}
		else if (self.buildingPhase == 1){ //buildCon
			if (self.checkBuildingConsumptionBuild(self.towerType,self.upgradeLevel)){
				Base.totalPopCarrier += self.upgradeLevel;
				self.workRemaining = lib.progressPerBuild(self.towerType, self.upgradeLevel);
				//console.log("lib: " + lib.progressPerBuild(self.towerType, self.upgradeLevel));
				self.buildingPhase = 2;
			}
			else self.buildingPhase = 0;
		}
		else if (self.buildingPhase == 2){ //build
			self.workCapacity = Math.max(1, self.upgradeLevel);
			self.workUsage = self.getMaxWorkers(Math.max(1, self.upgradeLevel));
			if (self.workRemaining > self.workUsage) { self.workRemaining -= self.workUsage; Base.totalPopBuilder += self.workUsage; }
			else { self.workRemaining = 0; Base.totalPopBuilder += self.workRemaining; }

			//console.log("Work remaining: " + self.workRemaining);

			if(self.workRemaining == 0) {
				self.buildingPhase = 0;
				self.upgradeLevel++;
				//console.log("build complete, to idle");
			}
		}
		else if (self.buildingPhase == 3){ //consume
			if (self.checkApplyBuildingConsumptionProduce(self.towerType) && self.productionLevel < self.upgradeLevel){
				if (buildings[self.towerType].category == "housing" ) {
					// housing skips directly to build after one consumption.
					self.workRemaining = 24 + self.productionLevel;
					self.buildingPhase = 4;
				}
					self.productionLevel++;
			}
			else{
				if(self.productionLevel > 0) {
					self.workRemaining = lib.progressPerProduction(self.towerType, self.productionLevel);
					self.buildingPhase = 4;
				}
				else self.buildingPhase = 0;
			}
		}
		else if (self.buildingPhase == 4){ //produce
			self.workCapacity = Math.max(1, self.upgradeLevel);
			self.workUsage = self.getMaxWorkers(Math.max(1, self.upgradeLevel));
			if (buildings[self.towerType].category == "housing" ) { self.outputBuildingProduce(self.towerType, self.upgradeLevel); }
			//console.log("Work remaining: " + self.workRemaining);
			if (self.workRemaining > self.workUsage) { 
				self.workRemaining -= self.workUsage; 
				if (buildings[self.towerType].category !== "housing") Base.totalPopWorker += self.workUsage; 
			}
			else { Base.totalPopWorker += self.workRemaining; self.workRemaining = 0; }

			if(self.workRemaining == 0) { 
				self.outputBuildingProduce(self.towerType,self.productionLevel);
				self.buildingPhase = 0; 
				Base.totalPopCarrier += self.productionLevel;
				Base.Tech += self.productionLevel;
				console.log("produce (" + self.productionLevel + "/" + self.upgradeLevel + ") complete, to idle"); 
			}
		}
	};

	self.update = function(){
		super_update();
	}

	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			parent:self.parent,
			map:self.map,
			mana:self.mana,
			manaMax:self.manaMax,
			bulletType:self.bulletType,
			towerType:self.towerType,
			upgradeLevel:self.upgradeLevel,
			targetLevel:self.targetLevel,
			productionLevel:self.productionLevel,
			workRemaining:self.workRemaining,
			buildingPhase:self.buildingPhase,
		};
	}
	self.getUpdatePack = function(){
		if (tick % 3 == 1)
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			towerType:self.towerType,
			upgradeLevel:self.upgradeLevel,
			targetLevel:self.targetLevel,
			productionLevel:self.productionLevel,
			workRemaining:self.workRemaining,
			workCapacity:self.workCapacity,
			workUsage:self.workUsage,
			buildingPhase:self.buildingPhase,
		};
		else return;
	}

	self.checkBuildingConsumptionProduce = function(buildingName) {
		const building = buildings[buildingName];
	  
		if (building && building.consume && building.produce) {
		  const resources = Object.keys(building.consume);
		  const hasAllResources = resources.every(resource => {
			if (resource === 'population') {
			  return building.consume[resource] <= Base.populationCurrent;
			} else {
			  return building.consume[resource] && Base.stockpile[resource] >= building.consume[resource];
			}
		  });
			  return hasAllResources;
		} else {
			  console.log(`The ${buildingName} building does not exist or does not have 'consume' and 'produce' properties.`);
		  return false;
		}
	};

	self.checkApplyBuildingConsumptionProduce = function(buildingName) {
		const building = buildings[buildingName];
	  
		if (building && building.consume && building.produce) {
		  const resources = Object.keys(building.consume);
		  const hasAllResources = resources.every(resource => {
			if (resource === 'population') {
			  return building.consume[resource] <= Base.populationCurrent;
			} else {
			  return building.consume[resource] && Base.stockpile[resource] >= building.consume[resource];
			}
		  });
		  if(hasAllResources) {
			for (const resource of resources) { Base.stockpile[resource] -= building.consume[resource]; }
			return true;
		  }
		  else { return false; }
		} else {
			  console.log(`The ${buildingName} building does not exist or does not have 'consume' and 'produce' properties.`);
		  return false;
		}
	};

	self.outputBuildingProduce = function(buildingName,upgradeLevel) {
		const building = buildings[buildingName];
	  
		if (building && building.consume && building.produce) {
		  const resources = Object.keys(building.consume);
		  const hasAllResources = true;
		  if (hasAllResources) {
			//console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
	  
			const producedItems = Object.entries(building.produce);
			for (const [item, quantity] of producedItems) {
			  if (item === 'population') {
				Base.totalPopProduce += quantity * upgradeLevel;
				//console.log(`The ${buildingName} building produced ${quantity} population.`);
			  } else {
					Base.stockpile[item] = (Base.stockpile[item] || 0) + quantity * upgradeLevel;
				//console.log(`The ${buildingName} building produced ${quantity} ${item}(s).`);
			  }
			}
			return true;
		  } else {
				//console.log(`The ${buildingName} building does not have enough resources to produce: ${resources.join(', ')}.`);
			return false;
		  }
		} else {
			  console.log(`The ${buildingName} building does not exist or does not have 'consume' and 'produce' properties.`);
		  return false;
		}
	};

	self.checkBuildingConsumptionBuild = function(buildingName,upgradeLevel) {
		const building = buildings[buildingName];
	  
		if (building && building.build) {
		  const resources = Object.keys(building.build);
		  //console.log(resources);
		  const hasAllResources = resources.every(resource => {
			  return building.build[resource] && Base.stockpile[resource] >= Math.round(building.build[resource] * (upgradeLevel * 5 + 1));
		  });
	  
		  if (hasAllResources) {
			//console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
	  
			for (const resource of resources) {
				Base.stockpile[resource] -= Math.round(building.build[resource] * (upgradeLevel * 5 + 1));
			}
			return true;
		  } else {
			//console.log(`The ${buildingName} building does not have enough resources to build: ${resources.join(', ')}.`);
			return false;
		  }
		} else {
			console.log(`The ${buildingName} building does not exist or does not have 'build' and 'produce' properties.`);
		  return false;
		}
	};

	Tower.list[self.id] = self;
	initPack.tower.push(self.getInitPack());
	return self;
}
Tower.list = {};

Tower.update = function(){
	var pack = [];
	for(var i in Tower.list){
		var tower = Tower.list[i];
		tower.update();
		if(tower.toRemove){
			delete Tower.list[i];
			removePack.tower.push(tower.id);
		} else
			pack.push(tower.getUpdatePack());
	}
	return pack;
}

Tower.getAllInitPack = function(){
	var towers = [];
	for(var i in Tower.list)
		towers.push(Tower.list[i].getInitPack());
	return towers;
}