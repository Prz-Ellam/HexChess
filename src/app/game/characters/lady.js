import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Lady/Red.fbx';
import green from '@models/Lady/Green.fbx';
import idle from '@models/Lady/Idle.fbx'
import walking from '@models/Lady/Walking.fbx';
import death from '@models/Lady/Death.fbx'

export class Lady extends Character {
    constructor(scene, board, position, team) {
        const modelpath = (team === 'RED') ? red : green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Lady', team);
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;
        let hexagon;

        let coords = [];
        let xCopy = x, zCopy = z;
        while (zCopy < 10) {
            if (zCopy % 2 == 0) xCopy++;
            zCopy++;
            hexagon = scene.getObjectByName(`(${xCopy}, ${zCopy})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(xCopy, zCopy));
            else
                break;
            //coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }
	 
	    xCopy = x, zCopy = z;
        while (zCopy < 10) {
            if (zCopy % 2 != 0) xCopy--;
            zCopy++;
            hexagon = scene.getObjectByName(`(${xCopy}, ${zCopy})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(xCopy, zCopy));
            else
                break;
            // coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }

        xCopy = x, zCopy = z;
        while (zCopy > 1) {
            if (zCopy % 2 == 0) xCopy++;
            zCopy--;
            hexagon = scene.getObjectByName(`(${xCopy}, ${zCopy})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(xCopy, zCopy));
            else
                break;
            // coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }

	    xCopy = x, zCopy = z;
	    while (zCopy > 1) {
            if (zCopy % 2 != 0) xCopy--;
            zCopy--;
            hexagon = scene.getObjectByName(`(${xCopy}, ${zCopy})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(xCopy, zCopy));
            else
                break;
            // coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined
            && this.powerup !== 'Ghost') break;
	    }

        const valids = super.discardCells(scene, coords, changeSide, this.position.y);
        return valids;
    }

}