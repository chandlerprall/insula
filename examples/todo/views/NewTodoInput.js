import React from 'react';
import {func, string} from 'prop-types';
import connect from '../../../src/Connect';
import {ADD_TODO, UPDATE_NEXT_TODO} from '../TodoConstants';

function NewTodoInput({addTodo, nextTodo, updateTodo}) {
    return (
        <div>
            <input type="text" value={nextTodo} onChange={e => updateTodo(e.target.value)} placeholder="new todo item"/>
            <button onClick={addTodo}>add</button>
        </div>
    );
}

NewTodoInput.displayName = 'NewTodoInput';

NewTodoInput.propTypes = {
    addTodo: func.isRequired,
    nextTodo: string.isRequired,
    updateTodo: func.isRequired,
};

export default connect(
    [['nextTodo']],
    ([nextTodo], {bindDispatch}) => ({
        nextTodo,
        addTodo: bindDispatch(ADD_TODO, nextTodo),
        updateTodo: bindDispatch(UPDATE_NEXT_TODO),
    }),
    {
        listeners: [
            {
                event: UPDATE_NEXT_TODO,
                listener: (value, {setPartialState}) => {
                    setPartialState(['nextTodo'], value);
                },
            },
            {
                event: ADD_TODO,
                listener: (value, {setPartialState}) => {
                    setPartialState(['nextTodo'], '');
                },
            },
        ],
    }
)(NewTodoInput);