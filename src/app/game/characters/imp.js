import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Imp/Red.fbx';
import green from '@models/Imp/Green.fbx';
import idle from '@models/Imp/Idle.fbx'
import walking from '@models/Imp/Walking.fbx';
import death from '@models/Imp/Death.fbx';

export class Imp extends Character
{
    constructor(scene, board, position)
    {
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
        if (z % 2 !== 0)
        {
            coords.push(new THREE.Vector2(x, z + 2));
            coords.push(new THREE.Vector2(x, z - 2));
        }
        else
        {
            coords.push(new THREE.Vector2(x + 1, z + 2));
            coords.push(new THREE.Vector2(x + 1, z - 2));
        }

        if (scene.getObjectByProperty('cell', `(${x + 1}, ${z})`) === undefined)
            coords.push(new THREE.Vector2(x + 2, z));

        if (scene.getObjectByProperty('cell', `(${x - 1}, ${z})`) === undefined)
            coords.push(new THREE.Vector2(x - 2, z));
        
        //coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));
        //coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));
        //coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));
        //coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));

        const valids = super.discardCells(scene, coords);
        return valids;
    }
}