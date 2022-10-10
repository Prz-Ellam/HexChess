import { CharacterFactory } from './character-factory.js';

export class BoardDirector
{
    constructor() {
        this.board = [
            [ 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight' ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight' ]
        ];
    }

    create(scene, board)
    {
        const characterFactory = new CharacterFactory(scene, board);
        for (let i = 0; i < 10; i++)
        {
            for (let j = 0; j < 10; j++)
            {
                if (this.board[i][j] === 0) continue;

                characterFactory.create(this.board[i][j], `(${j + 1}, ${10 - i})`);
            }
        }
    }
    
}
