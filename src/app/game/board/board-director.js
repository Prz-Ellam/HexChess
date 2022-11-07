import { CharacterFactory } from '@characters/character-factory';

export class BoardDirector
{
    constructor() {
        /*
        this.board = [
            [ 'Monk', 'Monk', 'Imp', 'Peasant', 'Witch', 'Lady', 'Peasant', 'Imp', 'Monk', 'Monk' ],
            [ 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight' ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 'Peasant', 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight', 'Knight' ],
            [ 'Monk', 'Monk', 'Imp', 'Peasant', 'Lady', 'Witch', 'Peasant', 'Imp', 'Monk', 'Monk' ]
        ];
        */
        
        this.board = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 'Imp', 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 'Lady', 0, 'Imp', 'Imp', 0, 'Peasant', 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        ];
        
    }

    async create(scene, board) {
        const characterFactory = new CharacterFactory(scene, board);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.board[i][j] === 0) continue;
                await characterFactory.create(this.board[i][j], `(${j + 1}, ${10 - i})`);
            }
        }
    }
    
}
