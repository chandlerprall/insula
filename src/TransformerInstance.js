export default class TransformerInstance {
    constructor(transformer, data) {
        this.transformer = transformer;
        this.data = data;
        this.subscriptions = [];
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