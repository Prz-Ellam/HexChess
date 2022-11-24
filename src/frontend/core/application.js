import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

import { Board } from '../game/board/board';
import { getObjectsByProperty, getContainerObjByChild } from './helpers';
import { BoardDirector } from '../game/board/board-director';
import { GameManager } from '../game/game-manager';
import { ParticleSystem } from './particle-system';
import { MapFactory } from '../game/maps/map-factory';

import { io } from 'socket.io-client'
import { Router } from '../routes/router';
import { AudioManager } from './audio';
import { SnowParticles } from '../game/particles/snow-particles';

export class Application {

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
        /*
        let startTime = 0;
        setInterval(() => {
            startTime++;
            console.log(startTime);
        }, 1000);
        */

        THREE.DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };
        
        THREE.DefaultLoadingManager.onLoad = () => {
        
            console.log('Loading Complete!');
            const root = document.getElementById('root');
            root.innerHTML = '';
            root.append(this.renderer.domElement);
        
        };
        
        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            
            const loadingLabel = document.getElementById('loading-label');
            loadingLabel.innerText = `Cargando: %${ parseFloat((itemsLoaded / itemsTotal) * 100).toFixed(1) }`;
            //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        
        };
        
        THREE.DefaultLoadingManager.onError = url => {
            console.log( 'There was an error loading ' + url );
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
        controls.update();

        if (this.configuration.scenario === 'SNOW') {
            this.snow = new SnowParticles(this.scene);
            this.snow.emitParticles(this.scene);
        }

        this.particleSystem = new ParticleSystem(this.scene, {
            position: new THREE.Vector3(0.0, 10.0, 0.0),
            rotationBegin: 0.0,
            rotationEnd: 0.0,
            rotationVariation: 0.0,
            scaleBegin: new THREE.Vector3(1.0, 1.0, 1.0),
            scaleEnd: new THREE.Vector3(0.0, 0.0, 0.0),
            scaleVariation: new THREE.Vector3(0.3, 0.3, 0.3),
            speed: new THREE.Vector3(0.0, 0.0, 0.0),
            speedVariation: new THREE.Vector3(0.0, 5.0, 0.0),
            lifetime: 50.0
        }, 1000);

        const mapScene = new MapFactory(this.scene, this.configuration.scenario);

        const board = new Board(this.scene,
            new THREE.Vector3(0.0, 0.0, 0.0),
            new THREE.Vector2(10, 10),
            1.75,
            this.configuration.dificulty
        );

        const boardDirector = new BoardDirector();
        boardDirector.create(this.scene, board);

        this.clock = new THREE.Clock();
        
        this.gameManager = new GameManager(this.scene, board, team, this.socket, this.configuration, this.audio);

        this.run();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.onWindowResizeEvent());
        window.addEventListener('click', event => this.onClickEvent(event));
        window.addEventListener('keydown', () => this.onKeyEvent());
    }

    onWindowResizeEvent() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onClickEvent(event) {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2.0 - 1.0;
        mouse.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0;

        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            let object = intersects[0].object;
            let currentObject = getContainerObjByChild(object);
            if (currentObject === null) currentObject = object;

            console.log(currentObject.name);

            this.gameManager.processAction(currentObject);
        }
    }

    onKeyEvent(event) {
        this.particleSystem.emitParticles();
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

        //this.particleSystem.emitParticles();
        this.particleSystem.onUpdate(delta);
        this.particleSystem.onRender();

       
        if (this.configuration.scenario === 'SNOW') {
            this.snow.onUpdate(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}
