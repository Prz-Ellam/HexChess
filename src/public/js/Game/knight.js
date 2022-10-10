import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { Character } from "./character.js";

export class Knight extends Character
{
    constructor(scene, board, position)
    {
        const modelpath = 
        (new RegExp(/\((\d+), (\d+)\)/).exec(position)[2] < 5) ? 
        'models/Knight/RedKnight.fbx' : 
        'models/Knight/GreenKnight.fbx';
        super(scene, board, modelpath, position);
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