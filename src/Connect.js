import React, {Component} from 'react';
import {object} from 'prop-types';

export default function connect(selectors, transformer, options = {}) {
    return function connector(View) {
        class ConnectedComponent extends Component {
            constructor(...args) {
                super(...args);
                this.store = this.context.insulaStore;
                this.options = options;
                this.unsubscribeFromState = null;
                
                this.bindDispatch = (event, payload) => {
                    if (payload === undefined) {
                        return this.store.dispatch.bind(this.store, event);
                    } else {
                        return this.store.dispatch.bind(this.store, event, payload);
                    }
                };
    
                // create the options object that gets passed to the transformer
                this.transformerOptions = {bindDispatch: this.bindDispatch};
    
                this.state = transformer(this.getValuesForSelectors(selectors), this.transformerOptions);
    
                this.onStateUpdate = stateValues => {
                    this.setState(transformer([...stateValues, this.props], this.transformerOptions));
                };
            }
            
            componentDidMount() {
                // add event listeners
                const {listeners} = this.options;
                if (listeners != null) {
                    for (let i = 0; i < listeners.length; i++) {
                        const {event, listener} = listeners[i];
                        this.store.on(event, listener);
                    }
                }
                
                // add state subscriptions
                this.unsubscribeFromState = this.store.subscribeToState(selectors, this.onStateUpdate);
            }
            
            componentWillUnmount() {
                // remove event listeners
                const {listeners} = this.options;
                if (listeners != null) {
                    for (let i = 0; i < listeners.length; i++) {
                        const {event, listener} = listeners[i];
                        this.store.off(event, listener);
                    }
                }
                
                // remove state subscriptions
                this.unsubscribeFromState();
                this.unsubscribeFromState = null;
            }
            
            getValuesForSelectors(selectors) {
                const store = this.store;
                let stateValues = [];
                
                for (let i = 0; i < selectors.length; i++) {
                    stateValues.push(store.getPartialState(selectors[i]));
                }
                stateValues.push(this.props);
                
                return stateValues;
            }
            
            render() {
                return <View {...this.props} {...this.state} dispatch={this.store.dispatch.bind(this.store)}/>;
            }
        }
    
        ConnectedComponent.displayName = `Insula(${View.displayName})`;
        ConnectedComponent.contextTypes = {insulaStore: object.isRequired};
        
        return ConnectedComponent;
    };
}