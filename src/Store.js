import TreeSubscription from './TreeSubscription';
import nextTick from 'next-tick';

var NO_INDEX = -1;
var ZERO_LENGTH = 0;
var REMOVE_ONE_ITEM = 1;
var ONE_BEFORE_LAST_INDEX = -1;

export default function Store(initialState) {
    this.state = initialState || {};
    this.listeners = {};
    this.subscriptions = new TreeSubscription(this);
    this.eventOptions = this.createEventOptions();
    
    // To avoid creating polymorphic function usage of the internal dispatching code
    // `dispatch` thinly wraps the `internalDispatch` method by first setting
    // `this.currentPayload`
    this.currentEventPayload = null;
    
    this.callSubscribers = this.callSubscribers.bind(this);
    this.nextSubscriberCalls = [];
}

Store.prototype.getState = function getState() {
    return this.state;
};

Store.prototype.getPartialState = function getPartialState(selector) {
    var currentValue = this.getState();
    
    for (var i = 0; i < selector.length; i++) {
        var key = selector[i];
        if (currentValue.hasOwnProperty(key)) {
            currentValue = currentValue[key];
        } else {
            return null;
        }
    }
    
    return currentValue;
};

Store.prototype.setState = function setState(state) {
    this.state = state;
    this.callSubscribersUnderSelector([]);
};

Store.prototype.setPartialState = function setPartialState(selector, value) {
    var lastKey = selector[selector.length + ONE_BEFORE_LAST_INDEX];
    
    var currentValue = this.getState();
    for (var i = 0; i < selector.length + ONE_BEFORE_LAST_INDEX; i++) {
        var key = selector[i];
        if (currentValue.hasOwnProperty(key) === false) {
            currentValue[key] = {};
        }
        currentValue = currentValue[key];
    }
    
    currentValue[lastKey] = value;
    this.callSubscribersUnderSelector(selector);
};

Store.prototype.on = function on(event, listener) {
    if (this.listeners.hasOwnProperty(event) === false) {
        this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
};

Store.prototype.off = function off(event, listener) {
    if (this.listeners.hasOwnProperty(event)) {
        var eventListeners = this.listeners[event];
        var listenerIdx = eventListeners.indexOf(listener);
        if (listenerIdx !== NO_INDEX) {
            eventListeners.splice(listenerIdx, REMOVE_ONE_ITEM);
        }
    }
};

Store.prototype.dispatch = function dispatch(event, payload) {
    this.currentPayload = payload;
    this.internalDispatch(event);
};

Store.prototype.internalDispatch = function internalDispatch(event) {
    var listeners = this.listeners[event];
    if (listeners !== undefined) {
        var payload = this.currentPayload;
        var eventOptions = this.getEventOptions();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](payload, eventOptions);
        }
    }
    this.currentPayload = null;
};

Store.prototype.createEventOptions = function createEventOptions() {
    return {
        dispatch: this.dispatch.bind(this),
        getState: this.getState.bind(this),
        setState: this.setState.bind(this),
        setPartialState: this.setPartialState.bind(this),
        getPartialState: this.getPartialState.bind(this),
    };
};

Store.prototype.getEventOptions = function getEventOptions() {
    return this.eventOptions;
};

Store.prototype.subscribeToState = function subscribeToState(selectors, listener) {
    var store = this;
    var stateChangeListener = function() {
        // get state values
        var stateValues = [];
        for (var i = 0; i < selectors.length; i++) {
            stateValues.push(store.getPartialState(selectors[i]));
        }
        
        // call listener with all the state values
        listener(stateValues);
    };
    
    for (var i = 0; i < selectors.length; i++) {
        this.subscriptions.subscribeSelector(selectors[i], stateChangeListener);
    }
    
    return function unsubscribeToState() {
        for (var i = 0; i < selectors.length; i++) {
            store.subscriptions.unsubscribeSelector(selectors[i], stateChangeListener);
        }
    };
};

Store.prototype.callSubscribersUnderSelector = function callSubscribersUnderSelector(selector) {
    var subscribers = this.subscriptions.collectSubscribers(selector);
    
    if (this.nextSubscriberCalls.length === ZERO_LENGTH) {
        nextTick(this.callSubscribers);
    }
    
    for (var i = 0; i < subscribers.length; i++) {
        var subscriber = subscribers[i];
        if (this.nextSubscriberCalls.indexOf(subscriber) === NO_INDEX) {
            this.nextSubscriberCalls.push(subscriber);
        }
    }
};

Store.prototype.callSubscribers = function callSubscribers() {
    for (var i = 0; i < this.nextSubscriberCalls.length; i++) {
        this.nextSubscriberCalls[i]();
    }
    this.nextSubscriberCalls.length = 0;
};