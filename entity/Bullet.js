Bullet = function(param){
	var self = Entity(param);
	self.id = Math.random();
	self.angle = param.angle;
	self.type = param.type;
	if(param.towerType == "oilDrum") self.speed = 5;
	else self.speed = Math.pow(4 + param.speed / 7, 0.7);
	self.spdX = Math.cos(param.angle/180*Math.PI) * self.speed;
	self.spdY = Math.sin(param.angle/180*Math.PI) * self.speed;
	self.parentType = param.parenttype;
	self.bulletType = param.bulletType;
	//console.log("My bullet type is " + self.type + " and i spawned at x" + Math.round(self.x / 48) +" y"+ Math.round(self.x / 48));
	self.upgradeLevel = param.upgradeLevel;
	self.parent = param.parent;
	self.towerParent = param.towerParent;
	self.damage = param.damage;
	self.target = param.target;
	self.lastTarget = "";
	self.spdX = 0;
	self.spdY = 0;

	self.timer = 0;
	self.bounces = 0;
	self.toRemove = false;
	var super_update = self.update;

	self.damageCalc = function(damage,bulletType,armor,armorType){
		var calcDamage = damage;

				if(armor > 0 && bulletType == "physical" && armorType == "light")
				{ calcDamage = damage * 1.25 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "physical" && armorType == "heavy")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "physical" && armorType == "fortified")
				{ calcDamage = damage * 0.50 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "physical" && armorType == "infernal")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "physical" && armorType == "divine")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "physical" && armorType == "draconic")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }

				else if(armor > 0 && bulletType == "siege" && armorType == "light")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "siege" && armorType == "fortified")
				{ calcDamage = damage * 1.50 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "siege" && armorType == "infernal")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "siege" && armorType == "divine")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }

				else if(armor > 0 && bulletType == "arcane" && armorType == "heavy")
				{ calcDamage = damage * 1.25 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "arcane" && armorType == "fortified")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "arcane" && armorType == "infernal")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "arcane" && armorType == "divine")
				{ calcDamage = damage * 0.50 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "arcane" && armorType == "draconic")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }

				if(armor > 0 && bulletType == "heroic" && armorType == "light")
				{ calcDamage = damage * 0.50 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "heroic" && armorType == "heavy")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "heroic" && armorType == "fortified")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "heroic" && armorType == "infernal")
				{ calcDamage = damage * 1.25 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "heroic" && armorType == "divine")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }

				if(armor > 0 && bulletType == "elemental" && armorType == "light")
				{ calcDamage = damage * 1.25 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "elemental" && armorType == "fortified")
				{ calcDamage = damage * 0.75 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "elemental" && armorType == "divine")
				{ calcDamage = damage * 1.25 / Math.pow(0.95 + armor / 22, 0.35); }
				else if(armor > 0 && bulletType == "elemental" && armorType == "draconic")
				{ calcDamage = damage * 0.50 / Math.pow(0.95 + armor / 22, 0.35); }

				else if(armor > 0){ calcDamage = damage / Math.pow(0.90 + armor / 22, 0.35);}
				else{calcDamage = damage * 1.5;}

				if(calcDamage < 1) calcDamage = 1;

				return calcDamage;
	}

	self.update = function(){
		self.updateSpd();
		//self.toRemove = true;
		//console.log(self)
		super_update();
	}

	self.updateSpd = function(){
		self.spdX = 0;
		self.spdY = 0;
	}

	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			map:self.map,
			bulletType:self.bulletType,
			towerType:self.type,
			angle:self.angle,
			timer:self.timer,
			towerParent:self.towerParent,
		};
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			angle:self.angle,
			timer:self.timer,
		};
	}

	Bullet.list[self.id] = self;
	initPack.bullet.push(self.getInitPack());
	return self;
}
Bullet.list = {};

Bullet.update = function(){
	var pack = [];
	for(var i in Bullet.list){
		var bullet = Bullet.list[i];
		bullet.update();
		if(bullet.toRemove){
			delete Bullet.list[i];
			removePack.bullet.push(bullet.id);
		} else
			pack.push(bullet.getUpdatePack());
	}
	return pack;
}

Bullet.getAllInitPack = function(){
	var bullets = [];
	for(var i in Bullet.list)
		bullets.push(Bullet.list[i].getInitPack());
	return bullets;
}