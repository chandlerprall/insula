/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from '../../src/Store';
import Store from 'insula';
import CounterWidget from './views/CounterWidget';

const INITIAL_COUNTER_VALUE = 0;
const store = new Store(INITIAL_COUNTER_VALUE);

ReactDOM.render(
    <Provider store={store}>
        <CounterWidget stepValue={10}/>
    </Provider>,
    document.getElementById('application')
);