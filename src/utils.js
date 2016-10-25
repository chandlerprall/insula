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