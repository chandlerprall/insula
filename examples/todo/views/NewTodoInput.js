import React from 'react';
import {func, string} from 'prop-types';
import connect from '../../../src/Connect';

function NewTodoInput({dispatch, nextTodo}) {
    return (
        <div>
            <input type="text" value={nextTodo} onChange={e => dispatch('UPDATE_NEXT_TODO', e.target.value)} placeholder="new todo item"/>
            <button onClick={() => dispatch('ADD_TODO')}>add</button>
        </div>
    );
}

NewTodoInput.displayName = 'NewTodoInput';

NewTodoInput.propTypes = {
    dispatch: func.isRequired,
    nextTodo: string.isRequired,
};

export default connect(
    [['nextTodo']],
    ([nextTodo]) => ({nextTodo})
)(NewTodoInput);