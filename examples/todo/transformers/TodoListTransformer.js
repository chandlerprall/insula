import Transformer from 'insula/src/Transformer';
import {FINISH_ITEM} from '../intents/IntentNames';

export default Transformer(
    ['items'],
    function TodoListTransformer([items], {createIntent}) {
        return {
            items: items.filter(item => !item.isFinished).map(item => {
                return {
                    ...item,
                    clickIntent: createIntent(FINISH_ITEM, item.id, 'finishItem')
                };
            })
        };
    }
);