Insula is an event-driven state management library for JavaScript applications.

* [Installation](#installation)
* [Creating a state store](#creating-a-state-store)
	* [Accessing store values](#accessing-store-values)
	* [Updating store values](#updating-store-values)
	* [Subscribing to state changes](#subscribing-to-changes)
	* [Unsubscribing](#unsubscribing)
* [Event system](#event-system)
* [Selectors](#selectors)
* [Performance](#performance)

# Usage

## Installation


### npm

`npm install --save insula`


### yarn

`yarn add insula`

## Creating a state store

To create a new store initialize a new `Store` object by passing in the initial state.

```javascript
import Store from 'insula';

const initialState = {foo: 'bar'};
const store = new Store(initialState);
```

## State management

### Accessing store values

There are two ways to access values from the store. `getState` returns the entire state value, and `getPartialState` returns a portion of the state described by the passed [selector](#selectors).

```javascript
const store = new Store({
    nested: {
        object: 'value'
    }
});

store.getState(); // {nested: {object: "value"}}
store.getPartialState(['nested']); // {object: "value"}
store.getPartialState(['nested', 'value']); // "value"
```

Note that accessing any non-existant part of state will return a `null` value.

```javascript
const store = new Store({});
store.getPartialState(['some', 'nonexistant', 'object']); // null
```

### Updating store values

A `Store` has two ways to update its values. `setState` replaces the entire store value with a new object while `setPartialState` updates only a portion of state specified by a [selector](#selectors).

```javascript
const store = new Store({foo: 'bar'});

store.setState({fiz: 'biz'});
store.getState(); // {fiz: 'biz'}

store.setPartialState(['foo'], 'bar');
store.getState(); // {fix: 'biz', foo: 'bar'}
```

Note that setting a part of state whose object chain does not exist will create the necessary objects inside state.

```javascript
const store = new Store({});
store.setPartialState(['nested', 'object'], 'value');
store.getState(); // {nested: {object: "value"}}
```

### Subscribing to state changes

A `Store` allows subscriber functions to be added for all or part of state. By using [selectors](#selectors) to explcitly declare what part of state to subscribe to, these functions are only called when relevant pieces of state are changed.

The `subscribeToState` method takes two arguments, the first is an array of selectors and the second is the subscriber function. When called, the subscriber is passed an array of values in response to the selectors.

```javascript
const store = new Store({
    nested: {object: 'value'},
    foo: 'bar'
});

const selectors = [
    ['nested', 'object'],
    ['foo']
];

function subscriber(values) {
    // values is an array with the state values contained in `nested.object` and `foo`
    const [nestedObject, foo] = values;
};

store.subscribeToState(selectors, subscriber);

store.setPartialState(['foo'], 'baz');
// subscriber will be called with "value" and "baz" as the two values
```

A subscriber will be called if any part of its selector overlaps with a state change. Take a look at this example to understand what changes will affect a subscriber.

```javascript
store.subscribeToState([['nested', 'object']], ([nestedObject]) => {});

// these updates will trigger the subscriber
store.setState({}); // changing the entire state will affect any subscriber
store.setPartialState(['nested'], {}); // the new value for `nested` could change `nested.object`
store.setPartialState(['nested', 'object'], {}); // this matches the subscriber
store.setPartialState(['nested', 'object', 'subobject'], {}); // a piece of state contained by the selector changed

// these will not trigger the subscriber
store.setPartialState(['somewhere-else'], {}); // `somewhere-else` doesn't match the selector at all
store.setPartialState(['nested', 'someOtherObject'], {}); // `nested.object` doesn't care about `nested.someOtherObject`
```

### Unsubscribing

The `subscribeToState` method returns a function that will remove the subscription.

```javascript
const store = new Store({});

// add a subscription
const unsubscribe = store.subscribeToState([['foo']], () => {});

// remove the subscription
unsubscribe();
```

## Event system

Insula encourages state updates to be driven by events. The `Store` provides `on` and `off` methods to add and remove event listeners as well as a `dispatch` method to send events and payloads. Event listeners are called with the event payload and an object with additional functions for interacting with the state. These listeners can optionally dispatch other events, retrieve state values, or update state values.

```javascript
const store = new Store({});

store.on(
    'MY_EVENT',
    (payload, {dispatch, getState, getPartialState, setState, setPartialState}) => {
        // ...
    }
);

store.dispatch('MY_EVENT', {the: 'payload'});
```

# Selectors

A `selector` is an array of string values describing how to access a part of state. To set or get a state value the array values are used to traverse the state object. Using selectors allows Insula to understand which state subscription functions are affected by a state update.

Using arrays to describe the selectors allows Insula to support any kind of data structure, including when object keys include the `.` character. There is a [middleware](https://github.com/chandlerprall/insula-stringselectors) if you'd rather use strings such as `nested.object` for your selectors.

# Performance

Performance is a major goal for Insula and is achieved primarily through two mechanisms. Selectors allow Insula to understand the scope of a change and call only those functions which have subscribed to an affected part of state.

The second key element to Insula's performance is subscriber batching. While calls to `setState` and `setPartialState` are synchronous (you can get call `getState`/`getPartialState` right away and retrieve the new state values), any affected subscribers will not be called until the next event loop cycle.

```javascript
const store = new Store({});

const subscriber = () => console.log('subscriber called'); // called only once in this example

store.subscribeToState([[]], subscriber); // empty selector subscribes to all state changes

store.setState({});
store.setPartialState(['nested'], {});
store.setPartialState(['foo'], 'bar');
store.setPartialState(['foo'], 'baz');
store.setState({something: 'else'});
```