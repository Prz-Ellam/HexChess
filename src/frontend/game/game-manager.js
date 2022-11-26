import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { codeToVector, fadeToAction, getObjectsByProperty } from '../core/helpers';
import { Character } from './characters/character';

import Swal from 'sweetalert2';
import redForestVictory from '@images/JRojo-win-forest.png';
import redDesertVictory from '@images/JRojo-win-desert.png';
import redSnowVictory from '@images/JRojo-win-snow.png';
import greenForestVictory from '@images/JVerde-win-forest.png';
import greenDesertVictory from '@images/JVerde-win-desert.png';
import greenSnowVictory from '@images/JVerde-win-snow.png';
import { ItemFactory } from './items/item-factory';
import Mode from './config/mode';
import ObjectType from './config/object-type';
import Players from './config/players';
import Dificulty from './config/dificulty';
import Team from './config/team';

export class GameManager {
    constructor(scene, board, team, io, configuration, audio, router) {
        this.scene = scene;
        this.audio = audio;
        this.board = board;
        this.router = router;
        this.configuration = configuration;

        this.team = team;
        this.currentTeam = Team.RED;

        this.changeSide = false;
        this.io = io;
        this.items = 0;
        this.selected = {
            status: false,
            position: null,
            object: null
        };

        window.addEventListener('focus', () => {
            const items = getObjectsByProperty(this.scene, 'objectType', ObjectType.ITEM);
            items.forEach(item => {
                const hexagon = this.scene.getObjectByProperty('name', item.cell);
                item.staticPosition = hexagon.position.y + (hexagon.scale.y / 2.0);
            });
        });

        // Only multiplayer
        if (this.configuration.players === 'MULTIPLAYER') {
            this.io.on('select', data => this.select(data));
            this.io.on('move', data => this.move(data));
            this.io.on('deselect', () => this.deselect());
            this.io.on('setItem', data => setTimeout(this.setItem(data), 1000));
            this.io.on('setVariations', variations => this.board.setSizeVariations(variations));
        }
    }

    /**
     * Prepara un turno para un jugador
     * 
     * @param {Group} object - Un objeto 3D de THREE, sin especificar el tipo
     * @returns
     */
    processAction(object) {
        // Agarrar un turno
        if (object.objectType === ObjectType.CHARACTER &&   // Debe ser un personaje
            object.team === this.currentTeam &&             // Tiene que ser tu turno
            object.team === this.team) {                    // Tiene que ser tuyo

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.deselect();
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('deselect');
                    break;
            }

            const position = codeToVector(object.cell);
            const moves = object.findMoves(this.scene, position, this.changeSide);
            const data = {
                cells: moves,
                character: {
                    position: object.position,
                    cell: object.cell
                }
            }

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.select(data);
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('select', data);
                    break;
            }
        }

        // Deseleccionar
        if (this.selected.status && this.currentTeam === this.team &&
            (object.objectType !== ObjectType.CELL || !object.selectable) && // Una celda no seleccionable
            (object.objectType !== ObjectType.CHARACTER || object.team !== this.team)) { // Uno que no sea character

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.deselect();
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('deselect');
                    break;
            }
        }

        // Hay turno actualmente y se selecciona un elemento valido
        if (this.selected.status &&
            object.objectType === ObjectType.CELL && object.selectable) {

            const data = {
                startPosition: this.selected.object.position,
                startCell: this.selected.object.cell,
                targetPosition: object.position,
                targetCell: object.name
            }

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.move(data);
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('move', data);
                    break;
            }
        }
    }

    /**
     * 
     * @param {cells: Array<string>, target: {position: THREE.Vector3, cell: string}} data 
     */
    select(data) {
        this.board.makeSelectableCells(data);
        this.selected = {
            status: true,
            object: {
                position: data.character.position,
                cell: data.character.cell
            }
        };
    }

    deselect() {
        this.board.cleanSelectableCells();
        this.selected = {
            status: false,
            object: {
                position: null,
                cell: null
            }
        };
    }

    /**
     * {
     *   startPosition
     *   startCell
     *   targetPosition
     *   targetCell
     * }
     * @param {*} data 
     * @returns 
     */
    move(data) {
        // origin cell - target cell
        this.board.cleanSelectableCells();

        const targetObject = this.scene.getObjectByProperty('cell', data.targetCell);
        if (targetObject !== undefined) {
            switch (targetObject.objectType) {
                case ObjectType.CHARACTER: {
                    if (targetObject.team !== this.currentTeam) {
                        switch (this.configuration.mode) {
                            case Mode.CHECKMATE:
                                this.defeatCharacter(targetObject, data);
                                break;
                            case Mode.COLDWAR: {
                                const recruiterCharacter = this.scene.getObjectByProperty('cell', data.startCell);
                                this.changeCharacterTeam(targetObject, recruiterCharacter);
                                break;
                            }
                        }
                    }
                    return;
                }
                case ObjectType.ITEM: {
                    const character = this.scene.getObjectByProperty('cell', data.startCell);
                    this.getItem(character, targetObject);
                    break;
                }
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
     * Elimina un personaje de la escena
     * 
     * @param {Object3D} character 
     * @param {Object} data
     */
    defeatCharacter(character, data) {
        // Audio de muerte
        this.audio.death.play();

        // Animaciones
        character.actions['idle'].stop();
        character.actions['death'].play();

        // Esperar hasta que acabe la animacion
        setTimeout(() => {
            const defeatedTeam = character.team;
            this.scene.remove(character);

            const remainingTeam = getObjectsByProperty(this.scene, 'team', defeatedTeam).length;
            if (remainingTeam === 0) {
                this.gameOver();
            }

            this.moveCharacter(
                data.startPosition,
                data.startCell,
                data.targetPosition,
                data.targetCell
            );
        }, character.actions['death']._clip.duration * 1000 - 100);
    }

    changeCharacterTeam(character, recruiter) {
        this.audio.wololo.play();

        const team = recruiter.team;
        character.traverse(child => {
            if (child.isMesh) {
                child.material = Character.maps[team][character.character].clone();
                child.material.emissive = new THREE.Color(0x000000);
                child.material.opacity = 1.0;

                if (character.powerup) {
                    switch (character.powerup) {
                        case 'Ghost':
                            child.material.opacity = 0.2;
                            break;
                        case 'Book':
                            character.scale.set(.012, .012, .012);
                            break;
                        case 'Potion':
                            child.material.emissive = new THREE.Color(0x964B00);
                            break;
                    }
                }
            }
        });

        character.scale.set(.01, .01, .01);
        character.team = recruiter.team;

        this.changeSide = true;
        this.spawnItem();
        if (recruiter.powerup) {
            if (recruiter.powerup === 'Book') {
                this.currentTeam = (this.currentTeam === 'RED') ? 'GREEN' : 'RED';
            }

            recruiter.powerupTurns--;

            if (recruiter.powerupTurns < 0)
                recruiter.removePowerup();
        }
        this.iaTurn();
    }

    moveCharacter(startPosition, startCell, targetPosition, targetCell) {
        const selectedObject = this.scene.getObjectByProperty('cell', startCell);
        if (!selectedObject) return;

        let angle = Math.atan2(
            startPosition.z - targetPosition.z,
            targetPosition.x - startPosition.x
        );
        angle += Math.PI / 2;

        selectedObject.cell = targetCell;
        const tween = new TWEEN.Tween(
            {
                x: startPosition.x,
                y: startPosition.y,
                z: startPosition.z,
                start: 0.0
            }
        ).to(
            {
                x: targetPosition.x,
                y: startPosition.y,
                z: targetPosition.z,
                start: 1.0
            }, 1000
        ).onStart(() => {
            fadeToAction(
                selectedObject.actions['idle'],
                selectedObject.actions['walking'], 0.2);
        }).onUpdate(coords => {
            selectedObject.rotation.y = angle;

            let height = 0
            if (selectedObject.character == 'Imp') {
                height = 8 * coords.start * (1 - coords.start);
            }
            if (selectedObject.character == 'Monk') {
                this.audio.teleport.play();
                height = 1000;
            }

            selectedObject.position.set(coords.x, coords.y + height, coords.z);
        }).onComplete(() => {
            this.finishTurn(selectedObject);
        });

        tween.start();
    }

    finishTurn(character) {
        fadeToAction(character.actions['walking'], character.actions['idle'], 0.2);
        this.deselect();
        this.changeSide = false;

        // Si es de tu equipo o es singleplayer
        if (this.currentTeam === this.team || this.configuration.players == Players.SINGLEPLAYER) {
            const variations = this.board.createSizeVariations(this.configuration.dificulty);

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.board.setSizeVariations(variations);
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('setVariations', variations);
                    break;
            }
        }

        if (this.configuration.dificulty === Dificulty.NORMAL) {
            this.finishTurnActions(character);
        }
        else {
            setTimeout(() => {
                this.finishTurnActions(character);
            }, 1000);
        }
    }

    finishTurnActions(character) {
        // Aparece un item
        if (this.currentTeam === this.team || this.configuration.players === Players.SINGLEPLAYER)
            this.spawnItem();

        // Cambio de turno
        this.currentTeam = (this.currentTeam === 'RED') ? 'GREEN' : 'RED';

        // El personaje tiene un powerup
        if (character.powerup) {
            if (character.powerup === 'Book') {
                this.currentTeam = (this.currentTeam === 'RED') ? 'GREEN' : 'RED';
            }

            character.powerupTurns--;

            if (character.powerupTurns < 0)
                character.removePowerup();
        }
        this.iaTurn();
    }

    iaTurn() {
        // Si es contra IA
        if (this.currentTeam === 'GREEN' &&
            this.configuration.players === Players.SINGLEPLAYER) {

            const team = getObjectsByProperty(this.scene, 'team', Team.GREEN);
            let booleano = false;

            loop1:
            for (const character of team) {
                const position = codeToVector(character.cell);
                const moves = character.findMoves(this.scene, position, this.changeSide);
                loop2:
                for (const move of moves) {
                    const element = this.scene.getObjectByProperty('cell', move);
                    if (element) {
                        const hexagon = this.scene.getObjectByName(move);
                        if (!hexagon) continue;

                        switch (this.configuration.players) {
                            case Players.SINGLEPLAYER:
                                this.deselect();
                                break;
                            case Players.MULTIPLAYER:
                                this.io.emit('deselect');
                                break;
                        }

                        const data = {
                            cells: moves,
                            character: {
                                position: character.position,
                                cell: character.cell
                            }
                        }

                        switch (this.configuration.players) {
                            case Players.SINGLEPLAYER:
                                this.select(data);
                                break;
                            case Players.MULTIPLAYER:
                                this.io.emit('select', data);
                                break;
                        }

                        setTimeout(() => {
                            const data = {
                                startPosition: character.position,
                                targetPosition: hexagon.position,
                                startCell: character.cell,
                                targetCell: hexagon.name
                            }

                            this.move(data);
                        }, 1000);

                        booleano = true;
                        break loop1;
                    }
                }
            }

            if (booleano) return;

            const movableCharacters = [];
            for (const character of team) {
                const position = codeToVector(character.cell);
                const moves = character.findMoves(this.scene, position, this.changeSide);
                if (moves !== undefined && moves.length > 0) {
                    movableCharacters.push(character);
                }
            }

            const random = Math.round(Math.random() * (movableCharacters.length - 1));
            const newCharacter = movableCharacters[random];
            const position = codeToVector(newCharacter.cell);
            const moves = newCharacter.findMoves(this.scene, position, this.changeSide);
            const moveRandom = Math.round(Math.random() * (moves.length - 1));
            const move = moves[moveRandom];
            const newHexagon = this.scene.getObjectByName(move);

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.deselect();
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('deselect');
                    break;
            }

            const data = {
                cells: moves,
                character: {
                    position: newCharacter.position,
                    cell: newCharacter.cell
                }
            }

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.select(data);
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('select', data);
                    break;
            }

            setTimeout(() => {
                const data = {
                    startPosition: newCharacter.position,
                    targetPosition: newHexagon.position,
                    startCell: newCharacter.cell,
                    targetCell: newHexagon.name
                }

                this.move(data);
            }, 1000);

        }
    }

    spawnItem() {
        if (this.items >= 3) {
            return;
        }

        const charactersCount = getObjectsByProperty(this.scene, 'objectType', ObjectType.CHARACTER).length;
        const percentage = -Math.log(charactersCount) * 3 + 30;
        const random = Math.round(Math.random() * 100); // Random between 0 - 100

        if (random < percentage) {

            // Get objects has property
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

            const chosenCellIndex = Math.round(Math.random() * freeCells.length);
            const chosenCell = freeCells[chosenCellIndex];

            const itemType = Math.round(Math.random() * 2);
            const types = ['Potion', 'Book', 'Ghost'];
            const item = types[itemType];

            switch (this.configuration.players) {
                case Players.SINGLEPLAYER:
                    this.setItem({ cell: chosenCell, type: item });
                    break;
                case Players.MULTIPLAYER:
                    this.io.emit('setItem', { cell: chosenCell, type: item });
                    break;
            }
        }
    }

    setItem(data) {
        const item = data.type;
        const itemFactory = new ItemFactory(this.scene);
        itemFactory.create(item, data.cell);
        this.items++;
    }

    getItem(character, item) {
        this.audio.powerup.play();
        character.setPowerup(item.type);
        this.scene.remove(item);
        this.items--;
    }

    gameOver() {
        if (this.configuration.players === Players.MULTIPLAYER) {
            fetch('/api/v1/games', {
                method: 'POST'
            })
                .then(res => res.json())
                .then(res => {
                    this.gameOverScreen();
                });
        }
        else {
            this.gameOverScreen();
        }
    }

    gameOverScreen() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '447339420703828',
                xfbml: true,
                version: 'v2.9'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        Swal.fire({
            title: '¡GANASTE!',
            background: '#1B1B36',
            imageUrl: redForestVictory,
            imageAlt: 'Game over',
            width: '800px',
            buttonsStyling: false,
            showConfirmButton: true,
            confirmButtonText: 'Continuar',
            showCancelButton: true,
            cancelButtonText: '',
            reverseButtons: true,
            customClass: {
                title: 'title-style',
                confirmButton: 'btn button button-anim btn-next',
                cancelButton: 'fb-share-button bg-blue mx-5'
            },
            backdrop: `rgba(0, 0, 123, 0.4)`
        })
            .then(result => {
                if (result.isConfirmed) {

                }
                else if (result.isDismissed) {
                    FB.ui({
                        method: 'share',
                        href: 'https://hex-chess.azurewebsites.net/',
                        quote: '¡MAMAAAAA! Gane una partida de HexChess'
                    }, function (response) { });
                }
                //this.audio.sound.stop();
                //this.router.redirect('/');
                window.location.href = '/';
            });
    }

}
