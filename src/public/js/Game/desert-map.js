import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

export class DesertMap{

    constructor(scene){
        this.name = this.create(scene);
    }

    create(scene){
        const fbxLoader = new FBXLoader();
     fbxLoader.load(
         'models/Desert/TERRENO-DESIERTO.fbx',
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
             object.position.z = 6;
             object.scale.set(.01, .01, .01);
             object.castShadow = true;
             object.receiveShadow = true;

             this.scene.add(object);

         }
     )
    }


}
