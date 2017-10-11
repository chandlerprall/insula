/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from '../../src/Store';
import Store from 'insula';
import NewTodoInput from './views/NewTodoInput';
import TodoItems from './views/TodoItems';
import CompletedItems from './views/CompletedItems';

const store = new Store({
    nextTodo: '',
    todos: ['make application pretty'],
    completed: ['make todo app'],
});

ReactDOM.render(
    <Provider store={store}>
        <div>
            <h1>Todo App</h1>
            
            <NewTodoInput/>
            
            <div>
                <strong>Things To Do</strong><br/>
                <TodoItems/>
            </div>
            
            <div>
                <strong>Things I've Done</strong><br/>
                <CompletedItems/>
            </div>
        </div>
    </Provider>,
    document.getElementById('application')
);