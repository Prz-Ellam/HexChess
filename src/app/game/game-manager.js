
import { getObjectsByProperty } from '../core/helpers';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

export class GameManager {
    constructor(scene, io) {
        this.scene = scene;
        this.io = io;
        this.selected = {
            status: false,
            position: null,
            object: null
        };
    }

    makeTurn(object) {
        // No hay turno actualmente
        if (object.typeGame === 'Character' && !this.selected.status) {
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
            && object.typeGame !== 'Character') {
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

    makeCellsSelectable(cells) {
        cells.forEach((coords) => {
            const cell = this.scene.getObjectByName(coords, true);
            if (cell !== undefined) {
                cell.material.color.setHex(0xa7bad0);
                cell.selectable = true;
            }
        });
    }

    cleanCellsSelectable() {
        const validCells = getObjectsByProperty(this.scene, 'selectable', true);
        validCells.forEach(cell => {
            cell.selectable = false;
            cell.material.color.setHex(0x958ae6);
        });
    }

    selectObject(position, cell) {
        this.selected = {
            status: true,
            object: {
                position: position,
                cell: cell
            }
        };
    }

    freeObject() {
        this.selected = {
            status: false,
            object: {
                position: null,
                cell: null
            }
        };
    }

    defeatCharacter(character, data) {
        character.actions['idle'].stop();
        character.actions['death'].play();
        const defeatedTeam = character.team;
        // this.scene.remove(e[0]);
        const remainingTeam = getObjectsByProperty(this.scene, 'team', defeatedTeam).length;
        if (remainingTeam === 0) alert(`Perdio el equipo ${defeatedTeam}`);

        setTimeout(() => {
            this.moveCharacter(
                data.target.startPosition,
                data.target.startCell,
                data.target.targetPosition,
                data.target.targetCell
            );
            this.scene.remove(character);
        }, character.actions['death']._clip.duration * 1000);
    }

    changeCharacterTeam(character, recruiter) {
        let recruiterMap;
        recruiter.traverse(child => {
            if (child.isMesh) {
                recruiterMap = child.material;
                return;
            }
        });

        character.traverse(child => {
            if (child.isMesh) {
                child.material = recruiterMap.clone();
                character.team = recruiter.team;
            }
        });

        this.freeObject();
    }

    moveCharacter(startPosition, startCell, targetPosition, targetCell) {

        function fadeToAction(previousAction, activeAction, duration) {

            if (previousAction !== activeAction) {

                previousAction.fadeOut( duration );

            }

            activeAction
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();

        }

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
            fadeToAction(selectedObject.actions['idle'],
            selectedObject.actions['walking'], 0.2);
            //selectedObject.actions['walking'].play();
        }).onUpdate(coords => {
            selectedObject.rotation.y = angle;
            selectedObject.position.set(coords.x, coords.y, coords.z);
        }).onComplete(() => {
            fadeToAction(selectedObject.actions['walking'],
            selectedObject.actions['idle'], 0.2)
            //selectedObject.actions['walking'].stop();
            //selectedObject.actions['idle'].play();
            //socket.emit('moveComplete', true);
            //socket.on('changeTurn', () => {

            selectedObject.cell = targetCell;
            this.freeObject();

            //});
        });

        tween.start();
    }

    spawnItem() {

        const charactersCount = getObjectsByProperty(this.scene, 'typeGame', 'Character').length;
        const percentage = -Math.log(charactersCount) * 3 + 30;
        const random = Math.random() * 100;

        if (random < percentage)
        {
            // Si
        }

    }

    gameOver() {

    }

    scoring() {

    }
}
