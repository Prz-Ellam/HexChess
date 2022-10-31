import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { codeToVector, getObjectsByProperty } from '../core/helpers';

export class GameManager {
    constructor(scene, board, team, io, configuration) {
        this.team = team;
        this.currentTeam = 'A';
        this.scene = scene;
        this.board = board;
        this.configuration = configuration;
        this.io = io;
        this.selected = {
            status: false,
            position: null,
            object: null
        };

        // Only multiplayer
        this.io.on('select', data => { this.select(data) });
        this.io.on('move', data => { this.move(data) });
        this.io.on('deselect', () => { this.deselect() });
    }

    /**
     * Prepara un turno para un jugador
     * 
     * @param {Group} object 
     * @returns
     */
    processAction(object) {
        // No hay turno actualmente
        // this.selected.status dice si ya hay un objeto seleccionado (true) o no (false)
        if (object.typeGame === 'Character' && !this.selected.status &&
            object.team === this.currentTeam && object.team === this.team) {

            const position = codeToVector(object.cell);
            const moves = object.findMoves(this.scene, position);
            const data = {
                cells: moves,
                character: {
                    position: object.position,
                    cell: object.cell
                }
            }

            /*
            if (singleplayer) {
                this.select(data);
            }
            else {
                this.io.emit('select', data);
            }
            */

            //this.select(data);
            this.io.emit('select', data);
        }

        // Hay turno actualmente y se selecciona un objeto no valido
        if (this.selected.status && (object.typeGame !== 'Cell' || !object.selectable)
            && object.typeGame !== 'Character') {

            this.io.emit('deselect');
            //this.deselect();
        }

        // Hay turno actualmente y se selecciona un elemento valido
        if (object.typeGame === 'Cell' && this.selected.status && object.selectable) {
            const data = {
                startPosition: this.selected.object.position,
                targetPosition: object.position,
                startCell: this.selected.object.cell,
                targetCell: object.name
            }

            //this.move(data);
            this.io.emit('move', data)
        }
    }

    makeIaTurn() {

    }

    /**
     * 
     * @param {cells: Array<string>, target: {position: THREE.Vector3, cell: string}} data 
     */
    select(data) {
        this.board.makeSelectableCells(data.cells);
        this.selectObject(data.character.position, data.character.cell);
    }

    deselect() {
        this.board.cleanSelectableCells();
        this.deselectObject();
    }

    move(data) {
        this.board.cleanSelectableCells();

        let targetCharacter = this.scene.getObjectByProperty('cell', data.targetCell);
        if (targetCharacter !== undefined) {
            // Checkmate
            if (this.configuration.mode === 'checkmate')
                this.defeatCharacter(targetCharacter, data);
            else if (this.configuration.mode === 'coldwar') {
            // Coldwar
                var recruiterCharacter = this.scene.getObjectByProperty('cell', data.startCell);
                this.changeCharacterTeam(targetCharacter, recruiterCharacter);
            }
            return;
        }

        this.moveCharacter(
            data.startPosition,
            data.startCell,
            data.targetPosition,
            data.targetCell
        );
    }

    /**
     * Selecciona un personaje
     * 
     * @param {THREE.Vector3} position 
     * @param {String} cell 
     */
    selectObject(position, cell) {
        this.selected = {
            status: true,
            object: {
                position: position,
                cell: cell
            }
        };
    }

    /**
     * Deselecciona un personaje
     */
    deselectObject() {
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

        setTimeout(() => {
            this.moveCharacter(
                data.startPosition,
                data.startCell,
                data.targetPosition,
                data.targetCell
            );
            const defeatedTeam = character.team;
            this.scene.remove(character);

            const remainingTeam = getObjectsByProperty(this.scene, 'team', defeatedTeam).length;
            if (remainingTeam === 0) alert(`Perdio el equipo ${defeatedTeam}`);

        }, character.actions['death']._clip.duration * 1000 - 10);
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

        this.deselectObject();
    }

    moveCharacter(startPosition, startCell, targetPosition, targetCell) {
        // Transición entre animaciones fluida
        function fadeToAction(previousAction, activeAction, duration) {
            if (previousAction !== activeAction) {
                previousAction.fadeOut(duration);
            }

            activeAction
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();
        }

        let selectedObject = this.scene.getObjectByProperty('cell', startCell);
        if (selectedObject === undefined) return;

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
            fadeToAction(
                selectedObject.actions['idle'],
                selectedObject.actions['walking'], 0.2);
            //selectedObject.actions['walking'].play();
        }).onUpdate(coords => {
            selectedObject.rotation.y = angle;
            selectedObject.position.set(coords.x, coords.y, coords.z);
        }).onComplete(() => {
            fadeToAction(
                selectedObject.actions['walking'],
                selectedObject.actions['idle'], 0.2)
            
            //selectedObject.actions['walking'].stop();
            //selectedObject.actions['idle'].play();
            //socket.emit('moveComplete', true);
            //socket.on('changeTurn', () => {

            selectedObject.cell = targetCell;
            this.deselectObject();

            this.currentTeam = (this.currentTeam === 'A') ? 'B' : 'A';
            this.spawnItem();

            // Si es contra IA
            // if (this.currentTeam === 'B') {
                //alert('JAJAJA');
                
                //this.makeIaTurn();

                //this.currentTeam = 'A';
            //}

            //});
        });

        tween.start();
    }

    spawnItem() {

        const charactersCount = getObjectsByProperty(this.scene, 'typeGame', 'Character').length;
        const percentage = -Math.log(charactersCount) * 3 + 30;
        const random = Math.random() * 100;

        if (random < percentage) {
            const ocupiedCells = [];
            this.scene.traverse(child => {
                if (child.cell) {
                    ocupiedCells.push(child.cell);
                }
            });

            const freeCells = [];
            for (let i = 0; i < this.board.count.x; i++) {
                for (let j = 0; j < this.board.count.y; j++) {
                    if (!ocupiedCells.includes(`(${i + 1}, ${j + 1})`)) {
                        freeCells.push(`(${i + 1}, ${j + 1})`);
                    }
                }
            }

            const chosenCellIndex = parseInt(Math.random() * freeCells.length);
            const chosenCell = freeCells[chosenCellIndex];
            const hexagon = this.scene.getObjectByName(chosenCell);

            // Add an item to the scene
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 1.0, 1.0), 
                new THREE.MeshStandardMaterial({ color : 0xC62F2F })
            );

            cube.position.x = hexagon.position.x;
            cube.position.y = hexagon.position.y + (hexagon.scale.y / 2.0);
            cube.position.z = hexagon.position.z;

            this.scene.add(cube);

        }

    }

    gameOver() {

    }

    scoring() {

    }
}
