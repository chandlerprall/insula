var NO_INDEX = -1;
var ONE_BEFORE_LAST_INDEX = -1;
var ONE_ITEM = 1;

export function Node(selectorPath) {
    this.selectorPath = selectorPath;
    this.subscribers = [];
    this.children = {};
}

Node.prototype.hasNode = function hasNode(key) {
    return this.children.hasOwnProperty(key);
};

Node.prototype.createNode = function createNode(key) {
    var newSelectorPath = this.selectorPath.slice();
    newSelectorPath.push(key);
    return this.children[key] = new Node(newSelectorPath);
};

Node.prototype.get = function get(key) {
    return this.children[key];
};

Node.prototype.addSubscriber = function addSubscriber(subscriber) {
    this.subscribers.push(subscriber);
};

Node.prototype.removeSubscriber = function removeSubscriber(subscriber) {
    var subscriberIdx = this.subscribers.indexOf(subscriber);
    if (subscriberIdx !== NO_INDEX) {
        this.subscribers.splice(subscriberIdx, ONE_ITEM);
    }
};

export default function TreeSubscription(store) {
    this.store = store;
    this.root = new Node([]);
}

TreeSubscription.prototype.subscribeSelector = function subscribeSelector(selector, subscriber) {
    var currentNode = this.root;
    
    // walk tree, creating new nodes
    for (var i = 0; i < selector.length; i++) {
        var key = selector[i];
        if (!currentNode.hasNode(key)) {
            currentNode.createNode(key);
        }
        currentNode = currentNode.get(key);
    }
    
    // current node is the end of the chain, add the listener
    currentNode.addSubscriber(subscriber);
};

TreeSubscription.prototype.unsubscribeSelector = function unsubscribeSelector(selector, subscriber) {
    var currentNode = this.root;
    
    // walk tree
    for (var i = 0; i < selector.length; i++) {
        var key = selector[i];
        if (!currentNode.hasNode(key)) {
            return; // no node here, we can't remove anything
        }
        currentNode = currentNode.get(key);
    }
    
    // current node is the end of the chain, add the listener
    currentNode.removeSubscriber(subscriber);
};

function addSubscribersToArray(node, subscribers) {
    for (var i = 0; i < node.subscribers.length; i++) {
        var subscriber = node.subscribers[i];
        if (subscribers.indexOf(subscriber) === NO_INDEX) {
            subscribers.push(subscriber);
        }
    }
}

TreeSubscription.prototype.collectSubscribers = function collectSubscribers(selector) {
    var currentNode = this.root;
    var subscribers = [];
    
    // walk tree, creating new nodes
    for (var i = 0; i < selector.length; i++) {
        var key = selector[i];
    
        // if this is a parent node in the selector path add its selector
        if (i !== selector.length + ONE_BEFORE_LAST_INDEX) {
            addSubscribersToArray(currentNode, subscribers);
        }
        
        // if there is no matching node we can't continue looking for subscribers
        if (!currentNode.hasNode(key)) {
            // if this is the last selector in the chain we want to still grab any of its subscribers
            // even if we can't dig further into any children
            if (i === selector.length + ONE_BEFORE_LAST_INDEX) {
                addSubscribersToArray(currentNode, subscribers);
            }
            
            return subscribers;
        }
        
        currentNode = currentNode.get(key);
    }

    // current node is the end of the chain, collect child subscribers
    this.collectNodeSubscribers(currentNode, subscribers);

    return subscribers;
};

TreeSubscription.prototype.collectNodeSubscribers = function collectNodeSubscribers(node, subscribers) {
    // get node's subscribers
    addSubscribersToArray(node, subscribers);

    // call my children's subscribers
    var childrenKeys = Object.keys(node.children);
    for (var j = 0; j < childrenKeys.length; j++) {
        this.collectNodeSubscribers(node.children[childrenKeys[j]], subscribers);
    }
};