/* eslint-disable no-magic-numbers */
export default [
    {
        event: 'UPDATE_NEXT_TODO',
        handler: (value, {setPartialState}) => {
            setPartialState(['nextTodo'], value);
        },
    },
    {
        event: 'ADD_TODO',
        handler: (payload, {getPartialState, setPartialState}) => {
            const newTodos = [...getPartialState(['todos']), getPartialState(['nextTodo'])];
            setPartialState(['todos'], newTodos);
            setPartialState(['nextTodo'], '');
        },
    },
    {
        event: 'COMPLETE_ITEM',
        handler: (itemIdx, {getPartialState, setPartialState}) => {
            const todos = getPartialState(['todos']);
            const completed = getPartialState(['completed']);
            
            const completedItem = todos[itemIdx];
            const newCompleted = [completedItem, ...completed];
            const newTodos = todos.slice(0, itemIdx).concat(todos.slice(itemIdx + 1));
            
            setPartialState(['todos'], newTodos);
            setPartialState(['completed'], newCompleted);
        },
    },
    {
        event: 'UNCOMPLETE_ITEM',
        handler: (itemIdx, {getPartialState, setPartialState}) => {
            const todos = getPartialState(['todos']);
            const completed = getPartialState(['completed']);
            
            const uncompletedItem = completed[itemIdx];
            const newTodos = [uncompletedItem, ...todos];
            const newCompleted = completed.slice(0, itemIdx).concat(completed.slice(itemIdx + 1));
            
            setPartialState(['todos'], newTodos);
            setPartialState(['completed'], newCompleted);
        },
    },
];