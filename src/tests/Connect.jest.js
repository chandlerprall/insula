import React, {Component} from 'react';
import TestRenderer from 'react-test-renderer';
import StoreComponent from '../Store';
import InsulaStore from 'insula';
import connect from '../Connect';

function testAfterNextTick(fn, delay = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                try {
                    fn();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            },
            delay
        );
    });
}

describe('Connector', () => {
    describe('connection to state', () => {
        it('immediately renders the child component with selected state', () => {
            const SUB_STATE = {two: 'value'};
            
            class TestComponent extends Component {
                render() {
                    return <div/>;
                }
            }
            TestComponent.displayName = 'TestComponent';
            
            const connectedComponent = connect([], () => ({}))(TestComponent);
            expect(connectedComponent.displayName).toBe(`Insula(${TestComponent.displayName})`);
        });
    
        it('calls the transformer with selected state', () => {
            const SUB_STATE = {two: 'value'};
            const store = new InsulaStore({one: SUB_STATE});
        
            class TestComponent extends Component {
                render() {
                    return <div/>;
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const selectors = [['one'], ['one', 'two']];
            const transformer = jest.fn(() => ({}));
        
            const ConnectedComponent = connect(selectors, transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            expect(transformer.mock.calls).toEqual([
                [[SUB_STATE, SUB_STATE.two]]
            ]);
    
            renderer.unmount(); // cleanup
        });
    
        it('renders the connected view with props from the transformer', () => {
            const store = new InsulaStore({one: {two: 'value'}});
    
            const renderFn = jest.fn(() => <div/>);
        
            class TestComponent extends Component {
                render() {
                    return renderFn(this.props);
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({one: '1', two: 2}));
        
            const ConnectedComponent = connect([], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            expect(renderFn.mock.calls).toEqual([
                [{one: '1', two: 2}]
            ]);
    
            renderer.unmount(); // cleanup
        });
    
        it('renders the connected view with props from the transformer and ones that are passed in', () => {
            const store = new InsulaStore({one: {two: 'value'}});
    
            const renderFn = jest.fn(() => <div/>);
        
            class TestComponent extends Component {
                render() {
                    return renderFn(this.props);
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({one: '1', two: 2}));
        
            const ConnectedComponent = connect([], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent prop="erty"/></StoreComponent>);
        
            expect(renderFn.mock.calls).toEqual([
                [{one: '1', two: 2, prop: 'erty'}]
            ]);
    
            renderer.unmount(); // cleanup
        });
    
        it('renders the connected view with props from the transformer overriding component attributes', () => {
            const store = new InsulaStore({one: {two: 'value'}});
    
            const renderFn = jest.fn(() => <div/>);
        
            class TestComponent extends Component {
                render() {
                    return renderFn(this.props);
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({foo: 'baz'}));
        
            const ConnectedComponent = connect([], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent foo="bar"/></StoreComponent>);
        
            expect(renderFn.mock.calls).toEqual([
                [{foo: 'baz'}]
            ]);
            
            renderer.unmount(); // cleanup
        });
    
        it('triggers the transformer when a relevant state change occurs', () => {
            const store = new InsulaStore({one: {two: 'value'}});

            class TestComponent extends Component {
                render() {
                    return <div/>
                }
            }
            TestComponent.displayName = 'TestComponent';

            const transformer = jest.fn((stateValues) => ({}));

            const ConnectedComponent = connect([['one', 'two']], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);

            return testAfterNextTick(() => {
                store.setPartialState(['one', 'two'], 'val');
            }).then(() => testAfterNextTick(() => {
                expect(transformer.mock.calls).toEqual([
                    [['value']],
                    [['val']],
                ]);
    
                renderer.unmount(); // cleanup
            }));
        });
    
        it('re-renders the component when a relevant state change occurs', () => {
            const store = new InsulaStore({one: {two: 'value'}});

            const renderFn = jest.fn(() => <div/>);

            class TestComponent extends Component {
                render() {
                    return renderFn(this.props);
                }
            }
            TestComponent.displayName = 'TestComponent';

            const transformer = jest.fn(([prop]) => ({prop}));

            const ConnectedComponent = connect([['one', 'two']], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
    
            return testAfterNextTick(() => {
                store.setPartialState(['one', 'two'], 'val');
            }).then(() => testAfterNextTick(() => {
                expect(renderFn.mock.calls).toEqual([
                    [{prop: 'value'}],
                    [{prop: 'val'}],
                ]);
        
                renderer.unmount(); // cleanup
            }));
        });
    });
});