import ItemList from './ItemList';
import connect from '../../../src/Connect';
import {UNCOMPLETE_ITEM} from '../TodoConstants';

const FIRST_INDEX = 0;
const NEXT_INDEX = 1;

export default connect(
    [['completed']],
    ([completed], {bindDispatch}) => ({
        items: completed.map((text, idx) => ({
            text,
            onClick: bindDispatch(UNCOMPLETE_ITEM, idx),
        })),
        showStruckOut: true,
    }),
    {
        listeners: {
            [UNCOMPLETE_ITEM]: (itemIdx, {getPartialState, setPartialState}) => {
                const todos = getPartialState(['todos']);
                const completed = getPartialState(['completed']);

                const uncompletedItem = completed[itemIdx];
                const newTodos = [uncompletedItem, ...todos];
                const newCompleted = completed.slice(FIRST_INDEX, itemIdx).concat(completed.slice(itemIdx + NEXT_INDEX));

                setPartialState(['todos'], newTodos);
                setPartialState(['completed'], newCompleted);
            },
        },
    }
)(ItemList);