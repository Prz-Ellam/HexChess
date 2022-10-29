import * as THREE from 'three';
import { Character } from "./character.js";

import redKnight from '../../assets/models/Knight/RedKnight.fbx';
import greenKnight from '../../assets/models/Knight/GreenKnight.fbx';

export class Knight extends Character
{
    constructor(scene, board, position, animations)
    {
        const modelpath = 
        (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ? 
        redKnight : 
        greenKnight;
        super(scene, board, modelpath, position, animations);
    }

    findMoves(scene, x, z)
    {
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