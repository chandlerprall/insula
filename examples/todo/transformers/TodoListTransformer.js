import Transformer from 'capacitor/src/Transformer';
import {FINISH_ITEM} from '../intents/IntentNames';

export default Transformer(
    ['items'],
    function TodoListTransformer([items]) {
        return {
            items: items.filter(item => !item.isFinished),
            finishItemIntent: FINISH_ITEM
        };
    }
);