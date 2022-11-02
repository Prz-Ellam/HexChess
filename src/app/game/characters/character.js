import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { getObjectsByProperty } from '../../core/helpers';

export class Character {

    constructor(scene, board, model, position, animations) {
        this.boardCount = board.count;
        this.name = this.create(scene, model, position, animations);
    }

    static model = null;

    create(scene, model, position, animations) {
        //const texture = new THREE.TextureLoader()
        //    .load('models/Knight/textures/Red.png');

        if (Character.model) 
            return Character.model.clone();

        const fbxLoader = new FBXLoader();
        fbxLoader.load(model, object => {
            object.traverse(function (child) {
                if (child.isMesh) {
                    const oldMat = child.material;
                    child.material = new THREE.MeshPhysicalMaterial({
                        //color: oldMat.color,
                        map: oldMat.map,
                        //emissive: new THREE.Color(0x964B00),
                        //skinning: true
                    });
                }
                child.castShadow = true;
            });

            object.position.y = 1;
            object.scale.set(.01, .01, .01);
            object.castShadow = true;
            object.receiveShadow = true;

            const hexagon = scene.getObjectByName(position);

            object.position.x = hexagon.position.x;
            object.position.y = hexagon.position.y + (hexagon.scale.y / 2.0);
            object.position.z = hexagon.position.z;

            // TODO: Cada personaje tenga su propio name
            object.typeGame = 'Character';
            object.cell = hexagon.name;

            var regex = new RegExp(/\((\d+), (\d+)\)/);
            var values = regex.exec(object.cell);

            if (values[2] < 5) {
                object.team = 'A';
                object.rotation.y = THREE.MathUtils.degToRad(180);
            }
            else {
                object.team = 'B';
            }

            //object.rotation.y = THREE.Math.degToRad(315);

            object.userData.isContainer = true;
            object.findMoves = this.findMoves;
            object.boardCount = this.boardCount;
            object.actions = {};

            const animLoader = new FBXLoader();
            animLoader.load(animations[0], animation => {
                object.mixer = new THREE.AnimationMixer(object);
                //object.mixer = mixer;

                // Buscamos la animacion y le damos play para que inicie
                const idle = object.mixer.clipAction(animation.animations[0]);
                object.actions['idle'] = idle;
                idle.play();
            });

            animLoader.load(animations[1], animation => {
                const walking = object.mixer.clipAction(animation.animations[0]);
                object.actions['walking'] = walking;
            });

            animLoader.load(animations[2], animation => {
                const death = object.mixer.clipAction(animation.animations[0]);
                death.setLoop(THREE.LoopOnce);
                object.actions['death'] = death;
            });


            object.onUpdate = this.onUpdate;
            scene.add(object);

            Character.model = object;
        });

    }

    findMoves(scene, position) {

    }

    discardCells(scene, coords) {
        const valids = [];
        coords = coords.filter(coord => {
            if (coord.x < 1 && coord.x > this.boardCount.x &&
                coord.y < 1 && coord.y > this.boardCount.y) return false;

            const anotherObject = scene.getObjectByProperty('cell', `(${coord.x}, ${coord.y})`);

            if (anotherObject !== undefined)
                if (anotherObject.team === this.team) return false;

            valids.push(`(${coord.x}, ${coord.y})`);
            return true;
        });
        return valids;
    }

    onUpdate(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

}
