import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import QueryTransformer from '../transformers/QueryTransformer';
import {SET_QUERY, START_SEARCH} from '../intents/IntentNames';

function QueryView({query, dispatch}) {
    const onKeyDown = e => {
        if (e.keyCode === 13) {
            dispatch(START_SEARCH);
        }
    };

    return (
        <div>
            <input type="text"
                   id="query"
                   placeholder="enter search query"
                   value={query}
                   onChange={e => dispatch(SET_QUERY, e.target.value)}
                   onKeyDown={onKeyDown}/>
        </div>
    );
}

QueryView.displayName = 'Query';

QueryView.propTypes = {
    query: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(QueryTransformer)(QueryView)