import Transformer from 'capacitor/src/Transformer';
import {ADD_ITEM, UPDATE_NEW_ITEM} from '../intents/IntentNames';

export default Transformer(
    ['newItem'],
    function TodoListTransformer([newItem], {createIntent}) {
        return {
            value: newItem,
            addItemIntent: createIntent(ADD_ITEM, newItem),
            updateNewItemIntent: UPDATE_NEW_ITEM
        };
    }
);