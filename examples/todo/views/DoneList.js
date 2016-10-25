import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import DoneListTransformer from '../transformers/DoneListTransformer';
import ItemList from './ItemList';

function DoneList({items, unfinishItemIntent, dispatch}) {
    console.log('DoneList::render');
    
    return (
        <div>
            <ItemList items={items} isStriken={true} onClick={item => dispatch(unfinishItemIntent, item)}/>
        </div>
    );
}

DoneList.displayName = 'DoneList';

DoneList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    unfinishItemIntent: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(DoneListTransformer)(DoneList);