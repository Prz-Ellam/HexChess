import * as THREE from 'three';

export class Item {

    onUpdate(delta) {
        this.angle += delta * 50.0;
        this.rotation.y += delta;
        this.position.y = this.staticPosition + (0.1 * Math.sin(THREE.MathUtils.degToRad(this.angle)));
    }

}