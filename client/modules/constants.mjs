import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

// Load terrain textures
const texGrassdiff = textureLoader.load('client/textures/grass.jpg'); texGrassdiff.wrapS = texGrassdiff.wrapT = THREE.RepeatWrapping; texGrassdiff.repeat.set(32, 32);
const texGrassNor = textureLoader.load('client/textures/grassNor.jpg'); texGrassNor.wrapS = texGrassNor.wrapT = THREE.RepeatWrapping; texGrassNor.repeat.set(32, 32);
const texGrassDisp = textureLoader.load('client/textures/grassDis.jpg'); texGrassDisp.wrapS = texGrassDisp.wrapT = THREE.RepeatWrapping; texGrassDisp.repeat.set(32, 32);
const texSanddiff = textureLoader.load('client/textures/sand.jpg'); texSanddiff.wrapS = texSanddiff.wrapT = THREE.RepeatWrapping; texSanddiff.repeat.set(32, 32);
const texSandNor = textureLoader.load('client/textures/sandNor.jpg'); texSandNor.wrapS = texSandNor.wrapT = THREE.RepeatWrapping; texSandNor.repeat.set(32, 32);
const texSandDisp = textureLoader.load('client/textures/sandDis.jpg'); texSandDisp.wrapS = texSandDisp.wrapT = THREE.RepeatWrapping; texSandDisp.repeat.set(32, 32);
const texRockdiff = textureLoader.load('client/textures/rock.png'); texRockdiff.wrapS = texRockdiff.wrapT = THREE.RepeatWrapping; texRockdiff.repeat.set(32, 32);
const texRockNor = textureLoader.load('client/textures/rockNor.png'); texRockNor.wrapS = texRockNor.wrapT = THREE.RepeatWrapping; texRockNor.repeat.set(32, 32);
const texRockDisp = textureLoader.load('client/textures/rockDis.png'); texRockDisp.wrapS = texRockDisp.wrapT = THREE.RepeatWrapping; texRockDisp.repeat.set(32, 32);

// Load building textures
const texDirt = textureLoader.load('client/textures/buildings/dirt.png');
const texDirtNor = textureLoader.load('client/textures/buildings/dirtNor.png');
const texStone = textureLoader.load('client/textures/buildings/stone.png');
const texStoneNor = textureLoader.load('client/textures/buildings/stoneNor.png');
const texWood = textureLoader.load('client/textures/buildings/wood.png');
const texWoodNor = textureLoader.load('client/textures/buildings/woodNor.png');
const texIron = textureLoader.load('client/textures/buildings/iron.jpg');
const texIronNor = textureLoader.load('client/textures/buildings/ironNor.jpg');
const texCopper = textureLoader.load('client/textures/buildings/copper.jpg');
const texCopperNor = textureLoader.load('client/textures/buildings/ironNor.jpg');

const materialMap = {
    'sand': new THREE.MeshStandardMaterial({
        color:"#aaaaaa",
        map: texSanddiff, // Set diffuse/color map
        normalMap: texSandNor,
        displacementMap: texSandDisp,
        displacementScale: 0.7, // Adjust displacement strength
        roughness: 0.9
    }),
    'grass': new THREE.MeshStandardMaterial({
        color:"#aaaaaa",
        map: texGrassdiff,
        normalMap: texGrassNor,
        displacementMap: texGrassDisp,
        displacementScale: 0.7,
        roughness: 0.9
    }),
    'rock': new THREE.MeshStandardMaterial({
        color:"#aaaaaa",
        map: texRockdiff,
        normalMap: texRockNor,
        displacementMap: texRockDisp,
        displacementScale: 0.7,
        roughness: 0.9
    }),
    // Buildings
    'stone': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texStone,
        normalMap: texStoneNor,
        roughness: 0.9
    }),
    'wood': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texWood,
        normalMap: texWoodNor,
        roughness: 0.9
    }),
    'dirt': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texDirt,
        normalMap: texDirtNor,
        roughness: 0.9
    }),
    'iron': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.4,
        metalness: 0.4,
        envMapIntensity: 1, // Reflect environment
    }),
    'copper': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texCopper,
        normalMap: texCopperNor,
        roughness: 0.4,
        metalness: 0.4,
        envMapIntensity: 1, // Reflect environment
    }),
    'glass': new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // Set the base color
        metalness: 0, // Non-metallic
        roughness: 0, // Smooth surface
        transmission: 0.9, // High transmission for glass
        transparent: true, // Enable transparency
        envMapIntensity: 1, // Reflect environment
        clearcoat: 1, // Add a clear coat layer
        clearcoatRoughness: 0 // Smooth clear coat
      })
};

export { materialMap };