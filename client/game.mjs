import { EntityManager } from "entityManager";
import { ResourceList } from "resourceList";
import { LoadingScreen } from "loadingScreen";
import { LoginScreen } from "loginScreen";
import { WorldInfo } from "worldInfo";
import { Chat } from "chat";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MapControls } from 'three/addons/controls/OrbitControls.js';
import { socket } from "singletons"
import BuildingsFrame from "buildingsFrame";
import { PlayerList } from "playerList";

// Loading screen
let loadingScreen = new LoadingScreen();
loadingScreen.addEventListener("loadComplete", () => {
    gameDiv.style.display = 'inline-block';
    loginScreen.showFrame();
    loginScreen.setFramePosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');
    loadingScreen = undefined;
});
document.body.appendChild(loadingScreen.domElement);

// World information
var worldInfo = new WorldInfo();

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
    buildingsFrame.setFramePosition(window.innerWidth - 4, window.innerHeight - 4, 'RIGHT_BOTTOM');
    chat.showFrame();
    chat.setFramePosition(4, window.innerHeight - 4, "LEFT_BOTTOM");
    playerList.showFrame();
    playerList.setFramePosition(window.innerWidth - 4, 4, "RIGHT_TOP");
    worldInfo.showFrame();
});

// Player list
var playerList = new PlayerList();

//ThreeJS
var scene = new THREE.Scene();

// Don't mind me, I just need the scene...
var entityManager = new EntityManager(scene);
entityManager.addEventListener("selectedBuildingChanged", (event) => {
    buildingsFrame.updateDisplay(event.detail.building);
});
entityManager.addEventListener("playerConnected", (event) => {
    playerList.addPlayer(event.detail.player);
});
entityManager.addEventListener("playerDisconnected", (event) => {
    playerList.removePlayer(event.detail.player);
});

var camera = new THREE.PerspectiveCamera(15, window.innerWidth / (window.innerHeight) * 1.15, 0.1, 1000);
camera.position.set(260, 100, 460);

var fakePlayer = { left: false, right: false, up: false, down: false };

var renderer = new THREE.WebGLRenderer({ canvas: threejs });
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enables Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

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
    gltf.scene.traverse ( function ( child )
{
    if ( child.isMesh )
    {
        //child.castShadow = true;
        child.receiveShadow = true;
    }
});
    terrain = gltf.scene;
    terrain.receiveShadow = true;
    terrain.position.x = size / 2 - 2.4;
    terrain.position.y = -0.16;
    terrain.position.z = size / 2 - 2.4;

    // Traverse the scene and apply anisotropic filtering to all textures
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
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
var directionalLight = new THREE.DirectionalLight(0xfffefa, 2.2);
directionalLight.name = "Direc";
directionalLight.position.set(222, 222, 222); // (x, y, z)
directionalLight.target.position.set(110, 0, 110); // (x, y, z)
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -40;
directionalLight.shadow.camera.right = 40;
directionalLight.shadow.camera.top = 40;
directionalLight.shadow.camera.bottom = -40;
directionalLight.shadow.zoom = 5.1;
directionalLight.shadow.mapSize.width = 2048; // default 512
directionalLight.shadow.mapSize.height = 2048; // default 512
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 400; // default 500

scene.add(directionalLight);
scene.add(directionalLight.target);

//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
scene.add( helper );




const light = new THREE.HemisphereLight(0xddeeff, 0x225522, 0.1);
//scene.add(light);

// Create a point light
const pointLight = new THREE.PointLight(0xeeeeee);
pointLight.position.set(0, 0, 0);
pointLight.intensity = 0.8;
//pointLight.castShadow = true;

// Add the point light to the scene
//scene.add(pointLight);
var textureSB = {};
//cubemap HDR
new RGBELoader()
    .setPath('/client/img/')
    .load('morning.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //texture.generateMipmaps = true;
        //scene.background = texture;
        //scene.backgroundBlurriness = 2;
        //scene.environment = texture;
        textureSB["morning"] = texture;
});

new RGBELoader()
    .setPath('/client/img/')
    .load('noon.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //texture.generateMipmaps = true;
        //scene.background = texture;
        //scene.backgroundBlurriness = 2;
        //scene.environment = texture;
        textureSB["noon"] = texture;
});

new RGBELoader()
    .setPath('/client/img/')
    .load('evening.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //texture.generateMipmaps = true;
        //scene.background = texture;
        //scene.backgroundBlurriness = 2;
        //scene.environment = texture;
        textureSB["evening"] = texture;
});

new RGBELoader()
    .setPath('/client/img/')
    .load('night.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //texture.generateMipmaps = true;
        //scene.background = texture;
        //scene.backgroundBlurriness = 2;
        //scene.environment = texture;
        textureSB["night"] = texture;
});


const buttonSkybox = document.getElementById("testA");
buttonSkybox.addEventListener('click', (event) => {
    console.log("2k");
    scene.background = textureSB["2k"];
    scene.environment = textureSB["2k"];
});

const buttonSkyboxB = document.getElementById("testB");
buttonSkyboxB.addEventListener('click', (event) => {
    console.log("8k");
    scene.background = textureSB["8k"];
    scene.environment = textureSB["8k"];
});

const buttonSkyboxC = document.getElementById("testC");
buttonSkyboxC.addEventListener('click', (event) => {
    console.log("original");
    scene.background = textureSB["original"];
    scene.environment = textureSB["original"];
});

const buttonSkyboxD = document.getElementById("testD");
buttonSkyboxD.addEventListener('click', (event) => {
    console.log("old");
    scene.background = textureSB["old"];
    scene.environment = textureSB["old"];
});

// Call this function to change the environmentmap based on time of day.
function updateEnvironmentMap(hour) {
    // Validate the input hour
    if (hour < 0 || hour > 23) {
      console.error("Invalid hour value. Please provide a value between 0 and 23.");
      return;
    }
  
    // Check if all textures have been loaded
    if (textureSB.morning && textureSB.noon && textureSB.evening && textureSB.night) {
        if (hour > 18) {
            scene.background = textureSB["evening"];
            scene.environment = textureSB["evening"];
        }
        else if (hour > 12) {
            scene.background = textureSB["noon"];
            scene.environment = textureSB["noon"];
        }
        else if (hour > 6) {
            scene.background = textureSB["morning"];
            scene.environment = textureSB["morning"];
        }
        else {
            scene.background = textureSB["night"];
            scene.environment = textureSB["night"];
        }
    } 
    else { console.warn("Textures are still loading..."); }
}

var targetFrameTime = 20;
var renderScale = 100;
var previousTime = 10;
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
var deltaAvg = 0;
var deltaCount = 0;
var minute = 0;
var hour = 6;
var animate = function () {
    requestAnimationFrame(animate);
    var currentTime = new Date().getTime();
    var delta = currentTime - previousTime;
    deltaAvg += delta;
    deltaCount++;
    previousTime = currentTime;
    pollInputs(delta);

    controls.update();

    if (currentTime - 30 > lastEmit) {
        worldInfo.tick();
        stockpile.updateResourceDisplays();
        lastEmit = currentTime;
        if(minute >= 59) { 
            if(hour >= 23) hour = 0;
            else hour++;
            minute = 0;
            console.log("Time is " + hour + ":" + minute);
        }
        else minute++;
        updateEnvironmentMap(hour)
    }

    directionalLight.position.set(controls.target.x - 111 + hour * 11, 122, controls.target.z + 188); // (x, y, z)
    directionalLight.target.position.set(controls.target.x, 0, controls.target.z); // (x, y, z)
    pointLight.position.set(controls.target.x, (20 + camera.position.y) / 2, controls.target.z + 10);

    if (delta > 45 + targetFrameTime) document.getElementById('fpsCounter').style.color = "red";
    if (delta > 30 + targetFrameTime) document.getElementById('fpsCounter').style.color = "orange";
    else if (delta > 15 + targetFrameTime) document.getElementById('fpsCounter').style.color = "yellow";
    else document.getElementById('fpsCounter').style.color = "white";

    document.getElementById('fpsCounter').innerHTML = "Fps: " + Math.round(1000 / (deltaAvg / deltaCount));
    if (deltaCount >= 20) {
        deltaCount /= 2;
        deltaAvg /= 2;
    }  

    //cube.rotation.x += 0.01;
    if (oldWidth != window.innerWidth || oldHeight != window.innerHeight) {
        console.log("WE GON RESIZE");
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio * renderScale / 100);
        camera.aspect = (window.innerWidth / window.innerHeight) * 1.06;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
};

animate();

var settingsDiv = document.getElementById('settingsDiv');
window.openSettings = function (e) {
    settingsDiv.style.display = 'initial';
}
window.closeSettings = function (e) {
    settingsDiv.style.display = 'none';
}

//UI
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

socket.emit('sendInit');