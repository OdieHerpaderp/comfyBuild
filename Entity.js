initPack = {player:[],bullet:[],tower:[]};
removePack = {player:[],bullet:[],tower:[]};

require('./entity/Player');
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
			players:initPack.player,
			resourceNodes:initPack.bullet,
			buildings:initPack.tower,
		},
		removePack:{
			players:removePack.player,
			resourceNodes:removePack.bullet,
			buildings:removePack.tower,
		},
		updatePack:{
			players:Player.update(),
			resourceNodes:Bullet.update(),
			buildings:Tower.update(),
		}
	};
	initPack.players = [];
	initPack.resourceNodes = [];
	initPack.buildings = [];
	removePack.players = [];
	removePack.resourceNodes = [];
	removePack.buildings = [];
	return pack;
}