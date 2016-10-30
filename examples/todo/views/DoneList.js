import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import DoneListTransformer from '../transformers/DoneListTransformer';
import ItemList from './ItemList';

function DoneList({items, dispatch}) {
    return (
        <div>
            <ItemList items={items} isStriken={true} onClick={clickIntent => dispatch(clickIntent)}/>
        </div>
    );
}

DoneList.displayName = 'DoneList';

DoneList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(DoneListTransformer)(DoneList);