/* eslint complexity: "off" */

function isPrimitive(value) {
    return Object(value) !== value;
}

function shallowObj(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }

    for (let i = 0; i < obj1Keys.length; i++) {
        const key = obj1Keys[i];
        if (obj2.hasOwnProperty(key)) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
}

export function shallowCompare(a, b) {
    if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
        return false;
    }

    if (typeof a === 'function' || isPrimitive(a) || isPrimitive(b)) {
        return a === b;
    }

    return shallowObj(a, b);
}
