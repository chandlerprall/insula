import test from 'ava';
import {areObjectsShallowEqual, doArraysIntersect, isValuePrimitive} from './utils';

test('doArraysIntersect - empty arrays', t => {
    t.plan(1);
    t.is(doArraysIntersect([], []), false);
});

test('doArraysIntersect - one empty array', t => {
    t.plan(1);
    t.is(doArraysIntersect([], ['a']), false);
});

test('doArraysIntersect - non-intersecting non-empty arrays', t => {
    t.plan(2);
    t.is(doArraysIntersect(['b'], ['a']), false);
    t.is(doArraysIntersect(['a', 'b'], ['x', 'y', 'z']), false);
});

test('doArraysIntersect - intersecting arrays', t => {
    t.plan(4);
    t.is(doArraysIntersect(['a'], ['a']), true);
    t.is(doArraysIntersect(['a'], ['a', 'b']), true);
    t.is(doArraysIntersect(['a', 'b'], ['a']), true);
    t.is(doArraysIntersect(['a', 'b', 'c'], ['x', 'y', 'z', 'b']), true);
});

test('isValuePrimitive', t => {
    t.plan(8);
    t.true(isValuePrimitive(null));
    t.true(isValuePrimitive(undefined));
    t.true(isValuePrimitive(''));
    t.true(isValuePrimitive(0));
    t.true(isValuePrimitive(false));

    t.false(isValuePrimitive({}));
    t.false(isValuePrimitive([]));
    t.false(isValuePrimitive(new Boolean(false)));
});

test('areObjectsShallowEqual - primative values', t => {
    t.plan(5);

    t.true(areObjectsShallowEqual(0, 0));
    t.true(areObjectsShallowEqual(1, 1));
    t.true(areObjectsShallowEqual('Abc', 'Abc'));

    t.false(areObjectsShallowEqual(0, 1));
    t.false(areObjectsShallowEqual('Abc', 'ABc'));
});

test('areObjectsShallowEqual - non-primative values', t => {
    t.plan(7);

    t.true(areObjectsShallowEqual({}, {}));
    t.true(areObjectsShallowEqual({a: 'b', c: []}, {a: 'b', c: []}));
    t.true(areObjectsShallowEqual([], []));
    t.true(areObjectsShallowEqual([1, 2], [1, 2]));
    t.true(areObjectsShallowEqual([], {}));

    t.false(areObjectsShallowEqual({a: 'b'}, {}));
    t.false(areObjectsShallowEqual({}, {a: 'b'}));
});