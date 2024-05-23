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
	self.buildTimer = 65;
	self.transforms = 0;
	self.value = param.value;
	self.team = self.whatTeam; // none, west, east

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

	self.regenerate = function()
	{
		if(self.targetLevel > self.upgradeLevel){
			if(self.buildTimer > 0) {
				for (let i = 0; i < self.upgradeLevel + 1; i++) { 
					if(checkBuildingConsumptionAndProduce(self.towerType)){
						self.buildTimer -= 2 * Base.constructionMultiplier;
						Base.Tech += self.upgradeLevel;
					}
					//else console.log("Could not build!");
				}
			}
			else { 
				self.upgradeLevel++;
				self.buildTimer = Math.round(65 + self.upgradeLevel * 0.5);
			}
			return;
		}
		else{
			for (let i = 0; i < self.upgradeLevel; i++) { 
				if(checkBuildingConsumptionAndProduce(self.towerType)) {Base.Tech += 1; Base.morale -= Math.ceil(10 - self.upgradeLevel / 100);}
			}
		}
	};

	self.update = function(){

		if(self.heroic == true){
			if(Base.phase == 1) self.heroicEXP += Base.wave / 75;
			self.AGI = Math.floor(30 + Math.pow(self.heroicWEP + self.heroicAGI * 2, 0.95));
			self.range = Math.floor(120 + Math.pow(self.heroicNTL / 2, 0.85));
			if (self.towerType == "heroicBarbarian") {
				self.damage = Math.floor(350 + Math.pow(self.heroicWEP * 4 + self.heroicSTR * 9, 0.95) + Math.pow(self.heroicJWL * 4 + self.heroicAGI * 3, 0.95));
			}
			else if (self.towerType == "heroicArcher") {
				self.damage = Math.floor(350 + Math.pow(self.heroicWEP * 4 + self.heroicSTR * 6, 0.95) + Math.pow(self.heroicJWL * 4 + self.heroicAGI * 6, 0.95));
			}
			else if (self.towerType == "heroicWizard") {
				self.damage = Math.floor(350 + Math.pow(self.heroicWEP * 4 + self.heroicSTR * 3, 0.95) + Math.pow(self.heroicJWL * 4 + self.heroicNTL * 9, 0.95));
			}
			self.heroicLVL = Math.floor(Math.pow(self.heroicEXP / 300 , 0.55));
			self.heroicPTS = 9 + self.heroicLVL - self.heroicSTR - self.heroicAGI - self.heroicNTL;
			//console.log("ARCHER - LVL: " + self.heroicLVL + " PTS: " + self.heroicPTS)
		}

		super_update();

		self.attackTimer += 1 + self.AGI;
		
		if (self.attackTimer > 1200){
			//console.log("Tower look for baddie");
			if(self.towerType == "rocket"){
				for(var ni in NPC.list){
					var np = NPC.list[ni];
					if(self.getDistance(np) < self.range && Math.round(Math.random() * 5) == 3 ){
						var dy = np.y - self.y;
						var dx = np.x - self.x;
  						var theta = Math.atan2(dy, dx); // range (-PI, PI]
  						theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
						if (theta < 0) theta = 360 + theta; // range [0, 360)
					}
				}
				if (theta == undefined){
					return;
				}
				self.shootBullet(ni,theta,"rocket",self.id); self.attackTimer = 0; return;
			}
			else if(self.mana > 89 && self.towerType == "grave"){
				var target = self.getArmor(self.range);
				if (target[1] !== 420) {self.shootBullet(target[0],target[1],"spellGrave",self.id); self.mana -= 89; self.attackTimer = 0; return;}
			}
			else if(self.mana > 69 && self.towerType == "darkness"){
				var target = self.getArmor(self.range);
				if (target[1] !== 420) {self.shootBullet(target[0],target[1],"spellDarkness",self.id); self.mana -= 69; self.attackTimer = 0; return;}
			}
			else if(self.mana > 39 && self.towerType == "snowman"){
				for(var ni in NPC.list){
					var np = NPC.list[ni];
					if(self.attackTimer < 300) return;
					if(self.getDistance(np) < self.range){
						var dy = np.y - self.y;
						var dx = np.x - self.x;
  						var theta = Math.atan2(dy, dx); // range (-PI, PI]
  						theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
						if (theta < 0) theta = 360 + theta; // range [0, 360)
						self.shootBullet(ni,theta,"spellSnowman",self.id); self.mana -= 39; self.attackTimer -= 399;
					}
				}
			}
			else if(self.mana > 109 && self.towerType == "spark"){
				for(var ni in NPC.list){
					var np = NPC.list[ni];
					if(self.getDistance(np) < self.range && np.stun < 1024){
						var dy = np.y - self.y;
						var dx = np.x - self.x;
  						var theta = Math.atan2(dy, dx); // range (-PI, PI]
  						theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
						if (theta < 0) theta = 360 + theta; // range [0, 360)
						self.shootBullet(ni,theta,"spellSpark",self.id); self.mana -= 109; self.attackTimer = 0; return;
					}
				}
			}
			else if(self.mana > 99 && self.towerType == "lightning"){
				for(var ni in NPC.list){
					var np = NPC.list[ni];
					if(self.getDistance(np) < self.range && np.stun < 1024){
						var dy = np.y - self.y;
						var dx = np.x - self.x;
  						var theta = Math.atan2(dy, dx); // range (-PI, PI]
  						theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
						if (theta < 0) theta = 360 + theta; // range [0, 360)
						self.shootBullet(ni,theta,"spellLightning",self.id); self.mana -= 99; self.attackTimer = 0; return;
					}
				}
			}

			for(var ni in NPC.list){
				var np = NPC.list[ni];
				if(self.getDistance(np) < self.range){
					//console.log("I found a baddie");
					var dy = np.y - self.y;
					var dx = np.x - self.x;
  					var theta = Math.atan2(dy, dx); // range (-PI, PI]
  					theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
					if (theta < 0) theta = 360 + theta; // range [0, 360)

					if (self.mana > 49 && self.towerType == "corrosion") {self.shootBullet(ni,theta,"spellCorrosion",self.id); self.mana -= 49;}
					else if (self.mana > 39 && self.towerType == "toxic") {self.shootBullet(ni,theta,"spellCorrosion",self.id); self.mana -= 39;}
					else if (self.mana > 39 && self.towerType == "frost") {self.shootBullet(ni,theta,"spellFrost",self.id); self.mana -= 39;}
					else if (self.mana > 59 && self.towerType == "bbq") {self.shootBullet(ni,theta,"spellBBQ",self.id); self.mana -= 59;}
					else if (self.mana > 209 && self.towerType == "ganja") {self.shootBullet(ni,theta,"spellGanja",self.id); self.mana -= 209;}
					else if (self.mana >= 11 && self.towerType == "gun") {if(self.loaded == 1){self.shootBullet(ni,theta,self.towerType,self.id); self.mana -= 11;}}
					else if (self.mana < 11 && self.towerType == "gun") {if(self.loaded == 1){self.loaded = 0;}self.attackTimer = 0; return;}
					else if (self.mana >= 39 && self.towerType == "laser") {self.shootBullet(ni,theta,self.towerType,self.id); self.mana -= 39; self.attackTimer = 0; return;}
					else if (self.mana < 39 && self.towerType == "laser") {return;}
					else if (self.mana >= 11 && self.towerType == "oilDrum") {self.shootBullet(ni,theta,self.towerType,self.id); self.shootBullet(ni,theta - 16,self.towerType,self.id); self.shootBullet(ni,theta + 16,self.towerType,self.id); self.mana -= 11;}
					else if (self.mana < 11 && self.towerType == "oilDrum") {self.attackTimer = 0; return;}
					else {self.shootBullet(ni,theta,self.towerType,self.id)}
					self.attackTimer = 0;
					//if(self.towerType == "heroicArcher") self.heroicEXP += Base.wave * 2;
					return;
				}
			}
		}
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

function checkBuildingConsumptionAndProduce(buildingName) {
	const building = buildings[buildingName];
  
	if (building && building.consume && building.produce) {
	  const resources = Object.keys(building.consume);
	  const hasAllResources = resources.every(resource => {
		if (resource === 'population') {
		  return building.consume[resource] <= Base.population;
		} else {
		  return building.consume[resource] && Base.stockpile[resource] >= building.consume[resource];
		}
	  });
  
	  if (hasAllResources) {
		console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
  
		for (const resource of resources) {
		  if (resource === 'population') {
			Base.population -= building.consume[resource];
		  } else {
			Base.stockpile[resource] -= building.consume[resource];
		  }
		}
  
		const producedItems = Object.entries(building.produce);
		for (const [item, quantity] of producedItems) {
		  if (item === 'population') {
			Base.population += quantity;
			console.log(`The ${buildingName} building produced ${quantity} population.`);
		  } else {
			Base.stockpile[item] = (Base.stockpile[item] || 0) + quantity;
			console.log(`The ${buildingName} building produced ${quantity} ${item}(s).`);
		  }
		}
		return true;
	  } else {
		console.log(`The ${buildingName} building does not have enough resources to consume ${resources.join(', ')}.`);
		return false;
	  }
	} else {
	  console.log(`The ${buildingName} building does not exist or does not have 'consume' and 'produce' properties.`);
	  return false;
	}
  }

  function checkBuildingConsumptionAndBuild(buildingName) {
	const building = buildings[buildingName];
  
	if (building && building.build) {
	  const resources = Object.keys(building.consume);
	  const hasAllResources = resources.every(resource => {
		if (resource === 'population') {
		  return building.build[resource] <= population;
		} else {
		  return building.build[resource] && Base.stockpile[resource] >= building.build[resource];
		}
	  });
  
	  if (hasAllResources) {
		//console.log(`The ${buildingName} building wants to consume ${resources.join(', ')}.`);
  
		for (const resource of resources) {
		  if (resource === 'population') {
			Base.population -= building.build[resource];
		  } else {
			Base.stockpile[resource] -= building.build[resource];
		  }
		}
		return true;
	  } else {
		//console.log(`The ${buildingName} building does not have enough resources to build ${resources.join(', ')}.`);
		return false;
	  }
	} else {
	  //console.log(`The ${buildingName} building does not exist or does not have 'build' and 'produce' properties.`);
	  return false;
	}
  }