import * as THREE from 'three';
import snowFlake from '@images/snowflake1.png'

export class SnowParticles {

    constructor(scene) {
        this.scene = scene;
        this.emitParticles(scene);

    }

    emitParticles() {
        this.particles;
        let positions = [], velocities = [];

        this.numSnowflakes = 15000;

       this.maxRange = 1000, this.minRange = this.maxRange / 2;
       this.minHeight = 10;

        const geometry = new THREE.BufferGeometry();

        const textureLoader = new THREE.TextureLoader();

        for (let i = 0; i < this.numSnowflakes; i++) {
            positions.push(
                Math.floor(Math.random() * this.maxRange - this.minRange), // x -500 to 500
                Math.floor(Math.random() * this.minRange + this.minHeight), //y 250 to 750
                Math.floor(Math.random() * this.maxRange - this.minRange)); // z -500 to 500

            velocities.push(
                Math.floor(Math.random() * 6 - 3) * 0.1, // x -0.3 to 0.3
                Math.floor(Math.random() * 5 + 0.12) * 0.18, // y 0.02 to 0.92
                Math.floor(Math.random() * 6 - 3) * 0.1); // z -0.3 to 0.3
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

        const flakeMaterial = new THREE.PointsMaterial({
            size: 4,
            map: textureLoader.load(snowFlake),
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.7,
        });

        this.particles = new THREE.Points(geometry, flakeMaterial);

        this.particles.Name = 'snowP';
        this.particles.onUpdate = this.onUpdate;

        this.scene.add(this.particles);
    }

    onUpdate() {

        let numSnowflakes = this.numSnowflakes;
        let particles = this.particles;
        let maxRange = this.maxRange, minRange = this.minRange, minHeight = this.minHeight;

        for (let i=0; i< numSnowflakes*3; i+=3){

            particles.geometry.attributes.position.array[i] -= particles.geometry.attributes.velocity.array[i];

            particles.geometry.attributes.position.array[i+1] -= particles.geometry.attributes.velocity.array[i+1];

            particles.geometry.attributes.position.array[i+2] -= particles.geometry.attributes.velocity.array[i+2];
        
            if(particles.geometry.attributes.position.array[i+1] < 10){
                particles.geometry.attributes.position.array[i] = Math.floor(Math.random()*maxRange - minRange);
                particles.geometry.attributes.position.array[i+1] = Math.floor(Math.random()*minRange + minHeight);
                particles.geometry.attributes.position.array[i+2] = Math.floor(Math.random()*maxRange - minRange);
            }
        
            particles.geometry.attributes.position.needsUpdate = true;

        }
    }
}