export class Application {

    constructor() {
        this.initialize();
    }

    initialize() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000.0
        );
        this.camera.position.set(0.0, 1.0, 0.0);
        this.camera.lookAt(0.0, 1.0, 0.0);

        this.renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0, 1.0));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enable = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.append(renderer.domElement);
    }

}