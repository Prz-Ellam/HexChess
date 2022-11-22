import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
//import fbxLoader from '../../core/loaders';
export class Character {

    constructor(scene, board, model, position, animations, character, team) {
        this.boardCount = board.count;
        this.name = this.create(scene, model, position, animations, character, team);
    }

    static models = {
        'RED': {},
        'GREEN': {}
    }

    static maps = {
        'RED': {},
        'GREEN': {}
    };

    create(scene, model, position, animations, character, team) {

        const fbxLoader = new FBXLoader();
        fbxLoader.load(model, object => {
            object.traverse(child => {
                if (child.isMesh) {
                    const oldMat = child.material;

                    const newMaterial = new THREE.MeshPhysicalMaterial({
                        map: oldMat.map
                    });

                    child.material = newMaterial;
                    const p = (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5)
                    if (p) {
                        Character.maps['RED'][character] = newMaterial;
                    }
                    else {
                        Character.maps['GREEN'][character] = newMaterial;
                    }
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
            object.character = character;
            object.typeGame = 'Character';
            object.cell = hexagon.name;

            object.team = team;

            var regex = new RegExp(/\((\d+), (\d+)\)/);
            var values = regex.exec(object.cell);

            if (values[2] < 5) {
                object.rotation.y = THREE.MathUtils.degToRad(180);
            }

            //object.rotation.y = THREE.Math.degToRad(315);

            object.userData.isContainer = true;
            object.findMoves = this.findMoves;
            object.boardCount = this.boardCount;
            object.setPowerup = this.setPowerup;
            object.removePowerup = this.removePowerup;
            object.actions = {};

            const animLoader = new FBXLoader();
            object.mixer = new THREE.AnimationMixer(object);
            animLoader.load(animations[0], animation => {
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

            const p = (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5)
            if (p) {
                Character.models['RED'][character] = object;
            }
            else {
                Character.models['GREEN'][character] = object;
            }

        });

    }

    findMoves(scene, position) {

    }

    discardCells(scene, coords, changeSide, height) {
        const valids = [];
        coords = coords.filter(coord => {
            if (coord.x < 1 && coord.x > this.boardCount.x &&
                coord.y < 1 && coord.y > this.boardCount.y) return false;

            const anotherObject = scene.getObjectByProperty('cell', `(${coord.x}, ${coord.y})`);
            if (anotherObject !== undefined) {
                if (anotherObject.team === this.team) return false;
                if (anotherObject.team !== this.team && changeSide) return false;
                if (anotherObject.powerup === 'Potion') return false;
            }

            // const hexagon = scene.getObjectByName(`(${coord.x}, ${coord.y})`);
            // if (hexagon.scale.y !== height) return false;

            valids.push(`(${coord.x}, ${coord.y})`);
            return true;
        });
        return valids;
    }

    setPowerup(item) {

        switch (item) {
            case 'Potion': {
                this.traverse(child => {
                    if (child.isMesh) {
                        //child.material = recruiterMap.clone();
                        child.material.emissive = new THREE.Color(0x964B00);
                    }
                });
                this.powerup = item;
                break;
            }
            case 'Ghost': {
                this.traverse(child => {
                    if (child.isMesh) {
                        const oldMat = child.material;

                        const newMaterial = new THREE.MeshPhysicalMaterial({
                            map: oldMat.map,
                            transparent: true,
                            opacity: 0.2
                        });

                        child.material = newMaterial;
                    }
                });
                this.powerup = item;
                break;
            }
        }

        this.powerupTurns = 3;

    }

    removePowerup() {
        this.traverse(child => {
            if (child.isMesh) {
                const oldMat = child.material;
                const newMaterial = new THREE.MeshPhysicalMaterial({
                    map: oldMat.map,
                });
                child.material = newMaterial;
            }
        });
        this.powerup = null;
    }

    onUpdate(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

}
