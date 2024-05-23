Base = {};
require('./Database');
require('./lib/lib');
require('./lib/buildings');
require('./lib/comfyBuild');
require('./lib/stockpile');
require('./Entity');
require('./Gamemode');
//require('./geckosio');
require('./client/Inventory');
//mooi

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var os = require('os');
var PF = require('pathfinding');
const { basename } = require('path');
var nextCreep = 1;

tick = 0;
Base.Health = 150;
Base.Tech = 0;
Base.wave = 0;
Base.phase = 0; //0 = build phase, 1 = creep phase
Base.creepType = "unknown";
Base.armorType = "unknown";
Base.mobsLeft = 8;
Base.bonusGold = 100;
Base.spawnSpeed = 50;
Base.leaks = 0;
Base.leakWave = 0;

//comfyBuild
Base.population = 128;
Base.populationAvg = 128;
Base.populationCurrent = 128;
Base.constructionMultiplier = 0.75;
Base.morale = 10000;
Base.lastTick = 0;
Base.skippedTicks = 0;
Base.resourcePrice = 10000;

var previousTime = 0;
Base.announce = function(announcement){
	for(var i in SOCKET_LIST){
		var sucket = SOCKET_LIST[i];
		sucket.emit('addToChat',announcement);
	}
}
Base.sendGameState = function(num){
	for(var i in SOCKET_LIST){
		var sucket = SOCKET_LIST[i];
		sucket.emit('gameState',{gameState:num});
	}
}
function towerMaxHealth() { 
	return Math.round(30 * Math.pow((Base.Tech - 750) / 225 + Base.wave / 5, 1.2))
}
function regenTower() { 
	Base.Health += (600 + Base.Tech) / (1400 + Base.Health * 16);
	if (Base.Health > towerMaxHealth()){
		Base.Health = towerMaxHealth();
	}
}

//Pathfinding Stuff
PFGrid = {};
PFGrid.grid = new PF.Grid(128, 128); 
//grid.setWalkableAt(0, 0, false);
//PFGrid.grid.setWalkableAt(63, 63, false);

PFGrid.finder = new PF.AStarFinder({allowDiagonal: false});
PFGrid.gridBackup = PFGrid.grid.clone(); //create clone of grid, as pathfinding messes up the grid.
PFGrid.pathA = PFGrid.finder.findPath(Gamemode.startAX, Gamemode.startAY, Gamemode.endAX, Gamemode.endAY, PFGrid.gridBackup);

//console.log(PFGrid.pathA);
PFGrid.pathA.forEach(function(entry){
	console.log("PathA X: " + entry[0] + " Y:" + entry[1]);
});

PFGrid.gridBackup = PFGrid.grid.clone(); //create clone of grid, as pathfinding messes up the grid.
PFGrid.pathB = PFGrid.finder.findPath(Gamemode.startBX, Gamemode.startBY, Gamemode.endBX, Gamemode.endBY, PFGrid.gridBackup);

//console.log(PFGrid.pathB);
PFGrid.pathB.forEach(function(entry){
	console.log("PathB X: " + entry[0] + " Y:" + entry[1]);
});

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/indexthreejs.html');
});
app.use('/client',express.static(__dirname + '/client'));
app.use('/node_modules',express.static(__dirname + '/node_modules'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

SOCKET_LIST = {};


var DEBUG = true;


var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;

	socket.on('signIn',function(data){ //{username,password}
		console.log("User " + data.username + " logging in...");
		if (Base.wave != 0) return socket.emit('signInResponse',{success:false});
		Database.isValidPassword(data,function(res){
			if(!res)
				return socket.emit('signInResponse',{success:false});
			Database.getPlayerProgress(data.username,function(progress){
				Player.onConnect(socket,data.username,progress);
				socket.emit('signInResponse',{success:true});
			})
		});
	});
	socket.on('signUp',function(data){
		Database.isUsernameTaken(data,function(res){
			if(res){
				socket.emit('signUpResponse',{success:false});
			} else {
				Database.addUser(data,function(){
					socket.emit('signUpResponse',{success:true});
				});
			}
		});
	});


	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});

	socket.on('evalServer',function(data){
		if(!DEBUG)
			return;
		var res = eval(data);
		socket.emit('evalAnswer',res);
	});



});

setInterval(function(){
	var currentTime = new Date().getTime();
    var delta = currentTime - previousTime;
	if (delta > 10) console.log("Subtick has exceeded 10! (" + delta + ")");
	previousTime = currentTime;
	var deltaTick = currentTime - Base.lastTick;
	if (deltaTick < 30) {
		Base.skippedTicks++; return;
	}

	Base.lastTick = currentTime;

	var packs = Entity.getFrameUpdateData();

	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init',packs.initPack);
		socket.emit('update',packs.updatePack);
		socket.emit('remove',packs.removePack);
	}
	if(tick === 5)
	{
		Gamemode.prepare();
	}
	if(tick % 3 === 0)
	{
		comfyBuild.tick();
	}
	if(tick % 512 === 0) Base.announce("T:" + tick + "  Skipped Ticks: " + Base.skippedTicks);
	if(tick % 128 === 0){
		console.log("T:" + tick + "  Skipped Ticks: " + Base.skippedTicks);
		Base.skippedTicks = 0;

		if(Base.population < 3) {
			// Test if grid is valid
			randomGridX = Math.round(16 + Math.random() * 96);
			randomGridY = Math.round(16 + Math.random() * 96);
			if(PFGrid.grid.isWalkableAt(randomGridX,randomGridY)){
				PFGrid.grid.setWalkableAt(randomGridX, randomGridY, false);
				var towerType = "slums";
				var randomtow = Math.round(Math.random() * 3);
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
					value:0,
				});
				socket.emit('addToChat','Homeless people have built a slums on their own volition!');
			}
		}
	}
	tick++;
},1);

Base.startWave = function(){
	console.log("startWave initialized.");
	if(Base.phase == 0){
		if(Base.wave == 0){
			var totalGold = 0;
			for(var i in Player.list){
					var player = Player.list[i];
					totalGold += player.gold + player.score * 6;
				}
				console.log(totalGold);
				Base.wave = 1 + Math.floor(Math.pow(totalGold / 350, 0.75));
				Base.creepType = "rat";
				Base.announce("Skipped to wave " + Base.wave);
				Base.wave -= 1;
		}
		PFGrid.gridBackup = PFGrid.grid.clone(); //create clone of grid, as pathfinding messes up the grid.
		PFGrid.pathA = PFGrid.finder.findPath(Gamemode.startAX, Gamemode.startAY, Gamemode.endAX, Gamemode.endAY, PFGrid.gridBackup);

		console.log(PFGrid.pathA);

		PFGrid.gridBackup = PFGrid.grid.clone(); //create clone of grid, as pathfinding messes up the grid.
		PFGrid.pathB = PFGrid.finder.findPath(Gamemode.startBX, Gamemode.startBY, Gamemode.endBX, Gamemode.endBY, PFGrid.gridBackup);

		console.log(PFGrid.pathB);

		for(var i in Tower.list){
			var t = Tower.list[i];
			t.mana = t.manaMax;
			playa = Player.list[t.parent];
			if (playa){
				if (t.towerType == "gun") Math.round(playa.scoreBoard[0] += t.damage * t.AGI / 70);
				else if (t.towerType == "gustav") Math.round(playa.scoreBoard[1] += t.damage * t.AGI / 30);
				else if (t.bulletType == "physical") Math.round(playa.scoreBoard[0] += t.damage * t.AGI / 50);
				else if (t.bulletType == "siege") Math.round(playa.scoreBoard[1] += t.damage * t.AGI / 50);
				else if (t.bulletType == "arcane") Math.round(playa.scoreBoard[2] += t.damage * t.AGI / 50);
				else if (t.bulletType == "heroic") Math.round(playa.scoreBoard[3] += t.damage * t.AGI / 50);
				else if (t.bulletType == "elemental") Math.round(playa.scoreBoard[4] += t.damage * t.AGI / 50);
				console.log(playa.username + ": " + playa.scoreBoard);
			}
		}
		Base.wave += 1;
		Base.phase = 1;
		Base.bonusGold = Math.floor(Base.Tech / 1500 + 182 + Math.pow(Base.wave * 12, 1.10));
		Base.sendGameState(1);
		Base.Health *= 1.1;
	}
};

Base.readyCheck = function(){
	var online = 0;
	for(var i in Player.list){
		var p = Player.list[i];
		if (p.ready == false) return false;
		online ++;
	}
	if(online == 0) return false;
	return true;
}

Base.nextColor = function(){
	var online = 0;
	for(var i in Player.list){
		online ++;
	}
	switch (online){
		case 0: return "#FF6666";
		case 1: return "#6666FF";
		case 2: return "#FFFF66";
		case 3: return "#FF66FF";
		case 4: return "#66FFFF";
		default: return "#BBBBBB";
	}
		
}