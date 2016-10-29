import test from 'ava';
import Store from './Store';
import Section from './Section';
import Intent from './Intent';
import Transformer from './Transformer';

test('Store dispatches intents', t => {
    t.plan(2);

    const INTENT_ADD_ITEM = 'INTENT_ADD_ITEM';
    const INTENT_ADD_PERSON = 'INTENT_ADD_PERSON';

    const addItem = Intent(INTENT_ADD_ITEM, (items, item) => [].concat(items, [item]));
    const addPerson = Intent(INTENT_ADD_PERSON, (people, person) => [].concat(people, [person]));

    const ITEM_VALUE = 'anItem';
    const PERSON_VALUE = 'somePerson';

    const sectionItems = Section([], addItem);
    const sectionPeople = Section([], addPerson);

    const store = Store({
        sections: {items: sectionItems, people: sectionPeople}
    });

    store.dispatch(INTENT_ADD_ITEM, ITEM_VALUE);
    t.is(store.sections.items.value[0], ITEM_VALUE);

    store.dispatch(INTENT_ADD_PERSON, PERSON_VALUE);
    t.is(store.sections.people.value[0], PERSON_VALUE);
});

test('Intents can dispatch other intents', t => {
    t.plan(2);

    const INTENT_ADD_ITEM = 'INTENT_ADD_ITEM';
    const INTENT_ADD_PERSON = 'INTENT_ADD_PERSON';

    const ITEM_VALUE = 'anItem';
    const PERSON_VALUE = 'somePerson';

    const addItem = Intent(INTENT_ADD_ITEM, (items, item, {dispatch}) => {
        dispatch(INTENT_ADD_PERSON, PERSON_VALUE);
        return [].concat(items, [item]);
    });
    const addPerson = Intent(INTENT_ADD_PERSON, (people, person) => [].concat(people, [person]));

    const sectionItems = Section([], addItem);
    const sectionPeople = Section([], addPerson);

    const store = Store({
        sections: {items: sectionItems, people: sectionPeople}
    });

    store.dispatch(INTENT_ADD_ITEM, ITEM_VALUE);

    t.is(store.sections.items.value[0], ITEM_VALUE);
    t.is(store.sections.people.value[0], PERSON_VALUE);
});

test('Store sections can be added / removed at run time', t => {
    t.plan(4);

    const INTENT_ADD_ITEM = 'INTENT_ADD_ITEM';
    const addItem = Intent(INTENT_ADD_ITEM, (items, item) => {
        t.pass();
        return [item].concat(items);
    });

    const store = Store({
        sections: {names: Section([], addItem)}
    });
    store.dispatch(INTENT_ADD_ITEM, null); // should cause 1 pass, only `names`

    store.addSection('colors', Section([], addItem));
    store.dispatch(INTENT_ADD_ITEM, null); // should cause 2 passes, both sections

    store.removeSection('colors');
    store.dispatch(INTENT_ADD_ITEM, null); // should cause 1 pass, only `names`
});

test('Store accepts transformer subscriptions and unsubscriptions', t => {
    t.plan(1);

    const INTENT = 'intent/INTENT';
    const intent = Intent(INTENT, x => x + 1);

    const store = Store({
        sections: {value: Section(0, intent)}
    });

    const transformer = Transformer(['value'], x => {
        t.pass();
        return x;
    });

    const onTransform = () => t.fail(); // negative test, this should never be called because of the immediate unsubscribe
    store.subscribeTransformer(transformer, onTransform);
    store.unsubscribeTransformer(transformer, onTransform);

    store.dispatch(INTENT);
});

test('Store returns transformed data on subscription', t => {
    t.plan(1);

    const INTENT = 'intent/INTENT';
    const intent = Intent(INTENT, () => {});

    const store = Store({
        sections: {value: Section(0, intent)}
    });

    const TRANSFORMED = {};
    const transformer = Transformer(['value'], () => TRANSFORMED);

    t.is(store.subscribeTransformer(transformer, () => {}), TRANSFORMED);
});

test('Store calls transformers affected by an intent', t => {
    return new Promise(resolve => {
        t.plan(2);

        const INTENT = 'intent/INTENT';
        const intent = Intent(INTENT, () => {});

        const store = Store({
            sections: {items: Section([], intent)}
        });

        const transformer = Transformer(['items'], () => t.pass());
        store.subscribeTransformer(transformer, () => {});

        store.dispatch(INTENT);

        // allow for the batched intent to be processed
        setTimeout(resolve);
    });
});

test('Store fires affected transform listeners only once', t => {
    return new Promise(resolve => {
        t.plan(2);

        const INTENT_TEST = 'intent/TEST';
        const intentTest = Intent(INTENT_TEST, () => {});

        const store = Store({sections: {
            items: Section([], intentTest),
            people: Section([], intentTest)
        }});
        const transformer = Transformer(['items', 'people'], () => t.pass());

        store.subscribeTransformer(transformer, () => {});
        store.dispatch(INTENT_TEST);

        // allow for the batched intent to be processed
        setTimeout(resolve);
    });
});

test('Store fires only affected transform listeners', t => {
    return new Promise(resolve => {
        t.plan(3);

        const INTENT_TEST = 'intent/TEST';
        const intentTest = Intent(INTENT_TEST, () => {});

        const store = Store({sections: {
            items: Section([], intentTest),
            people: Section([])
        }});

        const transformerItems = Transformer(['items'], () => t.pass()); // runs once on create, once for the intent
        const transformerPeople = Transformer(['people'], () => t.pass()); // runs only on create

        store.subscribeTransformer(transformerItems, () => {});
        store.subscribeTransformer(transformerPeople, () => {});

        store.dispatch(INTENT_TEST);

        // allow for the batched intent to be processed
        setTimeout(resolve);
    });
});

test('Store calls transform subscriptions', t => {
    return new Promise(resolve => {
        t.plan(3);

        const INCREASE_INTENT = 'intent/INCREASE_INTENT';
        const increase = Intent(INCREASE_INTENT, x => x + 1);

        const store = Store({
            sections: {value: Section(0, increase)}
        });

        const transformer = Transformer(['value'], ([value]) => {
            t.pass(); // called twice
            return {value}; // convert to object
        });

        const onTransform = ({value: transformedValue}) => t.is(transformedValue, 1);
        store.subscribeTransformer(transformer, onTransform);

        store.dispatch(INCREASE_INTENT);

        // allow for the batched intent to be processed
        setTimeout(resolve);
    });
});

test('Store batches state updates', t => {
    return new Promise(resolve => {
        t.plan(1);

        const ADD_ITEM_INTENT = 'intent/ADD_ITEM';
        const addItem = Intent(ADD_ITEM_INTENT, (items, item) => items.concat([item]));

        const ADD_PERSON_INTENT = 'intent/ADD_PERSON';
        const addPerson = Intent(ADD_PERSON_INTENT, (people, person, {dispatch}) => {
            dispatch(ADD_ITEM_INTENT);
            return people.concat([person]);
        });

        const ITEM_VALUE = 'anItem';
        const PERSON_VALUE = 'somePerson';

        const store = Store({
            sections: {
                items: Section([], addItem),
                people: Section([], addPerson)
            }
        });

        let returnValue = 0;
        const transformer = Transformer(
            ['items', 'people'],
            () => returnValue++ // ensures output of transformer is always different which means the downstream subscribe is always called
        );

        const onTransform = () => t.pass(); // should only be called once as the two dispatches should collate into one update
        store.subscribeTransformer(transformer, onTransform);

        store.dispatch(ADD_PERSON_INTENT);

        // allow for the batched intent to be processed
        setTimeout(resolve);
    });
});