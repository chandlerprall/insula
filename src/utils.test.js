import test from 'ava';
import {doArraysIntersect} from './utils';

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