import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import NewItemTransformer from '../transformers/NewItemTransformer';

function NewItemInput({value, dispatch, addItemIntent, updateNewItemIntent}) {
    const onKeyDown = e => {
        if (e.keyCode === 13) {
            dispatch(addItemIntent);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Add Item" value={value} onChange={e => dispatch(updateNewItemIntent, e.target.value)} onKeyDown={onKeyDown}/>
        </div>
    );
}

NewItemInput.displayName = 'NewItemInput';

NewItemInput.propTypes = {
    value: PropTypes.string.isRequired,
    addItemIntent: PropTypes.any.isRequired,
    updateNewItemIntent: PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(NewItemTransformer)(NewItemInput);