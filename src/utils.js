export const getUid = (function(){
    let uid = 0;
    return function getUid() {
        return uid++;
    }
}());

export function doArraysIntersect(a, b) {
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] === b[j]) return true;
        }
    }
    return false;
}

export function isValuePrimitive(x) {
    if (x == null) return true; // null and undefined
    if (typeof x === 'string') return true;
    if (typeof x === 'number') return true;
    if (typeof x === 'boolean') return true;
    return false;
}

export function areObjectsShallowEqual(a, b) {
    if (a === b) return true; // if they match, great!

    const isAPrimitive = isValuePrimitive(a);
    const isBPrimitive = isValuePrimitive(b);
    if (isAPrimitive || isBPrimitive) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    // check if objects have different number of keys
    if (aKeys.length !== bKeys.length) return false;

    // objects have same number of keys, iterate through one list of keys comparing values
    for (let i = 0; i < aKeys.length; i++) {
        let key = aKeys[i];
        if (!b.hasOwnProperty(key)) return false; // quick out if b doesn't have this key

        let aValue = a[key];
        let bValue = b[key];

        if (isValuePrimitive(aValue) && isValuePrimitive(bValue)) {
            if (aValue !== bValue) return false;
        } else {
            if (typeof aValue !== typeof bValue) return false;
        }
    }

    return true;
}