import { Book } from './book';
import { Ghost } from './ghost';
import { Potion } from './potion'

export class ItemFactory {

    constructor(scene) {
        this.scene = scene;
    }

    create(name) {
        switch (name) {
            case 'Potion':
                return new Potion(this.scene);
            case 'Book':
                return new Book(this.scene);
            case 'Ghost':
                return new Ghost(this.scene);
        }
    }

}