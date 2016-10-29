import {doArraysIntersect} from './utils';
import TransformerInstance from './TransformerInstance';

export default function Store(config) {
    if (!(this instanceof Store)) {
        return new Store(config);
    }

    this.sections = {};
    this.transformerInstances = {};

    // add sections
    Object.keys(config.sections).forEach(sectionName => this.addSection(sectionName, config.sections[sectionName]))
}

Store.prototype.addSection = function addSection(name, section) {
    this.sections[name] = section;
};

Store.prototype.removeSection = function removeSection(name) {
    delete this.sections[name];
};

Store.prototype.getValuesForSelectors = function getValuesForSelectors(sections) {
    return sections.map(section => {
        if (this.sections[section] == null) return null;
        return this.sections[section].value;
    });
};

Store.prototype.getIntentContext = function() {
    return {dispatch: this.dispatch.bind(this)};
};

Store.prototype.dispatch = function dispatch(intentName, payload) {
    // Step 1: update sections` values
    let affectedSections = [];
    const intentContext = this.getIntentContext();
    Object.keys(this.sections).forEach(sectionName => {
        const isSectionAffected = this.sections[sectionName].handleIntent(intentName, payload, intentContext);
        isSectionAffected && affectedSections.push(sectionName);
    });

    // Step 2: run associated transformers
    let affectedTransformerInstances = [];
    Object.keys(this.transformerInstances).forEach(transformerUid => {
        const transformerInstance = this.transformerInstances[transformerUid];
        const {transformer, data: previousData} = transformerInstance;
        if (doArraysIntersect(transformer.selectors, affectedSections)) {
            const newData = transformer.transform(this.getValuesForSelectors(transformer.selectors));
            // @TODO better compare newData with previousData
            if (newData !== previousData) {
                affectedTransformerInstances.push(transformerInstance);
                transformerInstance.data = newData;
            }
        }
    });

    // Step 3: run associated transformer listeners
    affectedTransformerInstances.forEach(affectedTransformerInstance => {
        affectedTransformerInstance.subscriptions.forEach(subscription => {
            subscription(affectedTransformerInstance.data);
        })
    });
};

Store.prototype.subscribeTransformer = function subscribeTransformer(transformer, subscription) {
    let transformerInstance = this.transformerInstances[transformer.uid];
    if (transformerInstance == null) {
        this.transformerInstances[transformer.uid] = transformerInstance = new TransformerInstance(
            transformer,
            transformer.transform(this.getValuesForSelectors(transformer.selectors))
        );
    }
    transformerInstance.subscribe(subscription);
    return transformerInstance.data;
};

Store.prototype.unsubscribeTransformer = function unsubscribeTransformer(transformer, subscription) {
    const transformerInstance = this.transformerInstances[transformer.uid];
    if (transformerInstance) {
        transformerInstance.unsubscribe(subscription);
        if (transformerInstance.subscriptions.length === 0) {
            delete this.transformerInstances[transformer.uid];
        }
    }
};