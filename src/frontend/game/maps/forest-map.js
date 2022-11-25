import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import forest from '@models/Forest/forest-terrain.fbx';
import ObjectType from '../config/object-type';

export class ForestMap {

    constructor(scene) {
        this.name = this.create(scene);
    }

    create(scene) {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(forest, object => {
            object.traverse(child => {
                child.castShadow = true;
                child.receiveShadow = true;
            });

            object.scale.set(.01, .01, .01);
            object.castShadow = true;
            object.receiveShadow = true;

            object.position.y = 1.0;
            object.position.z = 22.0;
            
            object.userData.isContainer = true;
            object.objectType = ObjectType.MAP;

            scene.add(object);
        });
    }
}
