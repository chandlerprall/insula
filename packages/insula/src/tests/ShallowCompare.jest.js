import {shallowCompare} from '../ShallowCompare';

const testShallowCompare = (value, against, result) => {
    test(`should return ${result} when comparing ${JSON.stringify(value)} against ${JSON.stringify(against)}`, () =>
        expect(shallowCompare(value, against)).toBe(result));
};

describe('ShallowCompare', () => {
    describe('Number', () => {
        const numberTests = [
            {value: 0, against: 0, result: true},
            {value: 0, against: 1, result: false},
            {value: 0, against: false, result: false},
            {value: 0, against: undefined, result: false},
            {value: 0, against: null, result: false},
            {value: 0, against: '', result: false},
            {value: 0, against: () => {}, result: false},
            {value: 0, against: [], result: false},
            {value: 0, against: {}, result: false},
        ];

        for (let i = 0; i < numberTests.length; i++) {
            const number = numberTests[i];
            const value = number.value;
            const against = number.against;
            const result = number.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Boolean', () => {
        const booleanTests = [
            {value: false, against: false, result: true},
            {value: false, against: true, result: false},
            {value: false, against: 0, result: false},
            {value: false, against: undefined, result: false},
            {value: false, against: null, result: false},
            {value: false, against: '', result: false},
            {value: false, against: () => {}, result: false},
            {value: false, against: [], result: false},
            {value: false, against: {}, result: false},
            {value: true, against: true, result: true},
            {value: true, against: false, result: false},
            {value: true, against: 0, result: false},
            {value: true, against: undefined, result: false},
            {value: true, against: null, result: false},
            {value: true, against: '', result: false},
            {value: true, against: () => {}, result: false},
            {value: true, against: [], result: false},
            {value: true, against: {}, result: false},
        ];

        for (let i = 0; i < booleanTests.length; i++) {
            const bool = booleanTests[i];
            const value = bool.value;
            const against = bool.against;
            const result = bool.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Null', () => {
        const nullTests = [
            {value: null, against: null, result: true},
            {value: null, against: false, result: false},
            {value: null, against: true, result: false},
            {value: null, against: undefined, result: false},
            {value: null, against: 0, result: false},
            {value: null, against: '', result: false},
            {value: null, against: () => {}, result: false},
            {value: null, against: [], result: false},
            {value: null, against: {}, result: false},
        ];

        for (let i = 0; i < nullTests.length; i++) {
            const _null = nullTests[i];
            const value = _null.value;
            const against = _null.against;
            const result = _null.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('undefined', () => {
        const undefinedTests = [
            {value: undefined, against: undefined, result: true},
            {value: undefined, against: false, result: false},
            {value: undefined, against: true, result: false},
            {value: undefined, against: null, result: false},
            {value: undefined, against: 0, result: false},
            {value: undefined, against: '', result: false},
            {value: undefined, against: () => {}, result: false},
            {value: undefined, against: [], result: false},
            {value: undefined, against: {}, result: false},
        ];

        for (let i = 0; i < undefinedTests.length; i++) {
            const _undefined = undefinedTests[i];
            const value = _undefined.value;
            const against = _undefined.against;
            const result = _undefined.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('String', () => {
        const stringTests = [
            {value: '', against: '', result: true},
            {value: '', against: 'abc', result: false},
            {value: '', against: undefined, result: false},
            {value: '', against: false, result: false},
            {value: '', against: true, result: false},
            {value: '', against: null, result: false},
            {value: '', against: 0, result: false},
            {value: '', against: () => {}, result: false},
            {value: '', against: [], result: false},
            {value: '', against: {}, result: false},
        ];

        for (let i = 0; i < stringTests.length; i++) {
            const string = stringTests[i];
            const value = string.value;
            const against = string.against;
            const result = string.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Function', () => {
        const refFunc = () => {};
        const funcTests = [
            {value: refFunc, against: refFunc, result: true},
            {value: () => {}, against: () => {}, result: false},
            {value: refFunc, against: undefined, result: false},
            {value: refFunc, against: false, result: false},
            {value: refFunc, against: true, result: false},
            {value: refFunc, against: null, result: false},
            {value: refFunc, against: '', result: false},
            {value: refFunc, against: 0, result: false},
            {value: refFunc, against: () => {}, result: false},
            {value: refFunc, against: [], result: false},
            {value: refFunc, against: {}, result: false},
        ];

        for (let i = 0; i < funcTests.length; i++) {
            const func = funcTests[i];
            const value = func.value;
            const against = func.against;
            const result = func.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Array', () => {
        const refArray = [];
        const refObj = {};
        const arrayTests = [
            {value: refArray, against: refArray, result: true},
            {value: [], against: [], result: true},
            {value: [1, 2, 3], against: [1, 2, 3], result: true},
            {value: [refObj], against: [refObj], result: true},
            {value: refArray, against: [], result: true},
            {value: [1, 2], against: [1, 2, 3], result: false},
            {value: ['a', 'b', 'c'], against: {0: 'a', 1: 'b', 2: 'c'}, result: false},
            {value: [{}], against: [{}], result: false},
            {value: refArray, against: undefined, result: false},
            {value: refArray, against: false, result: false},
            {value: refArray, against: true, result: false},
            {value: refArray, against: null, result: false},
            {value: refArray, against: '', result: false},
            {value: refArray, against: 0, result: false},
            {value: refArray, against: () => {}, result: false},
            {value: refArray, against: {}, result: false},
        ];

        for (let i = 0; i < arrayTests.length; i++) {
            const arr = arrayTests[i];
            const value = arr.value;
            const against = arr.against;
            const result = arr.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Object', () => {
        const refObj = {};
        const objTests = [
            {value: refObj, against: refObj, result: true},
            {value: {}, against: {}, result: true},
            {value: {a: 1}, against: {a: 1}, result: true},
            {value: refObj, against: {}, result: true},
            {value: {}, against: {a: 1}, result: false},
            {value: {a: 1, b: []}, against: {a: 1, b: []}, result: false},
            {value: {a: 1, b: {}}, against: {a: 1, b: {}}, result: false},
            {value: refObj, against: undefined, result: false},
            {value: refObj, against: false, result: false},
            {value: refObj, against: true, result: false},
            {value: refObj, against: null, result: false},
            {value: refObj, against: '', result: false},
            {value: refObj, against: 0, result: false},
            {value: refObj, against: () => {}, result: false},
            {value: refObj, against: [], result: false},
        ];

        for (let i = 0; i < objTests.length; i++) {
            const obj = objTests[i];
            const value = obj.value;
            const against = obj.against;
            const result = obj.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Map', () => {
        const refMap1 = new Map();
        const refMap2 = new Map().set('test', 'this is a test');
        const refMap3 = new Map().set('test', 'this is a test');
        const refMap4 = new Map().set('other test', 'this is another test');
        const mapTests = [
            {value: refMap1, against: refMap1, result: true},
            {value: new Map(), against: new Map(), result: false},
            {value: new Map(), against: refMap1, result: false},
            {value: refMap1, against: refMap2, result: false},
            {value: refMap2, against: refMap3, result: false},
            {value: refMap1, against: refMap2, result: false},
            {value: refMap1, against: undefined, result: false},
            {value: refMap1, against: false, result: false},
            {value: refMap1, against: true, result: false},
            {value: refMap1, against: null, result: false},
            {value: refMap1, against: '', result: false},
            {value: refMap1, against: 0, result: false},
            {value: refMap1, against: () => {}, result: false},
            {value: refMap1, against: [], result: false},
        ];

        for (let i = 0; i < mapTests.length; i++) {
            const map = mapTests[i];
            const value = map.value;
            const against = map.against;
            const result = map.result;
            testShallowCompare(value, against, result);
        }
    });

    describe('Set', () => {
        const refSet1 = new Set([1, 2, 3]);
        const refSet2 = new Set([2, 3]);
        const setTests = [
            {value: refSet1, against: refSet1, result: true},
            {value: new Set(), against: new Set(), result: false},
            {value: refSet1, against: refSet2, result: false},
            {value: new Set(), against: refSet1, result: false},
            {value: new Set([1, 2, 3]), against: new Set([1, 2, 3]), result: false},
            {value: refSet1, against: refSet2, result: false},
            {value: refSet1, against: undefined, result: false},
            {value: refSet1, against: false, result: false},
            {value: refSet1, against: true, result: false},
            {value: refSet1, against: null, result: false},
            {value: refSet1, against: '', result: false},
            {value: refSet1, against: 0, result: false},
            {value: refSet1, against: () => {}, result: false},
            {value: refSet1, against: [], result: false},
        ];

        for (let i = 0; i < setTests.length; i++) {
            const set = setTests[i];
            const value = set.value;
            const against = set.against;
            const result = set.result;
            testShallowCompare(value, against, result);
        }
    });
});
