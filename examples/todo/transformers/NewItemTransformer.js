import Transformer from 'capacitor/src/Transformer';
import {ADD_ITEM, UPDATE_NEW_ITEM} from '../intents/IntentNames';

export default Transformer(
    ['newItem'],
    function TodoListTransformer([newItem]) {
        return {
            value: newItem,
            addItemIntent: ADD_ITEM,
            updateNewItemIntent: UPDATE_NEW_ITEM
        };
    }
);