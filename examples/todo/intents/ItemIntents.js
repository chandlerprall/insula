import Intent from 'insula/src/Intent';
import {ADD_ITEM, UPDATE_NEW_ITEM, FINISH_ITEM, UNFINISH_ITEM} from './IntentNames';

export const addItem = Intent(ADD_ITEM, (items, item, {dispatch}) => {
    // clear out the new item value
    dispatch(UPDATE_NEW_ITEM, '');

    // add the new item as an unfinished
    return [{id: items.length, isFinished: false, text: item}].concat(items);
});

export const updateNewItem = Intent(UPDATE_NEW_ITEM, (existingValue, newValue) => newValue);

export const finishItem = Intent(
    FINISH_ITEM,
    (items, finishedItemId) => {
        return items.map(item => {
            if (item.id === finishedItemId) {
                item.isFinished = true;
            }
            return item;
        });
    }
);

export const unfinishItem = Intent(
    UNFINISH_ITEM,
    (items, finishedItemId) => {
        return items.map(item => {
            if (item.id === finishedItemId) {
                item.isFinished = false;
            }
            return item;
        });
    }
);

