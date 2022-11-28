import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { getObjectsByProperty } from '@core/helpers';
import Dificulty from '../config/dificulty';
import ObjectType from '../config/object-type';

export class Board {

    constructor(scene, position, count, space, dificulty) {
        this.scene = scene;
        this.position = position;
        this.count = count;
        this.space = space;
        this.create(dificulty);
    }

    /**
     * @autor Prz-Ellam
     * @date 2022-30-10
     * @param {string} dificulty - Especifica la dificultad del juego, puede ser 'Easy' o 'Hard'
     */
    create(dificulty) {

        const startX = Math.round(this.position.x - (this.count.x / 2));
        const startZ = Math.round(this.position.y - (this.count.y / 2));
        const endX = Math.round(this.position.x + (this.count.x / 2));
        const endZ = Math.round(this.position.y + (this.count.y / 2));

        const board = new THREE.Object3D();

        for (let x = startX; x < endX; x++) {
            for (let z = startZ; z < endZ; z++) {

                const hexagon = new THREE.Mesh(
                    new THREE.CylinderGeometry(1.0, 1.0, 1.0, 6, 1, false),
                    new THREE.MeshPhongMaterial({
                        color : 0x958ae6,
                        specular: 0x5854ff,
                        flatShading: true,
                        vertexColors: 0,
                        depthWrite: true,
                        shininess: 50,
                        depthTest: true,
                        emissive: 0
                    })
                );

                hexagon.castShadow = true;
                hexagon.receiveShadow = true;

                hexagon.position.x = (z % 2 === 0) ? x : x + 0.5;
                hexagon.position.x *= this.space;
                hexagon.position.y = 0.5;
                hexagon.position.z = z * 1.535;

                const xCoord = (x - startX) + 1;
                const zCoord = (z * -1) - startZ;
                hexagon.name = `(${xCoord}, ${zCoord})`;
                hexagon.isValid = false;
                hexagon.typeGame = 'Cell';
                hexagon.objectType = ObjectType.CELL;

                board.add(hexagon);
            }
        }

        board.name = 'Board';
        this.scene.add(board);
        this.size = new THREE.Vector2(endX - startX, endZ - startZ);
    }

    /**
     * @autor Prz-Ellam
     * @date 2022-10-30
     * @param {Array<string>} cells - Arreglo con los codigos de todas las celdas que serán seleccionables
     */
    makeSelectableCells(data) {
        data.cells.forEach(cell => {
            const hexagon = this.scene.getObjectByName(cell, true);
            if (hexagon !== undefined) {
                let color = 0xA7BAD0;
                const object = this.scene.getObjectByProperty('cell', cell);
                if (object !== undefined) {
                    switch (object.objectType) {
                        case ObjectType.CHARACTER:
                            color = '0xFF8178';
                            break;
                        case ObjectType.ITEM:
                            color = '0x8CDBA9';
                            break;
                    }
                }

                hexagon.material.color.setHex(color);
                hexagon.selectable = true;
            }
        });
        const principalHexagon = this.scene.getObjectByName(data.character.cell, true);
        if (principalHexagon !== undefined) {
            principalHexagon.material.color.setHex(0xCED16D);
            principalHexagon.standing = true;
        }
    }

    /**
     * @autor Prz-Ellam
     * @date 2022-10-30
     * @return {void} void
     */
    cleanSelectableCells() {
        const selectableCells = getObjectsByProperty(this.scene, 'selectable', true);
        selectableCells.forEach(cell => {
            cell.selectable = false;
            cell.material.color.setHex(0x958ae6);
        });
        const selectableCells2 = getObjectsByProperty(this.scene, 'standing', true);
        selectableCells2.forEach(cell => {
            cell.selectable = false;
            cell.material.color.setHex(0x958ae6);
        });
    }

    createSizeVariations(dificulty) {
        const cells = getObjectsByProperty(this.scene, 'objectType', ObjectType.CELL);
        const cellsVariations = [];
        cells.forEach(cell => {
            let change = Math.random() * (2 - 1) + 1;
            change = Math.round(change);
            if (dificulty === 'NORMAL') change = 1.0;
            cellsVariations.push(change);
        });
        return cellsVariations;
    }

    setSizeVariations(cellsVariations) {
        const cells = getObjectsByProperty(this.scene, 'objectType', ObjectType.CELL);

        cells.forEach((cell, i) => {
            const element = this.scene.getObjectByProperty('cell', cell.name);

            const tween = new TWEEN.Tween({ position: cell.position.y, scale: cell.scale.y })
            .to({ position: cellsVariations[i] / 2, scale: cellsVariations[i]  }, 1000)
            .onStart(() => {
            })
            .onUpdate(status => {
                cell.scale.y = status.scale;
                cell.position.y = status.position;
                if (element !== undefined) {
                    if (element.objectType === ObjectType.ITEM) {
                        element.staticPosition = status.position + (status.scale / 2.0);
                    }
                    else {
                        element.position.y = status.position + (status.scale / 2.0);
                    }
                }
            });

            tween.start();
        });
    }

}