import { Knight } from './knight.js';
import { Monk } from './monk.js';
import { Peasant } from './peasant.js';

export class CharacterFactory
{
    constructor(scene, board)
    {
        this.scene = scene;
        this.board = board;
    }

    create(name, position)
    {
        switch (name)
        {
            case 'Monk':
                return new Monk(this.scene, this.board, position);
            case 'Peasant':
                return new Peasant(this.scene, this.board, position);
            case 'Knight':
                return new Knight(this.scene, this.board, position)
        }

        return null;
    }
}