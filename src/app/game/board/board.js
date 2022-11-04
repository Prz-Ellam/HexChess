import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { getObjectsByProperty } from '@core/helpers';

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
        // board.position.set(this.position);

        for (let x = startX; x < endX; x++) {
            for (let z = startZ; z < endZ; z++) {

                const hexagon = new THREE.Mesh(
                    new THREE.CylinderGeometry(1.0, 1.0, 1.0, 6, 1, false),
                    new THREE.MeshPhongMaterial({ 
                        //clearcoat: 1.0,
                        //clearcoatRoughness: 0.1,
                        color : 0x958ae6,
                        ////flatShading: true,
                        //roughness: 0.5,
                        //metalness: 1.0,
                        //transparent: true,
                        //opacity: 1.0
                        ////specular: 0x4737a0,
                        //uuid: "0DD2D112-EA1F-3781-A46D-55B79A64DD19",
                        //vertexColors: 0,
                        //color: 16777215,
                        //depthWrite: true,
                        ////shininess: 32,
                        //depthTest: true,


                        specular: 0x5854ff,
                        flatShading: true,
                        vertexColors: 0,
                        //color: 0x632ecf,
                        depthWrite: true,
                       
                        shininess: 50,
                       
                        depthTest: true,
                        emissive: 0
                    })
                );

                hexagon.position.x = (z % 2 === 0) ? x : x + 0.5;
                hexagon.position.x *= this.space;
                hexagon.position.y = 0.5;
                hexagon.position.z = z * 1.535; // TODO: Numero magicos

                hexagon.castShadow = true;
                hexagon.receiveShadow = true;

                if (dificulty === 'Hard') {
                    let change = Math.random() * (2 - 1) + 1;
                    change = Math.round(change);
                    hexagon.scale.y = change;
                    hexagon.position.y = change / 2;
                }

                const xCoord = (x - startX) + 1;
                const zCoord = (z * -1) - startZ;
                hexagon.name = `(${xCoord}, ${zCoord})`;
                hexagon.isValid = false;
                hexagon.typeGame = 'Cell';

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
    makeSelectableCells(cells) {
        cells.forEach(coords => {
            const cell = this.scene.getObjectByName(coords, true);
            if (cell !== undefined) {
                cell.material.color.setHex(0xa7bad0);
                cell.selectable = true;
            }
        });
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
    }

    sizeVariation() {
        const cells = getObjectsByProperty(this.scene, 'typeGame', 'Cell');
        cells.forEach(cell => {
            let change = Math.random() * (2 - 1) + 1;

            const element = this.scene.getObjectByProperty('cell', cell.name);

            change = Math.round(change);
            //cell.scale.y = change;
            //cell.position.y += change / 2;

            const tween = new TWEEN.Tween({ position: cell.position.y, scale: cell.scale.y })
            .to({ position: change / 2, scale: change  }, 1000)
            .onStart(() => {
            })
            .onUpdate(status => {
                cell.scale.y = status.scale;
                cell.position.y = status.position;
                if (element !== undefined) {
                    element.position.y = status.position + (status.scale / 2.0);
                }
            });

            tween.start();
        });
    }

}