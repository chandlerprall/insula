import React, {Component} from 'react';
import TestRenderer from 'react-test-renderer';
import StoreComponent from '../Store';
import InsulaStore from 'insula';
import connect, {shallowEquals} from '../Connect';

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
    
        it('includes component props when calling the transformer', () => {
            const store = new InsulaStore({});
            
            class TestComponent extends Component {
                render() {
                    return <div/>;
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({}));
            
            const ConnectedComponent = connect([], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent foo="bar"/></StoreComponent>);
    
            expect(transformer.mock.calls).toMatchObject([
                [[{foo: 'bar'}], {}]
            ]);
            
            renderer.unmount(); // cleanup
        });
    
        it('passes a dispatch function to the connected view', () => {
            const store = new InsulaStore({});
    
            const renderFn = jest.fn(() => <div/>);
            
            class TestComponent extends Component {
                render() {
                    return renderFn(this.props);
                }
            }
            TestComponent.displayName = 'TestComponent';
    
            const ConnectedComponent = connect([], () => ({}))(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
    
            expect(renderFn.mock.calls).toHaveLength(1);
            expect(renderFn.mock.calls[0]).toHaveLength(1);
            expect(renderFn.mock.calls[0][0].dispatch).toBeInstanceOf(Function);
    
            renderer.unmount(); // cleanup
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
        
            expect(transformer.mock.calls).toMatchObject([
                [[SUB_STATE, SUB_STATE.two, {}], {}]
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
        
            expect(renderFn.mock.calls).toMatchObject([
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
        
            expect(renderFn.mock.calls).toMatchObject([
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
        
            expect(renderFn.mock.calls).toMatchObject([
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
                expect(transformer.mock.calls).toMatchObject([
                    [['value', {}], {}],
                    [['val', {}], {}],
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
                expect(renderFn.mock.calls).toMatchObject([
                    [{prop: 'value'}],
                    [{prop: 'val'}],
                ]);
        
                renderer.unmount(); // cleanup
            }));
        });
    });
    
    describe('Transformer options', () => {
        it('passes a bindDispatch option', () => {
            const store = new InsulaStore({one: {two: 'value'}});
        
            class TestComponent extends Component {
                render() {
                    return <div/>
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({}));
        
            const ConnectedComponent = connect([[]], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            expect(transformer.mock.calls).toHaveLength(1);
            expect(transformer.mock.calls[0]).toHaveLength(2);
            expect(transformer.mock.calls[0][1].bindDispatch).toBeInstanceOf(Function);
    
            renderer.unmount(); // cleanup
        });
    
        it('calling bindDispatch with an event and payload returns a curried function that does dispatch the event and payload', () => {
            const store = new InsulaStore({one: {two: 'value'}});
        
            const EVENT = 'event';
            const PAYLOAD = {};
        
            const listener = jest.fn();
            store.on(EVENT, listener);
        
            class TestComponent extends Component {
                render() {
                    return <div/>
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(([state], {bindDispatch}) => {
                const eventDispatcher = bindDispatch(EVENT, PAYLOAD);
            
                // don't ever do this in a real system, but hey it works \o/
                eventDispatcher();
                return {};
            });
        
            const ConnectedComponent = connect([['one', 'two']], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            expect(listener.mock.calls).toMatchObject([
                [PAYLOAD, {}]
            ]);
    
            renderer.unmount(); // cleanup
        });
    
        it('calling bindDispatch with an event and no payload returns a curried function that allows payload to be specified', () => {
            const store = new InsulaStore({one: {two: 'value'}});
        
            const EVENT = 'event';
            const PAYLOAD = {};
        
            const listener = jest.fn();
            store.on(EVENT, listener);
        
            class TestComponent extends Component {
                render() {
                    return <div/>
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(([state], {bindDispatch}) => {
                const eventDispatcher = bindDispatch(EVENT);
            
                // don't ever do this in a real system, but hey it works \o/
                eventDispatcher(PAYLOAD);
                return {};
            });
        
            const ConnectedComponent = connect([['one', 'two']], transformer)(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            expect(listener.mock.calls).toMatchObject([
                [PAYLOAD, {}]
            ]);
    
            renderer.unmount(); // cleanup
        });
    });
    
    describe('Runtime listeners', () => {
        it('dispatches listeners after the component mounted with the component as context', () => {
            const store = new InsulaStore({});
        
            const EVENT = 'event';
            const PAYLOAD = {};
        
            const listener = jest.fn();
        
            let theComponent;
            class TestComponent extends Component {
                constructor(...args) {
                    super(...args);
                    theComponent = this;
                }
                
                render() {
                    return <div/>
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({}));
        
            const ConnectedComponent = connect(
                [],
                transformer,
                {listeners: {[EVENT]: listener}}
            )(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            store.dispatch(EVENT, PAYLOAD);
        
            expect(listener.mock.calls).toMatchObject([
                [PAYLOAD, {}]
            ]);
            
            expect(listener.mock.instances).toEqual([theComponent]);
        
            renderer.unmount(); // cleanup
        });
    
        it(`doesn't dispatch listeners from components that have unmounted`, () => {
            const store = new InsulaStore({});
        
            const EVENT = 'event';
            const PAYLOAD = {foo: 'thing'};
        
            const listener = jest.fn();
        
            class TestComponent extends Component {
                render() {
                    return <div/>
                }
            }
            TestComponent.displayName = 'TestComponent';
        
            const transformer = jest.fn(() => ({}));
        
            const ConnectedComponent = connect(
                [],
                transformer,
                {listeners: {[EVENT]: listener}}
            )(TestComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ConnectedComponent/></StoreComponent>);
        
            store.dispatch(EVENT, PAYLOAD); // this fires the listener
    
            renderer.unmount(); // cleanup
    
            store.dispatch(EVENT, PAYLOAD); // this one shouldn't fire the listener
        
            expect(listener.mock.calls).toMatchObject([
                [PAYLOAD, {}]
            ]);
        });
    });
    
    describe('component prop updates', () => {
        it('calls the transformer when input props are shallowly changed', () => {
            const store = new InsulaStore({});
    
            class ChildComponent extends Component {
                render() {
                    return <div/>
                }
            }
            ChildComponent.displayName = 'ChildComponent';
    
            let propForChild = 'bar';
            class ParentComponent extends Component {
                render() {
                    return <ConnectedComponent foo={propForChild}/>;
                }
            }
            ParentComponent.displayName = 'ParentComponent';
    
            const transformer = jest.fn(() => ({}));
    
            const ConnectedComponent = connect(
                [],
                transformer
            )(ChildComponent);
            const renderer = TestRenderer.create(<StoreComponent store={store}><ParentComponent/></StoreComponent>);
    
            expect(transformer.mock.calls[0][0][0]).toMatchObject({foo: 'bar'});
            transformer.mockClear();
    
            propForChild = 'baz';
            renderer.getInstance().forceUpdate();
    
            expect(transformer.mock.calls[0][0][0]).toMatchObject({foo: 'baz'});
            transformer.mockClear();
        });
    });
});

describe('shallowEquals', () => {
    it('returns true for objects that are empty', () => {
        expect(shallowEquals(
            {},
            {}
        )).toBe(true);
    });
    
    it('returns true for objects that are shallowly equvilient', () => {
        expect(shallowEquals(
            {foo: 'bar'},
            {foo: 'bar'}
        )).toBe(true);
    });
    
    it('returns true when all key/values match', () => {
        expect(shallowEquals(
            {foo: 'bar', bar: 'baz'},
            {foo: 'bar', bar: 'baz'}
        )).toBe(true);
    });
    
    it('returns false when any key is different in obj2', () => {
        expect(shallowEquals(
            {foo: 'bar', bar: 'baz'},
            {foo: 'bar', bar2: 'baz'}
        )).toBe(false);
    });
    
    it('returns false when any value is different in obj2', () => {
        expect(shallowEquals(
            {foo: 'bar', bar: 'baz'},
            {foo: 'bar', bar: 'baz2'}
        )).toBe(false);
    });
    
    it('returns false when object key count differs', () => {
        expect(shallowEquals(
            {foo: 'bar', bar: 'baz'},
            {foo: 'bar'}
        )).toBe(false);
    
        expect(shallowEquals(
            {foo: 'bar'},
            {foo: 'bar', bar: 'baz'}
        )).toBe(false);
    });
});