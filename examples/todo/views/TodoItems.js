import ItemList from './ItemList';
import connect from '../../../src/Connect';
import {ADD_TODO, COMPLETE_ITEM} from '../TodoConstants';
import {SELECT_TODOS, SELECT_COMPLETED_TODOS} from '../TodoSelectors';

const FIRST_INDEX = 0;
const NEXT_INDEX = 1;

export default connect(
    [SELECT_TODOS],
    ([todos], {bindDispatch}) => ({
        items: todos.map((text, idx) => ({
            text,
            onClick: bindDispatch(COMPLETE_ITEM, idx),
        })),
        showStruckOut: false,
    }),
    {
        listeners: {
            [ADD_TODO]: (payload, {getPartialState, setPartialState}) => {
                const newTodos = [...getPartialState(SELECT_TODOS), payload];
                setPartialState(SELECT_TODOS, newTodos);
            },
            [COMPLETE_ITEM]: (itemIdx, {getPartialState, setPartialState}) => {
                const todos = getPartialState(SELECT_TODOS);
                const completed = getPartialState(SELECT_COMPLETED_TODOS);

                const completedItem = todos[itemIdx];
                const newCompleted = [completedItem, ...completed];
                const newTodos = todos.slice(FIRST_INDEX, itemIdx).concat(todos.slice(itemIdx + NEXT_INDEX));

                setPartialState(SELECT_TODOS, newTodos);
                setPartialState(SELECT_COMPLETED_TODOS, newCompleted);
            },
        },
    }
)(ItemList);