import BaseEntity from "baseEntity";
import { modelCache } from "singletons";
import * as THREE from 'three';
import TextSprite from '@seregpie/three.text-sprite';

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

    _workRemaining;
    get workRemaining() {
        return this._workRemaining;
    }
    set workRemaining(value) {
        if (this._workRemaining == value) { return; }
        this._workRemaining = value;
        this.propertyChanged("workRemaining", value);
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

        this.buildingType = initData.towerType ?? "unknown";
        this.upgradeLevel = initData.upgradeLevel ?? 0;
        this.targetLevel = initData.targetLevel ?? this.upgradeLevel;
        this.workRemaining = initData.workRemaining ?? 0;
        this.buildingPhase = initData.buildingPhase ?? 0;

        let model = modelCache.getModel(this.buildingType);
        if (model) {
            // Use model if available
            this.mesh = model.clone();
            this.mesh.traverse ( function ( child )
            {
                if ( child.isMesh )
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
        else {
            model = modelCache.getModel('fallback');
            if (model) {
                // Use model if available
                this.mesh = model.clone();
                this.mesh.castShadow = true;
                this.mesh.receiveShadow = true;
            }
            this.mesh.traverse ( function ( child )
            {
                if ( child.isMesh )
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            // Sprite fallback
            let geometry = new THREE.PlaneGeometry(1.4, 1.4, 1.4);

            let texture = new THREE.TextureLoader().load('/client/img/towers/' + this.buildingType + '.png');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);

            let material = new THREE.MeshLambertMaterial({ color: '#EEEEEE', map: texture, side: THREE.DoubleSide, transparent: true });
            let spriteMesh = new THREE.Mesh(geometry, material);
            spriteMesh.position.set(0, 1.3, 1.8);

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
            fontSize: 0.60,
            lineGap: 0.02,
            strokeColor: '#000',
            strokeWidth: 0.15,
            text: this.upgradeLevel + "\n" + this.buildingType,
        });

        this.textSprite.position.set(0, 3.4, 1.1);
        this.mesh.add(this.textSprite);
    }

    update(data) {
        super.update(data);

        var textNeedsUpdate = false;
        if (data.upgradeLevel && data.upgradeLevel !== this.upgradeLevel) {
            this.upgradeLevel = data.upgradeLevel;
            textNeedsUpdate = true;
        }
        if (data.targetLevel && data.targetLevel !== this.targetLevel) {
            this.targetLevel = data.targetLevel;
            textNeedsUpdate = true;
        }
        if (data.workRemaining > -1 && Math.floor(data.workRemaining / 2) !== Math.floor(this.workRemaining / 2)) {
            this.workRemaining = Math.floor(data.workRemaining / 2);
            textNeedsUpdate = true;
        }
        if (data.buildingPhase && data.buildingPhase !== this.buildingPhase) {
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
        statusText = this.getPhaseString(this.buildingPhase) + ": " + this.workRemaining;

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