import Transformer from 'capacitor/src/Transformer';

export default Transformer(
    ['query'],
    function QueryTransformer([query]) {
        return {query};
    }
);