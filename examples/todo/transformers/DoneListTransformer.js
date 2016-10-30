import Transformer from 'capacitor/src/Transformer';
import {UNFINISH_ITEM} from '../intents/IntentNames';

export default Transformer(
    ['items'],
    function TodoListTransformer([items], {createIntent}) {
        return {
            items: items.filter(item => item.isFinished).map(item => {
                return {
                    ...item,
                    clickIntent: createIntent(UNFINISH_ITEM, item.id, 'unfinishItem')
                };
            })
        };

    }
);