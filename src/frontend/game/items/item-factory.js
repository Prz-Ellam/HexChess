import { Book } from './book';
import { Ghost } from './ghost';
import { Potion } from './potion';

export class ItemFactory {

    constructor(scene) {
        this.scene = scene;
    }

    create(name, cell) {
        switch (name) {
            case 'Potion':
                return new Potion(this.scene, cell);
            case 'Book':
                return new Book(this.scene, cell);
            case 'Ghost':
                return new Ghost(this.scene, cell);
            default:
                console.warn(`No item named ${name}`);
        }
    }

}