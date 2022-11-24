import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const fbxLoader = async path => {
    return new Promise(resolve => new FBXLoader().load(path, resolve));
}

export default fbxLoader;