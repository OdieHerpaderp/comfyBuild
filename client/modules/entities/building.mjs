import BaseEntity from "baseEntity";
import { modelCache } from "singletons";
import * as THREE from 'three';
import TextSprite from '@seregpie/three.text-sprite';
import { materialMap } from "constants";

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
        
        this.buildingType = initData.towerType ?? initData.buildingType ?? "unknown";
        this.upgradeLevel = initData.upgradeLevel ?? 0;
        this.targetLevel = initData.targetLevel ?? this.upgradeLevel;
        this.productionLevel = initData.productionLevel ?? 1;
        this.workRemaining = initData.workRemaining ?? 0;
        this.workCapacity = initData.workCapacity ?? 0;
        this.workUsage = initData.workUsage ?? 0;
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
                    child.receiveShadow = true;
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
                    child.receiveShadow = true;
                }
            });
            // Sprite fallback
            let geometry = new THREE.PlaneGeometry(1.8, 1.8, 1.8);

            let texture = new THREE.TextureLoader().load('/client/img/towers/' + this.buildingType + '.png');
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
        this.mesh.position.set(this.worldX, -0.16, this.worldY - 0.01);

        // Bottom plane
        {
            let geometry = new THREE.PlaneGeometry(4.5, 4.5, 1, 1);
            let texture = new THREE.TextureLoader().load('/client/img/towerplane' + initData.bulletType + '.png');
            let material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            let planemesh = new THREE.Mesh(geometry, material);

            planemesh.position.set(0, 0, -0.01);
            planemesh.rotation.x = 0 - Math.PI / 2;

            //this.mesh.add(planemesh);
        }

        // Text
        this.textSprite = new TextSprite({
            alignment: 'center',
            color: '#fff',
            fontFamily: 'Roboto Slab',
            fontSize: 0.50,
            lineGap: 0.02,
            strokeColor: '#000',
            strokeWidth: 0.15,
            text: this.upgradeLevel + "\n" + this.buildingType + "\n" ,
        });

        this.textSprite.position.set(0, 3.4, 1.1);
        this.mesh.add(this.textSprite);
    }

    update(data) {
        super.update(data);

        this.workRemaining = data.workRemaining ?? this.workRemaining;
        this.productionLevel = data.productionLevel ?? this.productionLevel;
        this.workCapacity = data.workCapacity ?? this.workCapacity;
        this.workUsage = data.workUsage ?? this.workUsage;

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