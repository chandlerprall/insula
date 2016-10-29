export default function Section(initialValue, ...intents) {
    if (!(this instanceof Section)) {
        return new Section(initialValue, ...intents);
    }

    this.value = initialValue;
    this.intents = [];

    intents.forEach(intent => this.addIntent(intent));
}

Section.prototype.addIntent = function addIntent(intent) {
    const intentName = intent.name;

    let intentHandlers = this.intents[intentName];
    if (intentHandlers == null) {
        this.intents[intentName] = intentHandlers = [];
    }

    intentHandlers.push(intent);
};

Section.prototype.removeIntent = function removeIntent(intent) {
    const intentName = intent.name;
    const intentHandlers = this.intents[intentName];

    if (intentHandlers == null) return;

    const intentIdx = intentHandlers.indexOf(intent);
    if (intentIdx >= 0) {
        intentHandlers.splice(intentIdx, 1);
        if (intentHandlers.length === 0) {
            delete this.intents[intentName];
        }
    }
};

Section.prototype.handleIntent = function handleIntent(intentName, payload, context) {
    if (this.intents[intentName] == null) {
        return false;
    } else {
        this.value = (this.intents[intentName] || []).reduce(
            (value, subscribedIntent) => {
                const intentReturnValue = subscribedIntent.mutate(value, payload, context);
                // if the intent returned `undefined` then ignore it
                return intentReturnValue !== undefined ? intentReturnValue : value;
            },
            this.value
        );
        return true;
    }
};