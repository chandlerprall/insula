import {Component} from 'react';
import {object} from 'prop-types';

export default class StoreComponent extends Component {
    getChildContext() {
        return {insulaStore: this.props.store};
    }
    
    render() {
        return this.props.children;
    }
}

StoreComponent.displayName = 'ReactInsulaStore';

StoreComponent.childContextTypes = {insulaStore: object};
StoreComponent.propTypes = {store: object.isRequired};
