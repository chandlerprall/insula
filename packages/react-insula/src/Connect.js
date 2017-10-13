import React, {Component} from 'react';
import {object} from 'prop-types';

export function shallowEquals(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    
    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }
    
    for (let i = 0; i < obj1Keys.length; i++) {
        const key = obj1Keys[i];
        if (obj2.hasOwnProperty(key)) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        } else {
            return false;
        }
    }
    
    return true;
}

export default function connect(selectors, transformer, options = {}) {
    return function connector(View) {
        const isViewAReactComponentClass = View.prototype instanceof Component;
        
        class ConnectedComponent extends Component {
            constructor(...args) {
                super(...args);
                this.hasMounted = false;
                this.store = this.context.insulaStore;
                this.options = options;
                this.addedListeners = [];
                this.unsubscribeFromState = null;
                this.componentRef = null;
                this.stateValues = this.getValuesForSelectors(selectors);
                
                this.setComponentRef = ref => this.componentRef = ref;
                
                this.bindDispatch = (event, payload) => {
                    if (payload === undefined) {
                        return this.store.dispatch.bind(this.store, event);
                    } else {
                        return this.store.dispatch.bind(this.store, event, payload);
                    }
                };
    
                // create the options object that gets passed to the transformer
                this.transformerOptions = {bindDispatch: this.bindDispatch};
    
                this.state = transformer(this.stateValues, this.transformerOptions);
    
                this.onStateUpdate = stateValues => {
                    if (this.hasMounted) {
                        this.stateValues = [...stateValues, this.props];
                        this.setState(transformer(this.stateValues, this.transformerOptions));
                    }
                };
            }
            
            componentDidUpdate(prevProps) {
                if (!shallowEquals(this.props, prevProps)) {
                    this.stateValues[this.stateValues.length - 1] = this.props; // update props portion of stateValues
                    this.setState(transformer(this.stateValues, this.transformerOptions));
                }
            }
            
            componentDidMount() {
                this.hasMounted = true;
                
                // add event listeners
                const {listeners} = this.options;
                if (listeners != null) {
                    const events = Object.keys(listeners);
                    for (let i = 0; i < events.length; i++) {
                        const event = events[i];
                        const listener = listeners[event];
                        const boundListener = listener.bind(this.componentRef);
                        this.addedListeners.push({event, listener: boundListener});
                        this.store.on(event, boundListener);
                    }
                }
                
                // add state subscriptions
                this.unsubscribeFromState = this.store.subscribeToState(selectors, this.onStateUpdate);
            }
            
            componentWillUnmount() {
                this.hasMounted = false;
                
                // remove event listeners
                for (let i = 0; i < this.addedListeners.length; i++) {
                    const {event, listener} = this.addedListeners[i];
                    this.store.off(event, listener);
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
                return <View
                    ref={isViewAReactComponentClass ? this.setComponentRef : null}
                    {...this.props}
                    {...this.state}
                    dispatch={this.store.dispatch.bind(this.store)}/>;
            }
        }
    
        ConnectedComponent.displayName = `Insula(${View.displayName})`;
        ConnectedComponent.contextTypes = {insulaStore: object.isRequired};
        
        return ConnectedComponent;
    };
}