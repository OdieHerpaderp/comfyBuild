import { EntityManager } from "entityManager";
import { LightingManager } from "lightingManager";
import { LoadingScreen } from "loadingScreen";
import { LoginScreen } from "loginScreen";
import { WorldInfo } from "worldInfo";
import { Chat } from "chat";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MapControls } from 'three/addons/controls/OrbitControls.js';
import { socket } from "singletons"
import { materialMap } from "constants";
import BuildingsFrame from "buildingsFrame";
import SettingsFrame from "settingsFrame";
import StockpileFrame from "stockpileFrame";
import { PlayerList } from "playerList";
import Stats from 'three/addons/libs/stats.module.js';

// Loading screen
let loadingScreen = new LoadingScreen();
loadingScreen.addEventListener("loadComplete", () => {
    gameDiv.style.display = 'inline-block';
    loginScreen.showFrame();
    loginScreen.setFramePosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');
    loadingScreen = undefined;
//    socket.emit('sendInit');
    
    animate();
});
document.body.appendChild(loadingScreen.domElement);

// World information
const worldInfo = new WorldInfo();

// Buildings
const buildingsFrame = new BuildingsFrame();

// Stockpile
const stockpile = new StockpileFrame();
socket.on('stockpile', function (data) {
    stockpile.updateResources(data);
});

// Chat
var chat = new Chat();

// Login
var loginScreen = new LoginScreen();
loginScreen.addEventListener("loginSuccessful", (data) => {
    if (data.detail) { entityManager.localPlayerId = data.detail };

    loginScreen.closeFrame();
    stockpile.showFrame();
    buildingsFrame.showFrame();
    settingsFrame.showFrame();
    buildingsFrame.setFramePosition(window.innerWidth - 4, window.innerHeight - 4, 'RIGHT_BOTTOM');
    chat.showFrame();
    chat.setFramePosition(4, window.innerHeight - 4, "LEFT_BOTTOM");
    playerList.showFrame();
    playerList.setFramePosition(window.innerWidth - 4, 4, "RIGHT_TOP");
    worldInfo.showFrame();
    worldInfo.setFramePosition(window.innerWidth / 2, 4, 'CENTER_TOP');
});

// Player list
var playerList = new PlayerList();

//ThreeJS
var scene = new THREE.Scene();

// Don't mind me, I just need the scene...
var entityManager = new EntityManager(scene);
entityManager.addEventListener("selectedBuildingChanged", (event) => {
    buildingsFrame.selectedBuildingChanged(event.detail.building);
});
entityManager.addEventListener("playerConnected", (event) => {
    playerList.addPlayer(event.detail.player);
});
entityManager.addEventListener("playerDisconnected", (event) => {
    playerList.removePlayer(event.detail.player);
});

var lightingManager = new LightingManager(scene);

var camera = new THREE.PerspectiveCamera(15, window.innerWidth / (window.innerHeight) * 1.15, 0.1, 1000);
camera.position.set(260, 100, 460);

var fakePlayer = { left: false, right: false, up: false, down: false };

var renderer = new THREE.WebGLRenderer({ canvas: threejs });
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize(window.innerWidth, window.innerHeight);

// Post-Processing
renderer.toneMapping = THREE.ACESFilmicToneMapping; //Default to Linear
renderer.toneMappingExposure = 0.8;
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.shadowMap.enabled = true; // Enables Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// Settings
const settingsFrame = new SettingsFrame(renderer, scene);

// Camera controls
const gameElement = document.getElementById("game");
// note: normally renderer.domElement is used, but that's hidden behind other elements so it doesn't capture mouse events.
const controls = new MapControls(camera, gameElement);
controls.target.x = 260;
controls.target.z = 260;
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

    var intersections = raycaster.intersectObject(grid);
    var intersection = (intersections.length > 0 ? intersections[0] : null);
    if (intersection) {
        socket.emit('fakePlayer', { x: intersection.point.x * 10, y: intersection.point.z * 10 });
    }
});

var size = 614.4;
// Get the maximum anisotropy value supported by the renderer
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

// Load the texture
var gridTexture = new THREE.TextureLoader().load('/client/img/grid.png');

// Set the wrap mode and repeat
gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
gridTexture.repeat.set(128, 128);

// Enable anisotropic filtering
gridTexture.anisotropy = Math.min(maxAnisotropy, 16);

// Create the material
var gridMaterial = new THREE.MeshStandardMaterial({
    color: '#EEEEEE',
    map: gridTexture,
    transparent: true,
    roughness: 0.99,
});

// Create the geometry and mesh
var gridGeometry = new THREE.PlaneGeometry(size, size, 1, 1);
var grid = new THREE.Mesh(gridGeometry, gridMaterial);

// Position and rotate the mesh
grid.position.x = size / 2 - 2.4;
grid.position.y = -0.13;
grid.position.z = size / 2 - 2.4;
grid.rotation.x = Math.PI * 1.5;

// Add the mesh to the scene
//grid.receiveShadow = true;
scene.add(grid);

const loader = new GLTFLoader();
var terrain;

loader.load('client/models/terrain.glb', function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            //child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    terrain = gltf.scene;
    terrain.receiveShadow = true;
    terrain.position.x = size / 2 - 2.4;
    terrain.position.y = -0.6;
    terrain.position.z = size / 2 - 2.4;

    // Traverse the scene and apply anisotropic filtering to all textures, also add materials
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            const materialName = child.material.name;
            if (materialMap[materialName]) {
                child.material = materialMap[materialName];
            }
            child.receiveShadow = true;
            child.material.map && (child.material.map.anisotropy = Math.min(maxAnisotropy, 16));
            child.material.emissiveMap && (child.material.emissiveMap.anisotropy = Math.min(maxAnisotropy, 16));
            child.material.roughnessMap && (child.material.roughnessMap.anisotropy = Math.min(maxAnisotropy, 16));
            child.material.metalnessMap && (child.material.metalnessMap.anisotropy = Math.min(maxAnisotropy, 16));
            child.material.normalMap && (child.material.normalMap.anisotropy = Math.min(maxAnisotropy, 16));
            // Add more texture types if needed
        }
    });

    scene.add(terrain);
}, undefined, function (error) {
    console.error(error);
});

// Global plane geom
//var textureSB = {};
////cubemap HDR
//new RGBELoader()
//    .setPath('/client/img/')
//    .load('morning.hdr', function (texture) {
//        texture.mapping = THREE.EquirectangularReflectionMapping;
//        texture.magFilter = THREE.LinearFilter;
//        texture.minFilter = THREE.LinearFilter;
//        //texture.generateMipmaps = true;
//        //scene.background = texture;
//        //scene.backgroundBlurriness = 2;
//        //scene.environment = texture;
//        textureSB["morning"] = texture;
//    });

new RGBELoader()
    .setPath('/client/textures/')
    .load('envMap.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //texture.generateMipmaps = true;
        scene.background = texture;
        scene.backgroundBlurriness = 0.9;
        scene.environment = texture;
        //textureSB["noon"] = texture;
    });

//new RGBELoader()
//    .setPath('/client/img/')
//    .load('evening.hdr', function (texture) {
//        texture.mapping = THREE.EquirectangularReflectionMapping;
//        texture.magFilter = THREE.LinearFilter;
//        texture.minFilter = THREE.LinearFilter;
//        //texture.generateMipmaps = true;
//        //scene.background = texture;
//        //scene.backgroundBlurriness = 2;
//        //scene.environment = texture;
//        textureSB["evening"] = texture;
//    });
//
//new RGBELoader()
//    .setPath('/client/img/')
//    .load('night.hdr', function (texture) {
//        texture.mapping = THREE.EquirectangularReflectionMapping;
//        texture.magFilter = THREE.LinearFilter;
//        texture.minFilter = THREE.LinearFilter;
//        //texture.generateMipmaps = true;
//        //scene.background = texture;
//        //scene.backgroundBlurriness = 2;
//        //scene.environment = texture;
//        textureSB["night"] = texture;
//    });

var targetFrameTime = 20;
var renderScale = 100;
var previousTime = 10;
var displayHealth = true;
var displayDamage = 2;

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
var deltaAvg = 0;
var deltaCount = 0;

var animate = function () {
    requestAnimationFrame(animate);
    var currentTime = new Date().getTime();
    var delta = currentTime - previousTime;
    deltaAvg += delta;
    deltaCount++;
    previousTime = currentTime;
    pollInputs(delta);

    controls.update();
    lightingManager.animationFrame(camera.position, controls.target);
    if (currentTime - 30 > lastEmit) {
        worldInfo.tick();
        stockpile.displayTick();
        buildingsFrame.displayTick();
        lightingManager.tick(delta, controls.target);
        lastEmit = currentTime;
    }

    if (oldWidth != window.innerWidth || oldHeight != window.innerHeight) {
        console.log("WE GON RESIZE");
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio * renderScale / 100);
        camera.aspect = (window.innerWidth / window.innerHeight) * 1.06;
        camera.updateProjectionMatrix();
    }
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
};

// Create a new Stats instance
const stats = new Stats();

// Align the stats panel to the top-left corner
stats.dom.style.position = 'absolute';
stats.dom.style.left = '0px';
stats.dom.style.top = '0px';

// Add the stats panel to the document body
document.body.appendChild(stats.dom);

var settingsDiv = document.getElementById('settingsDiv');
window.openSettings = function (e) {
    settingsDiv.style.display = 'initial';
}
window.closeSettings = function (e) {
    settingsDiv.style.display = 'none';
}

//UI
document.body.onkeydown = function (event) {
    if (event.target.tagName == "INPUT") { return; }
    if (event.keyCode === 68)	//d
        fakePlayer.right = true;
    else if (event.keyCode === 83)	//s
        fakePlayer.down = true;
    else if (event.keyCode === 65) //a
        fakePlayer.left = true;
    else if (event.keyCode === 87) // w
        fakePlayer.up = true;

}
document.body.onkeyup = function (event) {
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

socket.emit('sendInit');

console.log("*Main Loaded");