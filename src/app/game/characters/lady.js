import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Lady/Red.fbx';
import green from '@models/Lady/Green.fbx';
import idle from '@models/Lady/Idle.fbx'
import walking from '@models/Lady/Walking.fbx';
import death from '@models/Lady/Death.fbx'

export class Lady extends Character {
    constructor(scene, board, position, animations) {
        const modelpath =
            (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ?
                red :
                green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Lady');
    }

    findMoves(scene, position, changeSide) {
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

        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }

    setPowerup(item) {
        
    }
}