# usage

The below examples create a store with a single state holding a list of names. There is a single intent that, when dispatched, adds a given name to the list.

## creating a store

A store is created by passing a `sections` configuration. Sections are created with an initial value and the intents allowed to operate on and mutate that value.

```javascript
import Store from 'insula/src/Store';
import Section from 'insula/src/Section';
import Intent from 'insula/src/Intent';

// Create an intent to add names to an array
const ADD_NAME = 'intent/AddName'; // name of the intent
const addNameIntent = Intent(ADD_NAME, (names, name) => [name].concat(names)); // return a new array without mutation

// Create a section that holds a list of names
const namesInitialState = ['John Hawkes', 'Linda Ellis'];
const namesSection = Section(namesInitialState, addNameIntent);

const config = {sections: {names: namesSection}};
const store = Store(config);
```

## dispatching intents

Intent names (string values) are dispatched, along with an optional payload. When an intent is fired, its mutator function is passed the section's current value and the payload. Any value returned by the mutator function becomes the new section value; if the mutator function returns `undefined` the section value is not changed.

```javascript
store.dispatch(ADD_NAME, 'Robert Browning');
```

Intents receive a context object as the third argument, allowing them to dispatch additional intents

```javascript
const ADD_PERSON = 'intent/AddPerson';
const ADD_NAME = 'intent/AddName';
const ADD_PHONE = 'intent/AddPhone';

const addName = Intent(ADD_NAME, (names, name) => [name].concat(names));
const addPhoneNumber = Intent(ADD_PHONE, (phoneNumbers, phoneNumber) => [phoneNumber].concat(phoneNumbers));

const addNameIntent = Intent(ADD_PERSON, (people, person, {dispatch}) => {
    dispatch(ADD_NAME, person.name);
    dispatch(ADD_PHONE, person.phoneNumber);
    return [person].concat(people);
});
```

## transformers

A transformer is a function that subscribes to specific sections and executes when one or more of those sections change.

```javascript
const namesTransformer = Transformer(
    ['names'], // subscribe to the `names` section
    ([names]) => {
        // when `names` changes, map each name into an object with `first` and `last` properties
        return names.map(name => {
            const nameParts = name.split(' ');
            return {first: nameParts[0], last: nameParts[1]};
        });
    }
);
```

Like intents, transformers are passed an additional argument which lets them create intents that can be used by subscribers.

```javascript
const REMOVE_PERSON_INTENT = 'intent/RemovePerson'; // assume an intent that takes a person's ID and removes him / her

const transformer = Transformer(
    ['people'],
    ([people], {createIntent}) => {
        // add a `removePerson` intent to each person, when it is dispatched, the REMOVE_PERSON_INTENT is triggered along with the person's id
        return people.map(person => ({...person, removePerson: createIntent(REMOVE_PERSON_INTENT, person.id)});
    }
);
```

## subscribing to state changes

Specifically, the only way to know of a state change is through a transformer. This allows additional caching and optimizations and prevents useless updates when insignificant state values change.

```javascript
store.subscribeTransformer(
    namesTransformer,
    (names) => {
        // do something with the updated list of first/last name objects
        // like trigger a view re-render
    }
);
```