import React, {Component, PropTypes} from 'react';

export default class Capacitor extends Component {
    getChildContext() {
        return {capacitorStore: this.props.store};
    }

    render() {
        return this.props.children;
    }
}

Capacitor.displayName = 'Capacitor';

Capacitor.propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};

Capacitor.childContextTypes = {
    capacitorStore: PropTypes.object.isRequired
};