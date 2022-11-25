import * as THREE from 'three';
import { Character } from './character';

import red from '@models/Imp/Red.fbx';
import green from '@models/Imp/Green.fbx';
import idle from '@models/Imp/Idle.fbx'
import walking from '@models/Imp/Walking.fbx';
import death from '@models/Imp/Death.fbx';

export class Imp extends Character
{
    constructor(scene, board, position, team)
    {
        const modelpath = (team === 'RED') ? red : green;
        super(scene, board, modelpath, position, [ idle, walking, death ], 'Imp', team);
    }

    findMoves(scene, position, changeSide) {
        const x = position.x;
        const z = position.y;

        let coords = [];
        let hexagon = scene.getObjectByName(`(${x}, ${z + 2})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x, z + 2));

        hexagon = scene.getObjectByName(`(${x}, ${z - 2})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x, z - 2));
/*
        coords.push(new THREE.Vector2(x, z + 2));
        coords.push(new THREE.Vector2(x, z - 2));
*/      
        hexagon = scene.getObjectByName(`(${x + 2}, ${z})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x + 2, z));

        hexagon = scene.getObjectByName(`(${x - 2}, ${z})`);
        if (hexagon !== undefined && hexagon.scale.y === this.position.y)
            coords.push(new THREE.Vector2(x - 2, z));
        
        const valids = super.discardCells(scene, coords, changeSide);
        return valids;
    }
}