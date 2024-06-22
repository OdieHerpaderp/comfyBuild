import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const textureLoader = new THREE.TextureLoader();

// Load terrain textures
const texGrassdiff = textureLoader.load('client/textures/grass.webp'); texGrassdiff.wrapS = texGrassdiff.wrapT = THREE.RepeatWrapping; texGrassdiff.repeat.set(32, 32);
const texGrassNor = textureLoader.load('client/textures/grassNor.jpg'); texGrassNor.wrapS = texGrassNor.wrapT = THREE.RepeatWrapping; texGrassNor.repeat.set(32, 32);
const texGrassDisp = textureLoader.load('client/textures/grassDis.jpg'); texGrassDisp.wrapS = texGrassDisp.wrapT = THREE.RepeatWrapping; texGrassDisp.repeat.set(32, 32);
const texSanddiff = textureLoader.load('client/textures/sand.jpg'); texSanddiff.wrapS = texSanddiff.wrapT = THREE.RepeatWrapping; texSanddiff.repeat.set(32, 32);
const texSandNor = textureLoader.load('client/textures/sandNor.jpg'); texSandNor.wrapS = texSandNor.wrapT = THREE.RepeatWrapping; texSandNor.repeat.set(32, 32);
const texSandDisp = textureLoader.load('client/textures/sandDis.jpg'); texSandDisp.wrapS = texSandDisp.wrapT = THREE.RepeatWrapping; texSandDisp.repeat.set(32, 32);
const texRockdiff = textureLoader.load('client/textures/rock.png'); texRockdiff.wrapS = texRockdiff.wrapT = THREE.RepeatWrapping; texRockdiff.repeat.set(32, 32);
const texRockNor = textureLoader.load('client/textures/rockNor.png'); texRockNor.wrapS = texRockNor.wrapT = THREE.RepeatWrapping; texRockNor.repeat.set(32, 32);
const texRockDisp = textureLoader.load('client/textures/rockDis.png'); texRockDisp.wrapS = texRockDisp.wrapT = THREE.RepeatWrapping; texRockDisp.repeat.set(32, 32);
const texSeaWater = textureLoader.load('client/textures/buildings/water.webp'); texSeaWater.wrapS = texSeaWater.wrapT = THREE.RepeatWrapping; texSeaWater.repeat.set(32, 32);
const texSeaWaterNor = textureLoader.load('client/textures/buildings/waterNor.webp'); texSeaWaterNor.wrapS = texSeaWaterNor.wrapT = THREE.RepeatWrapping; texSeaWaterNor.repeat.set(32, 32);

// Load building textures
const texDirt = textureLoader.load('client/textures/buildings/dirt.png');
const texDirtNor = textureLoader.load('client/textures/buildings/dirtNor.png');
const texStone = textureLoader.load('client/textures/buildings/stone.webp');
const texStoneNor = textureLoader.load('client/textures/buildings/stoneNor.webp');
const texShingles = textureLoader.load('client/textures/buildings/shingles.webp');
const texShinglesNor = textureLoader.load('client/textures/buildings/shinglesNor.webp');
const texSandStone = textureLoader.load('client/textures/buildings/sandStone.webp');
const texSandStoneNor = textureLoader.load('client/textures/buildings/sandStoneNor.webp');
const texWood = textureLoader.load('client/textures/buildings/wood.webp');
const texWoodNor = textureLoader.load('client/textures/buildings/woodNor.webp');
const texJade = textureLoader.load('client/textures/buildings/jade.webp');
const texJadeNor = textureLoader.load('client/textures/buildings/jadeNor.webp');
const texIron = textureLoader.load('client/textures/buildings/iron.jpg');
const texIronNor = textureLoader.load('client/textures/buildings/ironNor.webp');
const texHide = textureLoader.load('client/textures/buildings/hide.webp');
const texHideNor = textureLoader.load('client/textures/buildings/hideNor.webp');
const texLinen = textureLoader.load('client/textures/buildings/linen.webp');
const texLinenNor = textureLoader.load('client/textures/buildings/linenNor.webp');
const texWater = textureLoader.load('client/textures/buildings/water.webp');
const texWaterNor = textureLoader.load('client/textures/buildings/waterNor.webp');

const envMap = new RGBELoader()
    .setPath('/client/textures/')
    .load('envMap.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
});

const materialMap = {
    'sand': new THREE.MeshStandardMaterial({
        color:"#dddddd",
        map: texSanddiff, // Set diffuse/color map
        normalMap: texSandNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        displacementMap: texSandDisp,
        displacementScale: 0.65, // Adjust displacement strength
        roughness: 0.95,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'grass': new THREE.MeshStandardMaterial({
        color:"#dddddd",
        map: texGrassdiff,
        normalMap: texGrassNor,
        normalScale: new THREE.Vector2( 2, 2 ),
        displacementMap: texGrassDisp,
        displacementScale: 0.65,
        roughness: 0.95,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'rock': new THREE.MeshStandardMaterial({
        color:"#dddddd",
        map: texRockdiff,
        normalMap: texRockNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        displacementMap: texRockDisp,
        displacementScale: 0.65,
        roughness: 0.95,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'seaWater': new THREE.MeshPhysicalMaterial({
        color: 0xbbeeff,
        map: texSeaWater,
        normalMap: texSeaWaterNor,
        displacementMap: texRockDisp,
        displacementScale: 0.10,
        normalScale: new THREE.Vector2( 3, 3 ),
        metalness: 0,
        roughness: 0, // Smooth surface
        transmission: 0.8,
        opacity: 0.6,
        transparent: true, // Enable transparency
        envMapIntensity: 0.2, // Reflect environment
      }),
    // Buildings
    'stone': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texStone,
        normalMap: texStoneNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'sandStone': new THREE.MeshStandardMaterial({
        color:"#ffee99",
        map: texSandStone,
        normalMap: texSandStoneNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'shingles': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texShingles,
        normalMap: texShinglesNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'wood': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texWood,
        normalMap: texWoodNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'dirt': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texDirt,
        normalMap: texDirtNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'hide': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texHide,
        normalMap: texHideNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'linen': new THREE.MeshStandardMaterial({
        color:"#ffffff",
        map: texLinen,
        normalMap: texLinenNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.9,
        envMapIntensity: 0.015, // Reflect environment
    }),
    'iron': new THREE.MeshStandardMaterial({
        color:"#cecccc",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.22,
        metalness: 0.77,
        envMapIntensity: 0.2, // Reflect environment
    }),
    'steel': new THREE.MeshStandardMaterial({
        color:"#dfdddd",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.05,
        metalness: 0.88,
        envMapIntensity: 0.4, // Reflect environment
    }),
    'copper': new THREE.MeshStandardMaterial({
        color:"#ff9955",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.22,
        metalness: 0.77,
        envMapIntensity: 0.2, // Reflect environment
    }),
    'tin': new THREE.MeshStandardMaterial({
        color:"#88aaee",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.22,
        metalness: 0.77,
        envMapIntensity: 0.2, // Reflect environment
    }),
    'bronze': new THREE.MeshStandardMaterial({
        color:"#aa9922",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.12,
        metalness: 0.92,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'zinc': new THREE.MeshStandardMaterial({
        color:"#bbaa88",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'nickel': new THREE.MeshStandardMaterial({
        color:"#998844",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'sulphur': new THREE.MeshStandardMaterial({
        color:"#bbcc44",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'lead': new THREE.MeshStandardMaterial({
        color:"#661199",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'silver': new THREE.MeshStandardMaterial({
        color:"#ddddee",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 2, 2 ),
        roughness: 0.01,
        metalness: 0.99,
        envMapIntensity: 0.5, // Reflect environment
    }),
    'gold': new THREE.MeshStandardMaterial({
        color:"#ffcc55",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 2, 2 ),
        roughness: 0.01,
        metalness: 0.99,
        envMapIntensity: 0.5, // Reflect environment
    }),
    'invar': new THREE.MeshStandardMaterial({
        color:"#669911",
        map: texIron,
        normalMap: texIronNor,
        normalScale: new THREE.Vector2( 6, 6 ),
        roughness: 0.09,
        metalness: 0.99,
        envMapIntensity: 0.3, // Reflect environment
    }),
    'jade': new THREE.MeshStandardMaterial({
        color:"#ccffcc",
        map: texJade,
        normalMap: texJadeNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        roughness: 0.2,
        envMapIntensity: 0.1, // Reflect environment
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
      }),
      'water': new THREE.MeshPhysicalMaterial({
        color: 0xbbeeff, // Set the base color
        map: texWater,
        normalMap: texWaterNor,
        normalScale: new THREE.Vector2( 3, 3 ),
        metalness: 0,
        roughness: 0, // Smooth surface
        transmission: 0.8,
        opacity: 0.8,
        transparent: true, // Enable transparency
        envMapIntensity: 0.2, // Reflect environment
      })
};

export { materialMap, envMap };