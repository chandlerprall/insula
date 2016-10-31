import Transformer from 'capacitor/src/Transformer';

export default Transformer(
    ['results'],
    function SearchResultsTransformer([{isLoading, hits}]) {
        return {
            isLoading,
            hasResults: hits.length > 0,
            hits: hits.slice(0, 5)
        };
    }
);