export default class TransformerInstance {
    constructor(transformer) {
        this.transformer = transformer;
        this.data = null;
        this.subscriptions = [];
        this.createdProxyIntents = [];
    }
    
    subscribe(subscription) {
        this.subscriptions.push(subscription);
    }
    
    unsubscribe(subscription) {
        const subscriptionIdx = this.subscriptions.indexOf(subscription);
        if (subscriptionIdx >= 0) {
            this.subscriptions.splice(subscriptionIdx, 1);
        }
    }
}