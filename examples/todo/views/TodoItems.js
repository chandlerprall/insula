import ItemList from './ItemList';
import connect from '../../../src/Connect';
import {ADD_TODO, COMPLETE_ITEM} from '../TodoConstants';

const FIRST_INDEX = 0;
const NEXT_INDEX = 1;

export default connect(
    [['todos']],
    ([todos], {bindDispatch}) => ({
        items: todos.map((text, idx) => ({
            text,
            onClick: bindDispatch(COMPLETE_ITEM, idx),
        })),
        showStruckOut: false,
    }),
    {
        listeners: [
            {
                event: ADD_TODO,
                listener: (payload, {getPartialState, setPartialState}) => {
                    const newTodos = [...getPartialState(['todos']), payload];
                    setPartialState(['todos'], newTodos);
                },
            },
            {
                event: COMPLETE_ITEM,
                listener: (itemIdx, {getPartialState, setPartialState}) => {
                    const todos = getPartialState(['todos']);
                    const completed = getPartialState(['completed']);
    
                    const completedItem = todos[itemIdx];
                    const newCompleted = [completedItem, ...completed];
                    const newTodos = todos.slice(FIRST_INDEX, itemIdx).concat(todos.slice(itemIdx + NEXT_INDEX));
    
                    setPartialState(['todos'], newTodos);
                    setPartialState(['completed'], newCompleted);
                },
            },
        ],
    }
)(ItemList);