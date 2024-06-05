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
	self.buildTimer = 35;
	self.productionTimer = 5;
	self.transforms = 0;
	self.value = param.value;
	self.team = self.whatTeam; // none, west, east
	self.status = "build";
	self.active = true;
	self.produceSuccess = 0;

	self.heroic = false;

	self.timer = 0;
	self.toRemove = false;
	var super_update = self.update;

	self.whatTeam = function(){
		if(self.parent == 0){
			return 0;
		}
		else return Player.list[self.parent].team;
	}

	self.comfyTick = function(){
		if(self.targetLevel > self.upgradeLevel && Base.populationCurrent > 8 + Base.populationAvg / 200){
			// TODO implement smarter way to make buildings (especially houses) prefer producing when population is low.
			if(self.buildTimer > 0) {
				for (let i = 0; i < Math.round(self.upgradeLevel / 10 + 1); i++) { 
					if(self.checkBuildingConsumptionAndBuild(self.towerType,self.upgradeLevel)){
						self.status = "build";
						self.buildTimer -= 2 / ((self.upgradeLevel / 10 + 1) * 1.34) * Base.constructionMultiplier;
						//Base.Tech += self.upgradeLevel;
					}
					else self.status = "buildStop";
				}
			}
			else { 
				self.upgradeLevel++;
				self.buildTimer = Math.round(35 + self.upgradeLevel * 2.5);
			}
			return;
		}
		else{
			var active = false;
			// TODO limit status to full production, atleast one production and no production
			if(self.productionTimer > 0){
				// Housing buildings will generate population every tick when needs are met during production tick.
				if(buildings[self.towerType].category == "housing" && self.produceSuccess > 0) 
					for (let i = 0; i < self.produceSuccess; i++) { self.checkBuildingProduce(self.towerType); }
				self.productionTimer--;
				self.status = "produceWait";
				active = true;
			}
			else{
				self.productionTimer = 3;
				self.produceSuccess = 0;
				for (let i = 0; i < self.upgradeLevel; i++) { 
					if(self.checkBuildingConsumptionAndProduce(self.towerType)) {self.status = "produce" + i; Base.Tech += 1; active=true; self.produceSuccess++;}
				}
				self.status = "produceStop";
			}
			if(active) Base.morale -= Math.ceil(25 - self.upgradeLevel / 25);
		}
	};

	self.update = function(){
		super_update();
	}

	self.shootBullet = function(target,angle,towerType,towerParent){
		self.calcDamage = self.damage;
		Bullet({
			parent:self.parent,
			angle:angle,
			speed:self.range * 0.7,
			x:self.x,
			y:self.y,
			map:self.map,
			damage:self.calcDamage,
			bulletType:self.bulletType,
			towerType:towerType,
			target:target,
			type:towerType,
			towerParent:towerParent,
			upgradeLevel:self.upgradeLevel,
		});
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
		};
	}
	self.getUpdatePack = function(){
		if (tick % 12 == 1)
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			towerType:self.towerType,
			upgradeLevel:self.upgradeLevel,
			targetLevel:self.targetLevel,
			buildTimer:self.buildTimer,
		};
		else if (tick % 2 == 1 && self.buildTimer > 0)
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			towerType:self.towerType,
			upgradeLevel:self.upgradeLevel,
			targetLevel:self.targetLevel,
			buildTimer:self.buildTimer,
		};

		return;
	}
	self.getArmor = function(range){
		var nextTarget;
		var nextArmor = 0;
		var theta = 0;
		for(var Bni in NPC.list){
			var Bnp = NPC.list[Bni];
			if(self.getDistance(Bnp) < range && self.lastTarget !== Bnp.id && Bnp.armor > 0){
				if (Bnp.armor > nextArmor){
					nextTarget = Bnp.id;
					nextArmor = Bnp.armor;
					var dx = Bnp.x - self.x;
					var dy = Bnp.y - self.y;
					theta = Math.atan2(dy, dx); // range (-PI, PI]
					theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
					if (theta < 0) theta = 360 + theta; // range [0, 360)
				}
			}
		}
		if (nextTarget){
			//console.log("shooting target at " + theta + " with " + nextArmor + " armor.");
			return [nextTarget, theta];
		}
		else{
			//console.log("no eligible target found.");
			return [420, 420];
		}
	}

	self.checkBuildingConsumptionAndProduce = function(buildingName) {
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
	  
		  if (hasAllResources) {
			//console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
	  
			for (const resource of resources) {
			  if (resource === 'population') {
				Base.populationCurrent -= building.consume[resource];
			  } else {
					Base.stockpile[resource] -= building.consume[resource];
			  }
			}
	  
			const producedItems = Object.entries(building.produce);
			for (const [item, quantity] of producedItems) {
			  if (item === 'population') {
				Base.population += quantity;
				//console.log(`The ${buildingName} building produced ${quantity} population.`);
			  } else {
					Base.stockpile[item] = (Base.stockpile[item] || 0) + quantity;
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

	self.checkBuildingProduce = function(buildingName) {
		const building = buildings[buildingName];
	  
		if (building && building.consume && building.produce) {
		  const resources = Object.keys(building.consume);
		  const hasAllResources = true;
		  if (hasAllResources) {
			//console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
	  
			const producedItems = Object.entries(building.produce);
			for (const [item, quantity] of producedItems) {
			  if (item === 'population') {
				Base.population += quantity;
				//console.log(`The ${buildingName} building produced ${quantity} population.`);
			  } else {
					Base.stockpile[item] = (Base.stockpile[item] || 0) + quantity;
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
	
	self.checkBuildingConsumptionAndBuild = function(buildingName,upgradeLevel) {
		const building = buildings[buildingName];
	  
		if (building && building.build) {
		  const resources = Object.keys(building.build);
		  const hasAllResources = resources.every(resource => {
			if (resource === 'population') {
			  return building.build[resource] <= Base.populationCurrent;
			} else {
			  return building.build[resource] && Base.stockpile[resource] >= Math.round(building.build[resource] * (0.5 + upgradeLevel / 25));
			}
		  });
	  
		  if (hasAllResources) {
			//console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
	  
			for (const resource of resources) {
			  if (resource === 'population') {
				Base.populationCurrent -= building.build[resource];
			  } else {
				Base.stockpile[resource] -= Math.round(building.build[resource] * (1 + upgradeLevel / 10));
			  }
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