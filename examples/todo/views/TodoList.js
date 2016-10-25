import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import TodoListTransformer from '../transformers/TodoListTransformer';
import ItemList from './ItemList';

function TodoList({items, finishItemIntent, dispatch}) {
    console.log('TodoList::render');
    
    return (
        <div>
            <ItemList items={items} isStriken={false} onClick={item => dispatch(finishItemIntent, item)}/>
        </div>
    );
}

TodoList.displayName = 'TodoList';

TodoList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    finishItemIntent: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(TodoListTransformer)(TodoList);