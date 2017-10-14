/* eslint curly: "off" */
function isPrimitive(value) {
    return Object(value) !== value;
}

function isArrayOrObject(x) {
    if (isPrimitive(x)) return false;
    return x.constructor === Object || x.constructor === Array;
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
    if (a === b) {
        return true;
    } else if (isArrayOrObject(a) && isArrayOrObject(b)) {
        if (a.constructor !== b.constructor) return false;
        return shallowObj(a, b);
    }
    return false;
}
