var NO_INDEX = -1;
var REMOVE_ONE_ITEM = 1;

export default function Store(initialState) {
    this.state = initialState || {};
    this.listeners = {};
    this.eventOptions = this.createEventOptions();
    
    // To avoid creating polymorphic function usage of the internal dispatching code
    // `dispatch` thinly wraps the `internalDispatch` method by first setting
    // `this.currentPayload`
    this.currentEventPayload = null;
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
};

Store.prototype.setPartialState = function setPartialState(selector, value) {
    var lastKey = selector[selector.length - 1];
    
    var currentValue = this.getState();
    for (var i = 0; i < selector.length - 1; i++) {
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
    this.currentPayload = payload;
    this.internalDispatch(event);
};

Store.prototype.internalDispatch = function internalDispatch(event) {
    var listeners = this.listeners[event];
    if (listeners !== undefined) {
        var payload = this.currentPayload;
        var eventOptions = this.getEventOptions();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].call(this, event, payload, eventOptions);
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
    };
};

Store.prototype.getEventOptions = function getEventOptions() {
    return this.eventOptions;
};