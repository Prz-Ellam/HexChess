import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

export class Board {

    constructor(scene, position, count, space) {
        this.position = position;
        this.count = count;
        this.space = space;
        this.create(scene);
    }

    create(scene) {

        const startX = Math.round(this.position.x - (this.count.x / 2));
        const startZ = Math.round(this.position.y - (this.count.y / 2));
        const endX = Math.round(this.position.x + (this.count.x / 2));
        const endZ = Math.round(this.position.y + (this.count.y / 2));

        const board = new THREE.Object3D();
        // board.position.set(this.position);

        for (let x = startX; x < endX; x++) {
            for (let z = startZ; z < endZ; z++) {

                const hexagon = new THREE.Mesh(
                    new THREE.CylinderGeometry(1.0, 1.0, 1.0, 6, 1, false),
                    new THREE.MeshStandardMaterial({ 
                        color : (x % 2 == 0 ) ? 0x958ae6 : 0x958ae6,
                        flatShading: true 
                    })
                );

                hexagon.position.x = (z % 2 === 0) ? x : x + 0.5;
                hexagon.position.x *= this.space;
                hexagon.position.y = 0.5;
                hexagon.position.z = z * 1.535; // TODO: Numero magicos

                hexagon.castShadow = true;
                hexagon.receiveShadow = true;

                let change = Math.random(0, 2);
                //hexagon.scale.y = change;
                //hexagon.position.y += change / 2;

                const xCoord = (x - startX) + 1;
                const zCoord = (z * -1) - startZ;
                hexagon.name = `(${xCoord}, ${zCoord})`;
                hexagon.isValid = false;

                board.add(hexagon);
            }
        }

        board.name = "Board";

        scene.add(board);
        this.size = new THREE.Vector2(endX - startX, endZ - startZ);

    }

}