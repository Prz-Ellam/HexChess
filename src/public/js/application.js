import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/libs/tween.module.min.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

import { Board } from './Game/board.js';
import { getObjectsByProperty, getContainerObjByChild } from './Engine/helpers.js';
import { BoardDirector } from './Game/board-director.js';
import { GameManager } from './Game/game-manager.js';

import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/shaders/FXAAShader.js';

import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/GlitchPass.js';
import { OutlinePass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/OutlinePass.js';

import { ParticleSystem } from './Engine/particle-system.js';

class Application
{
    constructor()
    {
        this.create();
    }

    create()
    {
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

        document.body.appendChild(this.renderer.domElement);

        this.bindEvents();

        this.camera = new THREE.PerspectiveCamera(
            60.0, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000.0
        );
        this.camera.position.set(0.0, 8.0, 12.0);
        this.camera.lookAt(0.0, 1.0, 0.0);

        this.scene = new THREE.Scene();
        const skybox = new THREE.CubeTextureLoader();
        skybox.setPath('textures/');
        const cubemap = skybox.load([
            'right.png',
            'left.png',
            'top.png',
            'bottom.png',
            'back.png',
            'front.png'
        ]);
        this.scene.background = cubemap;

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 100, 10);
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

        light = new THREE.AmbientLight(0x303030);
        this.scene.add(light);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.minDistance = 10;
        controls.maxDistance = 25;
        controls.update();

        // Postprocessing Effects
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);
        const unrealBloomPass = new UnrealBloomPass({ x: 1024, y: 1024 }, 1.0, 0.0, 0.75);
        //composer.addPass(unrealBloomPass);
        const glitchPass = new GlitchPass();
        //composer.addPass(glitchPass);

        this.effectFXAA = new ShaderPass(FXAAShader);
        var pixelRatio = this.renderer.getPixelRatio();
        this.effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatio), 
        1 / (window.innerHeight * pixelRatio));
        this.effectFXAA.renderToScreen = true;
        this.composer.addPass(this.effectFXAA);
/*
        var geometry = new THREE.Geometry(); 
        geometry.vertices = [
            new THREE.Vector3(-1.0, -1.0, 0.0),
            new THREE.Vector3( 1.0, -1.0, 0.0),
            new THREE.Vector3( 1.0,  1.0, 0.0),
            new THREE.Vector3(-1.0,  1.0, 0.0)
        ];
        geometry.faces = [
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(2, 3, 0)
        ];

        const vertex = `
            void main()
            {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0f);
            }
        `;

        const fragment = `
            void main()
            {
                gl_FragColor = vec4(1.0f, 0.0f, 0.0f, 0.7f);
            }
        `;

        const cube = new THREE.Mesh(
            geometry,
            new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader: vertex,
                fragmentShader: fragment,
                side: THREE.DoubleSide,
                //blending: THREE.AdditiveBlending,
                //depthTest: true,
                //depthWrite: false,
                transparent: true
                //vertexColors: true
            }
        ));
        cube.position.y = 2;
        this.scene.add(cube);
*/

        this.particleSystem = new ParticleSystem(this.scene, {
            position: new THREE.Vector3(0.0, 0.0, 0.0),
            rotationBegin: 0.0,
            rotationEnd: 0.0,
            rotationVariation: 0.0,
            scaleBegin: new THREE.Vector3(0.0, 0.0, 0.0),
            scaleEnd: new THREE.Vector3(0.0, 0.0, 0.0),
            scaleVariation: new THREE.Vector3(0.0, 0.0, 0.0),
            speed: new THREE.Vector3(0.0, 0.0, 0.0),
            speedVariation: new THREE.Vector3(5.0, 2.0, 0.0),
            lifetime: 1.0
        }, 1000);

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }
        ));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        const board = new Board(this.scene, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector2(10, 10), 1.75);

        const boardDirector = new BoardDirector();
        boardDirector.create(this.scene, board);

        this.clock = new THREE.Clock();
        socket = io();
        socket.on('connect', () => {
            this.id = socket.id;
        });

        socket.emit('hostGame', {
            scenario: 'Forest',
            mode: 'Checkmate',
            dificulty: 'Easy',
        });

        this.gameManager = new GameManager(this.scene, socket);

        this.select = socket.on('select', data => {

            this.gameManager.makeCellsSelectable(data.cells);
            this.gameManager.selectObject(data.target.position, data.target.cell);
                
        });
    
        this.move = socket.on('move', data => {
    
            this.gameManager.cleanCellsSelectable();

            var e = getObjectsByProperty(this.scene, 'cell', data.target.targetCell);
            if (e.length !== 0) 
            {
                const defeatedTeam = e[0].team;
                this.scene.remove(e[0]);
                const remainingTeam = getObjectsByProperty(this.scene, 'team', defeatedTeam).length;
                if (remainingTeam === 0) alert(`Perdio el equipo ${defeatedTeam}`);
            }
    
            let selectedObject = getObjectsByProperty(this.scene, 'cell', data.target.startCell);
            if (selectedObject.length < 1) return;
            selectedObject = selectedObject[0];
    
            const tween = new TWEEN.Tween(
                {
                    x: data.target.startPosition.x,
                    y: data.target.startPosition.y,
                    z: data.target.startPosition.z
                }
            ).to(
                {
                    x: data.target.targetPosition.x,
                    y: data.target.startPosition.y,
                    z: data.target.targetPosition.z
                }, 1000
            ).onUpdate(coords => {
                selectedObject.position.set(coords.x, coords.y, coords.z);
            }).onComplete(() => {
                socket.emit('moveComplete', true);
                socket.on('changeTurn', () => {

                    selectedObject.cell = data.target.targetCell;
                    this.gameManager.freeObject();
                        
                });
            })
            
            tween.start();
    
        });
    }

    bindEvents()
    {
        window.addEventListener('resize', () => { this.onWindowResizeEvent(); });
        window.addEventListener('dblclick', (event) => { this.onDoubleClickEvent(event) });
        window.addEventListener('keydown', () => this.onKeyEvent() );
    }

    onWindowResizeEvent()
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.composer.setSize(window.innerWidth, window.innerHeight);
        var pixelRatio = this.renderer.getPixelRatio();
        this.effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatio), 
        1 / (window.innerHeight * pixelRatio));
    }

    onDoubleClickEvent(event)
    {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2.0 - 1.0;
        mouse.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0;

        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0)
        {
            var firstObject = intersects[0].object;
            var object = getContainerObjByChild(firstObject);
            if (object === null) object = firstObject;

            this.gameManager.makeTurn(object);
        }
    }

    onKeyEvent(event)
    {
        this.particleSystem.emitParticles();
    }

    run()
    {
        this.render();
    }

    render()
    {
        
        requestAnimationFrame(() => {

            var delta = this.clock.getDelta();

            if (this.mixer)
            {
                this.mixer.update(delta);
            }

            TWEEN.update();
            
            this.particleSystem.onUpdate(delta);
            this.particleSystem.onRender();

            this.renderer.render(this.scene, this.camera);
            //this.composer.render();
            this.render();
        });
    }
}

var socket;
var i = 0;

var app = null;

window.addEventListener('DOMContentLoaded', () => {
    app = new Application();
    app.run();
});
