import Transformer from 'capacitor/src/Transformer';
import {UNFINISH_ITEM} from '../intents/IntentNames';

export default Transformer(
    ['items'],
    function TodoListTransformer([items]) {
        return {
            items: items.filter(item => item.isFinished),
            unfinishItemIntent: UNFINISH_ITEM
        };
    }
);