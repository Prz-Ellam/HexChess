import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Knight/RedKnight.fbx';
import green from '@models/Knight/GreenKnight.fbx';
import idle from '@models/Knight/Idle.fbx'
import walking from '@models/Knight/Walking.fbx';
import death from '@models/Knight/Death.fbx'

export class Knight extends Character {
    constructor(scene, board, position, team) {
        //const modelpath =
        //    (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ?
        //        red :
        //        green;
        const modelpath = (team === 'RED') ? red : green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Knight', team);
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;

        const coords = [];
        coords.push(new THREE.Vector2(x - 1, z));
        coords.push(new THREE.Vector2(x + 1, z));
        coords.push(new THREE.Vector2(x + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x + (1 - z % 2), z + 1));
        coords.push(new THREE.Vector2(x - (z % 2), z - 1));
        coords.push(new THREE.Vector2(x - (z % 2), z + 1));

        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }
}