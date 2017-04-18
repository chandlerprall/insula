import ItemList from './ItemList';
import connect from '../../../src/Connect';

export default connect(
    [['todos']],
    ([todos], {bindDispatch}) => ({
        items: todos.map((text, idx) => ({
            text,
            onClick: bindDispatch('COMPLETE_ITEM', idx),
        })),
        showStruckOut: false,
    })
)(ItemList);