//ThreeJS

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 15, window.innerWidth/(window.innerHeight- 176)*1.15, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer( { canvas: threejs } );
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize( window.innerWidth, window.innerHeight - 176 );
//document.body.appendChild( renderer.domElement );

// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
var floorTexture = new THREE.ImageUtils.loadTexture( '/client/img/map.png' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 10, 10 );
var floorTextureN = new THREE.ImageUtils.loadTexture( '/client/img/map_n.png' );
floorTextureN.wrapS = floorTextureN.wrapT = THREE.RepeatWrapping; 
floorTextureN.repeat.set( 10, 10 );
// DoubleSide: render texture on both sides of mesh
var floorMaterial = new THREE.MeshStandardMaterial( { color:'#BBBBBB', map: floorTexture, side: THREE.BackSide, normalMap: floorTextureN, roughness: 0.7, } );
var floorGeometry = new THREE.PlaneGeometry(960, 960, 1, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.x = 237.75;
floor.position.y = -0.2;
floor.position.z = 237.75;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Global plane geom
var bulletGeometry = new THREE.PlaneGeometry( 3, 3, 1, 1 );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.3 );
directionalLight.position.x = 40;
directionalLight.position.y = 280;
directionalLight.position.z = 420;
directionalLight.name = "Direc";
scene.add( directionalLight );
directionalLight.target = floor;

const light = new THREE.HemisphereLight( 0xaabbff, 0x228811, 0.8 ); 
scene.add( light );

camera.position.z = 5;

//var skyColor = 0xFFEEDD;
//var groundColor = 0xAAA099;
//var light = new THREE.HemisphereLight(skyColor, groundColor, 0.7);
//light.name = "Hemi";
//scene.add(light);

var frameTime = 10;
var targetFrameTime = 20;
var renderScale = 100;
var previousTime = 10;
var avgDelta = 30;
var displayHealth = true;
var displayDamage = 2;
var upgradeAmount = 1;
var pop = 100;

const loader = new THREE.GLTFLoader();

modelData = [];

loader.load( 'client/models/tower/pawn.glb', function ( gltf ) {
    const root = gltf.scene;
    //console.log(root.children[0].geometry);
    cubetower = root.children[0];
    console.log(cubetower);
    modelData["pawn"] = cubetower;

}, undefined, function ( error ) {

    console.error( error );

} );

loader.load( 'client/models/tower/rock.glb', function ( gltf ) {
    const root = gltf.scene;
    //console.log(root.children[0].geometry);
    cubetower = root.children[0];
    console.log(cubetower);
    modelData["rock"] = cubetower;

}, undefined, function ( error ) {

    console.error( error );

} );

loader.load( 'client/models/tower/grave.glb', function ( gltf ) {
    const root = gltf.scene;
    //console.log(root.children[0].geometry);
    cubetower = root.children[0];
    console.log(cubetower);
    modelData["grave"] = cubetower;

}, undefined, function ( error ) {

    console.error( error );

} );

document.getElementById("frameTimeSlider").oninput = function() {
    targetFrameTime = this.value;
    document.getElementById("targetFrameTime").innerHTML = this.value;
}

document.getElementById("renderScaleSlider").oninput = function() {
    renderScale = this.value;
    document.getElementById("renderScale").innerHTML = this.value;
}

var hpDisplay = function() {
    if(displayHealth == true) {displayHealth = false; document.getElementById("buttonDisplayHP").innerHTML = "HP Display OFF";}
    else {displayHealth = true; document.getElementById("buttonDisplayHP").innerHTML = "HP Display ON";}

};
var damageDisplay = function() {
    if(displayDamage == 0) {displayDamage = 1; document.getElementById("buttonDisplayDAM").innerHTML = "Damage Display SOME";}
    else if(displayDamage == 1) {displayDamage = 2; document.getElementById("buttonDisplayDAM").innerHTML = "Damage Display ALL";}
    else {displayDamage = 0; document.getElementById("buttonDisplayDAM").innerHTML = "Damage Display NONE";}
};

var animate = function () {
    requestAnimationFrame( animate ); 
    var currentTime = new Date().getTime();
    var delta = currentTime - previousTime;
    avgDelta = Math.min((avgDelta * 2 + delta + targetFrameTime * 2) / 5 , 250);
    previousTime = currentTime;

    if (avgDelta > frameTime + 4 && frameTime < 200) frameTime = Math.ceil((frameTime + avgDelta * 2) / 3);
    else if (avgDelta < frameTime + 1 && frameTime > targetFrameTime) frameTime = Math.floor((frameTime + avgDelta) / 2);

    if (frameTime > 80 + targetFrameTime) document.getElementById('fpsCounter').style.color = "red";
    if (frameTime > 60 + targetFrameTime) document.getElementById('fpsCounter').style.color = "orange";
    else if (frameTime > 40 + targetFrameTime) document.getElementById('fpsCounter').style.color = "yellow";
    else document.getElementById('fpsCounter').style.color = "white";

    document.getElementById('fpsCounter').innerHTML = "FT: " + delta +" ms";

    //cube.rotation.x += 0.01;
    if(oldWidth != window.innerWidth || oldHeight != window.innerHeight){
        console.log("WE GON RESIZE");
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;
        renderer.setSize( window.innerWidth, window.innerHeight - 176 );
        renderer.setPixelRatio(window.devicePixelRatio * renderScale / 100);
        const canvas = renderer.domElement;
        camera.aspect = window.innerWidth/(window.innerHeight - 176)*1.06;
        camera.updateProjectionMatrix();
    }
    renderer.render( scene, camera );
};

animate();

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
    window.addEventListener('mousemove', divMove, true);
}

function openSettings(e){
    settingsDiv.style.display = 'initial';
}

function closeSettings(e){
    settingsDiv.style.display = 'none';
}

var zoom = 6;
function zoomIn(e){
    zoom += 0.3;

    if (zoom > 2.5) zoom = 2.5;
    else if (zoom < 0.25) zoom = 0.25;
}
function zoomOut(e){
    zoom -= 0.3;

    if (zoom > 8) zoom = 8;
    else if (zoom < 0.15) zoom = 0.15;
}
function zoomDefault(e){
    zoom = 1.0;
}
function scrollWheel(e){
    if (e.deltaY < 0) zoom += 0.3;
    else zoom -= 0.3;

    if (zoom > 9) zoom = 9;
    else if (zoom < -8) zoom = -8;
}

var socket = io();

var wave = 0;
var health = 0;
var maxHealth = 0;
var tech = 0;

//sign
var signDiv = document.getElementById('signDiv');
var loadDiv = document.getElementById('loadDiv');
var heroicTooltip = document.getElementById('heroicTooltip');
var towerTooltip = document.getElementById('towerTooltip');
var heroicTooltipText = document.getElementById('heroicTooltipText');
var towerTooltipText = document.getElementById('towerTooltipText');
var buttonUpgrade = document.getElementById('buttonUpgrade');
var buttonSell = document.getElementById('buttonSell');
var settingsDiv = document.getElementById('settingsDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

var hudButtons = document.getElementById('buttenz');

signDivSignIn.onclick = function(){
    var hashed = blowfish.encrypt(signDivPassword.value, 'sukkeltje', {cipherMode: 0, outputType: 1});
    //console.log("SignIn " + hashed);
    socket.emit('signIn',{username:signDivUsername.value,password:hashed});
}
signDivSignUp.onclick = function(){
    var hashed = blowfish.encrypt(signDivPassword.value, 'sukkeltje', {cipherMode: 0, outputType: 1});
    //console.log("SignUp " + hashed);
    socket.emit('signUp',{username:signDivUsername.value,password:hashed});
}
socket.on('signInResponse',function(data){
    if(data.success){
        frameLogin.closeFrame();
        frameStockpile.show();
        frameBuildings.show();
        document.getElementById('buildingsDiv').innerHTML = interface.generateBuildingsHTML();
    } else
        alert("Sign in unsuccessul.");
});
socket.on('signUpResponse',function(data){
    if(data.success){
        alert("Sign up successul.");
    } else
        alert("Sign up unsuccessul.");
});

//chat
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var stockpileDiv = document.getElementById('stockpileDiv');

socket.on('addToChat',function(data){
    chatText.innerHTML = '<div>' + data + '</div>' + chatText.innerHTML;
    //chatText.scrollTop = chatText.scrollHeight - chatText.clientHeight
});
socket.on('evalAnswer',function(data){
    console.log(data);
});

socket.on('heroicTooltip',function(data){
    //console.log(data);
    heroicTooltipText.innerHTML = "EXP: " + data.heroicEXP +  " Level: " + data.heroicLVL + " Stat Pts: " + data.heroicPTS
    + "<br />STR: " + data.heroicSTR + " AGI: " + data.heroicAGI +  " NTL: " + data.heroicNTL +
    "<br />WEP: " + data.heroicWEP + "ARM: " + data.heroicARM + "JWL: " + data.heroicJWL;
});

socket.on('towerTooltip',function(data){
    //console.log(data);
    towerTooltipText.innerHTML = "LVL: " + data.LVL +  " DMG: " + data.damage + " AGI: " + data.AGI + " RNG: " + data.range;
    buttonUpgrade.innerHTML = "Upgrade (" + upgradeAmount + ")";
    //buttonSell.innerHTML = "Sell (+" + data.value + ")";
});

socket.on('stockpile',function(data){
    //TODO improve if/when needed?
    stockpileDiv.innerHTML = "";
    for (const prop in data) {
        if(data[prop] > 0) stockpileDiv.innerHTML += `<div id='parent'><div id='wide'>${prop}:</div><div id='narrow'>${data[prop].toLocaleString()}</div></div>`;
      }
});

socket.on('gameState',function(data){
    //console.log(data);
    if(data.gameState !== undefined){
        if(data.gameState == 1) {
            hudButtons.style.display = 'none';
            //var light = scene.getObjectByName("Hemi");
            //light.color.setHex( 0xccd0dd );
            //light.groundColor.setHex( 0x656667 );
            var Dlight = scene.getObjectByName("Direc");
            if (wave % 10 === 9) Dlight.color.setHex( 0xffcccc );
            else Dlight.color.setHex( 0x66aadd ); 
        }
        else {
            hudButtons.style.display = 'inline-block';
            //var light = scene.getObjectByName("Hemi");
            //light.color.setHex( 0xffeedd );
            //light.groundColor.setHex( 0xAAA099 );
            var Dlight = scene.getObjectByName("Direc");
            Dlight.color.setHex( 0xffffff );
        }
    }
    if(data.wave !== undefined){
        wave = data.wave;
    }
    if(data.health !== undefined){
        health = data.health;
    }
    if(data.maxHealth !== undefined){
        maxHealth = data.maxHealth;
    }
    if(data.tech !== undefined){
        tech = data.tech;
    }
    if(data.ready !== undefined){
        if(data.ready == true) document.getElementById('buttonReady').innerHTML = "Unready!";
        else document.getElementById('buttonReady').innerHTML = "Ready!";
    }
});

chatForm.onsubmit = function(e){
    e.preventDefault();
    if(chatInput.value[0] === '/')
        socket.emit('evalServer',chatInput.value.slice(1));
    else if(chatInput.value[0] === '@'){
        //@username,message
        socket.emit('sendPmToServer',{
            username:chatInput.value.slice(1,chatInput.value.indexOf(',')),
            message:chatInput.value.slice(chatInput.value.indexOf(',') + 1)
        });
    } else
        socket.emit('sendMsgToServer',chatInput.value);
    chatInput.value = '';
}

//UI
var changeMap = function(){
    socket.emit('changeMap');
}

var buildTower = function(tower){
    socket.emit('buildTower', tower);
}

var spawnResource = function(tier){
    socket.emit('spawnResource', tier);
}

var towerDolmen = function(){
    socket.emit('towerDolmen');
}

var towerQuarry = function(){
    socket.emit('towerQuarry');
}

var towerForestry = function(){
    socket.emit('towerForestry');
}

var towerPawn = function(){
    socket.emit('towerPawn');
}

var towerPawn = function(){
    socket.emit('towerPawn');
}

var towerArrow = function(){
    socket.emit('towerArrow');
}

var towerCannon = function(){
    socket.emit('towerCannon');
}

var towerDarkness = function(){
    socket.emit('towerDarkness');
}

var towerCorrosion = function(){
    socket.emit('towerCorrosion');
}

var towerFrost = function(){
    socket.emit('towerFrost');
}

var towerGanja = function(){
    socket.emit('towerGanja');
}

var towerBBQ = function(){
    socket.emit('towerBBQ');
}

var towerSpark = function(){
    socket.emit('towerSpark');
}

var towerRocket = function(){
    socket.emit('towerRocket');
}

var towerBouncing = function(){
    socket.emit('towerBouncing');
}

var towerLaser = function(){
    socket.emit('towerLaser');
}

var towerHeroic = function(){
    socket.emit('towerHeroic');
}

var sellTower = function(){
    socket.emit('sellTower');
}
var upgradeTower = function(){
    socket.emit('upgradeTower',upgradeAmount);
}

var upgradeAll = function(){
    socket.emit('upgradeAll',upgradeAmount);
}

var upgradeSameType = function(){
    socket.emit('upgradeSameType',upgradeAmount);
}

var startWave = function(){
    socket.emit('ready');
}

var heroicSTR = function(){
    socket.emit('heroicSTR');
}
var heroicAGI = function(){
    socket.emit('heroicAGI');
}
var heroicNTL = function(){
    socket.emit('heroicNTL');
}

var transformA = function(){
    socket.emit('transformA');
}
var transformB = function(){
    socket.emit('transformB');
}
var transformC = function(){
    socket.emit('transformC');
}

var ctxUi = document.getElementById("ctx-ui").getContext("2d");
ctxUi.font = '30px Nanum Gothic Coding';

var Damage = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.damage = initPack.damage;
    self.x = initPack.x;
    self.y = initPack.y;
    self.z = 3;
    self.type = initPack.type;

    self.lifespan = 25;
    if(self.type == "damage" || self.type == "damageShield") self.lifespan = 20;
    else if(self.type == "miss") self.lifespan = 18;
    else if(self.type == "explosion") self.lifespan = 12;
    else if(self.type == "corrosion") self.lifespan = 7;
    else if(self.type == "fire") self.lifespan = 7;



    self.draw = function(){
        self.z += (0.1 + 0.3 * (self.lifespan / 10));

        var sprite = scene.getObjectByName("DAM" + self.id);
        sprite.position.set(self.x / 10, self.z, self.y / 10 + 0.25);

        self.lifespan -= 1;
        if(self.lifespan < 1){ 
            if(sprite){
                scene.remove(sprite);
            }
            delete Damage.list[self.id];
        }
    }
    Damage.list[self.id] = self;
    return self;
}
Damage.list = {};

var Player = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.color = initPack.color;
    console.log(self.color);
    self.number = initPack.number;
    self.username = initPack.username;
    self.x = initPack.x;
    self.y = initPack.y;
    self.hp = initPack.hp;
    self.hpMax = initPack.hpMax;
    self.exp = initPack.exp;
    self.research = initPack.research;
    self.score = initPack.score;
    self.map = initPack.map;
    self.kills = 0;
    self.scoreBoard = [];

    Player.list[self.id] = self;
    return self;
}
Player.list = {};

var NPC = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.number = initPack.number;
    self.creepType = initPack.creepType;
    self.x = initPack.x;
    self.y = initPack.y;
    self.hp = initPack.hp;
    self.hpMax = initPack.hpMax;
    self.shield = initPack.shield;
    self.shieldMax = initPack.shieldMax;
    self.score = initPack.score;
    self.armor = initPack.armor;
    self.map = initPack.map;
    self.corrosion = initPack.corrosion;
    self.frost = initPack.frost;
    self.fire = initPack.fire;
    self.stoned = initPack.stoned;

    NPC.list[self.id] = self;
    return self;
}
NPC.list = {};

var Bullet = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;
    self.map = initPack.map;
    self.bulletType = initPack.bulletType;
    self.towerType = initPack.towerType;
    self.angle = initPack.angle;
    self.timer = initPack.timer;

    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};

var Tower = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;
    self.parent = initPack.parent;
    self.mana = initPack.mana;
    self.manaMax = initPack.manaMax;
    self.map = initPack.map;
    self.towerType = initPack.towerType;
    self.upgradeLevel = initPack.upgradeLevel;
    self.targetLevel = initPack.targetLevel;
    self.buildTimer = initPack.buildTimer;

    Tower.list[self.id] = self;
    return self;
}
Tower.list = {};

var selfId = null;

socket.on('damage',function(data){
    if(displayDamage == 0) return;
    else if (frameTime > 80 + targetFrameTime) return;

    data.id = Math.random(256000);
    new Damage(data);

    var textColor = '#ffffff';
    if(data.type == "explosion") textColor = '#ffdd88';
    else if(data.type == "damageShield") textColor = '#22ddff';
    else if(data.type == "fire") textColor = '#ff9922';
    else if(data.type == "miss") textColor = '#ff0000';
    else if(data.type == "crit") textColor = '#ff2222';
    else if(data.type == "corrosion") textColor = '#33ff66';

    let sprite = new THREE.TextSprite({
        align: 'center',
        fillStyle: textColor,
        fontFamily: 'Nanum Gothic Coding',
        fontSize: (0.6 + Math.pow(0.45 * data.damage , 0.4) / 20),
        lineGap: -0.95,
        strokeStyle: '#000',
        strokeWidth: 0.15,
        text: [
        Math.round(data.damage),
        ].join('\n'),
    });
    sprite.position.set(data.x / 10, 3, data.y / 10 + 0.25);
    sprite.name = "DAM" + data.id;
    scene.add(sprite);

});

socket.on('init',function(data){
    if(data.selfId) selfId = data.selfId;
    //{ player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], bullet: []}
    for(var i = 0 ; i < data.player.length; i++){
        new Player(data.player[i]);

        var geometry = new THREE.PlaneGeometry( 5, 5, 1, 1 );
        var PTex = new THREE.TextureLoader().load( '/client/img/player.png' );
        var materialplayer = new THREE.MeshLambertMaterial( { map: PTex, side: THREE.BackSide, transparent: true, depthWrite: false, depthTest: false, color: data.player[i].color, } );
        var cubeplayer = new THREE.Mesh( geometry, materialplayer );

        cubeplayer.position.set(-400,-40,-400);
        cubeplayer.rotation.x = Math.PI / 2;
        cubeplayer.name = "Pl" + data.player[i].id;

        scene.add(cubeplayer);
    }
    for(var i = 0 ; i < data.bullet.length; i++){
        new Bullet(data.bullet[i]);
        
        var Texture = new THREE.TextureLoader().load( '/client/img/bullets/' + data.bullet[i].towerType + '.png');
        Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping; 
        Texture.repeat.set( 1, 1 );
        // DoubleSide: render texture on both sides of mesh
        var materialbullet = new THREE.MeshLambertMaterial( { map: Texture, transparent: true } );
        var cubebullet = new THREE.Mesh( bulletGeometry, materialbullet );
        
        cubebullet.position.set(data.bullet[i].x / 10, 2, data.bullet[i].y / 10);
        cubebullet.name = "Bu" + data.bullet[i].id;

        scene.add(cubebullet);

        if (data.bullet[i].towerType == "laser"){
            var laserMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
            var points = [];
            points.push( new THREE.Vector3( Tower.list[data.bullet[i].towerParent].x / 10, 2, Tower.list[data.bullet[i].towerParent].y / 10 ));
            points.push( new THREE.Vector3( data.bullet[i].x / 10, 2, data.bullet[i].y / 10 ) );

            var geometry = new THREE.BufferGeometry().setFromPoints( points );
            var line = new THREE.Line( geometry, laserMaterial );
            cubebullet.add( line );
        }
    }
    for(var i = 0 ; i < data.npc.length; i++){
        new NPC(data.npc[i]);
        
        var geometry = new THREE.PlaneGeometry( 4, 4, 4 );
        var Texture = new THREE.TextureLoader().load( '/client/img/creeps/' + data.npc[i].creepType + '.png');
        Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping; 
        Texture.repeat.set( 1, 1 );
        // DoubleSide: render texture on both sides of mesh
        var color = "#ffffff";
        if (data.npc[i].armorType == "infernal") color = "#ee0055";
        else if (data.npc[i].armorType == "divine") color = "#e6faff";
        else if (data.npc[i].armorType == "draconic") color = "#ffaa11";
        var materialnpc = new THREE.MeshPhongMaterial( { map: Texture, side: THREE.DoubleSide,transparent: true, color: color} );
        var cubenpc = new THREE.Mesh( geometry, materialnpc );
        
        cubenpc.position.set(data.npc[i].x / 10, 1.5, data.npc[i].y / 10 + 1);
        cubenpc.name = "Np" + data.npc[i].id;
        scene.add(cubenpc);

        var geometryB = new THREE.BoxGeometry( 3.2, 1, 0.1 );
        var TextureB = new THREE.TextureLoader().load( '/client/img/health.png');
        TextureB.wrapS = TextureB.wrapT = THREE.RepeatWrapping; 
        TextureB.repeat.set( 0.5, 1.0 );
        TextureB.offset.set( 0 );

        var materialnpcB = new THREE.MeshPhongMaterial( { map: TextureB } );
        var cubenpcB = new THREE.Mesh( geometryB, materialnpcB );

        cubenpcB.position.set(data.npc[i].x / 10, 3, data.npc[i].y / 10);
        cubenpcB.name = "NB" + data.npc[i].id;
        scene.add(cubenpcB);

        let sprite = new THREE.TextSprite({
            align: 'right',
            fillStyle: '#ffffff',
            fontFamily: 'Nanum Gothic Coding',
            fontSize: 0.85,
            lineGap: -0.95,
            strokeStyle: '#000',
            strokeWidth: 0.15,
            text: [
            '       ',
            Math.round(data.npc[i].hp),
            ].join('\n'),
        });
        sprite.position.set(data.npc[i].x / 10, 3.05, data.npc[i].y / 10 + 0.25);
        sprite.name = "NH" + data.npc[i].id;
        scene.add(sprite);

        var geometryA = new THREE.PlaneGeometry( 1.25, 1.25, 1.25 );
        var TextureA = new THREE.TextureLoader().load( '/client/img/status/shieldGood.png');
        TextureA.wrapS = TextureA.wrapT = THREE.RepeatWrapping; 
        TextureA.repeat.set( 1, 1 );
        var materialnpcArm = new THREE.MeshPhongMaterial( { map: TextureA, side: THREE.DoubleSide,transparent: true} );
        var cubenpcArm = new THREE.Mesh( geometryA, materialnpcArm );
        
        cubenpcArm.position.set(0.75, 4.4, -0.25);
        cubenpcArm.name = "NA" + data.npc[i].id;
        cubenpc.add(cubenpcArm);

        let asprite = new THREE.TextSprite({
            align: 'center',
            fillStyle: '#ffffff',
            fontFamily: 'Nanum Gothic Coding',
            fontSize: 0.75,
            lineGap: -0.95,
            strokeStyle: '#000',
            strokeWidth: 0.15,
            text: [
            '     ',
            Math.round(data.npc[i].armor),
            ].join('\n'),
        });
        asprite.position.set(0.75, 4.5, -0.05);
        asprite.name = "NArm" + data.npc[i].id;
        cubenpc.add(asprite);

        if (data.npc[i].shield > 0){
            var materialnpcBS = new THREE.MeshLambertMaterial( { map: TextureB ,color: '#28f' } );
            var cubenpcBS = new THREE.Mesh( geometryB, materialnpcBS );

            cubenpcBS.position.set(data.npc[i].x / 10, 3, data.npc[i].y / 10);
            cubenpcBS.name = "NS" + data.npc[i].id;
            scene.add(cubenpcBS);

            let spriteS = new THREE.TextSprite({
                align: 'right',
                fillStyle: '#ffffff',
                fontFamily: 'Nanum Gothic Coding',
                fontSize: 0.85,
                lineGap: -0.95,
                strokeStyle: '#000',
                strokeWidth: 0.15,
                text: [
                '       ',
                Math.round(data.npc[i].hp),
                ].join('\n'),
            });
            spriteS.position.set(data.npc[i].x / 10, 3.05, data.npc[i].y / 10 + 0.25);
            spriteS.name = "NHs" + data.npc[i].id;
            scene.add(spriteS);
        }
    }
    for(var i = 0 ; i < data.tower.length; i++){
        new Tower(data.tower[i]);
        
        var geometry = new THREE.PlaneGeometry( 4.4, 4.4, 4.4 );
        var Texture = new THREE.TextureLoader().load( '/client/img/towers/' + data.tower[i].towerType + '.png');
        Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping; 
        Texture.repeat.set( 1, 1 );
        // DoubleSide: render texture on both sides of mesh
        var materialtower = new THREE.MeshLambertMaterial( { map: Texture, side: THREE.DoubleSide,transparent: true} );
        var cubetower;

        if(data.tower[i].towerType == "pawn" || data.tower[i].towerType == "grave" || data.tower[i].towerType == "rock"){          
            //console.log(modelData[data.tower[i].towerType]);
            cubetower = new THREE.Mesh( modelData[data.tower[i].towerType].geometry, modelData[data.tower[i].towerType].material );
        }
        else { 
            cubetower = new THREE.Mesh( geometry, materialtower );       
        }
        

        //console.log(cubetower);
        cubetower.position.set(data.tower[i].x / 10, 2, data.tower[i].y / 10 + 0.6);
        cubetower.name = "To" + data.tower[i].id;     
        scene.add(cubetower);

        var Pgeometry = new THREE.PlaneGeometry( 4.5, 4.5, 1, 1 );
        var PTex = new THREE.TextureLoader().load( '/client/img/towerplane' + data.tower[i].bulletType + '.png' );
        var pl = Player.list[data.tower[i].parent];
        console.log("test: " + data.tower[i].parent);
        //if (data.tower[i].parent != 0) var Pmaterialtower = new THREE.MeshLambertMaterial( { map: PTex, side: THREE.DoubleSide,transparent: true, color: pl.color} );
        var Pmaterialtower = new THREE.MeshLambertMaterial( { map: PTex, side: THREE.DoubleSide,transparent: true} );
        var planetower = new THREE.Mesh( Pgeometry, Pmaterialtower );

        planetower.position.set(0,-1.98,-0.11);
        planetower.rotation.x = 0 - Math.PI / 2;
        planetower.name = "TP" + data.tower[i].id;

        cubetower.add(planetower);

        if(data.tower[i].manaMax > 0){
            var geometryB = new THREE.BoxGeometry( 3.2, 0.5, 0.1 );
            var TextureB = new THREE.TextureLoader().load( '/client/img/health.png');
            TextureB.wrapS = TextureB.wrapT = THREE.RepeatWrapping; 
            TextureB.repeat.set( 0.5, 1.0 );
            TextureB.offset.set( 0 );
            var materialtB = new THREE.MeshPhongMaterial( { map: TextureB } );
            var cubetB = new THREE.Mesh( geometryB, materialtB );
            cubetB.material.color.setHex( 0x66ccff );
            cubetB.name = "TM" + data.tower[i].id;
            cubetB.position.set(0,-0.25,0.7);

            cubetower.add(cubetB);
        }
        if(data.tower[i].towerType != "rock"){
            //var Lgeometry = new THREE.PlaneGeometry( 3.5, 0.9, 1, 1 );
            //var LTex = new THREE.TextureLoader().load( '/client/img/upgrade1.png' );
            //var Lmaterialtower = new THREE.MeshLambertMaterial( { map: LTex, side: THREE.DoubleSide,transparent: true, depthWrite: false, depthTest: false,} );
            var myessprite = new THREE.TextSprite({
                align: 'center',
                fillStyle: '#ffffff',
                fontFamily: 'Roboto Slab',
                fontSize: 0.80,
                lineGap: 0.05,
                strokeStyle: '#000',
                strokeWidth: 0.15,
                text: [
                '     ',
                Math.round(1),
                ].join('\n'),
            });

            myessprite.position.set(0,0.2,1.6);
            myessprite.name = "TL" + data.tower[i].id;
            cubetower.add(myessprite);
        }
    }
});

socket.on('update',function(data){
    //TODO don't use getObjectByName
    if (frameTime > 80 + targetFrameTime) return;
    //{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}], bullet: []}
    for(var i = 0 ; i < data.player.length; i++){
        var pack = data.player[i];
        var p = Player.list[pack.id];
        if(p){
            if(pack.x !== undefined)
                p.x = Math.round(pack.x);
            if(pack.y !== undefined)
                p.y = Math.round(pack.y);
            if(pack.hp !== undefined)
                p.hp = pack.hp;
            if(pack.exp !== undefined)
                p.exp = pack.exp;
            if(pack.score !== undefined)
                p.score = pack.score;
            if(pack.map !== undefined)
                p.map = pack.map;
            if(pack.gold !== undefined)
                p.gold = pack.gold;
            if(pack.research !== undefined)
                p.research = pack.research;
            if(pack.kills !== undefined)
                p.kills = pack.kills;
            if(pack.scoreboard !== undefined)
                p.scoreBoard = pack.scoreboard;
                
            var cubeplayer = scene.getObjectByName("Pl" + pack.id);
            if(cubeplayer){
                cubeplayer.position.set(pack.x / 10, 0.01, pack.y / 10);
            }

            if (Player.list[selfId].id == pack.id){
                if(cubeplayer){
                    camera.position.set(Player.list[selfId].x / 10, 292 - zoom * 27, Player.list[selfId].y / 10 + 334 - zoom * 30);
                    camera.lookAt(cubeplayer.position.x , cubeplayer.position.y , cubeplayer.position.z + 11 - zoom);
                }
            }
        }
    }
    for(var i = 0 ; i < data.npc.length; i++){
        var pack = data.npc[i];
        var p = NPC.list[pack.id];
        if(p){  
            var cubenpc = scene.getObjectByName("Np" + pack.id);
            if(cubenpc){
                cubenpc.position.set(p.x / 10, 1.5, p.y / 10);
            }
            var cubenpcB = scene.getObjectByName("NB" + pack.id);
            if(cubenpcB){
                cubenpcB.position.set(p.x / 10, 5, p.y / 10);
                if(pack.armor < 1 && p.armor > 0 && pack.armor !== undefined){
                    console.log("no armor");
                    cubenpcB.material.map = new THREE.TextureLoader().load('/client/img/healthBroken.png');
                    cubenpcB.material.needsUpdate = true;
                }
                if(p.corrosion > 1) cubenpcB.material.color.setHex( 0x00dd00 );
                else if(p.fire > 1) cubenpcB.material.color.setHex( 0xddcc00 );
                else cubenpcB.material.color.setHex( 0xdd0000 );
                var texture = cubenpcB.material.map;
                texture.repeat.set( 0.5, 1.0 );
                if (pack.hp !== undefined) texture.offset.set(0.5 - ((p.hp + pack.hp) * 0.25) / p.hpMax , 0);
                else texture.offset.set(0.5 - p.hp * 0.5 / p.hpMax , 0);
            } 
            var sprite = scene.getObjectByName("NH" + pack.id);
             if(sprite){
                if(pack.hp !== p.hp && pack.hp !== undefined){
                    sprite.text = [
                        '       ',
                        Math.round(pack.hp),
                        ].join('\n');
                }
                sprite.position.set(p.x / 10, 5.25, p.y / 10 + 0.25);
            }

            var cubenpcS = scene.getObjectByName("NS" + pack.id);
            if(cubenpcS){
                cubenpcS.position.set(p.x / 10, 6.2, p.y / 10);
                if(pack.shield !== p.shield && pack.shield !== undefined){
                    var textureS = cubenpcS.material.map;
                    textureS.repeat.set( 0.5, 1.0 );
                    textureS.offset.set(0.5 - pack.shield * 0.5 / p.shieldMax , 0);
                }
            }
            var spriteS = scene.getObjectByName("NHs" + pack.id);
            if(spriteS){
                if(pack.shield !== p.shield && pack.shield !== undefined){
                    spriteS.text = [
                        '     ',
                        Math.round(pack.shield),
                        ].join('\n');
                }
                spriteS.position.set(p.x / 10, 6.45, p.y / 10 + 0.25);
            }
            var spriteAr = scene.getObjectByName("NArm" + pack.id);
            if(spriteAr){
                if(pack.armor !== p.armor && pack.armor !== undefined){
                    spriteAr.text = [
                        '       ',
                        Math.round(pack.armor),
                        ].join('\n');
                }
            }

            if(pack.x !== undefined)
                p.x = pack.x;
            if(pack.y !== undefined)
                p.y = pack.y;
            if(pack.hp !== undefined)
                p.hp = pack.hp;
            if(pack.shield !== undefined)
                p.shield = pack.shield;
            if(pack.shieldMax !== undefined)
                p.shieldMax = pack.shieldMax;
            if(pack.score !== undefined)
                p.score = pack.score;
            if(pack.armor !== undefined)
                p.armor = pack.armor;
            if(pack.map !== undefined)
                p.map = pack.map;
            if(pack.corrosion !== undefined)
                p.corrosion = pack.corrosion;
            if(pack.frost !== undefined)
                p.frost = pack.frost;
            if(pack.fire !== undefined)
                p.fire = pack.fire;
            if(pack.stun !== undefined)
                p.stun = pack.stun;
            if(pack.stoned !== undefined)
                p.stoned = pack.stoned;
        }
    }
    for(var i = 0 ; i < data.bullet.length; i++){
        var pack = data.bullet[i];
        var b = Bullet.list[data.bullet[i].id];
        if(b){
            if(pack.x !== undefined)
                b.x = Math.round(pack.x);
            if(pack.y !== undefined)
                b.y = Math.round(pack.y);
            if(pack.bulletType !== undefined)
                b.bulletType = pack.bulletType;
            if(pack.angle !== undefined)
                b.angle = pack.angle;
            if(pack.timer !== undefined)
                b.timer = pack.timer;
                
            var cubebullet = scene.getObjectByName("Bu" + pack.id);
            if(cubebullet){
                cubebullet.position.set(pack.x / 10, 2, pack.y / 10);
            }
        }
    }
    var needsTooltip = false;
    var needsHeroicTooltip = false;


    for(var i = 0 ; i < data.tower.length; i++){
        var pack = data.tower[i];
        if (pack == undefined) return;  
        var b = Tower.list[data.tower[i].id];
        if(b){
            if(pack.x !== undefined)
                b.x = pack.x;
            if(pack.y !== undefined)
                b.y = pack.y;

            if(Math.round(Player.list[selfId].x / 48) == Math.round(b.x / 48) && Math.round(Player.list[selfId].y / 48) == Math.round(b.y / 48) && (b.towerType == "heroicBarbarian" || b.towerType == "heroicArcher" || b.towerType == "heroicWizard")){
                needsTooltip = false;
                needsHeroicTooltip = true;
                //console.log("This is a heroic Archer");
            }
            else if(Math.round(Player.list[selfId].x / 48) == Math.round(b.x / 48) && Math.round(Player.list[selfId].y / 48) == Math.round(b.y / 48) && b.towerType != "heroicBarbarian" && b.towerType != "heroicArcher" && b.towerType != "heroicWizard" && b.towerType != "rock"){
                needsTooltip = true;
                needsHeroicTooltip = false;
                //console.log("This is a heroic Archer");
            }

            if(pack.value !== undefined)
                b.value = pack.value;
            if(pack.mana !== undefined)
                b.mana = pack.mana;
            if(pack.manaMax !== undefined)
                b.manaMax = pack.manaMax;
            if(pack.towerType !== undefined && pack.towerType !== b.towerType){
                console.log(pack.towerType);
                var cubetower = scene.getObjectByName("To" + pack.id);
                if(cubetower){
                    cubetower.material.map = new THREE.TextureLoader().load( '/client/img/towers/' + pack.towerType + '.png' );
                    cubetower.material.needsUpdate = true;
                }
                b.towerType = pack.towerType;
            }
            if(pack.targetLevel !== undefined)
                p.targetLevel = pack.targetLevel;
            if((pack.upgradeLevel !== undefined && pack.upgradeLevel !== b.upgradeLevel) || (pack.buildTimer !== undefined && pack.buildTimer !== b.buildTimer)){
                    var spriteT = scene.getObjectByName("TL" + pack.id);
                    var status = "";
                    var levelText = Math.round(pack.upgradeLevel);
                    if (pack.targetLevel > pack.upgradeLevel) levelText = Math.round(pack.upgradeLevel) + " > " + Math.round(pack.targetLevel);
                    if(pack.targetLevel > pack.upgradeLevel) status = "Build: " + Math.round(Math.max(b.buildTimer * 0.65,0)) / 10;
                    if(spriteT){
                        spriteT.text = [
                            '       ',
                            levelText,
                            b.towerType,
                            status,
                            ].join('\n');
                    }
                b.upgradeLevel = pack.upgradeLevel;
                b.buildTimer = pack.buildTimer;
            }
            if(pack.x !== undefined && pack.y !== undefined){
                var cubetower = scene.getObjectByName("To" + pack.id);
                if(cubetower){
                    //cubetower.position.set(b.x / 10, 2, b.y / 10 + 0.2);
                }
            }
            var cubeM = scene.getObjectByName("TM" + pack.id);
            if(cubeM){
                var texture = cubeM.material.map;
                texture.repeat.set( 0.5, 1.0 );
                texture.offset.set(0.5 - b.mana * 0.5 / b.manaMax , 0);
            }
        }
    }
    if(needsHeroicTooltip == true) {socket.emit('updateTooltip'); heroicTooltip.style.display = 'inline-block';}
    else {
        heroicTooltip.style.display = 'none';
    }

    if(needsTooltip == true) {socket.emit('updateTooltip'); towerTooltip.style.display = 'inline-block';}
    else {
        towerTooltip.style.display = 'none';
    }
});

socket.on('remove',function(data){
    //{player:[12323],bullet:[12323,123123]}
    for(var i = 0 ; i < data.player.length; i++){
        var cubeplayer = scene.getObjectByName("Pl" + Player.list[data.player[i]].id);
         if(cubeplayer){
            scene.remove(cubeplayer);
        }

        delete Player.list[data.player[i]];
    }
    for(var i = 0 ; i < data.bullet.length; i++){
        var cubebullet = scene.getObjectByName("Bu" + Bullet.list[data.bullet[i]].id);
         if(cubebullet){
            scene.remove(cubebullet);
        }

        delete Bullet.list[data.bullet[i]];
    }
    for(var i = 0 ; i < data.npc.length; i++){
        var cubenpc = scene.getObjectByName("Np" + NPC.list[data.npc[i]].id);
         if(cubenpc){
            scene.remove(cubenpc);
        }
        var cubenpcB = scene.getObjectByName("NB" + NPC.list[data.npc[i]].id);
         if(cubenpcB){
            scene.remove(cubenpcB);
        }
        var cubenpcH = scene.getObjectByName("NH" + NPC.list[data.npc[i]].id);
         if(cubenpcH){
            scene.remove(cubenpcH);
        }
        var cubenpcH = scene.getObjectByName("NS" + NPC.list[data.npc[i]].id);
         if(cubenpcH){
            scene.remove(cubenpcH);
        }
        var cubenpcH = scene.getObjectByName("NHs" + NPC.list[data.npc[i]].id);
         if(cubenpcH){
            scene.remove(cubenpcH);
        }

        delete NPC.list[data.npc[i]];
    }
    for(var i = 0 ; i < data.tower.length; i++){
        var cubetower = scene.getObjectByName("To" + Tower.list[data.tower[i]].id);
         if(cubetower){
            scene.remove(cubetower);
        }
        var cubetowerL = scene.getObjectByName("TL" + Tower.list[data.tower[i]].id);
         if(cubetowerL){

            scene.remove(cubetowerL);
        }
        delete Tower.list[data.tower[i]];
    }
});

setInterval(function(){
    if(!selfId)
        return;
    //fixWindow();
    //ctx.clearRect(0,0,960,500);
    //drawMap();
    //drawScore();
    //for(var i in Player.list)
        //Player.list[i].draw();
    //for(var i in Bullet.list)
        //Bullet.list[i].draw();
    //for(var i in Tower.list)
        //Tower.list[i].draw();
    //for(var i in NPC.list)
        //NPC.list[i].draw();
    for(var i in Damage.list)
        Damage.list[i].draw();
},30);

setInterval(function(){
    drawScoreboard();
    drawStats();
},100);

var drawMap = function(){
    var player = Player.list[selfId];
    var x = player.x;
    var y = player.y;
    var ptrn = ctx.createPattern(Img.map[player.map], 'repeat');
    ctx.fillStyle = ptrn;
    //ctx.fillRect(x % 48, y % 48, WIDTH, HEIGHT);
    ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) - 960 * 2 - 48 + WIDTH / 2,(y * -2) % (960 *2) - 960 * 1 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2); ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) + 960 * 0 - 48 + WIDTH / 2,(y * -2) % (960 *2) - 960 * 1 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2); ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) + 960 * 2 - 48 + WIDTH / 2,(y * -2) % (960 *2) - 960 * 1 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2);
    ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) - 960 * 2 - 48 + WIDTH / 2,(y * -2) % (960 *2) + 960 * 1 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2); ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) + 960 * 0 - 48 + WIDTH / 2,(y * -2) % (960 *2) + 960 * 1 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2); ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) + 960 * 2 - 48 + WIDTH / 2,(y * -2) % (960 *2) + 960 * 1 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2);
    ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) - 960 * 2 - 48 + WIDTH / 2,(y * -2) % (960 *2) + 960 * 3 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2); ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) + 960 * 0 - 48 + WIDTH / 2,(y * -2) % (960 *2) + 960 * 3 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2); ctx.drawImage(Img.map[player.map],((x * -2) % (960 *2)) + 960 * 2 - 48 + WIDTH / 2,(y * -2) % (960 *2) + 960 * 3 + 48, Img.map[player.map].width *2, Img.map[player.map].height *2);
}

var drawScore = function(){
    if(lastScore === Player.list[selfId].score)
        return;
    lastScore = Player.list[selfId].score;
    ctxUi.clearRect(0,0,500,500);
    ctxUi.fillStyle = 'white';
    ctxUi.fillText(Player.list[selfId].score,0,30);
}
var lastScore = null;

var drawStats = function(){
    if(!selfId)
        return;
    //TODO don't use getElementById
    document.getElementById('panePos').innerHTML = "X: " + Math.round(Player.list[selfId].x) + "(" + Math.round(Player.list[selfId].x / 48) + ")" + " Y: " + Math.round(Player.list[selfId].y) + "(" + Math.round(Player.list[selfId].y / 48) + ")";
    document.getElementById('paneGold').innerHTML = "Gold: " + Player.list[selfId].gold + " RP: " + Player.list[selfId].research;
    document.getElementById('paneLevel').innerHTML = "Level: " + Player.list[selfId].score + "(" + Player.list[selfId].exp + "/" + Math.round( 2500 + Math.pow(Player.list[selfId].score * 750 , 1.1)) + ")";
    document.getElementById('paneTech').innerHTML = "Tech: " + tech.toLocaleString();
    document.getElementById('paneHealth').innerHTML = "Pop: " + health.toLocaleString() + " / " + maxHealth.toLocaleString();
    document.getElementById('paneWave').innerHTML = "Morale: " + wave / 100;
}

var drawScoreboard = function(){
    var text = "";

    text = "<table style='width:100%;'><tr><td style='width:18% !important;' id='scoreBoardtd'>Name</td><td style='width:6% !important;' id='scoreBoardtd'>Kills</td><td id='scoreBoardtd'>Physical</td><td id='scoreBoardtd'>Siege</td><td id='scoreBoardtd'>Arcane</td><td id='scoreBoardtd'>Heroic</td><td id='scoreBoardtd'>Elemental</td></tr>";
    for(var i in Player.list) {
        //console.log(Player.list[i].username + ": " + Player.list[i].scoreBoard);
        text += "<tr><td style='width:18% !important; color:" + Player.list[i].color + ";' id='scoreBoardtd'>" + Player.list[i].username + "</td><td style='width:6% !important;' id='scoreBoardtd'>" + Player.list[i].kills + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[0]) + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[1]) + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[2]) + "</td>" + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[3]) + "</td>" + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[4]) + "</td></tr>";
    }

    text += "</table>";
    document.getElementById('scoreBoard').innerHTML = text;
}
document.onkeydown = function(event){
    if(event.keyCode === 68)	//d
        socket.emit('keyPress',{inputId:'right',state:true});
    else if(event.keyCode === 83)	//s
        socket.emit('keyPress',{inputId:'down',state:true});
    else if(event.keyCode === 65) //a
        socket.emit('keyPress',{inputId:'left',state:true});
    else if(event.keyCode === 87) // w
        socket.emit('keyPress',{inputId:'up',state:true});

}
document.onkeyup = function(event){
    if(event.keyCode === 68)	//d
        socket.emit('keyPress',{inputId:'right',state:false});
    else if(event.keyCode === 83)	//s
        socket.emit('keyPress',{inputId:'down',state:false});
    else if(event.keyCode === 65) //a
        socket.emit('keyPress',{inputId:'left',state:false});
    else if(event.keyCode === 87) // w
        socket.emit('keyPress',{inputId:'up',state:false});
}

document.onmousedown = function(event){
    //socket.emit('keyPress',{inputId:'attack',state:true});
}
document.onmouseup = function(event){
    //socket.emit('keyPress',{inputId:'attack',state:false});
}
document.onmousemove = function(event){
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.round(Math.atan2(y,x) / Math.PI * 4) * 45;
    socket.emit('keyPress',{inputId:'mouseAngle',state:angle});
}

document.oncontextmenu = function(event){
    event.preventDefault();
}

console.log("*Main Loaded");
frameLogin.show();
frameLogin.setPosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');
loadDiv.style.display = 'none';
signDiv.style.display = 'none';
settingsDiv.style.display = 'none';
gameDiv.style.display = 'inline-block';

