import { getObjectsByProperty } from '../Engine/helpers.js';
import { TWEEN } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/libs/tween.module.min.js';

export class GameManager
{
    constructor(scene, io)
    {
        this.scene = scene;
        this.io = io;
        this.selected = {
            status: false,
            position: null,
            object: null
        };
    }

    makeTurn(object)
    {
        // No hay turno actualmente
        if (object.typeGame === 'Character' && !this.selected.status)
        {
            const regex = new RegExp(/\((\d+), (\d+)\)/);
            const values = regex.exec(object.cell);
            const x = Number(values[1]);
            const z = Number(values[2]);

            var moves = object.findMoves(this.scene, x, z);

            this.io.emit('select', {
                cells: moves,
                target: {
                    position: object.position,
                    cell: object.cell
                }
            });
        }

        if (this.selected.status && (object.typeGame !== 'Cell' || !object.selectable)
            && object.typeGame !== 'Character')
        {
            this.cleanCellsSelectable();
            this.freeObject();
        }

        if (object.typeGame === 'Cell' && this.selected.status && object.selectable) {

            this.io.emit('move', {
                target: {
                    startPosition: this.selected.object.position,
                    targetPosition: object.position,
                    startCell: this.selected.object.cell,
                    targetCell: object.name
                }
            });
        }
        
    }

    makeCellsSelectable(cells)
    {
        cells.forEach((coords) => {
            const cell = this.scene.getObjectByName(coords, true);
            if (cell !== undefined)
            {
                cell.material.color.setHex(0xa7bad0);
                cell.selectable = true;
            }
        });
    }

    cleanCellsSelectable()
    {
        const validCells = getObjectsByProperty(this.scene, 'selectable', true);
        validCells.forEach(cell => {
            cell.selectable = false;
            cell.material.color.setHex(0x958ae6);
        });
    }

    selectObject(position, cell)
    {
        this.selected = {
            status: true,
            object: {
                position: position,
                cell: cell
            }
        };
    }

    freeObject()
    {
        this.selected = {
            status: false,
            object: {
                position: null,
                cell: null
            }
        };
    }

    moveCharacter(startPosition, startCell, targetPosition, targetCell)
    {
        let selectedObject = getObjectsByProperty(this.scene, 'cell', startCell);
        if (selectedObject.length < 1) return;
        selectedObject = selectedObject[0];

        let angle = Math.atan2(
            startPosition.z - targetPosition.z,
            targetPosition.x - startPosition.x
        );
        angle += Math.PI / 2;

        const tween = new TWEEN.Tween(
            {
                x: startPosition.x,
                y: startPosition.y,
                z: startPosition.z
            }
        ).to(
            {
                x: targetPosition.x,
                y: startPosition.y,
                z: targetPosition.z
            }, 1000
        ).onStart(() => {
            selectedObject.actions['walking'].play();
        })
        .onUpdate(coords => {
            selectedObject.rotation.y = angle;
            selectedObject.position.set(coords.x, coords.y, coords.z);
        }).onComplete(() => {
            selectedObject.actions['walking'].stop();
            selectedObject.actions['idle'].play();
            //socket.emit('moveComplete', true);
            //socket.on('changeTurn', () => {

                selectedObject.cell = targetCell;
                this.freeObject();
                    
            //});
        });
        
        tween.start();
    }

    spawnItem()
    {
        
    }

    gameOver()
    {

    }

    scoring()
    {

    }
}