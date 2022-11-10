import { Book } from '../items/book';
import { Ghost } from '../items/ghost';
import { Potion } from '../items/potion';
import { Imp } from './imp';
import { Knight } from './knight';
import { Lady } from './lady';
import { Monk } from './monk';
import { Peasant } from './peasant';
import { Witch } from './witch';

export class CharacterFactory {
    constructor(scene, board) {
        this.scene = scene;
        this.board = board;
    }

    create(name, position) {
        switch (name) {
            case 'Monk':
                return new Monk(this.scene, this.board, position);
            case 'Peasant':
                return new Peasant(this.scene, this.board, position);
            case 'Knight':
                return new Knight(this.scene, this.board, position);
            case 'Imp':
                return new Imp(this.scene, this.board, position);
            case 'Lady':
                return new Lady(this.scene, this.board, position);
            case 'Witch':
                return new Witch(this.scene, this.board, position);

            case 'MonkRed':
                return new Monk(this.scene, this.board, position, 'RED');
            case 'PeasantRed':
                return new Peasant(this.scene, this.board, position, 'RED');
            case 'KnightRed':
                return new Knight(this.scene, this.board, position, 'RED');
            case 'ImpRed':
                return new Imp(this.scene, this.board, position, 'RED');
            case 'LadyRed':
                return new Lady(this.scene, this.board, position, 'RED');
            case 'WitchRed':
                return new Witch(this.scene, this.board, position, 'RED');

            case 'MonkGreen':
                return new Monk(this.scene, this.board, position, 'GREEN');
            case 'PeasantGreen':
                return new Peasant(this.scene, this.board, position, 'GREEN');
            case 'KnightGreen':
                return new Knight(this.scene, this.board, position, 'GREEN');
            case 'ImpGreen':
                return new Imp(this.scene, this.board, position, 'GREEN');
            case 'LadyGreen':
                return new Lady(this.scene, this.board, position, 'GREEN');
            case 'WitchGreen':
                return new Witch(this.scene, this.board, position, 'GREEN');


            case 'Potion':
                return new Potion(this.scene, position);
            case 'Book':
                return new Book(this.scene, position);
            case 'Ghost':
                return new Ghost(this.scene, position);
        }

        return null;
    }
}