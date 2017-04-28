`react-insula` allows React components to be directly connected to [Insula](https://github.com/chandlerprall/insula) stores, allowing easy state transformations and subscriptions.

* [Installation](#installation)
* [Creating and attaching state](#creating-and-attaching-state)
* [Subscribing components](#subscribing-components)
* [Transformers](#transformers)
    * [Accessing props](#accessing-props)
    * [Dispatching events](#dispatching-events)
    * [Bound dispatches](#bound-dispatches)
* [Runtime event listeners](#runtime-event-listeners)

# Examples

Todo [[demo]](https://chandlerprall.github.io/react-insula/examples/todo.html) [[code]](https://github.com/chandlerprall/react-insula/tree/master/examples/todo)

Counter [[demo]](https://chandlerprall.github.io/react-insula/examples/counter.html) [[code]](https://github.com/chandlerprall/react-insula/tree/master/examples/counter)

# Installation

## npm

`npm install --save --react-insula`

## yarn

`yarn add react-insula`


# Creating and attaching state

Before connecting a stateful component, the state has to be exposed to the React DOM tree. This is done by wrapping your application with the `Provider` component.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-insula';

const initialState = {
    deeply: {
        nested: {
            object: 'value'
        }
    },
    foo: 'bar'
};
const store = new Store(initialState);

ReactDOM.render(
    <Provider store={store}>
        <div>... rest of application goes here ...</div>
    </Provider>,
    document.getElementById('application')
);
```

# Subscribing components

To pull values from state into a component and have the component update when those values change, wrap the component with the `connect` function. This works for both `Function` components and `Component` classes. Insula uses `selectors` to specify which parts of state you want to access.

```javascript
import React from 'react';
import {connect} from 'react-insula';

function MyComponent({theValue, foo}) {
    return (
        <div>
            theValue: {theValue}
            <br/>
            foo: {foo}
        </div>
    );
}

// we want to access two values from the state: `deeply.nested.object` and `foo`
const selectors = [
    ['deeply', 'nested', 'object'],
    ['foo']
];

const transformer = ([deeplyNestedObject, foo]) => {
    return {
        theValue: deeplyNestedObject,
        foo
    };
};

export default connect(selectors, transformer)(MyComponent);
```

## Transformers

As the above example demonstrates, the first argument to a transformer function is an array with the selected state values. The object returned by a transformer will be merged with any props set by the parent and passed down to the child component.

### Accessing props

Sometimes it is useful to access the component's props in the transformer. These props are always passed to the transformer function as an additional value in the array.

**Parent.js**
```javascript
function Parent() {
    return (
        <Child foo="bar" baz={[1,2,3]}/>
    );
}
```

**Child.js**
```javascript
export default connect(
    [['stateValue']], // one selector
    ([stateValue, props]) => {
        return {
            stateValue: props.includeStateValue ? stateValue : null
        };
    }
)(ChildComponent);
```

### Dispatching events

Insula's state management is event driven so all connected views are also given a `dispatch` function that takes an event type and optional payload.

```javascript
function MyComponent({dispatch, subject, body}) {
    const onClick = () => dispatch('SEND_MESSAGE', {subject, body});
    return (<button onClick={onClick}>Send</button>);
}

export default connect(
    [ ['message', 'subject'], ['message', 'body'] ],
    ([subject, body]) => ({subject, body})
)(MyComponent);
```

### Bound dispatches

A key philosophy behind `react-insula` is that views should not know what is supposed to happen. Instead, they should be given a function that does _something_ at a given interaction, but they don't care what. Transformers are passed an object as the second argument with a `bindDispatch` method which allows them to create dispatcher functions. The event payload can optionally be curried onto the dispatch as well.

```javascript
function MyComponent({resetForm, sendMessage}) {
    const onClick = () => dispatch('SEND_MESSAGE', {title: 'Hello', message: 'World'});
    return (
        <div>
            <button onClick={sendMessage}>Send</button>
            <button onClick={resetForm}>Reset</button>
        </div>
    );
}

export default connect(
    [ ['message', 'subject'], ['message', 'body'] ],
    ([subject, body], {bindDispatch}) => {
        return {
            resetForm: bindDispatch('RESET_FORM'), // no payload defined, the view could optionally add one
            sendMessage: bindDispatch('SEND_MESSAGE', {subject, body}) // payload is defined, the view can't do anything but call the function
        };
    }
)(MyComponent);
```

## Runtime event listeners

While event listeners can be [added to the store directly](https://github.com/chandlerprall/insula#event-system), sometimes an event only makes sense in the context of a component, or maybe a mounted component needs to Do Something Else in response to an event. These runtime event listeners can be specified by passing a configuration object to `connect`.

```javascript
export default connect(
    [[]],
    ([state]) => ({}),
    {
        listeners: [
            {
                event: 'SEND_MESSAGE',
                listener: (payload, {dispatch}) => {
                    const {subject} = payload;
                    dispatch('RECORD_ANALYTICS', {eventType: 'sentMessage', subject});
                }
            }
        ]
    }
)(MyComponent);
```

The second parameter passed to the listener function provides the `dispatch`, `getState`, `getPartialState`, `setState`, and `setPartialState` methods from the Insula store.

Runtime event listeners are added during the `componentDidMount` lifecycle and removed at `componentWillUnmount`. Additionally, the listener's `this` context is your component, allowing you to access the instance methods.

```javascript
class MyComponent extends Component {
    reactToEvent() {
        // ... do something
    }

    render() {return <div/>;}
}

export default connect(
    [[]],
    ([state]) => ({}),
    {
        listeners: [
            {
                event: 'EVENT_TYPE',
                listener: () => {
                    this.reactToEvent();
                }
            }
        ]
    }
)(MyComponent);
```