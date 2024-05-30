Base = {};
require('./Database');
require('./lib/lib');
buildings = {};
(async () => {
	buildings = (await import("./lib/buildings.mjs")).buildings;
})();
require('./lib/comfyBuild');
require('./lib/stockpile');
require('./Entity');
require('./Gamemode');
//require('./geckosio');
require('./client/Inventory');

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
Base.mobsLeft = 8;
Base.bonusGold = 100;
Base.spawnSpeed = 50;
Base.leaks = 0;
Base.leakWave = 0;

//comfyBuild
Base.population = 32;
Base.populationAvg = 32;
Base.populationCurrent = 32;
Base.constructionMultiplier = 1;
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
app.use('/lib',express.static(__dirname + '/lib'));
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

//TODO: Merge comfyBuild tick into main tick once movement is clientside
function gameTick() {
	if(tick === 5){
		Gamemode.prepare();
	}
	if(tick % 2 === 0){
		comfyBuild.tick();
	}
	if(tick % 10 === 0){
		//console.log(Base.stockpile);
		for(var i in SOCKET_LIST){
			var sucket = SOCKET_LIST[i];
			sucket.emit('stockpile', Base.stockpile);
		}
	}
	var packs = Entity.getFrameUpdateData();
	//TODO: updatePacks on the client assume that the updatePack contains every entity.
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('init',packs.initPack);
		socket.emit('update',packs.updatePack);
		socket.emit('remove',packs.removePack);
	}
	tick++;
};

// New implementation that doesn't rely on raf
const targetFrameRate = 20;
const targetFrameTime = 1000 / targetFrameRate; // Target frame time in milliseconds

let lastFrameTime = Date.now();

function gameLoop() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastFrameTime;

  if (elapsedTime >= targetFrameTime) {
    gameTick(elapsedTime);
    lastFrameTime = currentTime;
  }

  setTimeout(gameLoop, targetFrameTime);
}

gameLoop();

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