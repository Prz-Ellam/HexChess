import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import desert from '@models/desert/desert.fbx';
import ObjectType from '../config/object-type';

export class DesertMap {

    constructor(scene) {
        this.name = this.create(scene);
    }

    create(scene) {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(desert, object => {
            object.traverse(child => {
                if (child.isMesh) {
                    child.material.shininess = 0.0;
                }
                child.castShadow = true;
                child.receiveShadow = true;
            })
            object.position.y = 0;
            object.position.z = -45;
            object.scale.set(.01, .01, .01);
            object.castShadow = true;
            object.receiveShadow = true;
            object.userData.isContainer = true;
            object.objectType = ObjectType.MAP;

            scene.add(object);

        });
    }

}
