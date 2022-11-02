import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Witch/Red.fbx';
import green from '@models/Witch/Green.fbx';
import idle from '@models/Witch/Idle.fbx'
import walking from '@models/Witch/Walking.fbx';
import death from '@models/Witch/Death.fbx'

export class Witch extends Character {
    constructor(scene, board, position, animations) {
        const modelpath =
            (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ?
                red :
                green;
        super(scene, board, modelpath, position, [ idle, walking, death ]);
    }

    findMoves(scene, position) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        let xCopy = x, zCopy = z;
        while (zCopy < 10) {
            if (zCopy % 2 == 0) xCopy++;
            zCopy++;
            coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined) break;
        }
	 
	    xCopy = x, zCopy = z;
        while (zCopy < 10) {
            if (zCopy % 2 != 0) xCopy--;
            zCopy++;
            coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined) break;
        }

        xCopy = x, zCopy = z;
        while (zCopy > 1) {
            if (zCopy % 2 == 0) xCopy++;
            zCopy--;
            coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined) break;
        }

	    xCopy = x, zCopy = z;
	    while (zCopy > 1) {
            if (zCopy % 2 != 0) xCopy--;
            zCopy--;
            coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined) break;
	    }

        for (let i = x + 1; i <= 10; i++) {
            coords.push(new THREE.Vector2(i, z));
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined) break;
        }

        for (let i = x - 1; i >= 1; i--) {
            coords.push(new THREE.Vector2(i, z));
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined) break;
        }

        zCopy = z;
        while (zCopy <= 10)
        {
            if (zCopy % 2 == 0)
            {
                coords.push(new THREE.Vector2(x, zCopy + 2));
            }
            else
            {
                coords.push(new THREE.Vector2(x + 1, zCopy + 2));
            }

            zCopy += 2;
        }

        zCopy = z;
        while (zCopy >= 1)
        {
            if (zCopy % 2 == 0)
            {
                coords.push(new THREE.Vector2(x, zCopy - 2));
            }
            else
            {
                coords.push(new THREE.Vector2(x + 1, zCopy - 2));
            }

            zCopy -= 2;
        }

        const valids = super.discardCells(scene, coords);
        return valids;
    }
}