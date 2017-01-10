import React, {PureComponent} from 'react';
import Insula from '../../../src/Insula';
import Store from 'insula/src/Store';
import Section from 'insula/src/Section';
import {addItem, updateNewItem, finishItem, unfinishItem} from '../intents/ItemIntents';
import NewItemInput from './NewItemInput';
import TodoList from './TodoList';
import DoneList from './DoneList';

export default class TodoApp extends PureComponent {
    constructor(...args) {
        super(...args);

        this.store = Store({
            sections: {
                newItem: Section('', updateNewItem),
                items: Section([{id: 0, isFinished: false, text: 'finish me'}, {id: 1, isFinished: true, text: 'already done'}], addItem, finishItem, unfinishItem)
            }
        });
    }

    render() {
        return (
            <Insula store={this.store}>
                <div>
                    <h1>Todo List</h1>
    
                    <NewItemInput/>
                    
                    <strong>Things to do</strong>
                    <TodoList/>

                    <strong>Things done</strong>
                    <DoneList/>
                </div>
            </Insula>
        );
    }
};

TodoApp.displayName = 'TodoApp';