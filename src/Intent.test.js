import test from 'ava';
import Intent from './Intent';

test('Intent creates with a name and mutator', t => {
    t.plan(1);

    const intentName = 'TEST_INTENT';
    const intentMutator = () => {};
    const intent = Intent(intentName, intentMutator);

    t.is(intent.name, intentName, 'Intent name is not correct');
});

test('Intent throws if no name given', t => {
    t.plan(1);
    t.throws(Intent);
});

test('Intent throws if no mutator given', t => {
    t.plan(1);
    t.throws(Intent.bind(null, 'test'));
});

test('Intent throws if mutator is not a function', t => {
    t.plan(1);
    t.throws(Intent.bind(null, 'test', {}));
});

test('Intent#mutate passes value and payload', t => {
    t.plan(2);
    const TEST_VALUE = 'testing';
    const TEST_PAYLOAD = {};
    const intent = Intent('TEST', (value, payload) => {
        t.is(value, TEST_VALUE);
        t.is(payload, TEST_PAYLOAD);
    });
    intent.mutate(TEST_VALUE, TEST_PAYLOAD);
});

test('Intent#mutate returns intended value', t => {
    t.plan(1);
    const RETURN_VALUE = {};
    const intent = Intent('TEST', () => RETURN_VALUE);
    t.is(intent.mutate(), RETURN_VALUE);
});

test('Intent#mutate calls mutator with correct "context"', t => {
    t.plan(1);
    const CONTEXT = {};
    const intent = Intent('TEST', (state, value, context) => t.is(context, CONTEXT));
    intent.mutate(null, null, CONTEXT);
});