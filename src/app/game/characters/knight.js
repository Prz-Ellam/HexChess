import * as THREE from 'three';
import { Character } from './character';

import redKnight from '@models/Knight/RedKnight.fbx';
import greenKnight from '@models/Knight/GreenKnight.fbx';
import idle from '@models/Knight/Idle.fbx'
import walking from '@models/Knight/Walking.fbx';
import death from '@models/Knight/Death.fbx'

export class Knight extends Character {
    constructor(scene, board, position, animations) {
        const modelpath =
            (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ?
                redKnight :
                greenKnight;
        super(scene, board, modelpath, position, [ idle, walking, death ]);
    }

    findMoves(scene, position) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        coords.push(new THREE.Vector2(x - 1, z));
        coords.push(new THREE.Vector2(x + 1, z));
        coords.push(new THREE.Vector2(x + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x + (1 - z % 2), z + 1));
        coords.push(new THREE.Vector2(x - (z % 2), z - 1));
        coords.push(new THREE.Vector2(x - (z % 2), z + 1));

        const valids = super.discardCells(scene, coords);
        return valids;
    }
}