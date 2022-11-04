import * as THREE from 'three';
import { Character } from "./character";

import red from '@models/Peasant/Red.fbx';
import green from '@models/Peasant/Green.fbx';
import idle from '@models/Peasant/Idle.fbx'
import walking from '@models/Peasant/Walking.fbx';
import death from '@models/Peasant/Death.fbx';

export class Peasant extends Character
{
    constructor(scene, board, position)
    {
        const modelpath =
            (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ?
                red :
                green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Peasant');
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        /*
        while (start <= this.boardCount.y)
        {
            console.log(start);
            start++;
            coords.push(new THREE.Vector2(x, start));
        }
        */

        for (let i = x + 1; i <= 10; i++) {
            coords.push(new THREE.Vector2(i, z));
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined) break;
        }

        for (let i = x - 1; i >= 1; i--) {
            coords.push(new THREE.Vector2(i, z));
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined) break;
        }

        coords.push(new THREE.Vector2(x + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x + (1 - z % 2), z + 1));
        coords.push(new THREE.Vector2(x - (z % 2), z - 1));
        coords.push(new THREE.Vector2(x - (z % 2), z + 1));
     
        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }
}