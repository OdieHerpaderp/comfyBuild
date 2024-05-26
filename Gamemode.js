//TODO move this code elsewhere
Gamemode = {};
Gamemode.mode = 2; // 0 = solo, 1 = double, 2 = split, 3 = versus
Gamemode.startAX = 0;
Gamemode.startAY = 0;
Gamemode.startBX = 0;
Gamemode.startBY = 0;

Gamemode.endAX = 0;
Gamemode.endAY = 0;
Gamemode.endBX = 0;
Gamemode.endBY = 0;

Gamemode.spawnBullet = function(type,xMin,xMax,yMin,yMax){
	// Test if grid is valid, but use a backup to discard changes
	var randomGridX = Math.round(xMin + Math.random() * (xMax-xMin));
	var randomGridY = Math.round(yMin + Math.random() * (yMax-yMin));
	while(!PFGrid.gridBackup.isWalkableAt(randomGridX,randomGridY)){
		randomGridX = Math.round(xMin + Math.random() * (xMax-xMin));
		randomGridY = Math.round(yMin + Math.random() * (yMax-yMin));
	}
	if(PFGrid.gridBackup.isWalkableAt(randomGridX,randomGridY)){
		PFGrid.gridBackup.setWalkableAt(randomGridX, randomGridY, false);
		Bullet({
			type:type,
			x:randomGridX * 48,
			y:randomGridY * 48,
			map:"field",
		});
	}
};

Gamemode.prepare = function(){
	for (i = 0; i < 96; i++){ Gamemode.spawnBullet("freshWater",60,68,0,127); }
	for (i = 0; i < 96; i++){ Gamemode.spawnBullet("soil",4,120,4,120); }
	for (i = 0; i < 96; i++){ Gamemode.spawnBullet("wildGame",4,120,4,120); }
	for (i = 0; i < 96; i++){ Gamemode.spawnBullet("forest",4,120,4,120); }
	for (i = 0; i < 96; i++){ Gamemode.spawnBullet("rockDeposit",4,50,4,120); }
	return;
	Tower({
		towerType:"waterSource",
		parent:0,
		x:8 * 48,
		y:8 * 48,
		map:"field",
		damage:1,
		range:1,
		bulletType:"undefined",
		agi:1,
		value:0,
	});
	PFGrid.grid.setWalkableAt(5, 5, false);
	Tower({
		towerType:"sandPit",
		parent:0,
		x:8 * 48,
		y:16 * 48,
		map:"field",
		damage:1,
		range:1,
		bulletType:"undefined",
		agi:1,
		value:0,
	});
	Tower({
		towerType:"clayPit",
		parent:0,
		x:12 * 48,
		y:12 * 48,
		map:"field",
		damage:1,
		range:1,
		bulletType:"undefined",
		agi:1,
		value:0,
	});
	Tower({
		towerType:"forestry",
		parent:0,
		x:16 * 48,
		y:8 * 48,
		map:"field",
		damage:1,
		range:1,
		bulletType:"undefined",
		agi:1,
		value:0,
	});
	Tower({
		towerType:"quarry",
		parent:0,
		x:16 * 48,
		y:16 * 48,
		map:"field",
		damage:1,
		range:1,
		bulletType:"undefined",
		agi:1,
		value:0,
	});
	return;
	//TODO: Clean up
    if (Gamemode.mode == 0){
        //set spawns
        Gamemode.startAX = 0;
        Gamemode.startAY = 32;
        Gamemode.endAX = 127;
        Gamemode.endAY = 32;

        //place rocks
		for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(0, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:0,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
        }

        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:64 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(127, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:127 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
    }
    else if(Gamemode.mode == 1){
        //set spawns
        Gamemode.startAX = 0;
        Gamemode.startAY = 16;
        Gamemode.endAX = 127;
        Gamemode.endAY = 32;
        Gamemode.startBX = 0;
        Gamemode.startBY = 48;
        Gamemode.endBX = 127;
        Gamemode.endBY = 32;

        //place rocks
        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 16 && loopI != 48){
				PFGrid.grid.setWalkableAt(0, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:0,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:62 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

		for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:64 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

		for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:66 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
        
        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(127, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:127 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
    }
    else if(Gamemode.mode == 2){
        console.log("Split mode");
        //set spawns
        Gamemode.startAX = 0;
        Gamemode.startAY = 32;
        Gamemode.endAX = 127;
        Gamemode.endAY = 32;
        Gamemode.startBX = 127;
        Gamemode.startBY = 32;
        Gamemode.endBX = 0;
        Gamemode.endBY = 32;

        //place rocks
        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(0, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:0,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:64 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
        
        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(127, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:127 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
	}
	else if(Gamemode.mode == 3){
        console.log("versus mode");
        //set spawns
        Gamemode.startAX = 64;
        Gamemode.startAY = 32;
        Gamemode.endAX = 127;
        Gamemode.endAY = 32;
        Gamemode.startBX = 64;
        Gamemode.startBY = 32;
        Gamemode.endBX = 0;
		Gamemode.endBY = 32;
		
		//create objects
		Base.A = [];
		Base.A.health = 100;
		Base.A.tech = 1000;
		Base.A.upgradeHealth = 1;
		Base.A.upgradeArmor = 1;
		Base.A.upgradeSpeed = 1;
		Base.B = [];
		Base.B.health = 100;
		Base.B.tech = 1000;
		Base.B.upgradeHealth = 1;
		Base.B.upgradeArmor = 1;
		Base.B.upgradeSpeed = 1;

        //place rocks
        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(0, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:0,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

		for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:62 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

		for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:64 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}

        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(64, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:66 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
        
        for (loopI = 0; loopI < 64; loopI++) { 
			if(loopI != 32){
				PFGrid.grid.setWalkableAt(127, loopI, false);
				Tower({
					towerType:"rock",
					parent:0,
					x:127 * 48,
					y:loopI * 48,
					map:"field",
					damage:1,
					range:1,
					bulletType:"undefined",
					agi:1,
					value:0,
				});
			}
		}
    }
};