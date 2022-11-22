import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import ghost from '@models/Ghost/Ghost.fbx';

export class Ghost {

    constructor(scene, position) {
        this.create(scene, position);
    }

    create(scene, position) {
        const manager = new THREE.LoadingManager();

        const fbxLoader = new FBXLoader(manager);
        fbxLoader.load(ghost, object => {
            object.traverse(child => {
                if (child.isMesh) {
                    //child.material[0].flatShading = true;
                    //child.material[1].flatShading = true;
                }
                child.castShadow = true;
                child.receiveShadow = true;
            });

            object.scale.set(.004, .004, .004);
            object.castShadow = true;
            object.receiveShadow = true;

            const hexagon = scene.getObjectByName(position);
            object.position.x = hexagon.position.x;
            object.position.y = hexagon.position.y + (hexagon.scale.y / 2.0);
            object.staticPosition = object.position.y;
            object.position.z = hexagon.position.z;

            object.type = 'Ghost';
            object.typeGame = 'Item';
            object.cell = hexagon.name;

            object.onUpdate = this.onUpdate;
            object.angle = 0.0;

            scene.add(object);
        });
    }

    onUpdate(delta) {
        this.angle += delta * 50.0;
        this.rotation.y += delta;
        this.position.y = this.staticPosition + (0.1 * Math.sin(THREE.MathUtils.degToRad(this.angle)));
    }

}