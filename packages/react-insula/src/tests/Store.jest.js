import React, {Component} from 'react';
import TestRenderer from 'react-test-renderer';
import {object} from 'prop-types';
import StoreComponent from '../Store';
import InsulaStore from 'insula';

describe('Store component', () => {
    it('adds the event dispatcher to context', () => {
        const renderFn = jest.fn(function() {
            expect(this.context.insulaStore).toBeInstanceOf(InsulaStore);
            return <div/>;
        });
        
        class TestComponent extends Component {
            constructor(...args) {
                super(...args);
            };
            
            render() {
                return renderFn.call(this);
            };
        }
        TestComponent.contextTypes = {insulaStore: object.isRequired};
        
        TestRenderer.create(<StoreComponent store={new InsulaStore()}><TestComponent/></StoreComponent>);
    });
});