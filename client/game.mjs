import entityManager from "entityManager";
import lightingManager from "lightingManager";
import particleManager from "particleManager";
import { LoadingScreen } from "loadingScreen";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { socket } from "singletons";
import { materialMap, envMap } from "constants";
import Stats from 'three/addons/libs/stats.module.js';
import frameManager from "frameManager";
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
entityManager.initialize(scene);
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

lightingManager.initialize(scene);

particleManager.initialize(scene);

var camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1.5, 900);

var fakePlayer = { left: false, right: false, up: false, down: false };

var renderer = new THREE.WebGLRenderer({ canvas: threejs, antialias: true });
var oldWidth = 0;
var oldHeight = 0;
renderer.setSize(window.innerWidth, window.innerHeight);

// Post-Processing
renderer.shadowMap.enabled = true; // Enables Shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//renderer.logarithmicDepthBuffer = true; // should address clipping

// Effect Composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Screen-Space Ambient Occlusion
const ssaoPass = new SSAOPass(scene, camera);
ssaoPass.samples = 16; // Increase for better quality, decrease for performance
ssaoPass.kernelRadius = 24; // Adjust kernel radius as needed
ssaoPass.rings = 7;
ssaoPass.distanceThreshold = 1.0;
ssaoPass.distanceFalloff = 0.0;
ssaoPass.rangeThreshold = 0.5;
ssaoPass.rangeFalloff = 0.1;
ssaoPass.luminanceInfluence = 0.8;
ssaoPass.radius = 2;
ssaoPass.scale = 5.5;
ssaoPass.bias = 5.5;
ssaoPass.minDistance = 0.0005;
ssaoPass.maxDistance = 0.8;
ssaoPass.depthAwareUpsampling = true;

composer.addPass(ssaoPass);

// Custom Tone Mapping Shader
const CustomToneMappingShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'toneMappingExposure': { value: 1.05 },
        'toneMappingWhitePoint': { value: 1.03 },
        'saturationAmount': { value: 1.15 },
        'contrastAmount': { value: 1.12 },
        'darknessAmount': { value: 0.98 },
        'gamma': { value: 2.2 } // Added gamma uniform
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float toneMappingExposure;
        uniform float toneMappingWhitePoint;
        uniform float saturationAmount;
        uniform float contrastAmount;
        uniform float darknessAmount;
        uniform float gamma;
        varying vec2 vUv;

        #define saturate(a) clamp( a, 0.0, 1.0 )
        #define Uncharted2Helper(x) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.0202 / 0.30, vec3( 0.0 ) )

        vec3 CustomToneMapping( vec3 color ) {
            color *= toneMappingExposure * darknessAmount;
            vec3 mappedColor = saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            
            // Increase contrast
            mappedColor = pow(mappedColor, vec3(contrastAmount));
            
            // Calculate luminance
            float luminance = dot(mappedColor, vec3(0.2126, 0.7152, 0.0722));
            
            // Increase saturation
            vec3 saturatedColor = mix(vec3(luminance), mappedColor, saturationAmount);
            
            // Apply gamma correction
            saturatedColor = pow(saturatedColor, vec3(1.0 / gamma));
            
            return saturatedColor;
        }

        void main() {
            vec4 color = texture2D( tDiffuse, vUv );
            color.rgb = CustomToneMapping( color.rgb );
            gl_FragColor = color;
        }
    `
};

// Tone Mapping Pass (including gamma correction)
const customToneMappingPass = new ShaderPass(new THREE.ShaderMaterial(CustomToneMappingShader));
composer.addPass(customToneMappingPass);

// Frame Manager
frameManager.initialize(renderer, scene);
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
        particleManager.spawnParticle("smoke",3,1,intersection.point.x,0,intersection.point.z,undefined);
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
grid.position.y = -0.001;
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
    if (currentTime - 50 > lastEmit) {
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
        composer.setPixelRatio(window.devicePixelRatio * renderScale / 100);
        camera.aspect = (window.innerWidth / window.innerHeight) * 1.06;
        camera.updateProjectionMatrix();
    }
    stats.begin();
    // TODO: Add option to enable/disable the composer and post-processing for performance/battery reasons.
    //renderer.render(scene, camera);
    composer.render();
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