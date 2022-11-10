import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import snow from '../../assets/models/Snow/snow-terrain.fbx';

export class SnowMap{
    constructor(scene){
        this.name = this.create(scene);
    }

    create(scene){
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            snow,
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
                object.position.z = 11;
                object.position.x = 2;
                object.scale.set(.01, .01, .01);
                object.castShadow = true;
                object.receiveShadow = true;
   
                scene.add(object);
   
            }
        )
    }
}
