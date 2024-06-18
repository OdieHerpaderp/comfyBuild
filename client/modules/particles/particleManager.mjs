
import * as THREE from 'three';

const particleTexture = [];
particleTexture["spark"] = new THREE.TextureLoader().load( '/client/img/spark.png' );
particleTexture["fire"] = new THREE.TextureLoader().load( '/client/textures/particles/fire.webp' );
particleTexture["fireWall"] = new THREE.TextureLoader().load( '/client/textures/particles/fire.webp' );
particleTexture["skull"] = new THREE.TextureLoader().load( '/client/img/skull.png' );
particleTexture["smoke"] = new THREE.TextureLoader().load( '/client/img/smoke.png' );
particleTexture["poison"] = new THREE.TextureLoader().load( '/client/img/poison.png' );
particleTexture["ice"] = new THREE.TextureLoader().load( '/client/img/ice.png' );
particleTexture["psmoke"] = new THREE.TextureLoader().load( '/client/img/smoke.png' );
particleTexture["gem"] = new THREE.TextureLoader().load( '/client/img/gem.png' );
    


class ParticleManager {
    constructor(scene) {
        //useTemplate.bind(this)(template);
        this.scene = scene;

        this.particleGroup = new THREE.Object3D();
        this.particleAttributes = { startSize: [], startPosition: [], randomness: [] };
    }

    addParticleGroup(){
        this.scene.add( this.particleGroup );
    }

    spawnParticle(type,totalParticles,scale,x,y,z,origin){
        for( var i = 0; i < totalParticles; i++ ) 
        {
            var color = 0xffffff; 
            var spriteMaterial;
            if (type == "smoke" || type == "psmoke" || type == "poison" || type == "gem" || type == "skull") spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture[type], transparent:true } );
            else spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture[type] } );
                
            var sprite = new THREE.Sprite( spriteMaterial );
            var spriteScale = (2.5 + Math.random() * 2.3) * scale;
            //if (type == "smoke") spriteScale /= 2;
            sprite.scale.set( spriteScale, spriteScale, 1.0 ); // imageWidth, imageHeight
            sprite.position.set( x,y,z );
            sprite.rotation.y = Math.random() * 360;
            
            if(origin !== undefined){
                sprite.speedX = (origin.spdX / 1.4 + 0.3 - Math.random())*0.6;
                sprite.speedZ = (0.9 - Math.random())*0.4;
                sprite.speedY = (0.3 - Math.random())*0.6;
            }
            else{
                sprite.speedX = (0.5 - Math.random())*1.0;
                sprite.speedY = (0.3 - Math.random())*0.6;
                sprite.speedZ = (0.5 - Math.random())*1.0;
            }
            
            sprite.lifespan = 85;
            sprite.type = type;
                
            if (type == "smoke") {
                sprite.position.y -= 0.8;
                sprite.material.opacity = 0.10;
                sprite.scale.x *= 0.77;
                sprite.scale.y *= 0.77;
                sprite.speedX *= 2.8;
                sprite.speedZ *= 1.6;
                sprite.speedY *= 2.8;
            }
            else if (type == "poison") {
                sprite.position.y -= 0.2;
                sprite.material.opacity = 0.40;
                sprite.scale.x *= 1.33;
                sprite.scale.y *= 1.33;
                sprite.speedX *= 1.2;
                sprite.speedZ *= 1.8;
                sprite.speedY *= 1.2;
                sprite.lifespan = 125;
            }
            else if (type == "psmoke") {
                sprite.material.opacity = 0.10;
                sprite.material.color.setHSL( 0, 0 , 0.01 );
                sprite.speedX *= 0.5;
                sprite.speedZ += 0.2;
                sprite.speedZ *= 0.6;
                sprite.speedY *= 0.5;
                //console.log(origin);
                sprite.hue = origin.hue;
                sprite.hue2 = origin.hue2;
                sprite.sat = origin.sat;
                sprite.lit = origin.lit;
            }
            else if (type == "gem") {
                sprite.material.opacity = 0.80;
                sprite.material.color.setHSL( 0, 0.99 , 0.99 );
                sprite.speedX *= 2.5;
                sprite.speedZ += 0.1;
                sprite.speedZ *= 2.5;
                sprite.speedY *= 2.5;
            }
            else if (type == "skull") {
                sprite.material.opacity = 0.80;
                sprite.material.blending = THREE.MultiplyBlending;
            }
            else sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
            
            this.particleGroup.add( sprite );
            // add variable qualities to arrays, if they need to be accessed later
            this.particleAttributes.startPosition.push( sprite.position.clone() );
            this.particleAttributes.randomness.push( Math.random() );
        }
    }

    animateParticles(){
        // Animate Particles
        for ( var c = 0; c < this.particleGroup.children.length; c ++ ) 
        {
            var sprite = this.particleGroup.children[ c ];
            if (sprite.lifespan < 0) {
                this.particleGroup.remove(this.particleGroup.children[c]);
                this.particleGroup.remove(sprite);
                sprite.remove();
            }
        
            // particle wigglea 
            // var wiggleScale = 2;
            // sprite.position.x += wiggleScale * (Math.random() - 0.5);
            // sprite.position.y += wiggleScale * (Math.random() - 0.5);
            // sprite.position.z += wiggleScale * (Math.random() - 0.5);
            
            // pulse away/towards center
            // individual rates of movement
            //var a = this.particleAttributes.randomness[c] + 1;
            //var pulseFactor = Math.sin(a * scrolll * 0.1 + 0.9);
            //sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
            //sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor;
            //sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;
                
            sprite.position.x += sprite.speedX / 6;
            //sprite.position.y -= 0.01 + a * 0.3 - Math.abs(sprite.speedX / 16) + Math.abs(sprite.speedY / 16);
            sprite.position.y += sprite.speedY / 6;
            sprite.position.z += sprite.speedZ / 6;
            sprite.lifespan -= 2.5;
        
                
            if (sprite.type == "smoke") {
                sprite.speedZ += 0.01;
                sprite.speedX *= 0.96;
                sprite.speedY *= 0.96;
                sprite.lifespan += 0.15;
                sprite.scale.x += 0.004;
                sprite.scale.y += 0.004;
                sprite.scale.x *= 1.004;
                sprite.scale.y *= 1.004;
                sprite.material.opacity = 0.02 + sprite.lifespan / 125;
                sprite.material.color.setHSL( 0, 0 , 0.01 + sprite.lifespan / 160 );
            }
            else if (sprite.type == "psmoke") {
                sprite.lifespan -= 1;
                sprite.material.opacity = 0.01 + sprite.lifespan / 111;
                sprite.material.color.setHSL( sprite.hue + sprite.lifespan * sprite.hue2, 0.01 + sprite.lifespan * sprite.sat , 0.01 + sprite.lifespan * sprite.lit );
                sprite.scale.x -= 0.003;
                sprite.scale.y -= 0.003;
                sprite.scale.x *= 0.998;
                sprite.scale.y *= 0.998;
            }
            else if (sprite.type == "spark") {
                sprite.lifespan -= 2;
                sprite.material.opacity = 0.01 + sprite.lifespan / 33;
                //sprite.material.color.setHSL( 0.01 + sprite.lifespan / 800, 0.05 + sprite.lifespan / 800 , 0.01 + sprite.lifespan / 800 );
                sprite.scale.x -= 0.003;
                sprite.scale.y -= 0.003;
                sprite.scale.x *= 0.998;
                sprite.scale.y *= 0.998;
            }
            else if (sprite.type == "fireWall") {
                sprite.lifespan -= 8;
                sprite.material.opacity = 0.01 + sprite.lifespan / 33;
                //sprite.material.color.setHSL( 0.01 + sprite.lifespan / 800, 0.05 + sprite.lifespan / 800 , 0.01 + sprite.lifespan / 800 );
                sprite.scale.x -= 0.003;
                sprite.scale.y -= 0.003;
                sprite.scale.x *= 0.998;
                sprite.scale.y *= 0.998;
            }
            else if (sprite.type == "gem") {
                sprite.lifespan -= 2;
                sprite.material.opacity = 0.01 + sprite.lifespan / 33;
                //sprite.material.color.setHSL( 0.01 + sprite.lifespan / 800, 0.05 + sprite.lifespan / 800 , 0.01 + sprite.lifespan / 800 );
                sprite.scale.x -= 0.003;
                sprite.scale.y -= 0.003;
                sprite.scale.x *= 0.988;
                sprite.scale.y *= 0.988;
            }
            else if (sprite.type == "skull") {
                sprite.lifespan -= 2;
                sprite.material.opacity = 0.01 + sprite.lifespan / 33;
                //sprite.material.color.setHSL( 0.01 + sprite.lifespan / 800, 0.05 + sprite.lifespan / 800 , 0.01 + sprite.lifespan / 800 );
                sprite.scale.x -= 0.003;
                sprite.scale.y -= 0.003;
                sprite.scale.x *= 0.922;
                sprite.scale.y *= 0.922;
            }
            else sprite.material.color.setHSL( 1, 0.3 + sprite.lifespan / 10 , 0.3 + sprite.lifespan / 30 );
            sprite.scale.x += 0.004;
            sprite.scale.y += 0.004;
            sprite.scale.x *= 1.004;
            sprite.scale.y *= 1.004;
            }
    }
}

export { ParticleManager };