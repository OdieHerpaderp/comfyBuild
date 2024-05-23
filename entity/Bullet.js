Bullet = function(param){
	var self = Entity(param);
	self.id = Math.random();
	self.angle = param.angle;
	self.type = param.towerType;
	if(param.towerType == "oilDrum") self.speed = 5;
	else self.speed = Math.pow(4 + param.speed / 7, 0.7);
	self.spdX = Math.cos(param.angle/180*Math.PI) * self.speed;
	self.spdY = Math.sin(param.angle/180*Math.PI) * self.speed;
	self.parentType = param.parenttype;
	self.bulletType = param.bulletType;
	//console.log("My bullet type is " + self.bulletType);
	self.upgradeLevel = param.upgradeLevel;
	self.parent = param.parent;
	self.towerParent = param.towerParent;
	self.damage = param.damage;
	self.target = param.target;
	self.lastTarget = "";

	self.timer = 0;
	self.bounces = 0;
	self.toRemove = false;
	var super_update = self.update;

	if(self.towerType == "laser"){
		self.x = NPC.list[self.target].x;
		self.y = NPC.list[self.target].y;
	}

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
		if(self.timer++ > 24)
			self.toRemove = true;
		super_update();

		//collision against NPCs
		for(var ni in NPC.list){
			var np = NPC.list[ni];

			if(5 + Math.random() * 100 < np.LUK) {
				for(var i in SOCKET_LIST){
					var sucket = SOCKET_LIST[i];
					sucket.emit('damage',{type:"miss",damage:"MISS",x:np.x,y:np.y,});
				}
				return;
			}

			if(self.map === np.map && self.getDistance(np) < 16){
				if(self.type == "spellGrave"){
					np.armor -= Math.ceil(Math.pow(-1 + 2 * self.upgradeLevel , 1.20));
				}
				else if(self.type == "spellDarkness"){
					np.armor -= Math.ceil(Math.pow(6 + 5.5 * self.upgradeLevel , 1.20));
				}
				else if(self.type == "spellCorrosion"){
					np.corrosion += -14 + 70 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "spellFrost"){
					np.frost += -10 + 40 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "spellSnowman"){
					np.frost += 180 + 65 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "spellBBQ"){
					np.fire += -6 + 30 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "spellSpark"){
					np.stun += 96 + 96 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "spellLightning"){
					np.stun += 512 + 128 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "oilDrum"){
					np.fire += -2 + 5 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "spellGanja"){
					np.stoned += -60 + 240 * Math.pow(self.upgradeLevel , 1.5);
				}
				else if(self.type == "bouncing" && self.lastTarget !== np.id){
					self.lastTarget = np.id;
					self.timer -= 4;
					var nextTarget;
					var nextDist = 100;
					for(var Bni in NPC.list){
						var Bnp = NPC.list[Bni];
						if(self.getDistance(Bnp) < 96 && self.lastTarget !== Bnp.id){
							if (nextDist > self.getDistance(Bnp)){
								nextTarget = Bnp.id;
								nextDist = self.getDistance(Bnp);

								var dy = Bnp.y - self.y;
								var dx = Bnp.x - self.x;
								var theta = Math.atan2(dy, dx); // range (-PI, PI]
							  	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
								if (theta < 0) theta = 360 + theta; // range [0, 360)
								self.spdX = Math.cos(theta/180*Math.PI) * self.speed;
								self.spdY = Math.sin(theta/180*Math.PI) * self.speed;
							}
						self.bounces += 1;
						if (self.bounces > self.upgradeLevel) self.toRemove = true;
						}
					}
				}
				else if(self.type == "bouncing" && self.lastTarget == np.id){
					if (self.bounces > self.upgradeLevel) self.toRemove = true;
					return;
				}
				
				var calcDamage = self.damageCalc(self.damage, self.bulletType, np.armor, np.armorType)

				if(np.shield > calcDamage){
					if(calcDamage >= 10){
						for(var i in SOCKET_LIST){
							var sucket = SOCKET_LIST[i];
							sucket.emit('damage',{type:"damageShield",damage:Math.round(calcDamage),x:np.x,y:np.y,});
						}
					}
					np.shield -= calcDamage;
				}
				else if(np.shield > 0){
					calcDamage -= np.shield;
					np.shield = 0;
					if(calcDamage >= 10){
						for(var i in SOCKET_LIST){
							var sucket = SOCKET_LIST[i];
							sucket.emit('damage',{type:"damage",damage:Math.round(calcDamage),x:np.x,y:np.y,});
						}
					}
					np.hp -= calcDamage;
				}
				else{
					if(calcDamage >= 10){
						for(var i in SOCKET_LIST){
							var sucket = SOCKET_LIST[i];
							sucket.emit('damage',{type:"damage",damage:Math.round(calcDamage),x:np.x,y:np.y,});
						}
					}
					np.hp -= calcDamage;
				}
				np.shieldRegen = 6;

				var shooter = Player.list[self.parent];
				//console.log("NPC has exp: " + np.exp);
				if(shooter) shooter.grantEXP(Math.round(np.exp * self.damage / np.hpMax));
				if(np.hp <= 0){
					if(shooter)
					{
						shooter.kills += 1;
						shooter.grantEXP(3 + np.exp);
						if(np.creepType == "slime" || np.creepType == "robot" || np.creepType == "cyborg" || Base.creepType == "golem" || np.creepType == "fleshGolem" || np.creepType == "rockGolem" || np.creepType == "steelGolem"){shooter.gold += Math.round(Base.wave * 2.6 + 5.4);}
						else{shooter.gold += Math.round(Base.wave * 1.2 + 2.8);}
						//p.toRemove = true;

						if(Tower.list[self.towerParent].heroic == true){
							Tower.list[self.towerParent].heroicEXP += Base.wave * 30;
							console.log("Heroic tower recieved Kill XP");
							//roll for item
							var item = Math.floor(Math.random() * 3);
							console.log("Rolled " + item);
							if (item == 0) {
								var randomroll = Math.floor(Math.random() * (3 + Base.wave * 0.1));
								if (randomroll > Tower.list[self.towerParent].heroicWEP){
									Tower.list[self.towerParent].heroicWEP = randomroll;
									Base.announce("Heroic unit " + Tower.list[self.towerParent].towerType + " found a +" + randomroll + " weapon!");
								}
							}
							else if (item == 1) {
								var randomroll = Math.floor(Math.random() * (3 + Base.wave * 0.1));
								if (randomroll > Tower.list[self.towerParent].heroicARM){
									Tower.list[self.towerParent].heroicARM = randomroll;
									Base.announce("Heroic unit " + Tower.list[self.towerParent].towerType + " found a +" + randomroll + " armor!");
								}
							}
							else {
								var randomroll = Math.floor(Math.random() * (3 + Base.wave * 0.1));
								if (randomroll > Tower.list[self.towerParent].heroicJWL){
									Tower.list[self.towerParent].heroicJWL = randomroll;
									Base.announce("Heroic unit " + Tower.list[self.towerParent].towerType + " found a +" + randomroll + " jewel!");
								}
							}
						}

						for(var tii in Tower.list){
							var tpp = Tower.list[tii];
							if(self.getDistanceToPoint(tpp.x,tpp.y) < 360 && tpp.heroic == true){
								tpp.heroicEXP += Base.wave * 30;
								console.log("Heroic tower recieved Proximity XP");
							}
						}
					}
					delete NPC.list[ni];
					removePack.npc.push(np.id);
				}

				//Splash Damage
				if(self.type == "gustav"){
					for(var nii in NPC.list){
						var npp = NPC.list[nii];
						if(self.map === npp.map && self.getDistance(npp) < 108){					
							if(np.shield > calcDamage / 3){
								for(var i in SOCKET_LIST){
									var sucket = SOCKET_LIST[i];
									sucket.emit('damage',{type:"explosion",damage:Math.round(calcDamage / 3),x:npp.x,y:npp.y,});
								}
								np.shield -= calcDamage / 3;
							}
							else if(np.shield > 0){
								calcDamageSh = calcDamage - np.shield;
								np.shield = 0;
								for(var i in SOCKET_LIST){
									var sucket = SOCKET_LIST[i];
									sucket.emit('damage',{type:"explosion",damage:Math.round(calcDamage / 3),x:npp.x,y:npp.y,});
								}
								np.hp -= calcDamageSh / 3;
							}
							else{
								for(var i in SOCKET_LIST){
									var sucket = SOCKET_LIST[i];
									sucket.emit('damage',{type:"explosion",damage:Math.round(calcDamage / 3),x:npp.x,y:npp.y,});
								}
								np.hp -= calcDamage / 3;
							}
							np.shieldRegen = 3;

							if(npp.hp <= 0){
								if(shooter)
								{
									shooter.grantEXP(3 + npp.exp);
									if(npp.creepType == "slime" || npp.creepType == "robot" || npp.creepType == "golem" || Base.creepType == "fleshGolem" || Base.creepType == "rockGolem" || Base.creepType == "steelGolem"){shooter.gold += Math.round(Base.wave * 3.9 + 7.1);}
									else{shooter.gold += Math.round(Base.wave * 1.3 + 2.7);}
									//p.toRemove = true;

								}
								delete NPC.list[nii];
								removePack.npc.push(npp.id);
							}
						}
					}
				}

				if (self.type == "oilDrum" || self.type == "laser") self.timer ++;
				else if (self.type == "bouncing") self.timer --;
				else self.toRemove = true;
			}
			else if(self.map === np.map && self.getDistance(np) < 48 && self.parent !== np.id && self.type != "oilDrum" && self.lastTarget !== np.id && NPC.list[self.target] == undefined){
				var dy = np.y - self.y;
				var dx = np.x - self.x;
  				var theta = Math.atan2(dy, dx); // range (-PI, PI]
  				theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
				if (theta < 0) theta = 360 + theta; // range [0, 360)
				self.angle = theta;
				self.spdX = Math.cos(self.angle/180*Math.PI) * self.speed * 2;
				self.spdY = Math.sin(self.angle/180*Math.PI) * self.speed * 2;
			}
			else if(self.map === np.map && self.parent !== np.id && self.type != "oilDrum" && self.lastTarget !== np.id && NPC.list[self.target] !== undefined){
				//console.log("nyoom");
				var dy = NPC.list[self.target].y - self.y;
				var dx = NPC.list[self.target].x - self.x;
  				var theta = Math.atan2(dy, dx); // range (-PI, PI]
  				theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
				if (theta < 0) theta = 360 + theta; // range [0, 360)
				self.angle = theta;
				self.spdX = Math.cos(self.angle/180*Math.PI) * self.speed;
				self.spdY = Math.sin(self.angle/180*Math.PI) * self.speed;
			}
		}
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

	Tower.getclosest = function(){
		var nextTarget;
		var nextDist = 100;
		for(var Bni in NPC.list){
			var Bnp = NPC.list[Bni];
			if(self.getDistance(Bnp) < 64 && self.lastTarget !== Bnp.id){
				if (nextDist > self.getDistance(Bnp)){
					nextTarget = Bnp.id;
					nextDist = self.getDistance(Bnp);
					var dx = Bnp.x - self.x;
					var dy = Bnp.y - self.y;
					var theta = Math.atan2(dy, dx); // range (-PI, PI]
					  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
					if (theta < 0) theta = 360 + theta; // range [0, 360)
				}
			}
		}
		return theta;
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