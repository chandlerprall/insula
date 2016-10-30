import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import TodoListTransformer from '../transformers/TodoListTransformer';
import ItemList from './ItemList';

function TodoList({items, dispatch}) {
    return (
        <div>
            <ItemList items={items} isStriken={false} onClick={clickIntent => dispatch(clickIntent)}/>
        </div>
    );
}

TodoList.displayName = 'TodoList';

TodoList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(TodoListTransformer)(TodoList);