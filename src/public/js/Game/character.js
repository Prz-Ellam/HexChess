import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

import { getObjectsByProperty } from '../Engine/helpers.js';

export class Character {

    constructor(scene, board, model, position)
    {
        this.boardCount = board.count;
        this.name = this.create(scene, model, position);
    }

    create(scene, model, position)
    {
        const gltfLoader = new GLTFLoader();
        // gltfLoader.setPath('models/');
        let mixer;
        let modelName;
        gltfLoader.load(model, (gltf) =>
        {
            const model = gltf.scene;

            model.traverse( function( node ) {

                if ( node.isMesh ) { 
                    node.castShadow = true; 
                    node.receiveShadow = true;
                }
        
            } );

            model.scale.setScalar(1);
            //model.position.set(-6.0, 0.0, -6.0);
            model.castShadow = true;
            model.receiveShadow = true;

            const hexagon = scene.getObjectByName(position);

            model.position.x = hexagon.position.x;
            model.position.y = hexagon.position.y + 0.5;
            model.position.z = hexagon.position.z;
            model.typeGame = 'Character';
            model.cell = hexagon.name;

            var regex = new RegExp(/\((\d+), (\d+)\)/);
            var values = regex.exec(model.cell);

            if (values[2] < 5) {
                model.team = 'A';
                model.rotation.y = 135;
            }
            else
            {
                model.team = 'B';
            }

            model.userData.isContainer = true;
            model.findMoves = this.findMoves;
            model.boardCount = this.boardCount;

            //modelsNames.push(model.name);
            const animLoader = new GLTFLoader();
            animLoader.load('models/Peasant/Death.gltf', (animation) =>
            {
                const mixer = new THREE.AnimationMixer(model);
                // Buscamos la animacion y le damos play para que inicie
                const idle = mixer.clipAction(animation.animations[0]);
                idle.play();
            });

            scene.add(model);
        });

    }

    findMoves(scene, x, z)
    {
        
    }

    discardCells(scene, coords)
    {
        const valids = [];
        coords = coords.filter(coord => {
            if (coord.x < 1 && coord.x > this.boardCount.x && 
                coord.y < 1 && coord.y > this.boardCount.y) return false;

            const anotherObject = getObjectsByProperty(scene, 'cell', `(${coord.x}, ${coord.y})`);

            if (anotherObject.length !== 0)
                if (anotherObject[0].team === this.team) return false;

            valids.push(`(${coord.x}, ${coord.y})`);
            return true;
        });
        return valids;
    }

}