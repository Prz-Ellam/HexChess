import { getObjectsByProperty } from '../Engine/helpers.js';
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