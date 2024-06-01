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
            // Sprite fallback
            let geometry = new THREE.PlaneGeometry(4.4, 6.4, 4.4);

            let texture = new THREE.TextureLoader().load('/client/img/towers/' + this.buildingType + '.png');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 2);

            let material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            this.mesh = new THREE.Mesh(geometry, material);
        }
        this.mesh.position.set(this.worldX, 0, this.worldY + 0.6);

        // Bottom plane
        {
            let geometry = new THREE.PlaneGeometry(4.5, 4.5, 1, 1);
            let texture = new THREE.TextureLoader().load('/client/img/towerplane' + initData.bulletType + '.png');
            let material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            let planemesh = new THREE.Mesh(geometry, material);

            planemesh.position.set(0, 0, -0.11);
            planemesh.rotation.x = 0 - Math.PI / 2;

            this.mesh.add(planemesh);
        }

        // Text
        this.textSprite = new TextSprite({
            alignment: 'center',
            color: '#fff',
            fontFamily: 'Roboto Slab',
            fontSize: 0.80,
            lineGap: 0.05,
            strokeColor: '#000',
            strokeWidth: 0.15,
            text: this.upgradeLevel + "\n" + this.buildingType,
        });

        this.textSprite.position.set(0, 3.2, 1.6);
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