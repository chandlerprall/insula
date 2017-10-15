/* global Set, Map*/
/* eslint curly: "off", complexity: "off" */

function isPrimitive(x) {
    return Object(x) !== x;
}

function isArrayOrObject(x) {
    return x.constructor === Object || x.constructor === Array;
}

function isMap(x) {
    return x.constructor === Map;
}

function isSet(x) {
    return x.constructor === Set;
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

function shallowMap(map1, map2) {
    if (map1.size !== map2.size) {
        return false;
    }

    for (var [key, value] of map1) {
        if (map2.get(key) !== value) {
            return false;
        }
    }
    return true;
}

function shallowSet(set1, set2) {
    if (set1.size !== set2.size) {
        return false;
    }

    for (var val of set1) {
        if (!set2.has(val)) {
            return false;
        }
    }
    return true;
}

export function shallowCompare(a, b) {
    if (a === b) {
        return true;
    } else if (isPrimitive(a) || isPrimitive(b) || a.constructor !== b.constructor) {
        return false;
    } else if (isArrayOrObject(a)) {
        return shallowObj(a, b);
    } else if (isMap(a)) {
        return shallowMap(a, b);
    } else if (isSet(a)) {
        return shallowSet(a, b);
    }
    return false;
}
