import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Witch/Red.fbx';
import green from '@models/Witch/Green.fbx';
import idle from '@models/Witch/Idle.fbx'
import walking from '@models/Witch/Walking.fbx';
import death from '@models/Witch/Death.fbx'

export class Witch extends Character {
    constructor(scene, board, position, team) {
        const modelpath = (team === 'RED') ? red : green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Witch', team);
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        let hexagon;

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
            //coords.push(new THREE.Vector2(xCopy, zCopy));
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
            //coords.push(new THREE.Vector2(xCopy, zCopy));
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
            //coords.push(new THREE.Vector2(xCopy, zCopy));
            if (scene.getObjectByProperty('cell', `(${xCopy}, ${zCopy})`) !== undefined
            && this.powerup !== 'Ghost') break;
	    }

        for (let i = x + 1; i <= 10; i++) {
            hexagon = scene.getObjectByName(`(${i}, ${z})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(i, z));
            else
                break;
            //coords.push(new THREE.Vector2(i, z));
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }

        for (let i = x - 1; i >= 1; i--) {
            hexagon = scene.getObjectByName(`(${i}, ${z})`);
            if (hexagon !== undefined && hexagon.scale.y === this.position.y)
                coords.push(new THREE.Vector2(i, z));
            else
                break;
            //coords.push(new THREE.Vector2(i, z));
            if (scene.getObjectByProperty('cell', `(${i}, ${z})`) !== undefined
            && this.powerup !== 'Ghost') break;
        }
/*
        zCopy = z;
        while (zCopy <= 10)
        {
            coords.push(new THREE.Vector2(x, zCopy + 2));
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
*/
        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }

}