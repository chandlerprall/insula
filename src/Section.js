export default function Section(initialValue, ...intents) {
    if (!(this instanceof Section)) {
        return new Section(initialValue, ...intents);
    }

    this.value = initialValue;

    this.intents = intents.reduce((intents, intent) => {
        intents[intent.name] = intents[intent.name] || [];
        intents[intent.name].push(intent);
        return intents;
    }, {});
}

Section.prototype.handleIntent = function handleIntent(intentName, payload) {
    if (this.intents[intentName] == null) {
        return false;
    } else {
        this.value = (this.intents[intentName] || []).reduce(
            (value, subscribedIntent) => {
                return subscribedIntent.mutate(value, payload);
            },
            this.value
        );
        return true;
    }
};