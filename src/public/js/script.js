// Forma de importar librerias externas desde JavaScript ES6 usando modules
// Mas limpio que usar la etiqueta script en el HTML
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

// Importamos los cargadores de modelos 3D
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

// Importamos los controles para poder movernos
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/utils/BufferGeometryUtils.js';

// Importamos archivos de postprocesamiento
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/shaders/FXAAShader.js';

import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/GlitchPass.js';
import { OutlinePass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/OutlinePass.js';


import { Board } from './Game/board.js';
import { Character } from './Game/character.js';


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enable = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0, 1.0));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// Modificamos el DOM para añadir el canvas del renderer
document.body.append(renderer.domElement);



// Scene
/*
    Creamos la escena que es el contenedor donde se almacenara todos nuestros objetos,
    como modelos, geometrias, camaras y luces
*/
const scene = new THREE.Scene();
scene.name = "Main Scene";
// Creamos un cargador de texturas de tipo cubo para instanciar una textura 3D y ponerla de skybox
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
scene.background = cubemap;
// No solo se puede poner una textura, tambien se puede poner un color directamente
//scene.background = new THREE.Color(0.1, 0.1, 0.1, 1.0);



// Camera
/*
    La camara es nuestra vista en 3era persona, escogemos una camara de tipo perspectiva, para
    obtener que los elementos mas alejados de nosotros se vean mas pequeños como en la vida real
*/
const camera = new THREE.PerspectiveCamera(
    45,                                     // FOV
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1,                                    // zNear
    1000.0                                  // zFar
);
camera.position.set(0.0, 1.0, 10.0);
camera.lookAt(0.0, 1.0, 0.0);


// Meshes
/*
    Todos estos seran nuestros objetos 3D que se renderizaran en nuestro escenario, usualmente
    una malla se compone que una geometria que son los vertices que la componen y un material que
    es la forma visual en que se dibujara en pantalla
*/
// Primero crearemos un cubo, medira 1x1x1 y su material solo sera un color rojo
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.0, 1.0), 
    new THREE.MeshStandardMaterial({ color : 0xC62F2F })
);
// Podemos modificar sus transformaciones, ya sea posicion, rotacion o escala
cube.position.y = 1.0;
cube.castShadow = true;
cube.receiveShadow = true;
// Al final lo añadimos a la escena con la funcion add
scene.add(cube);



// Podemos utilizar wireframe para mostrar las aristas de los objetos
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(128, 128, 128, 128), 
    //new THREE.MeshPhongMaterial({ color : 0xffffff, wireframe: true })
    new THREE.MeshStandardMaterial({ color : 0xffffff, side: THREE.DoubleSide })
);
plane.position.y = -5.0;
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = THREE.MathUtils.degToRad(90.0);
scene.add(plane);


const board = new Board(scene, new THREE.Vector2(0, 0), new THREE.Vector2(10, 10), 1.75);

const character = new Character(scene, board);

const scube = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.0, 1.0),
    new THREE.MeshPhongMaterial({ color : 0x005B96})
);

var hexagon = scene.getObjectByName('(5, 5)');

scube.position.x = hexagon.position.x;
scube.position.y = hexagon.position.y + 1.0;
scube.position.z = hexagon.position.z;
scube.typeGame = 'Character';
scube.cell = hexagon.name;
scube.movement = '1';
scene.add(scube);


hexagon = scene.getObjectByName('(1, 1)');

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.0, 1.0),
    new THREE.MeshPhongMaterial({color : 0x005B96 })
);

cube2.position.x = hexagon.position.x;
cube2.position.y = hexagon.position.y + 1.0;
cube2.position.z = hexagon.position.z;
cube2.typeGame = 'Character';
cube2.cell = hexagon.name;
cube2.movement = '1';
scene.add(cube2);



hexagon = scene.getObjectByName('(7, 7)');

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.0, 1.0),
    new THREE.MeshPhongMaterial({color : 0xdf2c14 })
);

cube3.position.x = hexagon.position.x;
cube3.position.y = hexagon.position.y + 1.0;
cube3.position.z = hexagon.position.z;
cube3.typeGame = 'Character';
cube3.cell = hexagon.name;
cube3.movement = '2';
scene.add(cube3);




/*
    En caso de querer un modelo animado podemos usar GLTF, este tipo de extension de modelo 3D se
    guarda en formato JSON, como JavaScript se lleva perfectamente con JSON (despues de todo lo
    lleva en su nombre (JavaScript Object Notation) es el formato ideal para modelos 3D en web)
*/
const modelsNames = [];

const gltfLoader = new GLTFLoader();
gltfLoader.setPath('models/');
let mixer;
gltfLoader.load('scene.gltf', (gltf) =>
{
    const model = gltf.scene.children[0];

    model.scale.setScalar(1);
    //model.position.set(-6.0, 0.0, -6.0);
    model.castShadow = true;
    model.receiveShadow = true;

    const hexagon = scene.getObjectByName('(4, 4)');

    model.position.x = hexagon.position.x;
    model.position.y = hexagon.position.y + 0.5;
    model.position.z = hexagon.position.z;
    model.typeGame = 'Character';
    model.cell = hexagon.name;
    model.movement = '2';

    modelsNames.push(model.name);
/*
    const animLoader = new GLTFLoader();
    animLoader.load('scene.gltf', (animation) =>
    {
        mixer = new THREE.AnimationMixer(model);
        // Buscamos la animacion y le damos play para que inicie
        const idle = mixer.clipAction(animation.animations[0]);
        idle.play();
    });
*/
    scene.add(model);
});



// Lights
// Ahora creamos una luz direccional que emulara ser un sol
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(20.0, 10.0, 10.0);
light.target.position.set(0.0, 0.0, 0.0);
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
scene.add(light);

// Instanciamos una luz ambiental que sera la luz general de nuestro escenario
const ambientLight = new THREE.AmbientLight(0x303030);
//ambientLight.position.set(0.0, 0.0, 0.0);
scene.add(ambientLight);



// Inputs
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
//controls.dampingFactor = 0.5;
//controls.enableDamping = true;


// Audio
// Con esto podemos reproducir un audio en nuestra pagina
const listener = new THREE.AudioListener();
camera.add(listener);

// Create a global audio source
const sound = new THREE.Audio(listener);
// THREE.PositionalAudio

// Load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.setPath('audio/');
audioLoader.load('music.mp3', function(buffer)
{
	sound.setBuffer(buffer);
	sound.setLoop(true);
	sound.setVolume(1.0);
    // El audio todo el tiempo es muy molesto asi que lo comente, descomentar esto para escuchar
	//sound.play();
});


// Postprocessing Effects
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const unrealBloomPass = new UnrealBloomPass({ x: 1024, y: 1024 }, 1.0, 0.0, 0.75);
//composer.addPass(unrealBloomPass);
const glitchPass = new GlitchPass();
//composer.addPass(glitchPass);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = Number(10.0);
outlinePass.edgeGlow = 0.0;
outlinePass.edgeThickness = 0.0;
outlinePass.pulsePeriod = 0.0;
outlinePass.usePatternTexture = false;
outlinePass.visibleEdgeColor = 0xffffff;
outlinePass.hiddenEdgeColor = 0xffffff;
composer.addPass(outlinePass);

// Ahora que utilizamos RenderPasses para renderizar nuestra escena, necesitamos crear un
// framebuffer con multisampling para evitar el antialias, lo hacemos con este ShaderPass
// https://stackoverflow.com/questions/21050797/how-to-enable-antialiasing-while-using-effectcomposer
const effectFXAA = new ShaderPass(FXAAShader);
var pixelRatio = renderer.getPixelRatio();
effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatio), 
1 / (window.innerHeight * pixelRatio));
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);



// Si se redimensiona la ventana del navegador, actualizamos la matriz de proyeccion y el viewport
window.addEventListener('resize', () =>
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
	effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatio), 
    1 / (window.innerHeight * pixelRatio));
});


function getObjectsByProperty( object, property, value, result = [] ) {

    // check the current object

    if ( object[ property ] === value ) result.push( object );
  
    // check children

    for ( let i = 0, l = object.children.length; i < l; i ++ ) {

        const child = object.children[ i ];

        getObjectsByProperty( child, property, value, result );

    }
   
  return result;

}


function findMoves(type, x, z) {

    switch (type)
    {
        case '1': {
            const valids = [];

            let coords = [];
            coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z - 1));
            coords.push(new THREE.Vector2(x - 2 + (1 - z % 2), z + 1));
            coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z - 1));
            coords.push(new THREE.Vector2(x + 1 + (1 - z % 2), z + 1));

            coords = coords.filter(coord => 
                (coord.x <= board.count.x && coord.x >= 1 && coord.y <= board.count.y && coord.y >= 1)
            );

            coords.forEach(coords => valids.push(`(${coords.x}, ${coords.y})`))
            
            return valids;
        }
        case '2': {
            const valids = [];

            let coords = [];
            coords.push(new THREE.Vector2(x - 1, z));
            coords.push(new THREE.Vector2(x + 1, z));
            coords.push(new THREE.Vector2(x + (1 - z % 2), z - 1));
            coords.push(new THREE.Vector2(x + (1 - z % 2), z + 1));
            coords.push(new THREE.Vector2(x - (z % 2), z - 1));
            coords.push(new THREE.Vector2(x - (z % 2), z + 1));

            coords = coords.filter(coord => 
                (coord.x <= board.count.x && coord.x >= 1 && coord.y <= board.count.y && coord.y >= 1)
            );

            coords.forEach(coords => valids.push(`(${coords.x}, ${coords.y})`))
            
            return valids;
        }
    }

}






// Mouse Pick and selection
// Utilizaremos un RayCaster para encontrar el modelo seleccionado cuando se hace click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let transition = {
    cameraPosition : new THREE.Vector3(0.0, 0.0, 0.0),
    worldPosition : new THREE.Vector3(0.0, 0.0, 0.0),
    lerp : 0.0,
    lerping : false
}


var change = false;
var selectedObject;

var movement = 0.0;
var startMove = false;
var startPosition, endPosition;

window.addEventListener('dblclick', (event) =>
{
    mouse.x = (event.clientX / window.innerWidth) * 2.0 - 1.0;
    mouse.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0;

    raycaster.setFromCamera(mouse, camera);
    /*
        Nos devuelve todos los objetos que fueron intersectados por el rayo, ordenados del mas
        cercano al mas lejano
    */
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0)
    {
        // Nos interesa principalmente el primero
        var object = intersects[0].object;

        var elemento = object;
        while (elemento !== null)
        {
            if (modelsNames.includes(elemento.name))
            {
                object = scene.getObjectByName(elemento.name);
            }
            elemento = elemento.parent;
            
        }

        //if (object.name !== 'Character') return;
        
        if (change && object.typeGame !== 'Character' 
            && object.name !== '' && selectedObject !== null
            && object.isValid === true) {

            //selectedObject.position.x = object.position.x;
            //selectedObject.position.z = object.position.z;
            selectedObject.cell = object.name;
            //selectedObject = null;

            const validsCells = getObjectsByProperty(scene, 'isValid', true);

            validsCells.forEach(cell => {
                cell.isValid = false;
                cell.material.color.setHex(0x958ae6);
            });

            startMove = true;
            startPosition = selectedObject.position;
            endPosition = new THREE.Vector3(object.position.x, startPosition.y, object.position.z);
            endPosition.y = startPosition.y;
            
            //change = false;

            return;
        }

        
        if (object.typeGame === 'Character' && !change)
        {
            const cellCoords = object.cell;
            const cell = scene.getObjectByName(cellCoords);

            const x = Number(cell.name.substr(1, cell.name.indexOf(',') - 1));
            const z = Number(cell.name.substr(cell.name.indexOf(',') + 2, cell.name.length - cell.name.indexOf(')')));


            //const moves = findMoves(object.type, x, z);
            const moves = findMoves(object.movement, x, z);

            console.log(moves);

            moves.forEach((coords) => {
                const cell = scene.getObjectByName(coords, true);
                if (cell !== undefined)
                {
                    cell.material.color.setHex(0x858080);
                    cell.isValid = true;
                }
            });

            selectedObject = object;

            change = true;
        }
    }  
});



// Clock y delta time para normalizar el tiempo
const clock = new THREE.Clock(true);



// Render Loop
let cycle = 0.0;
const render = () => 
{	
    requestAnimationFrame(render);

    const delta = clock.getDelta();
    cycle += delta * 0.5;

    // Rotamos el cubo
    cube.rotation.x += delta * 0.5;
    cube.rotation.y += delta * 0.5;

    // Rotamos la luz direccional
    //diffuseLight.position.x = Math.cos(cycle);
    //diffuseLight.position.z = Math.sin(cycle);

    // Aqui hacemos el lerp para transicionar de la posicion anterior a la actual
    // TODO: Esto podria ser diferente pero igualmente el resultado no esta mal
    if (transition.lerping === true)
    {
        //camera.position.lerp(transition.cameraPosition, transition.lerp);
        //controls.target.lerp(transition.worldPosition, transition.lerp);
        //controls.update();

        transition.lerp += delta * 0.1;
        if (transition.lerp > 0.1) 
        {
            transition.lerp = 0.0;
            transition.lerping = false;
        }
    }


    if (startMove)
    {
        selectedObject.position.lerpVectors(startPosition, endPosition, movement);
        movement += delta * 0.1;

        if (movement > 0.1)
        {
            movement = 0.0;
            startMove = false;
            change = false;
            startPosition = null;
            endPosition = null;
            selectedObject = null;
        }
        
    }


    // Aqui se actualizan los modelos animados
    if (mixer)
    {
        mixer.update(delta);
    }

    // Finalmente se renderiza y muestra la escena en pantalla
    //composer.render();
    renderer.render(scene, camera);
}

// No queremos que empiece a dibujarse en pantalla nada si no se han cargado todos los elementos
window.onload = render;
