import React, {PropTypes} from 'react';
import connect from '../../../src/connect';
import SearchResultsTransformer from '../transformers/SearchResultsTransformer';

function SearchResults({isLoading, hasResults, hits}) {
    return (
        <div>
            <h3>Search Results</h3>
            <span display-if={!isLoading && !hasResults}>Entry a query to see results</span>
            <span display-if={isLoading}>Loading results...</span>
            <div>
                {hits.map(({id, previewURL}) => (
                    <img key={id} src={previewURL} width="100"/>
                ))}
            </div>
        </div>
    );
}

SearchResults.displayName = 'SearchResults';

SearchResults.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    hasResults: PropTypes.bool.isRequired,
    hits: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        previewURL: PropTypes.string.isRequired
    })).isRequired
};

export default connect(SearchResultsTransformer)(SearchResults);