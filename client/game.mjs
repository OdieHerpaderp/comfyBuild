import { EntityManager } from "entityManager";
import { ResourceList } from "resourceList";
import { LoginScreen } from "loginScreen";
import { Chat } from "chat";
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MapControls } from 'three/addons/controls/OrbitControls.js';
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

// Don't mind me, I just need the scene...
var entityManager = new EntityManager(scene);

var camera = new THREE.PerspectiveCamera(15, window.innerWidth / (window.innerHeight - 44) * 1.15, 0.1, 1000);
camera.position.z = 5;
var fakePlayer = { left: false, right: false, up: false, down: false };

var renderer = new THREE.WebGLRenderer({ canvas: threejs });
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize(window.innerWidth, window.innerHeight - 44);

// Camera controls
const gameElement = document.getElementById("game");
// note: normally renderer.domElement is used, but that's hidden behind other elements so it doesn't capture mouse events.
const controls = new MapControls(camera, gameElement);
controls.maxDistance = 750;
controls.minDistance = 50;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.4;
controls.mouseButtons = {
    RIGHT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.ROTATE
};

var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.1;

gameElement.addEventListener('click', (event) => {
    // now left click selects whichever tile you click, as panning is moved to right click
    let boundingRect = renderer.domElement.getBoundingClientRect();

    raycaster.setFromCamera({
        x: (((event.clientX - boundingRect.left) / boundingRect.width) * 2) - 1,
        y: - (((event.clientY - boundingRect.top) / boundingRect.height) * 2) + 1
    }, camera);

    var intersections = raycaster.intersectObject(floor);
    var intersection = (intersections.length > 0 ? intersections[0] : null);
    if (intersection) {
        socket.emit('fakePlayer', { x: intersection.point.x * 10, y: intersection.point.z * 10 });
    }
});

// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
var floorTexture = new THREE.ImageUtils.loadTexture('/client/img/ground.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(16, 16);
var floorTextureN = new THREE.ImageUtils.loadTexture('/client/img/groundN.jpg');
floorTextureN.wrapS = floorTextureN.wrapT = THREE.RepeatWrapping;
floorTextureN.repeat.set(16, 16);
// DoubleSide: render texture on both sides of mesh
var size = 614.4;
var floorMaterial = new THREE.MeshStandardMaterial({ color: '#ccddcc', map: floorTexture, normalMap: floorTextureN, roughness: 0.6, });
var floorGeometry = new THREE.PlaneGeometry(size, size, 1, 1);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.x = size / 2 - 2.4;
floor.position.y = -0.17;
floor.position.z = size / 2 - 2.4;
floor.rotation.z = Math.PI / 2;
floor.rotation.x = Math.PI * 1.5;
scene.add(floor);

var gridTexture = new THREE.ImageUtils.loadTexture('/client/img/grid.png');
gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
gridTexture.repeat.set(128, 128);
// DoubleSide: render texture on both sides of mesh
var gridMaterial = new THREE.MeshStandardMaterial({ color: '#EEEEEE', map: gridTexture, transparent: true, roughness: 0.99, });
var gridGeometry = new THREE.PlaneGeometry(size, size, 1, 1);
var grid = new THREE.Mesh(gridGeometry, gridMaterial);
grid.position.x = size / 2 - 2.4;
grid.position.y = -0.16;
grid.position.z = size / 2 - 2.4;
grid.rotation.x = Math.PI * 1.5;
scene.add(grid);

// Global plane geom
var directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.x = -1100;
directionalLight.position.y = 1700;
directionalLight.position.z = 1100;
directionalLight.name = "Direc";
directionalLight.target.position.set(0, -200, 0); // (x, y, z)
scene.add(directionalLight);
scene.add(directionalLight.target);

const light = new THREE.HemisphereLight(0xffffff, 0x77ff77, 0.9);
scene.add(light);

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
var animate = function () {
    requestAnimationFrame(animate);
    var currentTime = new Date().getTime();
    var delta = currentTime - previousTime;
    avgDelta = Math.min((avgDelta * 2 + delta + targetFrameTime * 2) / 5, 250);
    previousTime = currentTime;
    pollInputs(delta);

    controls.update();

    if (currentTime - 30 > lastEmit) {
        drawStats();
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
    // TODO: move to a module and rename to the actual values
    if (data.health !== undefined) {
        health = data.health;
    }
    if (data.maxHealth !== undefined) {
        maxHealth = data.maxHealth;
    }
    if (data.tech !== undefined) {
        tech = data.tech;
    }
});

//UI
var Player = function (initPack) {
    var self = {};
    self.id = initPack.id;
    self.color = initPack.color;
    self.number = initPack.number;
    self.username = initPack.username;
    self.x = initPack.x;
    self.y = initPack.y;
    self.scoreBoard = [];

    Player.list[self.id] = self;
    return self;
}
Player.list = {};

var Tower = function (initPack) {
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;
    self.towerType = initPack.towerType;

    Tower.list[self.id] = self;
    return self;
}
Tower.list = {};

var selfId = null;

var firstInit = true;
socket.on('init', function (data) {
    if (data.selfId) selfId = data.selfId;
    //{ player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], bullet: []}
    for (var i = 0; i < data.player.length; i++) {
        // TODO: tooltips still use this...
        new Player(data.player[i]);
    }
    for (var i = 0; i < data.tower.length; i++) {
        // TODO: fix tooltip logic and initial camera position logic
        if (firstInit && data.tower[i].towerType == "headquarters") {
            firstInit = false;
            controls.target.x = data.tower[i].x / 10;
            controls.target.z = data.tower[i].y / 10;
            camera.position.set(data.tower[i].x / 10, 100, (data.tower[i].y / 10) + 200);
            controls.update();
        }
        new Tower(data.tower[i]);
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
        }
    }

    // TODO: move tooltip logic somewhere else
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
        delete Player.list[data.player[i]];
    }
    for (var i = 0; i < data.tower.length; i++) {
        delete Tower.list[data.tower[i]];
    }
});

setInterval(function () {
    drawScoreboard();
}, 100);

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

document.oncontextmenu = function (event) {
    event.preventDefault();
}

console.log("*Main Loaded");
loginScreen.showFrame();
loginScreen.setFramePosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');

loadDiv.style.display = 'none';
settingsDiv.style.display = 'none';
gameDiv.style.display = 'inline-block';
