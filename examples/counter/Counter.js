/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from '../../src/Store';
import Store from 'insula';
import CounterWidget from './views/CounterWidget';
import eventHandlers from './eventhandlers';

function attachEvents(store) {
    eventHandlers.forEach(({event, handler}) => {
        store.on(event, handler);
    });
}

const INITIAL_COUNTER_VALUE = 0;
const store = new Store(INITIAL_COUNTER_VALUE);
attachEvents(store);

ReactDOM.render(
    <Provider store={store}>
        <CounterWidget stepValue={10}/>
    </Provider>,
    document.getElementById('application')
);