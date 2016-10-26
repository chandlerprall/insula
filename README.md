# usage

The below examples create a store with a single state holding a list of names. There is a single intent that, when dispatched, adds a given name to the list.

## creating a store

A store is created by passing a `sections` configuration. Sections are created with an initial value and the intents allowed to operate on and mutate that value.

```javascript
import Store from 'capacitor/src/Store';
import Section from 'capacitor/src/Section';
import Intent from 'capacitor/src/Intent';

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

Intent names (string values) are dispatched, along with an optional payload. When an intent is fired, its mutator function is passed the section's current value and the payload. Any value returned by the mutator function becomes the new section value.

```javascript
store.dispatch(ADD_NAME, 'Robert Browning');
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