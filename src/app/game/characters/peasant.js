import * as THREE from 'three';
import { Character } from "./character.js";

export class Peasant extends Character
{
    constructor(scene, board, position)
    {
        const modelpath = 'models/Peasant/scene.gltf';
        super(scene, board, modelpath, position);
    }

    findMoves(scene, position) {
        const x = position.x;
        const z = position.y;

        const valids = [];

        let coords = [];
        let start = z;
        while (start <= this.boardCount.y)
        {
            console.log(start);
            start++;
            coords.push(new THREE.Vector2(x, start));
        }

        //coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));
        //coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));
        //coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));
        //coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));

        coords = coords.filter(coord => 
            coord.x <= this.boardCount.x && coord.x >= 1 && 
            coord.y <= this.boardCount.y && coord.y >= 1
        );

        coords.forEach(coords => valids.push(`(${coords.x}, ${coords.y})`))
                
        return valids;
    }
}