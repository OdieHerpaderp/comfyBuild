import { EntityManager } from "entityManager";
import { LightingManager } from "lightingManager";
import { ParticleManager } from "particleManager";
import { LoadingScreen } from "loadingScreen";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { socket } from "singletons";
import { materialMap, envMap } from "constants";
import Stats from 'three/addons/libs/stats.module.js';
import FrameManager from "frameManager";
import serverSettings from "serverSettings";
import researchManager from "researchManager";

researchManager.initialize();

// Loading screen
let loadingScreen = new LoadingScreen();
loadingScreen.addEventListener("loadComplete", () => {
    gameDiv.style.display = 'inline-block';
    frameManager.loadComplete();
    particleManager.addParticleGroup();
    //loginScreen.showFrame();
    //loginScreen.setFramePosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_CENTER');
    loadingScreen = undefined;
    //    socket.emit('sendInit');

    animate();
});
document.body.appendChild(loadingScreen.domElement);

//ThreeJS
var scene = new THREE.Scene();

// Don't mind me, I just need the scene...
var entityManager = new EntityManager(scene);
entityManager.addEventListener("selectedBuildingChanged", (event) => {
    frameManager.buildingsFrame.selectedBuildingChanged(event.detail.building);
});
entityManager.addEventListener("selectedResourceNodeChanged", (event) => {
    frameManager.buildingsFrame.selectedResourceNodeChanged(event.detail.resourceNode);
});
entityManager.addEventListener("playerConnected", (event) => {
    frameManager.playerList.addPlayer(event.detail.player);
});
entityManager.addEventListener("playerDisconnected", (event) => {
    frameManager.playerList.removePlayer(event.detail.player);
});

var lightingManager = new LightingManager(scene);

var particleManager = new ParticleManager(scene);

var camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1.5, 900);

var fakePlayer = { left: false, right: false, up: false, down: false };

var renderer = new THREE.WebGLRenderer({ canvas: threejs, antialias: true });
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize(window.innerWidth, window.innerHeight);

// Post-Processing
THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
    'vec3 CustomToneMapping( vec3 color ) { return color; }',

    `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.0206 / 0.30, vec3( 0.0 ) )

    float toneMappingWhitePoint = 1.0;
    float saturationAmount = 1.2; // Adjust this value to increase or decrease saturation

    vec3 CustomToneMapping( vec3 color ) {
        color *= toneMappingExposure;
        vec3 mappedColor = saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
        
        // Increase saturation
        float luminance = dot(mappedColor, vec3(0.2126, 0.7152, 0.0722));
        vec3 saturatedColor = mix(vec3(luminance), mappedColor, saturationAmount);
        
        return saturatedColor;
    }`
)

renderer.toneMapping = THREE.CustomToneMapping; //Default to Linear
renderer.toneMappingExposure = 1.5;
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true; // Enables Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.logarithmicDepthBuffer = true; // should address clipping

// Frame Manager
const frameManager = new FrameManager(renderer, scene);
frameManager.addEventListener("loginSuccessful", data => {
    if (data.detail) { 
        entityManager.localPlayerId = data.detail;
    };
});

// Camera controls
const gameElement = document.getElementById("game");
// note: normally renderer.domElement is used, but that's hidden behind other elements so it doesn't capture mouse events.
const controls = new MapControls(camera, gameElement);
controls.target.x = 54;
controls.target.y = 0;
controls.target.z = 54;
controls.maxDistance = 128;
controls.minDistance = 3;
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.4;
controls.mouseButtons = {
    RIGHT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.ROTATE
};
camera.position.set(54, 10, 100);

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
        socket.emit('fakePlayer', { x: intersection.point.x, y: intersection.point.z });
        particleManager.spawnParticle("fire",3,1,intersection.point.x,0,intersection.point.z,undefined);
    }
});

// Get the maximum anisotropy value supported by the renderer
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

// Load the texture
var gridTexture = new THREE.TextureLoader().load('/client/img/grid.png');

// Set the wrap mode and repeat
gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
gridTexture.repeat.set(serverSettings.mapWidth, serverSettings.mapHeight);

// Enable anisotropic filtering
gridTexture.anisotropy = Math.min(maxAnisotropy, 16);

// Create the material
var gridMaterial = new THREE.MeshStandardMaterial({
    color: '#EEEEEE',
    map: gridTexture,
    transparent: true,
    roughness: 0.99,
    depthWrite: false,
});

// Create the geometry and mesh
var gridGeometry = new THREE.PlaneGeometry(serverSettings.mapWidth, serverSettings.mapHeight, 1, 1);
var grid = new THREE.Mesh(gridGeometry, gridMaterial);

// Position and rotate the mesh
grid.position.x = serverSettings.mapWidth / 2 - .5;
grid.position.y = 0;
grid.position.z = serverSettings.mapHeight / 2 - .5;
grid.rotation.x = Math.PI * 1.5;

// Add the mesh to the scene
//grid.receiveShadow = true;
scene.add(grid);

//scene.background = envMap;
//scene.backgroundBlurriness = 0.9;
//scene.environment = envMap;

const loader = new GLTFLoader();
var terrain;

loader.load('client/models/terrain.glb', function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            //child.castShadow = true;
            child.material.envMap = envMap;
            child.receiveShadow = true;
        }
    });
    terrain = gltf.scene;
    terrain.receiveShadow = true;
    terrain.scale.x = 1/4.8;
    terrain.scale.y = 1/4.8;
    terrain.scale.z = 1/4.8;
    terrain.position.x = serverSettings.mapWidth / 2 - 0.5;
    terrain.position.y = -0.12;
    terrain.position.z = serverSettings.mapHeight / 2 - 0.5;
    

    // Traverse the scene and apply anisotropic filtering to all textures, also add materials
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            const materialName = child.material.name;
            if (materialMap[materialName]) {
                child.material = materialMap[materialName];
            }
            //if (materialName == "seaWater") return;
            child.receiveShadow = true;
            child.material.envMap = envMap;
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
    particleManager.animateParticles(delta);
    pollInputs(delta);

    controls.update();
    lightingManager.animationFrame(camera.position, controls.target);
    if (currentTime - 60 > lastEmit) {
        frameManager.displayTick();
        lightingManager.tick(delta, camera.position, controls.target);
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