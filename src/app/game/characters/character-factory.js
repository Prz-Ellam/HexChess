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
        }

        return null;
    }
}