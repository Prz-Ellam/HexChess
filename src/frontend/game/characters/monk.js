import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Monk/Red.fbx';
import green from '@models/Monk/Green.fbx';
import idle from '@models/Monk/Idle.fbx'
import walking from '@models/Monk/Walking.fbx';
import death from '@models/Monk/Death.fbx';

export class Monk extends Character
{
    constructor(scene, board, position, team) {
        const modelpath = (team === 'RED') ? red : green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Monk', team);
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        let hexagon = scene.getObjectByName(`(${x - 2 + (1 - z % 2)}, ${z - 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));

        hexagon = scene.getObjectByName(`(${x - 2 + (1 - z % 2)}, ${z + 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));

        hexagon = scene.getObjectByName(`(${x + 1 + (1 - z % 2)}, ${z - 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));

        hexagon = scene.getObjectByName(`(${x + 1 + (1 - z % 2)}, ${z + 1})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));
/*
        coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));
        coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));
*/
        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }

}