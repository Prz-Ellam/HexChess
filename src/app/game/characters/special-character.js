import { Character } from "./character.js";

export class SpecialCharacter extends Character {

    model;

    constructor(scene, board) {
        this.super(scene, board);
    }

    getMoves() {
        const valids = [];
        valids.push(`(${x - 1}, ${z})`);
        valids.push(`(${x + 1}, ${z})`);

        if (z % 2 !== 0)
        {
            valids.push(`(${x}, ${z - 1})`);
            valids.push(`(${x}, ${z + 1})`);

            valids.push(`(${x - 1}, ${z - 1})`);
            valids.push(`(${x - 1}, ${z + 1})`);
        }
        else
        {
            valids.push(`(${x + 1}, ${z - 1})`);
            valids.push(`(${x + 1}, ${z + 1})`);

            valids.push(`(${x}, ${z - 1})`);
            valids.push(`(${x}, ${z + 1})`);
        }
    }

    findMoves(x, z) {

        const valids = [];
    
        let coords = [];
        coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));
        coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));
        coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));
    
        coords = coords.filter(coord => 
            (coord.x <= board.count.x && coord.x >= 1 && coord.y <= board.count.y && coord.y >= 1)
        );
    
        coords.forEach(coords => valids.push(`(${coords.x}, ${coords.y})`))
        
        return valids;
    
    }

}