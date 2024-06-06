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

    _buildTimer;
    get buildTimer() {
        return this._buildTimer;
    }
    set buildTimer(value) {
        if (this._buildTimer == value) { return; }
        this._buildTimer = value;
        this.propertyChanged("buildTimer", value);
    }

    textSprite;

    constructor(initData) {
        super(initData);

        this.buildingType = initData.towerType ?? "unknown";
        this.upgradeLevel = initData.upgradeLevel ?? 0;
        this.targetLevel = initData.targetLevel ?? this.upgradeLevel;
        this.buildTimer = initData.buildTimer ?? 0;

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
        this.mesh.position.set(this.worldX, 0, this.worldY - 0.01);

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
        if (data.buildTimer && data.buildTimer !== this.buildTimer) {
            this.buildTimer = Math.round(Math.max(data.buildTimer * 0.65, 0)) / 10;
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
            statusText = "Build: " + this.buildTimer;
        }

        this.textSprite.text = ` \n${levelText}\n${this.buildingType}\n${statusText}`;
    }
}

export { Building };
export default Building;