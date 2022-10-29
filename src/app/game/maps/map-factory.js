import { ForestMap } from './forest-map';
import { DesertMap } from './desert-map';
import { SnowMap } from './snow-map';

export class MapFactory {

    constructor(scene, name) {
        this.scene = scene;
        this.create(name);
    }

    create(name) {
        switch (name) {
            case 'Forest':
                return new ForestMap(this.scene);
            case 'Snow':
                return new SnowMap(this.scene);
            case 'Desert':
                return new DesertMap(this.scene);
        }
    }
}
