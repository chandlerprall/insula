import ItemList from './ItemList';
import connect from '../../../src/Connect';
import {UNCOMPLETE_ITEM} from '../TodoConstants';
import {SELECT_TODOS, SELECT_COMPLETED_TODOS} from '../TodoSelectors';

const FIRST_INDEX = 0;
const NEXT_INDEX = 1;

export default connect(
    [SELECT_COMPLETED_TODOS],
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
                const todos = getPartialState(SELECT_TODOS);
                const completed = getPartialState(SELECT_COMPLETED_TODOS);

                const uncompletedItem = completed[itemIdx];
                const newTodos = [uncompletedItem, ...todos];
                const newCompleted = completed.slice(FIRST_INDEX, itemIdx).concat(completed.slice(itemIdx + NEXT_INDEX));

                setPartialState(SELECT_TODOS, newTodos);
                setPartialState(SELECT_COMPLETED_TODOS, newCompleted);
            },
        },
    }
)(ItemList);