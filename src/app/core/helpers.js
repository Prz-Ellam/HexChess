import * as THREE from 'three';

export function getContainerObjByChild(obj) {
  
    if (obj.userData.isContainer)
        return obj;
    else if (obj.parent != null) 
        return getContainerObjByChild(obj.parent);
    else 
        return null;

}

export function getObjectsByProperty(object, property, value, result = [])
{
    // check the current object
    if (object[property] === value) result.push(object);
  
    // check children
    for (let i = 0, l = object.children.length; i < l; i++) {
        const child = object.children[i];
        getObjectsByProperty(child, property, value, result);
    }
   
    return result;
}

export function codeToVector(code) {
    const regex = new RegExp(/\((\d+), (\d+)\)/);
    const values = regex.exec(code);
    const x = Number(values[1]);
    const z = Number(values[2]);
    return new THREE.Vector2(x, z);
}