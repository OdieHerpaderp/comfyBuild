import { ResourceList } from "resourceList";
import { LoginScreen } from "loginScreen";
import { Chat } from "chat";
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MapControls } from 'three/addons/controls/OrbitControls.js';
import TextSprite from '@seregpie/three.text-sprite';
import { socket } from "singletons"
import BuildingsFrame from "./modules/buildings/buildingsFrame.mjs";

// Buildings
var buildingsFrame = new BuildingsFrame();

// Stockpile
var stockpile = new ResourceList();
socket.on('stockpile', function (data) {
    stockpile.updateResources(data);
});

// Chat
var chat = new Chat();

// Login
var loginScreen = new LoginScreen();
loginScreen.addEventListener("loginSuccessful", () => {
    loginScreen.closeFrame();
    stockpile.showFrame();
    buildingsFrame.showFrame();
    chat.showFrame();
});

//ThreeJS
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(15, window.innerWidth / (window.innerHeight - 44) * 1.15, 0.1, 1000);
camera.position.z = 5;
var fakePlayer = { x: 64 * 48, y: 64 * 48, spdX: 0, spdY: 0, left: false, right: false, up: false, down: false };

var renderer = new THREE.WebGLRenderer({ canvas: threejs });
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize(window.innerWidth, window.innerHeight - 44);
//document.body.appendChild( renderer.domElement );

// Camera controls
const gameElement = document.getElementById("game");
// note: normally renderer.domElement is used, but that's hidden behind other elements so it doesn't capture mouse events.
const controls = new MapControls(camera, gameElement);
controls.maxDistance = 750;
controls.minDistance = 50;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.4;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
};

var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.1;
var mousePosition = new THREE.Vector2();
gameElement.addEventListener('mousemove', (event) => {
    let boundingRect = renderer.domElement.getBoundingClientRect();
    mousePosition.x = (((event.clientX - boundingRect.left) / boundingRect.width) * 2) - 1;
    mousePosition.y = - (((event.clientY - boundingRect.top) / boundingRect.height) * 2) + 1;
});
gameElement.addEventListener('click', () => {
    lockPosition = !lockPosition;
});

// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
var floorTexture = new THREE.ImageUtils.loadTexture('/client/img/map.png');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 10);
var floorTextureN = new THREE.ImageUtils.loadTexture('/client/img/map_n.png');
floorTextureN.wrapS = floorTextureN.wrapT = THREE.RepeatWrapping;
floorTextureN.repeat.set(10, 10);
// DoubleSide: render texture on both sides of mesh
var floorMaterial = new THREE.MeshStandardMaterial({ color: '#BBBBBB', map: floorTexture, side: THREE.BackSide, normalMap: floorTextureN, roughness: 0.7, });
var floorGeometry = new THREE.PlaneGeometry(960, 960, 1, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.x = 237.75;
floor.position.y = -0.2;
floor.position.z = 237.75;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// Global plane geom
var bulletGeometry = new THREE.PlaneGeometry(3, 3, 1, 1);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.x = 40;
directionalLight.position.y = 280;
directionalLight.position.z = 420;
directionalLight.name = "Direc";
scene.add(directionalLight);
directionalLight.target = floor;

const light = new THREE.HemisphereLight(0xaabbff, 0x228811, 0.8);
scene.add(light);


//var skyColor = 0xFFEEDD;
//var groundColor = 0xAAA099;
//var light = new THREE.HemisphereLight(skyColor, groundColor, 0.7);
//light.name = "Hemi";
//scene.add(light);

//cubemap HDR
new RGBELoader()
    .setPath('/client/img/')
    .load('skybox.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //texture.generateMipmaps = true;
        scene.background = texture;
        scene.backgroundBlurriness = 1;
        scene.environment = texture;
    });

var frameTime = 10;
var targetFrameTime = 20;
var renderScale = 100;
var previousTime = 10;
var avgDelta = 30;
var displayHealth = true;
var displayDamage = 2;
window.upgradeAmount = 1;
var pop = 100;

const loader = new GLTFLoader();

var modelData = [];
var preloadModel = function(model){
    loader.load('client/models/tower/' + model + '.glb', function (gltf) {
        const root = gltf.scene;
        //console.log(root.children[0].geometry);
        var cubetower = root;
        console.log(cubetower);
        modelData[model] = cubetower;
        console.log("Model " + model + "loaded");
    
    }, undefined, function (error) {
    
        console.error(error);
    
    });
}
preloadModel("well");

document.getElementById("frameTimeSlider").oninput = function () {
    targetFrameTime = this.value;
    document.getElementById("targetFrameTime").innerHTML = this.value;
}

document.getElementById("renderScaleSlider").oninput = function () {
    renderScale = this.value;
    document.getElementById("renderScale").innerHTML = this.value;
}

window.hpDisplay = function () {
    if (displayHealth == true) { displayHealth = false; document.getElementById("buttonDisplayHP").innerHTML = "HP Display OFF"; }
    else { displayHealth = true; document.getElementById("buttonDisplayHP").innerHTML = "HP Display ON"; }

};
window.damageDisplay = function () {
    if (displayDamage == 0) { displayDamage = 1; document.getElementById("buttonDisplayDAM").innerHTML = "Damage Display SOME"; }
    else if (displayDamage == 1) { displayDamage = 2; document.getElementById("buttonDisplayDAM").innerHTML = "Damage Display ALL"; }
    else { displayDamage = 0; document.getElementById("buttonDisplayDAM").innerHTML = "Damage Display NONE"; }
};

var pollInputs = function (delta) {
    let movement = new THREE.Vector2();

    //TODO Handle SOCD properly. This implementation is lazy
    if (fakePlayer.right) movement.x = 1;
    else if (fakePlayer.left) movement.x = -1;

    if (fakePlayer.down) movement.y = 1;
    else if (fakePlayer.up) movement.y = -1;

    movement.rotateAround(new THREE.Vector2(), -controls.getAzimuthalAngle()); // Follow camera direction
    movement.normalize();
    movement.multiplyScalar(delta * 0.07);

    camera.position.x += movement.x;
    camera.position.z += movement.y;
    controls.target.x += movement.x;
    controls.target.z += movement.y;
};

var lastEmit = new Date().getTime();
var lockPosition = false;
var animate = function () {
    requestAnimationFrame(animate);
    var currentTime = new Date().getTime();
    var delta = currentTime - previousTime;
    avgDelta = Math.min((avgDelta * 2 + delta + targetFrameTime * 2) / 5, 250);
    previousTime = currentTime;
    pollInputs(delta);

    controls.update();

    if (!lockPosition) {
        raycaster.setFromCamera(mousePosition, camera);
        var intersections = raycaster.intersectObject(floor);
        var intersection = (intersections.length > 0 ? intersections[0] : null);
        if (intersection) {
            fakePlayer.x = intersection.point.x * 10;
            fakePlayer.y = intersection.point.z * 10;
        }
    }

    if (currentTime - 30 > lastEmit) {
        drawStats();
        socket.emit('fakePlayer', { x: fakePlayer.x, y: fakePlayer.y });
        lastEmit = currentTime;
    }
    if (avgDelta > frameTime + 4 && frameTime < 200) frameTime = Math.ceil((frameTime + avgDelta * 2) / 3);
    else if (avgDelta < frameTime + 1 && frameTime > targetFrameTime) frameTime = Math.floor((frameTime + avgDelta) / 2);

    if (frameTime > 80 + targetFrameTime) document.getElementById('fpsCounter').style.color = "red";
    if (frameTime > 60 + targetFrameTime) document.getElementById('fpsCounter').style.color = "orange";
    else if (frameTime > 40 + targetFrameTime) document.getElementById('fpsCounter').style.color = "yellow";
    else document.getElementById('fpsCounter').style.color = "white";

    document.getElementById('fpsCounter').innerHTML = "FT: " + delta + " ms";

    //cube.rotation.x += 0.01;
    if (oldWidth != window.innerWidth || oldHeight != window.innerHeight) {
        console.log("WE GON RESIZE");
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight - 44);
        renderer.setPixelRatio(window.devicePixelRatio * renderScale / 100);
        const canvas = renderer.domElement;
        camera.aspect = window.innerWidth / (window.innerHeight - 44) * 1.06;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
};

animate();

function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
    window.addEventListener('mousemove', divMove, true);
}

window.openSettings = function (e) {
    settingsDiv.style.display = 'initial';
}

window.closeSettings = function (e) {
    settingsDiv.style.display = 'none';
}

var wave = 0;
var health = 0;
var maxHealth = 0;
var tech = 0;
var techCR = 0;

var loadDiv = document.getElementById('loadDiv');
var settingsDiv = document.getElementById('settingsDiv');
var hudButtons = document.getElementById('buttenz');

socket.on('evalAnswer', function (data) {
    console.log(data);
});

socket.on('gameState', function (data) {
    //console.log(data);
    if (data.gameState !== undefined) {
        if (data.gameState == 1) {
            hudButtons.style.display = 'none';
            //var light = scene.getObjectByName("Hemi");
            //light.color.setHex( 0xccd0dd );
            //light.groundColor.setHex( 0x656667 );
            var Dlight = scene.getObjectByName("Direc");
            if (wave % 10 === 9) Dlight.color.setHex(0xffcccc);
            else Dlight.color.setHex(0x66aadd);
        }
        else {
            hudButtons.style.display = 'inline-block';
            //var light = scene.getObjectByName("Hemi");
            //light.color.setHex( 0xffeedd );
            //light.groundColor.setHex( 0xAAA099 );
            var Dlight = scene.getObjectByName("Direc");
            Dlight.color.setHex(0xffffff);
        }
    }
    if (data.wave !== undefined) {
        wave = data.wave;
    }
    if (data.health !== undefined) {
        health = data.health;
    }
    if (data.maxHealth !== undefined) {
        maxHealth = data.maxHealth;
    }
    if (data.tech !== undefined) {
        tech = data.tech;
    }
    if (data.ready !== undefined) {
        if (data.ready == true) document.getElementById('buttonReady').innerHTML = "Unready!";
        else document.getElementById('buttonReady').innerHTML = "Ready!";
    }
});

//chatForm.onsubmit = function(e){
//    e.preventDefault();
//    if(chatInput.value[0] === '/')
//        socket.emit('evalServer',chatInput.value.slice(1));
//    else if(chatInput.value[0] === '@'){
//        //@username,message
//        socket.emit('sendPmToServer',{
//            username:chatInput.value.slice(1,chatInput.value.indexOf(',')),
//            message:chatInput.value.slice(chatInput.value.indexOf(',') + 1)
//        });
//    } else
//        socket.emit('sendMsgToServer',chatInput.value);
//    chatInput.value = '';
//}

//UI
var Damage = function (initPack) {
    var self = {};
    self.id = initPack.id;
    self.damage = initPack.damage;
    self.x = initPack.x;
    self.y = initPack.y;
    self.z = 3;
    self.type = initPack.type;

    self.lifespan = 25;
    if (self.type == "damage" || self.type == "damageShield") self.lifespan = 20;
    else if (self.type == "miss") self.lifespan = 18;
    else if (self.type == "explosion") self.lifespan = 12;
    else if (self.type == "corrosion") self.lifespan = 7;
    else if (self.type == "fire") self.lifespan = 7;



    self.draw = function () {
        self.z += (0.1 + 0.3 * (self.lifespan / 10));

        var sprite = scene.getObjectByName("DAM" + self.id);
        sprite.position.set(self.x / 10, self.z, self.y / 10 + 0.25);

        self.lifespan -= 1;
        if (self.lifespan < 1) {
            if (sprite) {
                scene.remove(sprite);
            }
            delete Damage.list[self.id];
        }
    }
    Damage.list[self.id] = self;
    return self;
}
Damage.list = {};

var Player = function (initPack) {
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

var NPC = function (initPack) {
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

var Bullet = function (initPack) {
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

var Tower = function (initPack) {
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

socket.on('damage', function (data) {
    if (displayDamage == 0) return;
    else if (frameTime > 80 + targetFrameTime) return;

    data.id = Math.random(256000);
    new Damage(data);

    var textColor = '#ffffff';
    if (data.type == "explosion") textColor = '#ffdd88';
    else if (data.type == "damageShield") textColor = '#22ddff';
    else if (data.type == "fire") textColor = '#ff9922';
    else if (data.type == "miss") textColor = '#ff0000';
    else if (data.type == "crit") textColor = '#ff2222';
    else if (data.type == "corrosion") textColor = '#33ff66';

    let sprite = new TextSprite({
        align: 'center',
        fillStyle: textColor,
        fontFamily: 'Nanum Gothic Coding',
        fontSize: (0.6 + Math.pow(0.45 * data.damage, 0.4) / 20),
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

var firstInit = true;
socket.on('init', function (data) {
    if (data.selfId) selfId = data.selfId;
    //{ player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], bullet: []}
    for (var i = 0; i < data.player.length; i++) {
        new Player(data.player[i]);

        var geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
        var PTex = new THREE.TextureLoader().load('/client/img/player.png');
        var materialplayer = new THREE.MeshLambertMaterial({ map: PTex, transparent: true, depthWrite: false, depthTest: false, color: data.player[i].color, });
        var cubeplayer = new THREE.Mesh(geometry, materialplayer);

        cubeplayer.position.set(-400, -40, -400);
        cubeplayer.rotation.x = Math.PI * 1.5;
        cubeplayer.name = "Pl" + data.player[i].id;

        scene.add(cubeplayer);
    }
    for (var i = 0; i < data.bullet.length; i++) {
        new Bullet(data.bullet[i]);

        var Texture = new THREE.TextureLoader().load('/client/img/bullets/' + data.bullet[i].towerType + '.png');
        Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping;
        Texture.repeat.set(1, 1);
        // DoubleSide: render texture on both sides of mesh
        var materialbullet = new THREE.MeshLambertMaterial({ map: Texture, transparent: true });
        var cubebullet = new THREE.Mesh(bulletGeometry, materialbullet);

        cubebullet.position.set(data.bullet[i].x / 10, 0.1, 0.1 + data.bullet[i].y / 10);
        cubebullet.rotation.x = Math.PI * 1.5;
        cubebullet.name = "Bu" + data.bullet[i].id;

        scene.add(cubebullet);
    }
    for (var i = 0; i < data.npc.length; i++) {
        new NPC(data.npc[i]);

        var geometry = new THREE.PlaneGeometry(4, 4, 4);
        var Texture = new THREE.TextureLoader().load('/client/img/creeps/' + data.npc[i].creepType + '.png');
        Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping;
        Texture.repeat.set(1, 1);
        // DoubleSide: render texture on both sides of mesh
        var color = "#ffffff";
        if (data.npc[i].armorType == "infernal") color = "#ee0055";
        else if (data.npc[i].armorType == "divine") color = "#e6faff";
        else if (data.npc[i].armorType == "draconic") color = "#ffaa11";
        var materialnpc = new THREE.MeshPhongMaterial({ map: Texture, side: THREE.DoubleSide, transparent: true, color: color });
        var cubenpc = new THREE.Mesh(geometry, materialnpc);

        cubenpc.position.set(data.npc[i].x / 10, 1.5, data.npc[i].y / 10 + 1);
        cubenpc.name = "Np" + data.npc[i].id;
        scene.add(cubenpc);

        var geometryB = new THREE.BoxGeometry(3.2, 1, 0.1);
        var TextureB = new THREE.TextureLoader().load('/client/img/health.png');
        TextureB.wrapS = TextureB.wrapT = THREE.RepeatWrapping;
        TextureB.repeat.set(0.5, 1.0);
        TextureB.offset.set(0);

        var materialnpcB = new THREE.MeshPhongMaterial({ map: TextureB });
        var cubenpcB = new THREE.Mesh(geometryB, materialnpcB);

        cubenpcB.position.set(data.npc[i].x / 10, 3, data.npc[i].y / 10);
        cubenpcB.name = "NB" + data.npc[i].id;
        scene.add(cubenpcB);

        let sprite = new TextSprite({
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

        var geometryA = new THREE.PlaneGeometry(1.25, 1.25, 1.25);
        var TextureA = new THREE.TextureLoader().load('/client/img/status/shieldGood.png');
        TextureA.wrapS = TextureA.wrapT = THREE.RepeatWrapping;
        TextureA.repeat.set(1, 1);
        var materialnpcArm = new THREE.MeshPhongMaterial({ map: TextureA, side: THREE.DoubleSide, transparent: true });
        var cubenpcArm = new THREE.Mesh(geometryA, materialnpcArm);

        cubenpcArm.position.set(0.75, 4.4, -0.25);
        cubenpcArm.name = "NA" + data.npc[i].id;
        cubenpc.add(cubenpcArm);

        let asprite = new TextSprite({
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

        if (data.npc[i].shield > 0) {
            var materialnpcBS = new THREE.MeshLambertMaterial({ map: TextureB, color: '#28f' });
            var cubenpcBS = new THREE.Mesh(geometryB, materialnpcBS);

            cubenpcBS.position.set(data.npc[i].x / 10, 3, data.npc[i].y / 10);
            cubenpcBS.name = "NS" + data.npc[i].id;
            scene.add(cubenpcBS);

            let spriteS = new TextSprite({
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
    for (var i = 0; i < data.tower.length; i++) {
        if (firstInit && data.tower[i].towerType == "headquarters") {
            firstInit = false;
            controls.target.x = data.tower[i].x / 10;
            controls.target.z = data.tower[i].y / 10;
            camera.position.set(data.tower[i].x / 10, 100, (data.tower[i].y / 10) + 200);
            controls.update();
        }
        new Tower(data.tower[i]);

        var geometry = new THREE.PlaneGeometry(4.4, 6.4, 4.4);
        var Texture = new THREE.TextureLoader().load('/client/img/towers/' + data.tower[i].towerType + '.png');
        Texture.wrapS = Texture.wrapT = THREE.RepeatWrapping;
        Texture.repeat.set(1, 2);
        // DoubleSide: render texture on both sides of mesh
        var materialtower = new THREE.MeshLambertMaterial({ map: Texture, side: THREE.DoubleSide, transparent: true });
        var cubetower;

        if (data.tower[i].towerType == "well" || data.tower[i].towerType == "grave" || data.tower[i].towerType == "rock") {
            //console.log(modelData[data.tower[i].towerType]);
            cubetower = modelData[data.tower[i].towerType].clone();
        }
        else {
            cubetower = new THREE.Mesh(geometry, materialtower);
        }


        //console.log(cubetower);
        cubetower.position.set(data.tower[i].x / 10, 0, data.tower[i].y / 10 + 0.6);
        cubetower.name = "To" + data.tower[i].id;
        scene.add(cubetower);

        var Pgeometry = new THREE.PlaneGeometry(4.5, 4.5, 1, 1);
        var PTex = new THREE.TextureLoader().load('/client/img/towerplane' + data.tower[i].bulletType + '.png');
        var pl = Player.list[data.tower[i].parent];
        console.log("test: " + data.tower[i].parent);
        //if (data.tower[i].parent != 0) var Pmaterialtower = new THREE.MeshLambertMaterial( { map: PTex, side: THREE.DoubleSide,transparent: true, color: pl.color} );
        var Pmaterialtower = new THREE.MeshLambertMaterial({ map: PTex, side: THREE.DoubleSide, transparent: true });
        var planetower = new THREE.Mesh(Pgeometry, Pmaterialtower);

        planetower.position.set(0, 0, -0.11);
        planetower.rotation.x = 0 - Math.PI / 2;
        planetower.name = "TP" + data.tower[i].id;

        cubetower.add(planetower);

        if (data.tower[i].manaMax > 0) {
            var geometryB = new THREE.BoxGeometry(3.2, 0.5, 0.1);
            var TextureB = new THREE.TextureLoader().load('/client/img/health.png');
            TextureB.wrapS = TextureB.wrapT = THREE.RepeatWrapping;
            TextureB.repeat.set(0.5, 1.0);
            TextureB.offset.set(0);
            var materialtB = new THREE.MeshPhongMaterial({ map: TextureB });
            var cubetB = new THREE.Mesh(geometryB, materialtB);
            cubetB.material.color.setHex(0x66ccff);
            cubetB.name = "TM" + data.tower[i].id;
            cubetB.position.set(0, -0.25, 0.7);

            cubetower.add(cubetB);
        }
        if (data.tower[i].towerType != "rock") {
            //var Lgeometry = new THREE.PlaneGeometry( 3.5, 0.9, 1, 1 );
            //var LTex = new THREE.TextureLoader().load( '/client/img/upgrade1.png' );
            //var Lmaterialtower = new THREE.MeshLambertMaterial( { map: LTex, side: THREE.DoubleSide,transparent: true, depthWrite: false, depthTest: false,} );
            var textSprite = new TextSprite({
                alignment: 'center',
                color: '#fff',
                fontFamily: 'Roboto Slab',
                fontSize: 0.80,
                lineGap: 0.05,
                strokeColor: '#000',
                strokeWidth: 0.15,
                text: [
                    '     ',
                    Math.round(1),
                ].join('\n'),
            });

            textSprite.position.set(0, 3.2, 1.6);
            textSprite.name = "TL" + data.tower[i].id;
            cubetower.add(textSprite);
        }
    }
});

socket.on('update', function (data) {
    //TODO don't use getObjectByName
    if (frameTime > 80 + targetFrameTime) return;
    //{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}], bullet: []}
    for (var i = 0; i < data.player.length; i++) {
        var pack = data.player[i];
        var p = Player.list[pack.id];
        if (p) {
            if (pack.x !== undefined)
                p.x = Math.round(pack.x);
            if (pack.y !== undefined)
                p.y = Math.round(pack.y);
            if (pack.hp !== undefined)
                p.hp = pack.hp;
            if (pack.exp !== undefined)
                p.exp = pack.exp;
            if (pack.score !== undefined)
                p.score = pack.score;
            if (pack.map !== undefined)
                p.map = pack.map;
            if (pack.gold !== undefined)
                p.gold = pack.gold;
            if (pack.research !== undefined)
                p.research = pack.research;
            if (pack.kills !== undefined)
                p.kills = pack.kills;
            if (pack.scoreboard !== undefined)
                p.scoreBoard = pack.scoreboard;

            var cubeplayer = scene.getObjectByName("Pl" + pack.id);
            if (cubeplayer) {
                cubeplayer.position.set(pack.x / 10, 0.01, pack.y / 10);
            }

            if (Player.list[selfId].id == pack.id) {
                if (cubeplayer) {

                }
            }
        }
    }
    for (var i = 0; i < data.npc.length; i++) {
        var pack = data.npc[i];
        var p = NPC.list[pack.id];
        if (p) {
            var cubenpc = scene.getObjectByName("Np" + pack.id);
            if (cubenpc) {
                cubenpc.position.set(p.x / 10, 1.5, p.y / 10);
            }
            var cubenpcB = scene.getObjectByName("NB" + pack.id);
            if (cubenpcB) {
                cubenpcB.position.set(p.x / 10, 5, p.y / 10);
                if (pack.armor < 1 && p.armor > 0 && pack.armor !== undefined) {
                    console.log("no armor");
                    cubenpcB.material.map = new THREE.TextureLoader().load('/client/img/healthBroken.png');
                    cubenpcB.material.needsUpdate = true;
                }
                if (p.corrosion > 1) cubenpcB.material.color.setHex(0x00dd00);
                else if (p.fire > 1) cubenpcB.material.color.setHex(0xddcc00);
                else cubenpcB.material.color.setHex(0xdd0000);
                var texture = cubenpcB.material.map;
                texture.repeat.set(0.5, 1.0);
                if (pack.hp !== undefined) texture.offset.set(0.5 - ((p.hp + pack.hp) * 0.25) / p.hpMax, 0);
                else texture.offset.set(0.5 - p.hp * 0.5 / p.hpMax, 0);
            }
            var sprite = scene.getObjectByName("NH" + pack.id);
            if (sprite) {
                if (pack.hp !== p.hp && pack.hp !== undefined) {
                    sprite.text = [
                        '       ',
                        Math.round(pack.hp),
                    ].join('\n');
                }
                sprite.position.set(p.x / 10, 5.25, p.y / 10 + 0.25);
            }

            var cubenpcS = scene.getObjectByName("NS" + pack.id);
            if (cubenpcS) {
                cubenpcS.position.set(p.x / 10, 6.2, p.y / 10);
                if (pack.shield !== p.shield && pack.shield !== undefined) {
                    var textureS = cubenpcS.material.map;
                    textureS.repeat.set(0.5, 1.0);
                    textureS.offset.set(0.5 - pack.shield * 0.5 / p.shieldMax, 0);
                }
            }
            var spriteS = scene.getObjectByName("NHs" + pack.id);
            if (spriteS) {
                if (pack.shield !== p.shield && pack.shield !== undefined) {
                    spriteS.text = [
                        '     ',
                        Math.round(pack.shield),
                    ].join('\n');
                }
                spriteS.position.set(p.x / 10, 6.45, p.y / 10 + 0.25);
            }
            var spriteAr = scene.getObjectByName("NArm" + pack.id);
            if (spriteAr) {
                if (pack.armor !== p.armor && pack.armor !== undefined) {
                    spriteAr.text = [
                        '       ',
                        Math.round(pack.armor),
                    ].join('\n');
                }
            }

            if (pack.x !== undefined)
                p.x = pack.x;
            if (pack.y !== undefined)
                p.y = pack.y;
            if (pack.hp !== undefined)
                p.hp = pack.hp;
            if (pack.shield !== undefined)
                p.shield = pack.shield;
            if (pack.shieldMax !== undefined)
                p.shieldMax = pack.shieldMax;
            if (pack.score !== undefined)
                p.score = pack.score;
            if (pack.armor !== undefined)
                p.armor = pack.armor;
            if (pack.map !== undefined)
                p.map = pack.map;
            if (pack.corrosion !== undefined)
                p.corrosion = pack.corrosion;
            if (pack.frost !== undefined)
                p.frost = pack.frost;
            if (pack.fire !== undefined)
                p.fire = pack.fire;
            if (pack.stun !== undefined)
                p.stun = pack.stun;
            if (pack.stoned !== undefined)
                p.stoned = pack.stoned;
        }
    }
    // Temporarily stop processing bullets, as they don't need updates
    /*
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
                cubebullet.position.set(pack.x / 10, 1, pack.y / 10);
            }
        }
    }
    */
    var needsTooltip = false;

    for (var i = 0; i < data.tower.length; i++) {
        var pack = data.tower[i];
        if (pack == undefined) return;
        var b = Tower.list[data.tower[i].id];
        if (b) {
            if (pack.x !== undefined)
                b.x = pack.x;
            if (pack.y !== undefined)
                b.y = pack.y;

            if (Math.round(Player.list[selfId].x / 48) == Math.round(b.x / 48) && Math.round(Player.list[selfId].y / 48) == Math.round(b.y / 48) && b.towerType != "heroicBarbarian" && b.towerType != "heroicArcher" && b.towerType != "heroicWizard" && b.towerType != "rock") {
                needsTooltip = true;
            }

            if (pack.value !== undefined)
                b.value = pack.value;
            if (pack.mana !== undefined)
                b.mana = pack.mana;
            if (pack.manaMax !== undefined)
                b.manaMax = pack.manaMax;
            if (pack.towerType !== undefined && pack.towerType !== b.towerType) {
                console.log(pack.towerType);
                var cubetower = scene.getObjectByName("To" + pack.id);
                if (cubetower) {
                    cubetower.material.map = new THREE.TextureLoader().load('/client/img/towers/' + pack.towerType + '.png');
                    cubetower.material.needsUpdate = true;
                }
                b.towerType = pack.towerType;
            }
            if (pack.targetLevel !== undefined)
                p.targetLevel = pack.targetLevel;
            if ((pack.upgradeLevel !== undefined && pack.upgradeLevel !== b.upgradeLevel) || (pack.buildTimer !== undefined && pack.buildTimer !== b.buildTimer)) {
                var spriteT = scene.getObjectByName("TL" + pack.id);
                var status = "";
                var levelText = Math.round(pack.upgradeLevel);
                if (pack.targetLevel > pack.upgradeLevel) levelText = Math.round(pack.upgradeLevel) + " > " + Math.round(pack.targetLevel);
                if (pack.targetLevel > pack.upgradeLevel) status = "Build: " + Math.round(Math.max(b.buildTimer * 0.65, 0)) / 10;
                if (spriteT) {
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
            if (pack.x !== undefined && pack.y !== undefined) {
                var cubetower = scene.getObjectByName("To" + pack.id);
                if (cubetower) {
                    //cubetower.position.set(b.x / 10, 2, b.y / 10 + 0.2);
                }
            }
            var cubeM = scene.getObjectByName("TM" + pack.id);
            if (cubeM) {
                var texture = cubeM.material.map;
                texture.repeat.set(0.5, 1.0);
                texture.offset.set(0.5 - b.mana * 0.5 / b.manaMax, 0);
            }
        }
    }

    if (needsTooltip) {
        socket.emit('updateTooltip');
        buildingsFrame.showTooltip();
    }
    else {
        buildingsFrame.showBuildingList();
    }
});

socket.on('remove', function (data) {
    //{player:[12323],bullet:[12323,123123]}
    for (var i = 0; i < data.player.length; i++) {
        var cubeplayer = scene.getObjectByName("Pl" + Player.list[data.player[i]].id);
        if (cubeplayer) {
            scene.remove(cubeplayer);
        }

        delete Player.list[data.player[i]];
    }
    for (var i = 0; i < data.bullet.length; i++) {
        var cubebullet = scene.getObjectByName("Bu" + Bullet.list[data.bullet[i]].id);
        if (cubebullet) {
            scene.remove(cubebullet);
        }

        delete Bullet.list[data.bullet[i]];
    }
    for (var i = 0; i < data.npc.length; i++) {
        var cubenpc = scene.getObjectByName("Np" + NPC.list[data.npc[i]].id);
        if (cubenpc) {
            scene.remove(cubenpc);
        }
        var cubenpcB = scene.getObjectByName("NB" + NPC.list[data.npc[i]].id);
        if (cubenpcB) {
            scene.remove(cubenpcB);
        }
        var cubenpcH = scene.getObjectByName("NH" + NPC.list[data.npc[i]].id);
        if (cubenpcH) {
            scene.remove(cubenpcH);
        }
        var cubenpcH = scene.getObjectByName("NS" + NPC.list[data.npc[i]].id);
        if (cubenpcH) {
            scene.remove(cubenpcH);
        }
        var cubenpcH = scene.getObjectByName("NHs" + NPC.list[data.npc[i]].id);
        if (cubenpcH) {
            scene.remove(cubenpcH);
        }

        delete NPC.list[data.npc[i]];
    }
    for (var i = 0; i < data.tower.length; i++) {
        var cubetower = scene.getObjectByName("To" + Tower.list[data.tower[i]].id);
        if (cubetower) {
            scene.remove(cubetower);
        }
        var cubetowerL = scene.getObjectByName("TL" + Tower.list[data.tower[i]].id);
        if (cubetowerL) {

            scene.remove(cubetowerL);
        }
        delete Tower.list[data.tower[i]];
    }
});

setInterval(function () {
    if (!selfId)
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
    for (var i in Damage.list)
        Damage.list[i].draw();
}, 30);

setInterval(function () {
    drawScoreboard();
}, 100);

var drawMap = function () {
    var player = Player.list[selfId];
    var x = player.x;
    var y = player.y;
    var ptrn = ctx.createPattern(Img.map[player.map], 'repeat');
    ctx.fillStyle = ptrn;
    //ctx.fillRect(x % 48, y % 48, WIDTH, HEIGHT);
    ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) - 960 * 2 - 48 + WIDTH / 2, (y * -2) % (960 * 2) - 960 * 1 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2); ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) + 960 * 0 - 48 + WIDTH / 2, (y * -2) % (960 * 2) - 960 * 1 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2); ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) + 960 * 2 - 48 + WIDTH / 2, (y * -2) % (960 * 2) - 960 * 1 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2);
    ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) - 960 * 2 - 48 + WIDTH / 2, (y * -2) % (960 * 2) + 960 * 1 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2); ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) + 960 * 0 - 48 + WIDTH / 2, (y * -2) % (960 * 2) + 960 * 1 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2); ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) + 960 * 2 - 48 + WIDTH / 2, (y * -2) % (960 * 2) + 960 * 1 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2);
    ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) - 960 * 2 - 48 + WIDTH / 2, (y * -2) % (960 * 2) + 960 * 3 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2); ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) + 960 * 0 - 48 + WIDTH / 2, (y * -2) % (960 * 2) + 960 * 3 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2); ctx.drawImage(Img.map[player.map], ((x * -2) % (960 * 2)) + 960 * 2 - 48 + WIDTH / 2, (y * -2) % (960 * 2) + 960 * 3 + 48, Img.map[player.map].width * 2, Img.map[player.map].height * 2);
}

var drawStats = function () {
    if (!selfId)
        return;
    //TODO don't use getElementById
    document.getElementById('panePos').innerHTML = "X: " + Math.round(Player.list[selfId].x) + "(" + Math.round(Player.list[selfId].x / 48) + ")" + " Y: " + Math.round(Player.list[selfId].y) + "(" + Math.round(Player.list[selfId].y / 48) + ")";
    document.getElementById('paneGold').innerHTML = "Gold: " + Player.list[selfId].gold + " RP: " + Player.list[selfId].research;
    document.getElementById('paneLevel').innerHTML = "Level: " + Player.list[selfId].score + "(" + Player.list[selfId].exp + "/" + Math.round(2500 + Math.pow(Player.list[selfId].score * 750, 1.1)) + ")";
    if (tech > techCR) techCR += Math.floor(1 + (tech - techCR) / 10);
    document.getElementById('paneTech').innerHTML = "Tech: " + techCR.toLocaleString();
    document.getElementById('paneHealth').innerHTML = "Pop: " + health.toLocaleString() + " / " + maxHealth.toLocaleString();
    document.getElementById('paneWave').innerHTML = "Morale: " + wave / 100;

    stockpile.updateResourceDisplays();
}

var drawScoreboard = function () {
    var text = "";

    text = "<table style='width:100%;'><tr><td style='width:18% !important;' id='scoreBoardtd'>Name</td><td style='width:6% !important;' id='scoreBoardtd'>Kills</td><td id='scoreBoardtd'>Physical</td><td id='scoreBoardtd'>Siege</td><td id='scoreBoardtd'>Arcane</td><td id='scoreBoardtd'>Heroic</td><td id='scoreBoardtd'>Elemental</td></tr>";
    for (var i in Player.list) {
        //console.log(Player.list[i].username + ": " + Player.list[i].scoreBoard);
        text += "<tr><td style='width:18% !important; color:" + Player.list[i].color + ";' id='scoreBoardtd'>" + Player.list[i].username + "</td><td style='width:6% !important;' id='scoreBoardtd'>" + Player.list[i].kills + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[0]) + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[1]) + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[2]) + "</td>" + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[3]) + "</td>" + "</td><td id='scoreBoardtd'>" + Math.round(Player.list[i].scoreBoard[4]) + "</td></tr>";
    }

    text += "</table>";
    document.getElementById('scoreBoard').innerHTML = text;
}
gameElement.onkeydown = function (event) {
    if (event.keyCode === 68)	//d
        fakePlayer.right = true;
    else if (event.keyCode === 83)	//s
        fakePlayer.down = true;
    else if (event.keyCode === 65) //a
        fakePlayer.left = true;
    else if (event.keyCode === 87) // w
        fakePlayer.up = true;

}
gameElement.onkeyup = function (event) {
    if (event.keyCode === 68)	//d
        fakePlayer.right = false;
    else if (event.keyCode === 83)	//s
        fakePlayer.down = false;
    else if (event.keyCode === 65) //a
        fakePlayer.left = false;
    else if (event.keyCode === 87) // w
        fakePlayer.up = false;
}

document.onmousedown = function (event) {
    //socket.emit('keyPress',{inputId:'attack',state:true});
}
document.onmouseup = function (event) {
    //socket.emit('keyPress',{inputId:'attack',state:false});
}
document.onmousemove = function (event) {
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.round(Math.atan2(y, x) / Math.PI * 4) * 45;
    socket.emit('keyPress', { inputId: 'mouseAngle', state: angle });
}

document.oncontextmenu = function (event) {
    event.preventDefault();
}

console.log("*Main Loaded");
loginScreen.showFrame();
loginScreen.setFramePosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');

loadDiv.style.display = 'none';
settingsDiv.style.display = 'none';
gameDiv.style.display = 'inline-block';
