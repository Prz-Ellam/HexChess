import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import potion from '@models/Potion/Potion.fbx';

export class Potion {

    constructor(scene, position) {
        this.create(scene, position);
    }

    create(scene, position) {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(potion, object => {
            object.traverse(child => {
                child.castShadow = true;
                child.receiveShadow = true;
            })

            object.position.y = 0;
            object.scale.set(.001, .001, .001);
            object.castShadow = true;
            object.receiveShadow = true;

            const hexagon = scene.getObjectByName(position);
            object.position.x = hexagon.position.x;
            object.position.y = hexagon.position.y + (hexagon.scale.y / 2.0);
            object.staticPosition = object.position.y;
            object.position.z = hexagon.position.z;

            object.type = 'Potion';
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