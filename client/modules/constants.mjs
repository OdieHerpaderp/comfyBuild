import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

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
const texStone = textureLoader.load('client/textures/buildings/stone.webp');
const texStoneNor = textureLoader.load('client/textures/buildings/stoneNor.jpg');
const texWood = textureLoader.load('client/textures/buildings/wood.webp');
const texWoodNor = textureLoader.load('client/textures/buildings/woodNor.webp');
const texIron = textureLoader.load('client/textures/buildings/iron.jpg');
const texIronNor = textureLoader.load('client/textures/buildings/ironNor.jpg');

const envMap = new RGBELoader()
    .setPath('/client/textures/')
    .load('envMap.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        //envMap = texture;
});

const materialMap = {
    'sand': new THREE.MeshStandardMaterial({
        color:"#dddddd",
        map: texSanddiff, // Set diffuse/color map
        normalMap: texSandNor,
        displacementMap: texSandDisp,
        displacementScale: 0.65, // Adjust displacement strength
        roughness: 0.95,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'grass': new THREE.MeshStandardMaterial({
        color:"#dddddd",
        map: texGrassdiff,
        normalMap: texGrassNor,
        displacementMap: texGrassDisp,
        displacementScale: 0.65,
        roughness: 0.95,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'rock': new THREE.MeshStandardMaterial({
        color:"#dddddd",
        map: texRockdiff,
        normalMap: texRockNor,
        displacementMap: texRockDisp,
        displacementScale: 0.65,
        roughness: 0.95,
        envMapIntensity: 0.015, // Reflect environment
    }),
    // Buildings
    'stone': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texStone,
        normalMap: texStoneNor,
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'wood': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texWood,
        normalMap: texWoodNor,
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'dirt': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texDirt,
        normalMap: texDirtNor,
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'iron': new THREE.MeshStandardMaterial({
        color:"#cecccc",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.22,
        metalness: 0.77,
        envMapIntensity: 0.2, // Reflect environment
    }),
    'steel': new THREE.MeshStandardMaterial({
        color:"#dfdddd",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.05,
        metalness: 0.88,
        envMapIntensity: 0.4, // Reflect environment
    }),
    'copper': new THREE.MeshStandardMaterial({
        color:"#ff9955",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.22,
        metalness: 0.77,
        envMapIntensity: 0.2, // Reflect environment
    }),
    'tin': new THREE.MeshStandardMaterial({
        color:"#88aaee",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.22,
        metalness: 0.77,
        envMapIntensity: 0.2, // Reflect environment
    }),
    'bronze': new THREE.MeshStandardMaterial({
        color:"#aa9922",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.12,
        metalness: 0.92,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'zinc': new THREE.MeshStandardMaterial({
        color:"#bbaa88",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'nickel': new THREE.MeshStandardMaterial({
        color:"#998844",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'sulphur': new THREE.MeshStandardMaterial({
        color:"#bbcc44",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'lead': new THREE.MeshStandardMaterial({
        color:"#661199",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'silver': new THREE.MeshStandardMaterial({
        color:"#ddddee",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.01,
        metalness: 0.99,
        envMapIntensity: 0.5, // Reflect environment
    }),
    'gold': new THREE.MeshStandardMaterial({
        color:"#ffcc55",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.01,
        metalness: 0.99,
        envMapIntensity: 0.5, // Reflect environment
    }),
    'invar': new THREE.MeshStandardMaterial({
        color:"#669911",
        map: texIron,
        normalMap: texIronNor,
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'glass': new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // Set the base color
        metalness: 0, // Non-metallic
        roughness: 0, // Smooth surface
        transmission: 0.9, // High transmission for glass
        transparent: true, // Enable transparency
        envMapIntensity: 0.3, // Reflect environment
        clearcoat: 1, // Add a clear coat layer
        clearcoatRoughness: 0 // Smooth clear coat
      })
};

export { materialMap, envMap };