import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import snow from '@models/Snow/snow-terrain.fbx';
import ObjectType from '../config/object-type';

export class SnowMap {
    constructor(scene) {
        this.name = this.create(scene);
    }

    create(scene) {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(snow, object => {
            object.traverse(function (child) {
                child.castShadow = true;
                child.receiveShadow = true;
            });

            object.position.y = 1.0;
            object.position.z = 11.0;
            object.position.x = 2.0;
            object.scale.set(.01, .01, .01);
            object.castShadow = true;
            object.receiveShadow = true;
            object.userData.isContainer = true;
            object.objectType = ObjectType.MAP;

            scene.add(object);
        });
    }
}
