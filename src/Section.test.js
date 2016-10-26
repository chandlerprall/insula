import test from 'ava';
import Section from './Section';
import Intent from './Intent';

test('Section creates with an initial value', t => {
    t.plan(1);

    const initialValue = [];
    const section = Section(initialValue);

    t.is(section.value, initialValue, 'initial value is not correct');
});

test('Section#handleIntent fires intents', t => {
    t.plan(1);
    
    const intentTest = Intent('INTENT_TEST', () => t.pass());
    const section = Section(null, intentTest);
    section.handleIntent('INTENT_TEST');
});

test('Section intents can be added and removed', t => {
    t.plan(3);

    const section = Section(null);

    const INTENT = 'INTENT_TEST';
    const intent = Intent(INTENT, () => t.pass());

    section.addIntent(intent);
    section.addIntent(intent);
    section.handleIntent(INTENT); // expect 2 passes

    section.removeIntent(intent);
    section.handleIntent(INTENT); // expect 1 pass

    section.removeIntent(intent);
    section.handleIntent(INTENT); // expect 0 passes
});

test('Section#handleIntent updates section value', t => {
    t.plan(1);

    const RETURN_VALUE = {};
    const intentTest = Intent('INTENT_TEST', () => RETURN_VALUE);
    const section = Section(null, intentTest);
    section.handleIntent('INTENT_TEST');
    t.is(section.value, RETURN_VALUE);
});

test('Section#handleIntent passes the current value and payload to mutators', t => {
    t.plan(2);

    const STATE_VALUE = {};
    const PAYLOAD = {};
    const intentTest = Intent('INTENT_TEST', (value, payload) => {
        t.is(value, STATE_VALUE);
        t.is(payload, PAYLOAD);
    });
    const section = Section(STATE_VALUE, intentTest);
    section.handleIntent('INTENT_TEST', PAYLOAD);
});

test('Section#handleIntent passes mutation through multiple intents in order', t => {
    t.plan(3);

    const START_VALUE = 2;
    const INTENT_NAME = 'INTENT_INCREMENT';

    const intentA = Intent(INTENT_NAME, value => {
        t.is(value, START_VALUE);
        return value + 1;
    });
    const intentB = Intent(INTENT_NAME, value => {
        t.is(value, START_VALUE + 1);
        return value + 2;
    });

    const section = Section(START_VALUE, intentA, intentB);

    section.handleIntent(INTENT_NAME);
    t.is(section.value, START_VALUE + 3);
});

test('Section#handleIntent returns correct value', t => {
    t.plan(2);

    const INTENT_ONE = 'intent/INTENT_ONE';
    const INTENT_TWO = 'intent/INTENT_TWO';

    const section = Section(null, Intent(INTENT_ONE, () => {}));

    t.is(section.handleIntent(INTENT_ONE), true);
    t.is(section.handleIntent(INTENT_TWO), false);
});

test('Section#handleIntent ignores when a lone intent returns `undefined`', t => {
    t.plan(1);

    const SECTION_VALUE = {};
    const intentTest = Intent('INTENT_TEST', () => undefined);
    const section = Section(SECTION_VALUE, intentTest);
    section.handleIntent('INTENT_TEST');
    t.is(section.value, SECTION_VALUE);
});

test('Section#handleIntent ignores when one out of many intents returns `undefined`', t => {
    t.plan(1);

    const RETURN_VALUE = {};
    const ITENT_NAME = 'INTENT_TEST';
    const intentOne = Intent(ITENT_NAME, () => RETURN_VALUE);
    const intentTwo = Intent(ITENT_NAME, () => undefined);
    const section = Section({}, intentOne, intentTwo);
    section.handleIntent(ITENT_NAME);
    t.is(section.value, RETURN_VALUE);
});