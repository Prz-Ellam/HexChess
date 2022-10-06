import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import { Board } from './Game/board.js';
import { Character } from './Game/character.js';
import { Knight } from './Game/knight.js';
import { Monk } from './Game/monk.js';
import { getObjectsByProperty, getContainerObjByChild } from './Engine/helpers.js';

class Application
{
    constructor()
    {
        this.initialize();
    }

    initialize()
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

        document.body.appendChild(this.renderer.domElement);

        this.bindEvents();

        this.camera = new THREE.PerspectiveCamera(
            60.0, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000.0
        );
        this.camera.position.set(0.0, 1.0, 10.0);
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
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this.scene.add(light);

        light = new THREE.AmbientLight(0x303030);
        this.scene.add(light);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.update();

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        const board = new Board(this.scene, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector2(10, 10), 1.75);

        //const character  = new Character(this.scene, board, 'models/Monk/scene.gltf', '(4, 4)');
        const monk  = new Monk(this.scene, board, '(4, 4)');
        const knight = new Knight(this.scene, board, '(2, 4)');

        const character2 = new Character(this.scene, board, 'models/Peasant/scene.gltf', '(9, 8)');
        //const character3 = new Character(this.scene, board, 'models/Knight/scene.gltf', '(2, 4)');
        const character5 = new Character(this.scene, board, 'models/Damsel/scene.gltf', '(5, 5)');
        const character6 = new Character(this.scene, board, 'models/Scarecrow/scene.gltf', '(8, 3)');
        const character7 = new Character(this.scene, board, 'models/Baba Yaga/scene.gltf', '(1, 1)');

        this.raycaster = new THREE.Raycaster();
        this.change = false;
        this.selectedObject = null;

        this.movement = 0.0;
        this.startMove = false;
        this.startPosition = null;
        this.endPosition = null;

        this.clock = new THREE.Clock();
    }

    bindEvents()
    {
        window.addEventListener('resize', () => { this.onWindowResizeEvent(); }, false);
        window.addEventListener('dblclick', (event) => { this.onDoubleClickEvent(event) });
    }

    onWindowResizeEvent()
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onDoubleClickEvent(event)
    {
        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2.0 - 1.0;
        mouse.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0;

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0)
        {
            var object = intersects[0].object;
            var container = getContainerObjByChild(object);
            if (container === null) container = object;

            if (this.change && object.typeGame !== 'Character' 
                && object.name !== '' && this.selectedObject !== null
                && object.isValid === true) {

                this.selectedObject.cell = object.name;

                const validsCells = getObjectsByProperty(this.scene, 'isValid', true);

                validsCells.forEach(cell => {
                    cell.isValid = false;
                    cell.material.color.setHex(0x958ae6);
                });

                this.startMove = true;
                this.startPosition = this.selectedObject.position;
                this.endPosition = new THREE.Vector3(container.position.x, this.startPosition.y, container.position.z);
                this.endPosition.y = this.startPosition.y;
                
                this.change = false;

                return;
            }

            if (container.typeGame === 'Character' && !this.change)
            {
                const cellCoords = container.cell;
                const cell = this.scene.getObjectByName(cellCoords);

                const x = Number(cell.name.substr(1, cell.name.indexOf(',') - 1));
                const z = Number(cell.name.substr(cell.name.indexOf(',') + 2, cell.name.length - cell.name.indexOf(')')));

                const moves = container.findMoves(x, z);

                //console.log(moves);

                moves.forEach((coords) => {
                    const cell = this.scene.getObjectByName(coords, true);
                    if (cell !== undefined)
                    {
                        cell.material.color.setHex(0x858080);
                        cell.isValid = true;
                    }
                });

                this.selectedObject = container;
                this.change = true;
            }

        }
    }

    run()
    {
        this.render();
    }

    render()
    {
        requestAnimationFrame(() => {

            const delta = this.clock.getDelta();

            if (this.startMove)
            {
                this.selectedObject.position.lerpVectors(this.startPosition, this.endPosition, this.movement);
                this.movement += delta * 0.1;

                if (this.movement > 0.1)
                {
                    this.movement = 0.0;
                    this.startMove = false;
                    this.change = false;
                    this.startPosition = null;
                    this.endPosition = null;
                    this.selectedObject = null;
                }
                
            }

            this.renderer.render(this.scene, this.camera);
            this.render();
        });
    }
}


var app = null;

window.addEventListener('DOMContentLoaded', () => {
    app = new Application();
    app.run();
});
