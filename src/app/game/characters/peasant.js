import * as THREE from 'three';
import { Character } from "./character";

import red from '@models/Peasant/Red.fbx';
import green from '@models/Peasant/Green.fbx';
import idle from '@models/Peasant/Idle.fbx'
import walking from '@models/Peasant/Walking.fbx';
import death from '@models/Peasant/Death.fbx';

export class Peasant extends Character
{
    constructor(scene, board, position, team) {
        const modelpath = (team === 'RED') ? red : green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Peasant', team);
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        let hexagon;

        for (let i = x + 1; i <= 10; i++) {
            //coords.push(new THREE.Vector2(i, z));
            hexagon = scene.getObjectByName(`(${i}, ${z})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(i, z));
            else
                break;
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }

        for (let i = x - 1; i >= 1; i--) {
            //coords.push(new THREE.Vector2(i, z));
            hexagon = scene.getObjectByName(`(${i}, ${z})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(i, z));
            else
                break;
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }

        hexagon = scene.getObjectByName(`(${x + (1 - z % 2)}, ${z - 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x + (1 - z % 2), z - 1));

        hexagon = scene.getObjectByName(`(${x + (1 - z % 2)}, ${z + 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x + (1 - z % 2), z + 1));

        hexagon = scene.getObjectByName(`(${x - (z % 2)}, ${z - 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x - (z % 2), z - 1));

        hexagon = scene.getObjectByName(`(${x - (z % 2)}, ${z + 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x - (z % 2), z + 1));
     
        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }
}