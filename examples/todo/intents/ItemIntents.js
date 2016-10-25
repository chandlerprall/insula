import Intent from 'capacitor/src/Intent';
import {ADD_ITEM, UPDATE_NEW_ITEM, FINISH_ITEM, UNFINISH_ITEM} from './IntentNames';

export const addItem = Intent(ADD_ITEM, (items, item) => [{id: items.length, isFinished: false, text: item}].concat(items));

export const updateNewItem = Intent(UPDATE_NEW_ITEM, (existingValue, newValue) => newValue);

export const finishItem = Intent(
    FINISH_ITEM,
    (items, finishedItem) => {
        return items.map(item => {
            if (item.id === finishedItem.id) {
                item.isFinished = true;
            }
            return item;
        });
    }
);

export const unfinishItem = Intent(
    UNFINISH_ITEM,
    (items, finishedItem) => {
        return items.map(item => {
            if (item.id === finishedItem.id) {
                item.isFinished = false;
            }
            return item;
        });
    }
);

