import BaseEntity from "baseEntity";
import { modelCache } from "singletons";
import * as THREE from 'three';
import TextSprite from '@seregpie/three.text-sprite';

class Building extends BaseEntity {
    buildingType;
    upgradeLevel;
    targetLevel;
    buildTimer;

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
        }
        else {
            let fbmodel = modelCache.getModel('fallback');
            if (fbmodel) {
                // Use model if available
                this.mesh = fbmodel.clone();
                //this.mesh.add(fbmesh);
            }
            // Sprite fallback
            let geometry = new THREE.PlaneGeometry(1.8, 1.8, 1.8);

            let texture = new THREE.TextureLoader().load('/client/img/towers/' + this.buildingType + '.png');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);

            let material = new THREE.MeshLambertMaterial({ color: '#EEEEEE', map: texture, side: THREE.DoubleSide, transparent: true });
            let fbmesh = new THREE.Mesh(geometry, material);
            fbmesh.position.set(0, 1.5, 1.8);
            this.mesh.add(fbmesh);

            //let fallback = modelCache.getModel('fallback');
            //if (fallback) { let fallbackmesh = fallback.clone(); this.mesh.add(fallbackmesh); }
        }
        this.mesh.position.set(this.worldX, 0, this.worldY - 0.01);

        // Bottom plane
        {
            let geometry = new THREE.PlaneGeometry(4.5, 4.5, 1, 1);
            let texture = new THREE.TextureLoader().load('/client/img/towerplane' + initData.bulletType + '.png');
            let material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            let planemesh = new THREE.Mesh(geometry, material);

            planemesh.position.set(0, 0, -0.01);
            planemesh.rotation.x = 0 - Math.PI / 2;

            this.mesh.add(planemesh);
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
            this.buildTimer = data.buildTimer;
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
            statusText = "Build: " + Math.round(Math.max(this.buildTimer * 0.65, 0)) / 10;
        }

        this.textSprite.text = ` \n${levelText}\n${this.buildingType}\n${statusText}`;
    }
}

export { Building };
export default Building;