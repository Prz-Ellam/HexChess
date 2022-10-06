import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

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
            const model = gltf.scene.children[0];

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
            model.movement = '2';

            model.userData.isContainer = true;
            model.findMoves = this.findMoves;
            model.boardCount = this.boardCount;

            //modelsNames.push(model.name);
        /*
            const animLoader = new GLTFLoader();
            animLoader.load('scene.gltf', (animation) =>
            {
                mixer = new THREE.AnimationMixer(model);
                // Buscamos la animacion y le damos play para que inicie
                const idle = mixer.clipAction(animation.animations[0]);
                idle.play();
            });
        */
            scene.add(model);
        });

    }

    findMoves(x, z)
    {
        /*
        let type = '2';
        switch (type)
        {
            case '1': {
                const valids = [];

                let coords = [];
                coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));
                coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));
                coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));
                coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));

                coords = coords.filter(coord => 
                    coord.x <= this.boardCount.x && coord.x >= 1 && 
                    coord.y <= this.boardCount.y && coord.y >= 1
                );

                coords.forEach(coords => valids.push(`(${coords.x}, ${coords.y})`))
                
                return valids;
            }
            case '2': {
                const valids = [];

                let coords = [];
                coords.push(new THREE.Vector2(x - 1, z));
                coords.push(new THREE.Vector2(x + 1, z));
                coords.push(new THREE.Vector2(x + (1 - z % 2), z - 1));
                coords.push(new THREE.Vector2(x + (1 - z % 2), z + 1));
                coords.push(new THREE.Vector2(x - (z % 2), z - 1));
                coords.push(new THREE.Vector2(x - (z % 2), z + 1));

                coords = coords.filter(coord => 
                    coord.x <= this.boardCount.x && coord.x >= 1 && 
                    coord.y <= this.boardCount.y && coord.y >= 1
                );

                coords.forEach(coords => valids.push(`(${coords.x}, ${coords.y})`))
                
                return valids;
            }
        }
        */
    }

}