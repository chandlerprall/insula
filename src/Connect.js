import React, {Component} from 'react';
import {object} from 'prop-types';

export default function connect(selectors, transformer) {
    return function connector(View) {
        class ConnectedComponent extends Component {
            constructor(...args) {
                super(...args);
                this.state = transformer(this.getValuesForSelectors(selectors));
                this.unsubscribeFromState = null;
                
                this.onStateUpdate = stateValues => {
                    this.setState(transformer(stateValues));
                };
            }
            
            componentDidMount() {
                this.unsubscribeFromState = this.context.insulaStore.subscribeToState(selectors, this.onStateUpdate);
            }
            
            componentWillUnmount() {
                this.unsubscribeFromState();
                this.unsubscribeFromState = null;
            }
            
            getValuesForSelectors(selectors) {
                const store = this.context.insulaStore;
                let stateValues = [];
                
                for (let i = 0; i < selectors.length; i++) {
                    stateValues.push(store.getPartialState(selectors[i]));
                }
                
                return stateValues;
            }
            
            render() {
                return <View {...this.props} {...this.state}/>;
            }
        }
    
        ConnectedComponent.displayName = `Insula(${View.displayName})`;
        ConnectedComponent.contextTypes = {insulaStore: object.isRequired};
        
        return ConnectedComponent;
    };
}