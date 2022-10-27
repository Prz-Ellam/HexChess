import { ForestMap } from './forest-map.js';
import { DesertMap } from './desert-map.js';
import { SnowMap } from './snow-map.js';

export class MapFactory
{

    constructor(scene)
    {
        this.scene = scene;
    }

    static create(name)
    {
        switch (name)
        {
            case 'Forest':
                  return new ForestMap(this.scene);
                break;
            case 'Snow':
                return new DesertMap(this.scene);
                break;
            case 'Desert':
                return new SnowMap(this.scene);
                break;
        }
    }
}
