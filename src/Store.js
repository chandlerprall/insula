import TreeSubscription from './TreeSubscription';
import nextTick from 'next-tick';

var NO_INDEX = -1;
var ZERO_LENGTH = 0;
var REMOVE_ONE_ITEM = 1;
var ONE_BEFORE_LAST_INDEX = -1;
var FIRST_INDEX = 0;
var SECOND_INDEX = 1;

export default function Store(initialState, middleware) {
    this.listeners = {};
    this.subscriptions = new TreeSubscription(this);
    this.eventOptions = this.createEventOptions();
    this.middleware = middleware || [];
    
    this.callSubscribers = this.callSubscribers.bind(this);
    this.nextSubscriberCalls = [];
    
    this.setState(initialState !== undefined ? initialState : {});
    
    // call any middleware constructors
    this.callMiddleware('constructor');
}

Store.prototype.callMiddleware = function callMiddleware(type, args) {
    var currentArgs = args;
    for (var i = 0; i < this.middleware.length; i++) {
        var middlewareItem = this.middleware[i];
        if (middlewareItem.hasOwnProperty(type)) {
            currentArgs = middlewareItem[type].call(this, currentArgs);
        }
    }
    return currentArgs;
};

Store.prototype.getState = function getState() {
    return this.callMiddleware('getState', [this.state])[FIRST_INDEX];
};

Store.prototype.getPartialState = function getPartialState(selector) {
    var processedSelector = this.callMiddleware('getPartialStateParseSelector', [selector])[FIRST_INDEX];
    return this.callMiddleware('getPartialStateReturn', [this.accessStateAtSelector(processedSelector)])[FIRST_INDEX];
};

Store.prototype.accessStateAtSelector = function accessStateAtSelector(selector) {
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
    this.state = this.callMiddleware('setState', [state])[FIRST_INDEX];
    this.callSubscribersUnderSelector([]);
};

Store.prototype.setPartialState = function setPartialState(selector, value) {
    var args = this.callMiddleware('setPartialState', [selector, value]);
    var processedSelector = args[FIRST_INDEX];
    var processedValue = args[SECOND_INDEX];
    this.setStateAtSelector(processedSelector, processedValue);
    this.callSubscribersUnderSelector(processedSelector);
};

Store.prototype.setStateAtSelector = function setStateAtSelector(selector, value) {
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
    var processed = this.callMiddleware('dispatch', [event, payload]);
    var processedEvent = processed[FIRST_INDEX];
    var processedPayload = processed[SECOND_INDEX];
    
    var listeners = this.listeners[processedEvent];
    if (listeners !== undefined) {
        var eventOptions = this.getEventOptions();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](processedPayload, eventOptions);
        }
    }
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
    var processed = this.callMiddleware('subscribeToState', [selectors, listener]);
    var processedSelectors = processed[FIRST_INDEX];
    var processedListener = processed[SECOND_INDEX];
    
    var store = this;
    var stateChangeListener = function() {
        // get state values
        var stateValues = [];
        for (var i = 0; i < processedSelectors.length; i++) {
            stateValues.push(store.getPartialState(processedSelectors[i]));
        }
        
        // call listener with all the state values
        processedListener(stateValues);
    };
    
    for (var i = 0; i < processedSelectors.length; i++) {
        this.subscriptions.subscribeSelector(processedSelectors[i], stateChangeListener);
    }
    
    return function unsubscribeToState() {
        for (var i = 0; i < processedSelectors.length; i++) {
            store.subscriptions.unsubscribeSelector(processedSelectors[i], stateChangeListener);
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