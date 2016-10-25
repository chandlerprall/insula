import {getUid} from './utils';

export default function Transformer(selectors, transform) {
    if (!(this instanceof Transformer)) {
        return new Transformer(selectors, transform);
    }
    
    this.uid = getUid();
    this.selectors = selectors;
    this.transform = transform;
}