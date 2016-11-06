require("babel-register");

const Immutable = require('immutable');
const Store = require('../src/Store').default;
const Section = require('../src/Section').default;
const Intent = require('../src/Intent').default;
const Transformer = require('../src/Transformer').default;

class ImmutableStore extends Store {
    constructor(...args) {
        super(...args);
    }

    mapSelectorToSectionName(sectionSelector) {
        return sectionSelector.split('.')[0];
    }

    getValuesForSelectors(sectionSelectors) {
        return sectionSelectors.map(sectionSelector => {
            const valueSelectors = sectionSelector.split('.');
            const [sectionName, ...selectors] = valueSelectors;
            const section = this.sections[sectionName];

            if (section == null) return null;

            const sectionValue = section.value;
            if (selectors.length === 0) {
                return sectionValue;
            } else {
                return sectionValue.getIn(selectors);
            }
        });
    }
}

const initialOrderState = Immutable.fromJS({
    name: '',
    address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: ''
    },
    items: []
});

const SET_NAME = 'intent/SET_NAME';
const setName = Intent(SET_NAME, (order, name) => order.set('name', name));

const SET_ADDRESS_FIELD = 'intent/SET_ADDRESS_FIELD';
const setAddressField = Intent(SET_ADDRESS_FIELD, (order, {field, value}) => order.setIn(['address', field], value));

const ADD_ITEM_TO_ORDER = 'intent/ADD_ITEM_TO_ORDER';
const addItemToOrder = Intent(ADD_ITEM_TO_ORDER, (order, item) => order.update('items', (items) => items.push(Immutable.fromJS(item))));

const store = new ImmutableStore();
store.addSection('order', Section(initialOrderState, setName, setAddressField, addItemToOrder));

const nameTransformer = Transformer(['order.name'], ([name]) => name);
store.subscribeTransformer(nameTransformer, name => console.log('name changed to', name));

const addressTransformer = Transformer(['order.address'], ([address]) => address);
store.subscribeTransformer(addressTransformer, address => console.log('address changed to', address.toJS()));

const itemsTransformer = Transformer(['order.items'], ([address]) => address);
store.subscribeTransformer(itemsTransformer, items => console.log('items changed to', items.toJS()));

// enough setup, now GO

store.dispatch(SET_NAME, 'Chandler');

store.dispatch(SET_ADDRESS_FIELD, {field: 'line1', value: '123 Main St.'});
store.dispatch(SET_ADDRESS_FIELD, {field: 'city', value: 'Denver'});
store.dispatch(SET_ADDRESS_FIELD, {field: 'state', value: 'Colorado'});
store.dispatch(SET_ADDRESS_FIELD, {field: 'zip', value: '80202'});

store.dispatch(ADD_ITEM_TO_ORDER, {name: 'Cookies', quantity: 2, price: '4.98'});
store.dispatch(ADD_ITEM_TO_ORDER, {name: 'Milk', quantity: 1, price: '1.99'});
store.dispatch(ADD_ITEM_TO_ORDER, {name: 'Santa Trap', quantity: 1, price: '999.99'});