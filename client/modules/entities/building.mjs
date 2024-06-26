import BaseEntity from "baseEntity";
import { modelCache } from "singletons";
import * as THREE from 'three';
import { Text } from 'troika-three-text'
import { materialMap, envMap } from "constants";
import { createDerivedMaterial } from 'troika-three-utils'
import {preloadFont} from 'troika-three-text'

preloadFont(
  {
    font: '/client/font/RobotoSlab-Bold.woff', 
    characters: 'abcdefghijklmnopqrstuvwxyz1234567890/>'
  },
  () => {
    console.log("Font preloaded!");
  }
)

export function createBillboardMaterial(baseMaterial, opts) {
  return createDerivedMaterial(
    baseMaterial,
    Object.assign(
      {
        vertexMainOutro: `
vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
vec3 scale = vec3(
  length(modelViewMatrix[0].xyz),
  length(modelViewMatrix[1].xyz),
  length(modelViewMatrix[2].xyz)
  );
// size attenuation: scale *= -mvPosition.z * 0.2;
mvPosition.xyz += position * scale;
gl_Position = projectionMatrix * mvPosition;
`
      },
      opts
    )
  )
}

class Building extends BaseEntity {
    _buildingType;
    get buildingType() {
        return this._buildingType;
    }
    set buildingType(value) {
        if (this._buildingType == value) { return; }
        this._buildingType = value;
        this.propertyChanged("buildingType", value);
    }
    _upgradeLevel;
    get upgradeLevel() {
        return this._upgradeLevel;
    }
    set upgradeLevel(value) {
        if (this._upgradeLevel == value) { return; }
        this._upgradeLevel = value;
        this.propertyChanged("upgradeLevel", value);
    }

    _targetLevel;
    get targetLevel() {
        return this._targetLevel;
    }
    set targetLevel(value) {
        if (this._targetLevel == value) { return; }
        this._targetLevel = value;
        this.propertyChanged("targetLevel", value);
    }

    _productionLevel;
    get productionLevel() {
        return this._productionLevel;
    }
    set productionLevel(value) {
        if (this._productionLevel == value) { return; }
        this._productionLevel = value;
        this.propertyChanged("productionLevel", value);
    }

    _workRemaining;
    get workRemaining() {
        return this._workRemaining;
    }
    set workRemaining(value) {
        if (this._workRemaining == value) { return; }
        this._workRemaining = value;
        this.propertyChanged("workRemaining", value);
    }

    _workCapacity;
    get workCapacity() {
        return this._workCapacity;
    }
    set workCapacity(value) {
        if (this._workCapacity == value) { return; }
        this._workCapacity = value;
        this.propertyChanged("workCapacity", value);
    }

    _workUsage;
    get workUsage() {
        return this._workUsage;
    }
    set workUsage(value) {
        if (this._workUsage == value) { return; }
        this._workUsage = value;
        this.propertyChanged("workUsage", value);
    }

    _buildingPhase;
    get buildingPhase() {
        return this._buildingPhase;
    }
    set buildingPhase(value) {
        if (this._buildingPhase == value) { return; }
        this._buildingPhase = value;
        this.propertyChanged("buildingPhase", value);
    }

    textSprite;

    constructor(initData) {
        super(initData);
        
        this.buildingType = initData.buildingType ?? "unknown";
        this.upgradeLevel = initData.upgradeLevel ?? 0;
        this.targetLevel = initData.targetLevel ?? this.upgradeLevel;
        this.productionLevel = initData.productionLevel ?? 1;
        this.workRemaining = initData.workRemaining ?? 0;
        this.workCapacity = initData.workCapacity ?? initData.maxWorkers ?? 0;
        this.workUsage = initData.workUsage ?? initData.currentWorkers ?? 0;
        this.buildingPhase = initData.buildingPhase ?? 0;

        let model = modelCache.getModel(this.buildingType);
        if (model) {
            // Use model if available
            this.mesh = model.clone();
            this.mesh.traverse ( function ( child )
            {
                if ( child.isMesh )
                {
                    const materialName = child.material.name;
                    if (materialMap[materialName]) {
                        child.material = materialMap[materialName];
                        if(materialName == "glass") { child.castShadow = false; }
                            else child.castShadow = true;
                    }
                    else{
                        // setup material to follow materialMap defaults
                        //child.material.color = "#ffffff";
                        child.material.roughness = 0.9;
                        child.material.envMapIntensity = 0.1; // Reflect environment
                        child.castShadow = true;
                    }
                    child.receiveShadow = true;
                    child.material.envMap = envMap;
                    child.material.needsUpdate = true;
                }
            });
        }
        else {
            model = modelCache.getModel('fallback');
            if (model) {
                // Use model if available
                this.mesh = model.clone();
            }
            this.mesh.traverse ( function ( child )
            {
                if ( child.isMesh )
                {
                    const materialName = child.material.name;
                    if (materialMap[materialName]) {
                        child.material = materialMap[materialName];
                        if(materialName == "glass") child.castShadow = false;
                            else child.castShadow = true;
                    }
                    child.material.envMap = envMap;
                    child.receiveShadow = true;
                    child.material.needsUpdate = true;
                }
            });
            // Sprite fallback
            let geometry = new THREE.PlaneGeometry(1.8, 1.8, 1.8);

            let texture = new THREE.TextureLoader().load('/client/img/buildings/' + this.buildingType + '.png');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);

            let material = new THREE.MeshLambertMaterial({ color: '#EEEEEE', map: texture, side: THREE.DoubleSide, transparent: true });
            let spriteMesh = new THREE.Mesh(geometry, material);
            spriteMesh.position.set(0, 1.1, 0);
            spriteMesh.rotation.x = 0 - Math.PI / 2;

            if (this.mesh) {
                this.mesh.add(spriteMesh);
            }
            else {
                this.mesh = spriteMesh;
            }
        }
        //this.mesh.castShadow = true;
        //this.mesh.receiveShadow = true;
        this.mesh.position.set(this.worldX, -0.01, this.worldY);

        // Text
        this.textSprite = new Text()

        // Turn text into a sprite so it faces the camera.
        let material = createBillboardMaterial(new THREE.MeshBasicMaterial());
        this.textSprite.text = this.upgradeLevel + "\n" + this.buildingType + "\n";
        this.textSprite.font = '/client/font/RobotoSlab-Bold.woff';
        this.textSprite.fontSize = 0.45;
        this.textSprite.fontWeight = 600;
        this.textSprite.lineHeight = 0.9;
        this.textSprite.material = material;
        this.textSprite.anchorX = "center";
        this.textSprite.textAlign = "center";
        this.textSprite.color = 0xFFFFFF;
        this.textSprite.outlineWidth = 0.03;

        // Update the rendering:
        this.textSprite.sync()

        this.textSprite.position.set(0, 3.4, 1.1);
        this.mesh.add(this.textSprite);

        // Foundation
        // TODO: add models for all ages
        let foundationModel = modelCache.getModel("foundation");
        if (foundationModel) {
            console.log("foundation");
            // Use model if available
            this.foundationMesh = foundationModel.clone();
            this.foundationMesh.traverse ( function ( child )
            {
                if ( child.isMesh )
                {
                    const materialName = child.material.name;
                    if (materialMap[materialName]) {
                        child.material = materialMap[materialName];
                        if(materialName == "glass") { child.castShadow = false; }
                            else child.castShadow = true;
                    }
                    child.material.envMap = envMap;
                    child.receiveShadow = true;
                    child.material.needsUpdate = true;
                }
            });
        }
        this.foundationMesh.position.set(0, 0, 0);
        this.mesh.add( this.foundationMesh );
    }

    update(data) {
        super.update(data);

        this.workRemaining = data.workRemaining ?? this.workRemaining;
        this.productionLevel = data.productionLevel ?? this.productionLevel;
        this.workCapacity = data.maxWorkers ?? this.workCapacity;
        this.workUsage = data.currentWorkers ?? this.workUsage;

        var textNeedsUpdate = false;
        if (data.upgradeLevel !== undefined && data.upgradeLevel !== this.upgradeLevel) {
            this.upgradeLevel = data.upgradeLevel;
            textNeedsUpdate = true;
        }
        if (data.targetLevel !== undefined && data.targetLevel !== this.targetLevel) {
            this.targetLevel = data.targetLevel;
            textNeedsUpdate = true;
        }
        if (data.buildingPhase !== undefined && data.buildingPhase !== this.buildingPhase) {
            this.buildingPhase = data.buildingPhase;
            textNeedsUpdate = true;
        }
        if (textNeedsUpdate) {
            this.updateText();
        };
    }

    updateText() {
        if (!this.textSprite) { return; }

        var levelText = Math.round(this.upgradeLevel);
        var statusText = "";
        if (this.targetLevel > this.upgradeLevel) {
            levelText += " > " + Math.round(this.targetLevel);
        }
        statusText = this.getPhaseString(this.buildingPhase);

        this.textSprite.text = ` \n${levelText}\n${this.buildingType}\n${statusText}`;
    }

    getPhaseString(num) {
        if(num == 0) return "wait...";
        else if(num == 1) return "buildCon";
        else if(num == 2) return "build";
        else if(num == 3) return "consume";
        else if(num == 4) return "produce";
        else return "i dunno lol";
    }
}

export { Building };
export default Building;