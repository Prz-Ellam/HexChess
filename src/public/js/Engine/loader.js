const fbxLoader = path => {
    return new Promise(resolve => {
        (new THREE.FBXLoader()).load(path, resolve)
    });
}

const textureLoader = path => {
    return new Promise(resolve => {
        (new THREE.FileLoader()).load(path, resolve)
    });
}

const audioLoader = path => {
    return new Promise(resolve => {
        (new THREE.AudioLoader()).load(path, resolve)
    });
}

export { fbxLoader, audioLoader, textureLoader }