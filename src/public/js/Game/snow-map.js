import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

export class SnowMap{
    constructor(scene){
        this.name = this.create(scene);
    }

    create(scene){
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            'models/Snow/snow-terrain.fbx',
            (object) => {
                object.traverse(function (child) {
                    if (child.isMesh)
                    {
                       const oldMat = child.material;
                      
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                })
                object.position.y = 1;
                object.position.z = 5;
               object.position.x = 2;
                object.scale.set(.01, .01, .01);
                object.castShadow = true;
                object.receiveShadow = true;
   
                this.scene.add(object);
   
            }
        )
    }
}
