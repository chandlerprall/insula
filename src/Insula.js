import React, {Component, PropTypes} from 'react';

export default class Insula extends Component {
    getChildContext() {
        return {insulaStore: this.props.store};
    }

    render() {
        return this.props.children;
    }
}

Insula.displayName = 'Insula';

Insula.propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};

Insula.childContextTypes = {
    insulaStore: PropTypes.object.isRequired
};