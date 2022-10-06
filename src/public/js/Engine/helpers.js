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
    if (object[property] === value ) result.push(object);
  
    // check children
    for (let i = 0, l = object.children.length; i < l; i++) {
        const child = object.children[i];
        getObjectsByProperty(child, property, value, result);
    }
   
    return result;
}