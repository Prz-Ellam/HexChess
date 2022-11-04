import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { codeToVector, getObjectsByProperty } from '../core/helpers';
import { Character } from './characters/character';
import { Potion } from './items/potion';

export class GameManager {
    constructor(scene, board, team, io, configuration) {
        this.team = team;
        this.currentTeam = 'A';
        this.scene = scene;
        this.board = board;
        this.configuration = configuration;
        this.changeSide = false;
        this.io = io;
        this.selected = {
            status: false,
            position: null,
            object: null
        };
        this.items = [];

        // Only multiplayer
        if (this.configuration.players === 'multiplayer') {
            this.io.on('select', data => { this.select(data) });
            this.io.on('move', data => { this.move(data) });
            this.io.on('deselect', () => { this.deselect() });
        }
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
            const moves = object.findMoves(this.scene, position, this.changeSide);


            const data = {
                cells: moves,
                character: {
                    position: object.position,
                    cell: object.cell
                }
            }

            if (this.configuration.players === 'singleplayer') {
                this.select(data);
            }
            else if (this.configuration.players === 'multiplayer') {
                this.io.emit('select', data);
            }

            //this.select(data);
            //this.io.emit('select', data);
        }

        // Hay turno actualmente y se selecciona un objeto no valido
        if (this.selected.status && (object.typeGame !== 'Cell' || !object.selectable)
            && object.typeGame !== 'Character') {

            if (this.configuration.players === 'singleplayer') {
                this.deselect();
            }
            else if (this.configuration.players === 'multiplayer') {
                this.io.emit('deselect');
            }

            //this.io.emit('deselect');
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

            if (this.configuration.players === 'singleplayer') {
                this.move(data);
            }
            else if (this.configuration.players === 'multiplayer') {
                this.io.emit('move', data);
            }

            //this.move(data);
            //this.io.emit('move', data)
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

        let targetObject = this.scene.getObjectByProperty('cell', data.targetCell);
        if (targetObject !== undefined) {
            if (targetObject.typeGame === 'Character') {
                // Checkmate
                if (this.configuration.mode === 'checkmate')
                    this.defeatCharacter(targetObject, data);
                else if (this.configuration.mode === 'coldwar') {
                // Coldwar
                    var recruiterCharacter = this.scene.getObjectByProperty('cell', data.startCell);
                    this.changeCharacterTeam(targetObject, recruiterCharacter);
                }
                return;
            }
            else if (targetObject.typeGame === 'Item') {
                // Item
                var character = this.scene.getObjectByProperty('cell', data.startCell);
                this.getItem(character, targetObject);
            }
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
        console.log(Character.maps);
        
        const team = recruiter.team;
        console.log(team);

        character.traverse(child => {
            if (child.isMesh) {
                //child.material = recruiterMap.clone();
                child.material = Character.maps[team][character.character].clone();
                character.team = recruiter.team;
            }
        });

        this.changeSide = true;
        this.deselectObject();
        //this.currentTeam = (this.currentTeam === 'A') ? 'B' : 'A';
        this.spawnItem();
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

        const startCoords = codeToVector(startCell);
        const targetCoords = codeToVector(targetCell);

        let distance = Math.sqrt(
            Math.pow(targetCoords.y - startCoords.y, 2) +
            Math.pow(targetCoords.x - startCoords.x, 2));
        console.log(distance);

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
            }, 1000 //distance * 1000
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
                selectedObject.actions['idle'], 0.2);
            
            //selectedObject.actions['walking'].stop();
            //selectedObject.actions['idle'].play();
            //socket.emit('moveComplete', true);
            //socket.on('changeTurn', () => {

            selectedObject.cell = targetCell;
            this.changeSide = false;
            this.deselectObject();

            

            this.currentTeam = (this.currentTeam === 'A') ? 'B' : 'A';
            this.spawnItem();

            if (this.configuration.dificulty === 'Hard')
                this.board.sizeVariation();

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

        if (this.items.length >= 3) {
            return;
        }

        const charactersCount = getObjectsByProperty(this.scene, 'typeGame', 'Character').length;
        const percentage = -Math.log(charactersCount) * 3 + 30;
        const random = Math.random() * 100;

        if (random > percentage) {
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

            const potion = new Potion(this.scene, chosenCell);

        }

    }

    getItem(character, item) {

        //character.powerup = item.type;
        character.setPowerup(item.type);
        this.scene.remove(item);

    }

    gameOver() {

    }

    scoring() {

    }
}
