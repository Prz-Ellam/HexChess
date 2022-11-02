import Boats from './boats'
import Potion from './potion'

export class ItemFactory {

    constructor() {
        
    }

    create(name) {
        switch (name) {
            case 'Potion':
                return new Potion(this.scene);
        }
    }

}