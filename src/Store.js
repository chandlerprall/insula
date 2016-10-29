import nextTick from 'next-tick';
import {doArraysIntersect} from './utils';
import TransformerInstance from './TransformerInstance';

export default function Store(config) {
    if (!(this instanceof Store)) {
        return new Store(config);
    }

    this.sections = {};
    this.transformerInstances = {};

    // allows collating affected sections across multiple dispatches
    this.affectedSections = [];

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

Store.prototype.getIntentContext = function getIntentContext() {
    return {dispatch: this.dispatch.bind(this)};
};

Store.prototype.processAffectedSections = function processAffectedSections() {
    // pick up where `Store.prototype.dispatch` left off, allowing intent dispatches to be batched

    // resolution step 2: run associated transformers
    let affectedTransformerInstances = [];
    Object.keys(this.transformerInstances).forEach(transformerUid => {
        const transformerInstance = this.transformerInstances[transformerUid];
        const {transformer, data: previousData} = transformerInstance;
        if (doArraysIntersect(transformer.selectors, this.affectedSections)) {
            const newData = transformer.transform(this.getValuesForSelectors(transformer.selectors));
            // @TODO better compare newData with previousData
            if (newData !== previousData) {
                affectedTransformerInstances.push(transformerInstance);
                transformerInstance.data = newData;
            }
        }
    });

    // resolution step 3: run associated transformer listeners
    affectedTransformerInstances.forEach(affectedTransformerInstance => {
        affectedTransformerInstance.subscriptions.forEach(subscription => {
            subscription(affectedTransformerInstance.data);
        })
    });

    // clear out the `affectedSections` buffer
    this.affectedSections.length = 0;
};

Store.prototype.dispatch = function dispatch(intentName, payload) {
    // resolution step 1: update sections` values
    const intentContext = this.getIntentContext();
    Object.keys(this.sections).forEach(sectionName => {
        const isSectionAffected = this.sections[sectionName].handleIntent(intentName, payload, intentContext);
        if (isSectionAffected) {
            this.affectedSections.push(sectionName);
            if (this.affectedSections.length === 1) {
                // `this.affectedSections` is no longer empty, schedule the batched transformer update
                nextTick(() => this.processAffectedSections());
            }
        }
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