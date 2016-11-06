import nextTick from 'next-tick';
import {areObjectsShallowEqual, doArraysIntersect, getUid} from './utils';
import TransformerInstance from './TransformerInstance';

export default function Store(config = {}) {
    if (!(this instanceof Store)) {
        return new Store(config);
    }

    this.sections = {};
    this.transformerInstances = {};
    this.proxiedIntents = {};

    // allows collating affected sections across multiple dispatches
    this.affectedSections = [];

    // add sections
    Object.keys(config.sections || {}).forEach(sectionName => this.addSection(sectionName, config.sections[sectionName]))
}

Store.prototype.addSection = function addSection(name, section) {
    this.sections[name] = section;
};

Store.prototype.removeSection = function removeSection(name) {
    delete this.sections[name];
};

Store.prototype.getValuesForSelectors = function getValuesForSelectors(selectors) {
    return selectors.map(selector => {
        const section = this.getSectionBySelector(selector);
        if (section == null) return null;
        return section.value;
    });
};

Store.prototype.getSectionBySelector = function getSectionBySelector(selector) {
    return this.sections[this.mapSelectorToSectionName(selector)];
};

Store.prototype.mapSelectorToSectionName = function mapSelectorToSectionName(selector) {
    return selector;
};

Store.prototype.addIntentProxy = function addIntentProxy(proxyName, targetIntentName, intentPayload) {
    if (this.proxiedIntents.hasOwnProperty(proxyName)) {
        console.warn(`Intent proxy "${proxyName}" already exists, overriding`);
    }
    this.proxiedIntents[proxyName] = {targetIntentName, intentPayload};
};

Store.prototype.removeIntentProxy = function removeIntentProxy(proxyName) {
    delete this.proxiedIntents[proxyName];
};

Store.prototype.getIntentContext = function getIntentContext() {
    return {dispatch: this.dispatch.bind(this)};
};

Store.prototype.getTransformerContext = function getTransformerContext(transformerInstance) {
    return {
        createIntent: (targetIntent, payload, proxyDescription) => {
            const proxyName = `${getUid()}-${proxyDescription || ''}`; // create a unique proxy name
            this.addIntentProxy(proxyName, targetIntent, payload); // register the proxy with the store
            transformerInstance.createdProxyIntents.push(proxyName); // track the proxy so it can be un-registered next time the transformer runs
            return proxyName;
        }
    };
};

Store.prototype.isTransformerOutputDifferent = function isTransformerOutputDifferent(a, b) {
    return !areObjectsShallowEqual(a, b);
};

Store.prototype.isTransformerInputDifferent = function isTransformerInputDifferent(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (!areObjectsShallowEqual(a[i], b[i])) return true;
    }
    return false;
};

Store.prototype.processAffectedSections = function processAffectedSections() {
    // pick up where `Store.prototype.dispatch` left off, allowing intent dispatches to be batched

    // resolution step 2: run associated transformers
    let affectedTransformerInstances = [];
    Object.keys(this.transformerInstances).forEach(transformerUid => {
        const transformerInstance = this.transformerInstances[transformerUid];
        const {transformer, data: previousData} = transformerInstance;
        const transformerContext = this.getTransformerContext(transformerInstance);
        
        // un-register any previously created proxy intents
        transformerInstance.createdProxyIntents.forEach(proxyName => this.removeIntentProxy(proxyName));
        transformerInstance.createdProxyIntents.length = 0;

        if (doArraysIntersect(transformer.selectors.map(selector => this.mapSelectorToSectionName(selector)), this.affectedSections)) {
            const transformerInput = this.getValuesForSelectors(transformer.selectors);
            if (this.isTransformerInputDifferent(transformerInput, transformerInstance.lastInput)) {
                const newData = transformer.transform(transformerInput, transformerContext);
                transformerInstance.lastInput = newData;
                if (this.isTransformerOutputDifferent(newData, previousData)) {
                    affectedTransformerInstances.push(transformerInstance);
                    transformerInstance.data = newData;
                }
            }
        }
    });

    // resolution step 3: run associated transformer listeners
    affectedTransformerInstances.forEach(affectedTransformerInstance => {
        affectedTransformerInstance.subscriptions.forEach(subscription => subscription(affectedTransformerInstance.data));
    });

    // clear out the `affectedSections` buffer
    this.affectedSections.length = 0;
};

Store.prototype.dispatch = function dispatch(intentName, payload) {
    if (this.proxiedIntents.hasOwnProperty(intentName)) {
        const proxiedIntent = this.proxiedIntents[intentName];
        intentName = proxiedIntent.targetIntentName;
        payload = proxiedIntent.intentPayload;
    }

    // resolution step 1: update sections` values
    const intentContext = this.getIntentContext();
    Object.keys(this.sections).forEach(sectionSelector => {
        const sectionName = this.mapSelectorToSectionName(sectionSelector);
        const section = this.getSectionBySelector(sectionSelector);
        const isSectionAffected = section.handleIntent(intentName, payload, intentContext);
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
    let  transformerInstance = this.transformerInstances[transformer.uid];
    if (transformerInstance == null) {
        // create instance
        transformerInstance = new TransformerInstance(transformer);

        // get context for instance
        const transformerContext = this.getTransformerContext(transformerInstance);

        // get initial transform data
        const transformerInput = this.getValuesForSelectors(transformer.selectors);
        transformerInstance.lastInput = transformerInput;
        transformerInstance.data = transformer.transform(transformerInput, transformerContext);

        this.transformerInstances[transformer.uid] = transformerInstance;
    }
    transformerInstance.subscribe(subscription);
    return transformerInstance.data;
};

Store.prototype.unsubscribeTransformer = function unsubscribeTransformer(transformer, subscription) {
    const transformerInstance = this.transformerInstances[transformer.uid];
    if (transformerInstance) {
        // un-register any previously created proxy intents
        transformerInstance.createdProxyIntents.forEach(proxyName => this.removeIntentProxy(proxyName));
        transformerInstance.createdProxyIntents.length = 0;

        transformerInstance.unsubscribe(subscription);
        if (transformerInstance.subscriptions.length === 0) {
            delete this.transformerInstances[transformer.uid];
        }
    }
};