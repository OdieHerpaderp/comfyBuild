initPack = {player:[],bullet:[],npc:[],tower:[]};
removePack = {player:[],bullet:[],npc:[],tower:[]};

require('./entity/Player');
require('./entity/NPC');
require('./entity/Bullet');
require('./entity/Tower');

Entity = function(param){
	var self = {
		x:0,
		y:0,
		gridX:0,
		gridY:0,
		spdX:0,
		spdY:0,
		id:"",
		map:'forest',
	}
	if(param){
		if(param.x)
			self.x = param.x;
		if(param.y)
			self.y = param.y;
		if(param.map)
			self.map = param.map;
		if(param.id)
			self.id = param.id;
	}

	self.update = function(){
		self.updatePosition();
	}
	self.updatePosition = function(){
		self.x += self.spdX;
		if (self.x > 127 * 48) {self.x = 127 * 48;}
		else if(self.x < 0) {self.x = 0;}
		self.y += self.spdY;
		if (self.y > 127 * 48) {self.y = 127 * 48;}
		else if(self.y < 0) {self.y = 0;}
	}
	self.getDistance = function(pt){
		return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
	}
	self.getDistanceToPoint = function(px,py){
		return Math.sqrt(Math.pow(self.x-px,2) + Math.pow(self.y-py,2));
	}
	return self;
}
Entity.getFrameUpdateData = function(){
	var pack = {
		initPack:{
			player:initPack.player,
			bullet:initPack.bullet,
			npc:initPack.npc,
			tower:initPack.tower,
		},
		removePack:{
			player:removePack.player,
			bullet:removePack.bullet,
			npc:removePack.npc,
			tower:removePack.tower,
		},
		updatePack:{
			player:Player.update(),
			bullet:Bullet.update(),
			npc:NPC.update(),
			tower:Tower.update(),
		}
	};
	initPack.player = [];
	initPack.bullet = [];
	initPack.npc = [];
	initPack.tower = [];
	removePack.player = [];
	removePack.bullet = [];
	removePack.npc = [];
	removePack.tower = [];
	return pack;
}