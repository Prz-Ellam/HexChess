export class GameManager
{
    constructor(scene)
    {
        this.scene = scene;
        this.selectedObject = null;
    }

    makeTurn(object)
    {
        // No hay turno actualmente
        if (object.typeGame === 'Character' && !this.selectedObject)
        {
            const regex = new RegExp(/\((\d+), (\d+)\)/);
            const values = regex.exec(object.cell);
            const x = Number(values[1]);
            const z = Number(values[2]);

            var moves = object.findMoves(x, z);
            moves = moves.filter(coord => {
                anotherObject = getObjectsByProperty(this.scene, 'cell', coord);

                if (anotherObject.length === 0)
                {
                    return true;
                }
                if (anotherObject[0].team !== object.team)
                {
                    return true;
                }
                return false;

            });

            moves.forEach((coords) => {
                const cell = this.scene.getObjectByName(coords, true);
                if (cell !== undefined)
                {
                    cell.material.color.setHex(0x858080);
                    cell.isValid = true;
                }
            });

            this.selectedObject = container;
        }

        if (object.typeGame === 'Cell' && this.selectedObject !== null
            && object.isValid === true) {

            var e = getObjectsByProperty(this.scene, 'cell', object.name);
            if (e.length !== 0) 
            {
                this.scene.remove(e[0]);
            }

            this.selectedObject.cell = object.name;

            const validCells = getObjectsByProperty(this.scene, 'isValid', true);
            validCells.forEach(cell => {
                cell.isValid = false;
                cell.material.color.setHex(0x958ae6);
            });

            //this.startMove = true;
            //this.startPosition = this.selectedObject.position;
            //this.endPosition = new THREE.Vector3(container.position.x, this.startPosition.y, container.position.z);
            //this.endPosition.y = this.startPosition.y;
            
            this.selectedObject = null;
            //this.change = false;
        }
    }

    spawnItem()
    {
        
    }
}