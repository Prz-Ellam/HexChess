import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import desert from '../../assets/models/Desert/TERRENO-DESIERTO.fbx';

export class DesertMap {

    constructor(scene) {
        this.name = this.create(scene);
    }

    create(scene) {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            desert,
            (object) => {
                object.traverse(function (child) {
                    if (child.isMesh) {
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

                scene.add(object);

            }
        )
    }


}
