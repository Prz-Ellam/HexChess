import { CharacterFactory } from '@characters/character-factory';

export class BoardDirector
{
    constructor() {
        
        this.board = [
            [ 'MonkGreen', 'MonkGreen', 'ImpGreen', 'PeasantGreen', 'WitchGreen', 'LadyGreen', 'PeasantGreen', 'ImpGreen', 'MonkGreen', 'MonkGreen' ],
            [ 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen', 'KnightGreen' ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed', 'KnightRed' ],
            [ 'MonkRed', 'MonkRed', 'ImpRed', 'PeasantRed', 'LadyRed', 'WitchRed', 'PeasantRed', 'ImpRed', 'MonkRed', 'MonkRed' ]
        ];
        
        /*
        this.board = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'Potion', 'PeasantRed', 'KnightGreen', 'KnightGreen', 'KnightRed', 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        ];
        */
       /*
        this.board = [
            [ 0, 0, 0, 0, 0, 0, 0, 'KnightGreen', 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 'KnightGreen', 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'Ghost', 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'KnightRed', 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'KnightRed', 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'KnightRed', 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'KnightRed', 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 'KnightRed', 0, 0, 0, 0, 0, 0, 0 ],
        ];
        */
    }

    create(scene, board) {
        const characterFactory = new CharacterFactory(scene, board);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.board[i][j] === 0) continue;
                characterFactory.create(this.board[i][j], `(${j + 1}, ${10 - i})`);
            }
        }
    }
    
}
