import Transformer from 'insula/src/Transformer';

export default Transformer(
    ['query'],
    function QueryTransformer([query]) {
        return {query};
    }
);