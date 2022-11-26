import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

import { Board } from '@board/board';
import { getObjectsByProperty, getContainerObjByChild } from './helpers';
import { BoardDirector } from '../game/board/board-director';
import { GameManager } from '../game/game-manager';
import { MapFactory } from '../game/maps/map-factory';

import { io } from 'socket.io-client'
import { Router } from '@routes/router';
import { AudioManager } from './audio';
import { SnowParticles } from '../game/particles/snow-particles';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import book from '@models/Book/Book.fbx';
import ghost from '@models/Ghost/Ghost.fbx';
import potion from '@models/Potion/Potion.fbx';
import Resources from './resources';
import { Ghost } from '../game/items/ghost';
import { Potion } from '../game/items/potion';
import { Book } from '../game/items/book';

import pause from '@views/pause.html';

export class Application {

    delta = 10;
    startX;
    startY;
    pauseFlag = false;

    socket = null;
    configuration = {};

    constructor() {
        this.socket = io();
        this.socket.on('connect', () => {
            this.id = this.socket.id;
            console.log(this.id);
        });

        this.router = new Router(this);
        this.router.resolve();
    }

    create() {

        if (this.configuration.players === 'SINGLEPLAYER') {
            this.createScene('RED');
        }
        else if (this.configuration.players === 'MULTIPLAYER') {
            this.multiplayer();
        }
        else {
            alert('Mal');
        }

    }

    multiplayer() {
        this.socket.on('findGame', data => {
            if (!data.status) this.router.redirect('/')
        });
        this.socket.emit('findGame', this.configuration);
        this.socket.on('startGame', data => { this.createScene(data.team) });
    }

    createScene(team) {

        const fbxLoader = new FBXLoader();
        fbxLoader.load(potion, object => {
            Resources.items['Potion'] = object;
            //const dummyPotion = new Potion(this.scene, '(5, 6)');
        });
        fbxLoader.load(ghost, object => {
            Resources.items['Ghost'] = object;
            //const dummyGhost = new Ghost(this.scene, '(5, 5)');
        });
        fbxLoader.load(book, object => {
            Resources.items['Book'] = object;
            //const dummyBook = new Book(this.scene, '(6, 5)');
        });

        THREE.DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };

        THREE.DefaultLoadingManager.onLoad = () => {

            const root = document.getElementById('root');
            root.innerHTML = '';
            root.innerHTML = pause;
            const btnResume = document.getElementById('btn-resume');
            btnResume.addEventListener('click', event => {

                this.pauseFlag = false;
                
                event.preventDefault();
                const pauseMenu = document.getElementById('pause-menu');
                pauseMenu.style.display = 'none';
                //pauseMenu.remove();
                const canvas = Array.from(document.getElementsByTagName('canvas'))[0];
                canvas.style.display = 'block';

            });
            root.append(this.renderer.domElement);

        };

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {

            const loadingLabel = document.getElementById('loading-label');
            loadingLabel.innerText = `Cargando: %${parseFloat((itemsLoaded / itemsTotal) * 100).toFixed(1)}`;
            //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        THREE.DefaultLoadingManager.onError = url => {
            console.log('There was an error loading ' + url);
        };

        this.socket.on('finishGame', () => {
            alert('Se perdio la conexión con tu rival');
            this.router.redirect('/');
        });
        this.socket.on('time', time => console.log(time));
        //this.socket.emit('ready');

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0, 1.0));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        //this.renderer.toneMappingExposure = 1.8;


        this.bindEvents();

        this.camera = new THREE.PerspectiveCamera(
            60.0,
            window.innerWidth / window.innerHeight,
            0.1,
            1000.0
        );
        // 12
        const z = (team === 'RED') ? 12.0 : -14.0;
        this.camera.position.set(0.0, 8.0, z);
        this.camera.lookAt(0.0, 1.0, 0.0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0.4156, 0.6588, 0.6823);

        this.audio = new AudioManager(this.camera);

        let light = new THREE.AmbientLight(0x303030);
        this.scene.add(light);

        light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 20, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 20.0;
        light.shadow.camera.right = -20.0;
        light.shadow.camera.top = 20.0;
        light.shadow.camera.bottom = -20.0;
        this.scene.add(light);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.minDistance = 10.0;
        controls.maxDistance = 25.0;
        controls.maxPolarAngle = THREE.MathUtils.degToRad(80.0);
        controls.enablePan = false;
        controls.update();

        if (this.configuration.scenario === 'SNOW') {
            this.snow = new SnowParticles(this.scene);
            this.snow.emitParticles(this.scene);
        }

        const mapFactory = new MapFactory(this.scene);
        mapFactory.create(this.configuration.scenario);

        const board = new Board(this.scene,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Vector2(10, 10),
            1.75,
            this.configuration.dificulty
        );

        const boardDirector = new BoardDirector();
        boardDirector.create(this.scene, board);

        this.clock = new THREE.Clock();

        this.gameManager = new GameManager(this.scene, board, team, this.socket, this.configuration, this.audio, this.router);

        this.run();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.onWindowResizeEvent());
        window.addEventListener('click', event => this.onClickEvent(event));
        window.addEventListener('keydown', event => this.onKeyDownEvent(event));
        window.addEventListener('mousedown', event => this.onMouseDownEvent(event));
        window.addEventListener('mouseup', event => this.onMouseUpEvent(event));
    }

    onWindowResizeEvent() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDownEvent(event) {
        if (this.pauseFlag) return;
        this.startX = event.pageX;
        this.startY = event.pageY;
    }

    onMouseUpEvent(event) {
        if (this.pauseFlag) return;
        const diffX = Math.abs(event.pageX - this.startX);
        const diffY = Math.abs(event.pageY - this.startY);

        if (diffX < this.delta && diffY < this.delta) {
            
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();

            mouse.x = (event.clientX / window.innerWidth) * 2.0 - 1.0;
            mouse.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0;

            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(this.scene.children, true);
            if (intersects.length > 0) {
                let object = intersects[0].object;
                let currentObject = getContainerObjByChild(object);
                if (!currentObject) currentObject = object;
                this.gameManager.processAction(currentObject);
            }
        }
    }

    onClickEvent(event) {

    }

    async onKeyDownEvent(event) {

        if (event.key === 'Escape') {

            this.pauseFlag = true;
            const canvas = Array.from(document.getElementsByTagName('canvas'))[0];
            const pauseMenu = document.getElementById('pause-menu');
            pauseMenu.style.display = 'block';
            canvas.style.display = 'none';

            //import('@styles/pause.css');
            //const view = await import('@views/pause.html');
            /*
            const root = document.getElementById('root');
            root.innerHTML += pause;

            const btnResume = document.getElementById('btn-resume');
            btnResume.addEventListener('click', event => {

                event.preventDefault();
                const pauseMenu = document.getElementById('pause-menu');
                pauseMenu.remove();
                const canvas = Array.from(document.getElementsByTagName('canvas'))[0];
                //canvas.style.display = 'block';

            });
            */

        }
        

    }

    run() {
        this.render();
    }

    render() {

        requestAnimationFrame(() => this.render());

        var delta = this.clock.getDelta();

        var characters = getObjectsByProperty(this.scene, 'typeGame', 'Character');
        characters.forEach(character => character.onUpdate(delta));

        var items = getObjectsByProperty(this.scene, 'typeGame', 'Item');
        items.forEach(item => item.onUpdate(delta));

        TWEEN.update();

        if (this.configuration.scenario === 'SNOW') {
            this.snow.onUpdate(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}
