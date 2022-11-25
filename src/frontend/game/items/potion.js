import * as THREE from 'three';
import Resources from '../../core/resources';
import ObjectType from '../config/object-type';

export class Potion {

    constructor(scene, cell) {
        this.create(scene, cell);
    }

    create(scene, cell) {
        const object = Resources.items['Potion'].clone();
        object.traverse(child => {
            child.castShadow = true;
            child.receiveShadow = true;
        });

        object.scale.set(.001, .001, .001);
        object.castShadow = true;
        object.receiveShadow = true;

        const hexagon = scene.getObjectByName(cell);
        if (!hexagon) return;

        object.position.x = hexagon.position.x;
        object.position.y = hexagon.position.y + (hexagon.scale.y / 2.0);
        object.staticPosition = object.position.y;
        object.position.z = hexagon.position.z;

        object.userData.isContainer = true;
        object.type = 'Potion';
        object.typeGame = 'Item';
        object.cell = hexagon.name;
        object.objectType = ObjectType.ITEM;

        object.onUpdate = this.onUpdate;
        object.angle = 0.0;

        scene.add(object);
    }

    onUpdate(delta) {
        this.angle += delta * 50.0;
        this.rotation.y += delta;
        this.position.y = this.staticPosition + (0.1 * Math.sin(THREE.MathUtils.degToRad(this.angle)));
    }

}