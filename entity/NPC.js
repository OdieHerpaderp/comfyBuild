NPC = function(param){
	var self = Entity(param);
	self.number = "" + Math.floor(10 * Math.random());
	self.username = param.username;
	self.creepType = param.creepType;
	console.log("Spawned a " + self.creepType);
	self.armor = param.armor;
	self.armorType = param.armorType;
	self.mouseAngle = 0;
	self.windup = 0;
	self.cooldown = 0;
	self.maxSpd = 2;
	self.toRemove = false;
	self.path = param.path;
	self.PFStep = 0;
	if (param.pfstep != undefined) self.PFStep = param.pfstep;
	self.PFX = 0;
	if (param.pfx != undefined) self.PFX = param.pfx;
	self.PFY = 0;
	if (param.pfy != undefined) self.PFY = param.pfy;
	self.nearbyTower = true;

	self.STR = param.str;
	self.VIT = param.vit;
	self.DEX = param.dex;
	self.AGI = param.agi;
	self.NTL = param.ntl;
	self.CNC = param.cnc;
	self.WIL = param.wil;
	self.LUK = param.luk;
	self.END = param.end;
	self.exp = param.exp;
	//console.log("I spawned with EXP " + self.exp);

	self.corrosion = 0;
	self.frost = 0;
	self.fire = 0;
	self.stoned = 0;
	self.shield = 0;
	self.stun = 0;
	self.mana = 0;

	self.shieldRegen = 0;
	if(self.creepType == "robot") self.shield = Math.round(180 + Math.pow(90 * Base.wave, 1.175));
	else if(self.creepType == "cyborg") self.shield = Math.round(120 + Math.pow(60 * Base.wave, 1.175));
	else if(self.creepType == "buggy") self.shield = Math.round(60 + Math.pow(30 * Base.wave, 1.175));
	else if(self.creepType == "futureSoldier") self.shield = Math.round(50 + Math.pow(25 * Base.wave, 1.175));
	else self.shield = 0;

	self.shieldMax = self.shield;

	self.hp = Math.round( 120 + Math.pow(self.VIT * 1.68 , 1.22) + Math.pow(self.STR / 15 , 0.98) );
	self.hpMax = self.hp;

	self.getHpMax = function(){
		self.hpMax = Math.round( 120 + Math.pow(self.VIT * 1.68 , 1.22) + Math.pow(self.STR / 15 , 0.98) );
		if(self.hp > self.hpMax){
			self.hp = self.hpMax;
		}
	}

	self.regenerate = function()
	{
		self.mana += 1;

		if(self.mana >= 20 && self.creepType == "cubeBoss") spawnSlime();

		if(self.creepType == "robot") self.stoned = 0;
		if(self.stoned > 840){
			if(self.corrosion >= 1) {
				self.hp -= Math.ceil(self.corrosion / 4);
				for(var i in SOCKET_LIST){
					var sucket = SOCKET_LIST[i];
					sucket.emit('damage',{type:"corrosion",damage:Math.ceil(self.corrosion / 5),x:self.x,y:self.y,});
				}
				self.corrosion -= Math.ceil(self.corrosion / 16);
			}
			
			if(self.fire >= 1) {
				self.hp -= Math.ceil(self.fire / 4); 
				for(var i in SOCKET_LIST){
					var sucket = SOCKET_LIST[i];
					sucket.emit('damage',{type:"fire",damage:Math.ceil(self.fire / 5),x:self.x,y:self.y,});
				}
				self.fire -= Math.ceil(self.fire / 16);
		}
			self.stoned -= Math.ceil(self.stoned / 72);
		}
		else if(self.corrosion < 1 && self.fire < 1 && self.STR > 3){
			self.hp += (Math.pow(self.VIT * 0.9, 0.84) + Math.pow(self.STR * 1.2, 1.04)) / 750;
		}
		else{ 	
			if(self.corrosion >= 1) {
				self.hp -= Math.ceil(self.corrosion / 4);
				for(var i in SOCKET_LIST){
					var sucket = SOCKET_LIST[i];
					sucket.emit('damage',{type:"corrosion",damage:Math.ceil(self.corrosion / 5),x:self.x,y:self.y,});
				}
				self.corrosion -= Math.ceil(self.corrosion / 16);
			}
			if(self.fire >= 1) {
				self.hp -= Math.ceil(self.fire / 4); 
				for(var i in SOCKET_LIST){
					var sucket = SOCKET_LIST[i];
					sucket.emit('damage',{type:"fire",damage:Math.ceil(self.fire / 4),x:self.x,y:self.y,});
				}
				if(self.corrosion < 1) self.hp += Math.round( Math.pow(self.VIT * 1.4, 0.84) + Math.pow(self.STR * 1.8, 1.04) ) / 1000;
				self.fire -= Math.ceil(self.fire / 16);
			}
		}
		if(self.frost > 0) self.frost -= Math.ceil(self.frost / 6);
		if(self.stun > 0) self.stun -= Math.ceil(self.stun / 24);

		if(self.shieldRegen <= 0) self.shield += 5 + Base.wave / 2;
		else self.shieldRegen -= 1;
		self.getHpMax();
		if(self.shield > self.shieldMax) self.shield = self.shieldMax;
	}

	self.score = 0;
	self.statPTS = 0;
	//self.inventory = new Inventory(param.progress.items,param.socket,true);

	var super_update = self.update;
	self.update = function(){
		self.updateSpd();

		super_update();

		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
		self.GridX = Math.round(self.x / 48);
		self.GridY = Math.round(self.y / 48);
		if ((self.path == "A" && self.GridX == Gamemode.endAX && self.GridY == Gamemode.endAY) || (self.path == "B" && self.GridX == Gamemode.endBX && self.GridY == Gamemode.endBY)){
			//Do damage to base
			//console.log("Leaked NPC: " + self.hp + " Damage");
			Base.leaks += 1;
			Base.Health -= self.hp / 10;
			//console.log("Base HP: " + Base.Health);
			Base.announce("Leaked Creep from path " + self.path + ". Base HP: " + Math.round(Base.Health));
			self.hp = 0;
			self.toRemove = true;
			if(Base.Health < 1){
				serv.close();
			}
		}
	}
	self.shootBullet = function(angle){
		if(Math.random() < 0.1)
		{
			self.inventory.addItem("potion",1);
		}
		self.calcDamage = Math.pow(self.STR , 0.95);
		Bullet({
			parent:self.id,
			angle:angle,
			x:self.x,
			y:self.y,
			map:self.map,
			damage:self.calcDamage,
		});
	}

	self.spawnSlime = function(){
		NPC({
			id:Math.round(Math.random() * 25600),
			creepType:"cubeSpawn",
			str:self.STR,
			vit:self.VIT / 2,
			dex:self.DEX,
			armor:Math.round((Base.wave + self.armor) / 2),
			armorType:Base.armorType,
			agi:self.AGI / 2,
			ntl:self.NTL,
			cnc:self.CNC,
			wil:self.WIL,
			luk:self.LUK,
			end:self.END,
			exp:self.exp,
			x:self.x,
			y:self.y,
			path:self.path,
			pfstep:self.PFStep,
			pfx:self.PFX,
			pfy:self.PFY,
			map:'field',
		});
		self.mana -= 20;
	}

	self.updateSpd = function(){
		//WE GON FIND PATH
		if(self.PFX == 0 && self.PFY == 0)
		{
			if(self.path == "A") self.PFX = PFGrid.pathA[self.PFStep][0];
			else self.PFX = PFGrid.pathB[self.PFStep][0];
			//console.log("X: " + PFGrid.path[self.PFStep][0]);
			if(self.path == "A") self.PFY = PFGrid.pathA[self.PFStep][1];
			else self.PFY = PFGrid.pathB[self.PFStep][1];
			//console.log("Y: " + PFGrid.path[self.PFStep][1]);
		}
		var dist = self.getDistanceToPoint(self.PFX * 48,self.PFY * 48);
		if(dist < 4)
		//if(Math.round(self.x / 48) == self.PFX && Math.round(self.y / 48) == self.PFY)
		{
			
			self.PFStep += 1;
			//console.log("Going to step " + self.PFStep);
			if(self.path == "A") self.PFX = PFGrid.pathA[self.PFStep][0];
			else self.PFX = PFGrid.pathB[self.PFStep][0];
			//console.log("X: " + PFGrid.path[self.PFStep][0]);
			if(self.path == "A") self.PFY = PFGrid.pathA[self.PFStep][1];
			else self.PFY = PFGrid.pathB[self.PFStep][1];
			//console.log("Y: " + PFGrid.path[self.PFStep][1]);
		}

		//WE GON MOVE
		if(self.stoned <= 8400 && self.stun <= 1024)
		{
			var dy = self.PFY * 48 - self.y;
			var dx = self.PFX * 48 - self.x;
			var theta = Math.atan2(dy, dx); // range (-PI, PI]
			theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
			if (theta < 0) theta = 360 + theta; // range [0, 360)

			self.angle = theta;

			self.checkNearbyTower();

			if (self.nearbyTower == true){
				self.spdX = Math.cos(self.angle/180*Math.PI) * (Math.pow(self.AGI / 12, 0.8)) / Math.pow(1 + self.frost / 64 + self.stoned / 196, 0.25);
				self.spdY = Math.sin(self.angle/180*Math.PI) * (Math.pow(self.AGI / 12, 0.8)) / Math.pow(1 + self.frost / 64 + self.stoned / 196, 0.25);
			}
			else{
				self.spdX = 0;
				self.spdY = 0;

				self.x = self.PFX * 48;
				self.y = self.PFY * 48;
			}
		}
		else
		{
			if (self.stun > 1024) self.stun -= 8 + self.AGI;
			if (self.stoned > 8400) self.stoned -= 4 + self.AGI;
			self.spdX = 0;
			self.spdY = 0;
		}
	}

	self.checkNearbyTower = function(){
		self.nearbyTower = false;
		for(var i in Tower.list){
			var t = Tower.list[i];
			if (t.getDistance(self) < 192 && t.towerType != "rock") {self.nearbyTower = true; return;}
		}
	}

	self.getInitPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			creepType:self.creepType,
			number:self.number,
			hp:self.hp,
			hpMax:self.hpMax,
			map:self.map,
			corrosion:self.corrosion,
			frost:self.frost,
			armor:self.armor,
			stoned:self.stoned,
			fire:self.fire,
			stun:self.stun,
			shield:self.shield,
			shieldMax:self.shieldMax,
		};
	}
	self.getUpdatePack = function(){
		if (tick % 3 == 1)
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
			hpMax:self.hpMax,
			map:self.map,
			corrosion:self.corrosion,
			frost:self.frost,
			armor:self.armor,
			stoned:self.stoned,
			fire:self.fire,
			shield:self.shield,
			stun:self.stun,
			shieldMax:self.shieldMax,
		};
		else return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
		};
	}

	NPC.list[self.id] = self;

	initPack.npc.push(self.getInitPack());
	return self;
}

NPC.list = {};

NPC.getAllInitPack = function(){
	var npcs = [];
	for(var i in NPC.list)
		npcs.push(NPC.list[i].getInitPack());
	console.log("NPCS: " + npcs);
	return npcs;
}

NPC.update = function(){
	var pack = [];
	for(var i in NPC.list){
		var npc = NPC.list[i];
		npc.update();
		if(npc.toRemove){
			delete NPC.list[i];
			removePack.npc.push(npc.id);
		} else
			pack.push(npc.getUpdatePack());
	}
	return pack;
}