Player = function(param){
	var self = Entity(param);
	self.number = "" + Math.floor(10 * Math.random());
	self.color = Base.nextColor();
	console.log(self.color);
	self.username = param.username;
	self.pressingRight = false;
	self.pressingLeft = false;
	self.pressingUp = false;
	self.pressingDown = false;
	self.pressingAttack = false;
	self.ready = false;
	self.mouseAngle = 0;
	self.windup = 0;
	self.cooldown = 0;
	self.maxSpd = 96;
	self.kills = 0;
	self.team = 0; // none, west, east

	self.research = 0;
	self.libraries = 1;
	self.researchElectricity = 1;

	self.scoreBoard = []; //Pierce pDPS,Siege pDPS, Magic pDPS
	self.scoreBoard[0] = 0;
	self.scoreBoard[1] = 0;
	self.scoreBoard[2] = 0;
	self.scoreBoard[3] = 0;
	self.scoreBoard[4] = 0;
	self.x = 64 * 48;
	self.y = 64 * 48;

	if(param.progress.score){
		console.log("Level: " + param.progress.score);
		self.score = param.progress.score;
	}
	else{
		self.score = 1;
	}
	if(param.progress.exp){
		console.log("exp: " + param.progress.exp);
		self.exp = param.progress.exp;
	}
	else{
		self.exp = 1;
	}
	self.tonxt = Math.round( 2500 + Math.pow(self.score * 750 , 1.1));
	self.statPTS = param.progress.statpts;
	self.gold = 9999;

	self.inventory = new Inventory(param.progress.items,param.socket,true);

	var super_update = self.update;
	self.update = function(){

		//collision against NPCs
		

		self.updateSpd();

		super_update();

		if(self.pressingAttack){
			self.shootBullet(self.mouseAngle);
		}
	}
	self.shootBullet = function(angle){
		self.calcDamage = Math.pow(self.STR , 0.95);
		Bullet({
			parent:self.parent,
			angle:angle,
			x:self.x,
			y:self.y,
			map:self.map,
			damage:self.calcDamage,
		});
	}

	self.updateSpd = function(){
		if(self.pressingRight){
			self.spdX += 0.75;
			if(self.spdX > self.maxSpd) self.spdX = self.maxSpd;
		}
		else if(self.pressingLeft){
			self.spdX -= 0.75;
			if(self.spdX < 0 - self.maxSpd) self.spdX = 0 - self.maxSpd;
		}
		else{
			self.spdX = self.spdX / 1.5;
		}

		if(self.pressingUp){
			self.spdY -= 0.75;
			if(self.spdY < 0 - self.maxSpd) self.spdY = 0 - self.maxSpd;
		}
		else if(self.pressingDown){
			self.spdY += 0.75;
			if(self.spdY > self.maxSpd) self.spdY = self.maxSpd;
		}
		else{
			self.spdY = self.spdY / 1.5;
		}
	}

	self.getInitPack = function(){
		console.log(self.username);
		return {
			id:self.id,
			username:self.username,
			x:self.x,
			y:self.y,
			number:self.number,
			hp:self.hp,
			hpMax:self.hpMax,
			exp:self.exp,
			score:self.score,
			map:self.map,
			gold:self.gold,
			research:self.research,
			color:self.color,
		};
	}
	self.getUpdatePack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			exp:self.exp,
			score:self.score,
			map:self.map,
			gold:self.gold,
			research:self.research,
			kills:self.kills,
			scoreboard:self.scoreBoard,
		}
	}
	self.getStatPack = function(){
		return {
			id:self.id,
			x:self.x,
			y:self.y,
			hp:self.hp,
			map:self.map,
		}
	}

	self.checkNodeOnCurrentPos = function(type){
		if(type == undefined) return true;
		self.gridX = Math.round(self.x / 48);
		self.gridY = Math.round(self.y / 48);
		self.x = self.gridX * 48;
		self.y = self.gridY * 48;
		for(var bi in Bullet.list){
			var bp = Bullet.list[bi];
			//console.log("found " + bp.type + " comparing to" + type);
			//console.log(bp);
			//if(bp.type == type) console.log("we gotta match: " + Math.round(self.x / 48) + " " + Math.round(bp.x / 48));
			if(bp.type == type && Math.round(self.x / 48) == Math.round(bp.x / 48) && Math.round(self.y / 48) == Math.round(bp.y / 48)) return true;
		}
		return false
	}

	Player.list[self.id] = self;

	initPack.player.push(self.getInitPack());
	return self;
}

Player.list = {};
Player.onConnect = function(socket,username,progress){
	var map = 'field';
	//if(Math.random() < 0.5)
	//	map = 'field';
	var player = Player({
		username:username,
		id:socket.id,
		map:map,
		socket:socket,
		progress:progress,
	});
	player.inventory.refreshRender();

	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
		else if(data.inputId === 'attack')
			player.pressingAttack = data.state;
		else if(data.inputId === 'mouseAngle')
			player.mouseAngle = data.state;
	});

	socket.on('changeMap',function(data){
		if(player.map === 'field')
			player.map = 'forest';
		else
			player.map = 'field';
	});

	socket.on('ready',function(data){
		console.log("Ready recieved.");
		player.ready = true;
		socket.emit('gameState',{ready:true});
	});

	socket.on('fakePlayer',function(data){
		player.x = Math.round(data.x / 48) * 48;
		player.y = Math.round(data.y / 48) * 48;
	});

	socket.on('updateTooltip',function(data){
		player.gridX = Math.round(player.x / 48);
		player.gridY = Math.round(player.y / 48);
		//player.x = player.gridX * 48;
		//player.y = player.gridY * 48;
		for(var ti in Tower.list){
			var tp = Tower.list[ti];
			if(player.map === tp.map && player.gridX == Math.round(tp.x / 48) && player.gridY == Math.round(tp.y / 48)){
				//console.log("We got him");
				if(player.id == tp.parent && tp.heroic == true){
					//console.log("We got him for realzies");
					socket.emit('heroicTooltip',{heroicEXP:Math.round(tp.heroicEXP),heroicLVL:tp.heroicLVL,heroicPTS:tp.heroicPTS, heroicSTR:tp.heroicSTR, heroicAGI:tp.heroicAGI, heroicNTL:tp.heroicNTL, heroicWEP:tp.heroicWEP, heroicARM:tp.heroicARM, heroicJWL:tp.heroicJWL});
				}	
				else{
					socket.emit('towerTooltip',{damage:tp.damage,LVL:tp.upgradeLevel,range:tp.range,AGI:tp.AGI,value:tp.value});
				}
			}
		}
	});

	socket.on('upgradeTower',function(amount){
		player.gridX = Math.round(player.x / 48);
		player.gridY = Math.round(player.y / 48);
		player.x = player.gridX * 48;
		player.y = player.gridY * 48;
		for(var ti in Tower.list){
			var tp = Tower.list[ti];
			if(player.getDistance(tp) < 2){
				tp.targetLevel+= amount;
				socket.emit('addToChat',"Upgrading tower to level " + tp.targetLevel);
			}
		}
	});

	socket.on('upgradeAll',function(amount){
		socket.emit('addToChat',"Upgrading all towers to level " + amount);
		for(var ti in Tower.list){
			var tp = Tower.list[ti];
			if(tp.upgradeLevel < amount) tp.targetLevel += amount;			
		}
	});

	socket.on('upgradeSameType',function(amount){
		player.gridX = Math.round(player.x / 48);
		player.gridY = Math.round(player.y / 48);
		player.x = player.gridX * 48;
		player.y = player.gridY * 48;
		for(var ti in Tower.list){
			var tp = Tower.list[ti];
			if(player.map === tp.map && player.getDistance(tp) < 2){
				var upTower = tp.towerType;
			}
		}
		var count = 0;
		for(var ti in Tower.list){
			var tp = Tower.list[ti];
			if(tp.towerType == upTower) {tp.targetLevel += amount; count++;}		
		}
		socket.emit('addToChat',"Upgrading " + count + " towers of type " + upTower + " by " + amount);
	});

	socket.on('sellTower',function(data){
		player.gridX = Math.round(player.x / 48);
		player.gridY = Math.round(player.y / 48);
		player.x = player.gridX * 48;
		player.y = player.gridY * 48;
		for(var ti in Tower.list){
			var tp = Tower.list[ti];
			if(player.map === tp.map && player.getDistance(tp) < 2){
				if(player.id === tp.parent){
                    player.gold += tp.value;
                    PFGrid.grid.setWalkableAt(player.gridX, player.gridY, true);
                    delete Tower.list[ti];
                    removePack.tower.push(tp.id);
                    socket.emit('addToChat',"Tower sold.");
                    console.log("Tower sold");
                }
                else if(tp.towerType == "rock"){
                    socket.emit('addToChat',"Please don't try and sell the rocks.");
                }
				else{
					playa = Player.list[tp.parent]
					//playa.gold += tp.value;
					PFGrid.grid.setWalkableAt(player.gridX, player.gridY, true);
					delete Tower.list[ti];
					removePack.tower.push(tp.id);
					//socket.emit('addToChat',"You've sold someone " + playa.username + "'s tower.");
				}
			}
		}
	});

	socket.on('spawnResource',function(tier){
		if(Base.Tech < Base.resourcePrice){
			socket.emit('addToChat',"You don't have enough Tech.");
		}
		else{
			// Test if grid is valid
			randomGridX = Math.round(16 + Math.random() * 96);
			randomGridY = Math.round(16 + Math.random() * 96);
			if(PFGrid.grid.isWalkableAt(randomGridX,randomGridY)){
				PFGrid.grid.setWalkableAt(randomGridX, randomGridY, false);
				var towerType = "quarry";
				var randomtow = Math.round(Math.random() * 7);
				if(randomtow == 2) towerType = "forestry";
				else if(randomtow == 3) towerType = "well";
				else if(randomtow == 4) towerType = "sandPit";
				else if(randomtow == 5) towerType = "quartzMine";
				else if(randomtow == 6) towerType = "clayPit";
				else if(randomtow == 7) towerType = "reedField";
				else if(randomtow == 8) towerType = "huntingGrounds";
				Tower({
					towerType:towerType,
					parent:player.id,
					x:randomGridX * 48,
					y:randomGridY * 48,
					map:player.map,
					damage:1,
					range:1,
					mana:0,
					bulletType:"undefined",
					agi:1,
					value:1,
				});
				Base.Tech -= Base.resourcePrice;
				Base.resourcePrice = Math.round(Base.resourcePrice * 1.1);
				socket.emit('addToChat','Random Resource success! Built a ' + towerType + '.<br>Next resource will cost' + Base.resourcePrice);
			}
			else{
				socket.emit('addToChat','Random Resource failure!');
			}
		}
	});

	socket.on('buildTower',function(tower){
		// Test if grid is valid
		player.gridX = Math.round(player.x / 48);
		player.gridY = Math.round(player.y / 48);
		console.log("Checking for "+ tower +"'s node: " + buildings[tower].node);
		if(!player.checkNodeOnCurrentPos(buildings[tower].node)){ socket.emit('addToChat','This building needs to be placed on a ' + buildings[tower].node + 'node.'); return;}
		if(!PFGrid.grid.isWalkableAt(player.gridX,player.gridY)){ socket.emit('addToChat','There is already a tower or obstacle here.'); return;}
		PFGrid.grid.setWalkableAt(player.gridX, player.gridY, false);
		createTower(player, tower);
	});

	socket.on('sendMsgToServer',function(data){
		for(var i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat',player.username + ': ' + data);
		}
	});
	socket.on('sendPmToServer',function(data){ //data:{username,message}
		var recipientSocket = null;
		for(var i in Player.list)
			if(Player.list[i].username === data.username)
				recipientSocket = SOCKET_LIST[i];
		if(recipientSocket === null){
			socket.emit('addToChat','The player ' + data.username + ' is not online.');
		} else {
			recipientSocket.emit('addToChat','From ' + player.username + ':' + data.message);
			socket.emit('addToChat','To ' + data.username + ':' + data.message);
		}
	});

	socket.emit('init',{
		selfId:socket.id,
		player:Player.getAllInitPack(),
		bullet:Bullet.getAllInitPack(),
		npc:NPC.getAllInitPack(),
		tower:Tower.getAllInitPack(),
	})
}

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list)
		players.push(Player.list[i].getInitPack());
	console.log("Players: " + players);
	return players;
}

Player.onDisconnect = function(socket){
	let player = Player.list[socket.id];
	if(!player)
		return;
	Database.savePlayerProgress({
		username:player.username,
		score:player.score,
		exp:player.exp,
		
	});
	// Delete towers from player to prevent cheese.
	/*
	for(var ti in Tower.list){
		var tp = Tower.list[ti];
		if(player.id == tp.parent){
			delete Tower.list[ti];
			removePack.tower.push(tp.id);
		}	
	}
	*/
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}

Player.update = function(){
	var pack = [];
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push(player.getUpdatePack());
		//console.log("Updated Player" + i + ". Map: " + player.map);
	}
	return pack;
}

createTower = function(player, towerType){
	Tower({
		towerType:towerType,
		parent:player.id,
		x:player.gridX * 48,
		y:player.gridY * 48,
		map:player.map,
		damage:1,
		range:1,
		mana:0,
		bulletType:"physical",
		agi:1,
		value:0,
	});
}