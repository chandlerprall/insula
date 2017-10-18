import {shallowCompare} from '../ShallowCompare';

describe('ShallowCompare', () => {
    test('should return false when comparing {} against []', () => {
        expect(shallowCompare({}, [])).toBe(false);
    });

    test('should return false when comparing {} against null', () => {
        expect(shallowCompare({}, null)).toBe(false);
    });

    test('should return true when comparing [1, 2, 3] against [1, 2, 3]', () => {
        expect(shallowCompare([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    test('should return true when comparing {a: 1, b: 2, c: 3} against {a: 1, b: 2, c: 3}', () => {
        expect(shallowCompare({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3})).toBe(true);
    });

    test('should return false when comparing [1, 2, 3] against [1, 2, 3 4]', () => {
        expect(shallowCompare([1, 2, 3], [1, 2, 3, 4])).toBe(false);
    });

    test('should return false when comparing {a: 1, b: 2, c: 3} against {a: 1, b: 2, c: 3, d: 4}', () => {
        expect(shallowCompare({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3, d: 4})).toBe(false);
    });

    test('should return false when comparing [1, 2, 3, 4, 5] against [5, 4, 3, 2, 1]', () => {
        expect(shallowCompare([1, 2, 3, 4, 5], [5, 4, 3, 2, 1])).toBe(false);
    });

    test('should return false when comparing ["a", "b", "c"] against {0: "a", 1: "b", 2: "c"}', () => {
        expect(shallowCompare(['a', 'b', 'c'], {0: 'a', 1: 'b', 2: 'c'})).toBe(false);
    });

    test('should return false when comparing {0: "a", 1: "b", 2: "c"} against ["a", "b", "c"]', () => {
        expect(shallowCompare({0: 'a', 1: 'b', 2: 'c'}, ['a', 'b', 'c'])).toBe(false);
    });

    test('should return false when comparing {a: "b", b: "c", c: "a"} against {a: "a", b: "b", c: "c"}', () => {
        expect(shallowCompare({a: 'b', b: 'c', c: 'a'}, {a: 'a', b: 'b', c: 'c'})).toBe(false);
    });
});
