import ItemList from './ItemList';
import connect from '../../../src/Connect';

export default connect(
    [['completed']],
    ([completed], {bindDispatch}) => ({
        items: completed.map((text, idx) => ({
            text,
            onClick: bindDispatch('UNCOMPLETE_ITEM', idx),
        })),
        showStruckOut: true,
    })
)(ItemList);