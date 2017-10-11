import Store from '../Store';

function testAfterNextTick(fn) {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                try {
                    fn();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }
        );
    });
}

describe('Store', () => {
    describe('State retrieval', () => {
        it('accepts a state on creation and allows retrieval', () => {
            const STATE = {};
            const store = new Store(STATE);
            expect(store.getState()).toBe(STATE);
        });
    
        it('defaults to an empty state object', () => {
            const store = new Store();
            expect(store.getState()).toEqual({});
        });
    
        it('allows the initial state to be a falsey value', () => {
            const store = new Store(0);
            expect(store.getState()).toEqual(0);
        });
    
        it('allows partial retrieval of state', () => {
            const STATE = {obj: {sub: 'value'}};
            const store = new Store(STATE);
            expect(store.getPartialState(['obj'])).toBe(STATE.obj);
        });
    
        it('retrieves a nested sub-value in state', () => {
            const STATE = {obj: {sub: 'value'}};
            const store = new Store(STATE);
            expect(store.getPartialState(['obj', 'sub'])).toBe(STATE.obj.sub);
        });
    
        it('retrieves a null value when piece of state doesn\'t exist', () => {
            const STATE = {};
            const store = new Store(STATE);
            expect(store.getPartialState(['obj', 'sub', 'value'])).toBeNull();
        });
    });
    
    describe('Event dispatching', () => {
        it('allows listening for and dispatching events', () => {
            const store =  new Store();
            
            const EVENT = 'event';
            const PAYLOAD = {testing: true};
            
            const listener = jest.fn();
            
            store.on(EVENT, listener);
            store.dispatch(EVENT, PAYLOAD);
    
            expect(listener.mock.calls).toEqual([
                [PAYLOAD, store.eventOptions]
            ]);
        });
    
        it('dispatches events with the expected options', () => {
            const store =  new Store();
    
            const EVENT = 'event';
            const PAYLOAD = {testing: true};
    
            const listener = jest.fn();
    
            store.on(EVENT, listener);
            store.dispatch(EVENT, PAYLOAD);
    
            const options = listener.mock.calls[0][1];
            expect(options.dispatch).toBeInstanceOf(Function);
            expect(options.getState).toBeInstanceOf(Function);
            expect(options.setState).toBeInstanceOf(Function);
            expect(options.setPartialState).toBeInstanceOf(Function);
            expect(options.getPartialState).toBeInstanceOf(Function);
        });
        
        it('doesn\'t error when dispatching unknown events', () => {
            const store =  new Store();
            
            const EVENT = 'event';
            const PAYLOAD = {testing: true};
            
            store.dispatch(EVENT, PAYLOAD);
        });
        
        it('allows multiple listeners to be subscribed to the same event', () => {
            const store =  new Store();
            
            const EVENT = 'event';
            const PAYLOAD = {testing: true};
            
            const listener1 = jest.fn();
            const listener2 = jest.fn();
            
            store.on(EVENT, listener1);
            store.on(EVENT, listener2);
            store.dispatch(EVENT, PAYLOAD);
            
            expect(listener1.mock.calls).toEqual([
                [PAYLOAD, store.eventOptions]
            ]);
            expect(listener2.mock.calls).toEqual([
                [PAYLOAD, store.eventOptions]
            ]);
        });
        
        it('allows listeners to be subscribed to multiple events', () => {
            const store =  new Store();
            
            const EVENT1 = 'event';
            const EVENT2 = 'event-2';
            const PAYLOAD = {testing: true};
            
            const listener = jest.fn();
            
            store.on(EVENT1, listener);
            store.on(EVENT2, listener);
            store.dispatch(EVENT1, PAYLOAD);
            store.dispatch(EVENT2, PAYLOAD);
            
            expect(listener.mock.calls).toEqual([
                [PAYLOAD, store.eventOptions],
                [PAYLOAD, store.eventOptions]
            ]);
        });
        
        it('allows event listeners to be removed', () => {
            const store =  new Store();
            
            const EVENT = 'event';
            const PAYLOAD = {testing: true};
            
            const listener = jest.fn();
            
            store.on(EVENT, listener);
            store.off(EVENT, listener);
            store.dispatch(EVENT, PAYLOAD);
            
            expect(listener.mock.calls).toEqual([]);
        });
        
        it('doesn\'t error when removing unsubscribed events from an un-initialized event', () => {
            const store =  new Store();
            
            const EVENT = 'event';
            const listener = jest.fn();
            
            store.off(EVENT, listener);
        });
        
        it('doesn\'t error when removing unsubscribed events from an initialized event', () => {
            const store =  new Store();
            
            const EVENT = 'event';
            const listener1 = jest.fn();
            const listener2 = jest.fn();
            
            store.on(EVENT, listener1);
            store.off(EVENT, listener2);
        });
    });
    
    describe('State updating', () => {
        it('allows an update to state', () => {
            const STATE1 = {};
            const STATE2 = {};
        
            const store = new Store(STATE1);
            store.setState(STATE2);
            expect(store.getState()).toBe(STATE2);
        });
    
        it('allows a partial update to state', () => {
            const store = new Store({obj: {sub: 'value'}});
            store.setPartialState(['obj'], {key: 'val'});
            expect(store.getState()).toEqual({obj: {key: 'val'}});
        });
    
        it('allows a partial update to nested state', () => {
            const store = new Store({obj: {sub: 'value'}});
            store.setPartialState(['obj', 'sub'], 'val');
            expect(store.getState()).toEqual({obj: {sub: 'val'}});
        });
    
        it('allows a partial update to a piece of state that doesn\'t exist, creating objects along the way', () => {
            const store = new Store({});
            store.setPartialState(['obj', 'sub'], 'value');
            expect(store.getState()).toEqual({obj: {sub: 'value'}});
        });
    });
    
    describe('Event-driven state updates', () => {
        it('allows events to set state updates', () => {
            const STATE1 = {};
            const STATE2 = {};
        
            const store = new Store(STATE1);
        
            const EVENT = 'event';
        
            const listener = jest.fn((payload, {setState}) => {
                setState(STATE2);
            });
        
            store.on(EVENT, listener);
            store.dispatch(EVENT);
        
            expect(store.getState()).toBe(STATE2);
        });
    
        it('allows events to set partial state updates', () => {
            const STATE1 = {obj: {sub: 'value'}};
            const STATE2 = {obj: {key: 'val'}};
        
            const store = new Store(STATE1);
        
            const EVENT = 'event';
        
            const listener = jest.fn((payload, {setPartialState}) => {
                setPartialState(['obj'], {key: 'val'});
            });
        
            store.on(EVENT, listener);
            store.dispatch(EVENT);
        
            expect(store.getState()).toEqual(STATE2);
        });
    });
    
    describe('State change subscriptions', () => {
        it('notifies listeners on full state changes', () => {
            const store = new Store({});

            const listener = jest.fn();

            store.subscribeToState([[]], listener);

            const NEW_STATE = {};
            store.setState(NEW_STATE);
            
            return testAfterNextTick(() => {
                expect(listener.mock.calls).toEqual([
                    [[NEW_STATE]]
                ]);
            });
        });

        it('notifies listeners on partial state changes', () => {
            const store = new Store({one: '1', two: '2'});

            const listener = jest.fn();

            store.subscribeToState([['two']], listener);

            store.setPartialState(['two'], '-2');
    
            return testAfterNextTick(() => {
                expect(listener.mock.calls).toEqual([
                    [['-2']]
                ]);
            });
        });
    
        it('notifies listeners on partial, deep state changes', () => {
            const store = new Store({one: '1', two: {sub: {key: 'value'}}});
        
            const listener = jest.fn();
        
            store.subscribeToState([['two', 'sub']], listener);
        
            store.setPartialState(['two', 'sub', 'key'], 'val');
        
            return testAfterNextTick(() => {
                expect(listener.mock.calls).toEqual([
                    [[{key: 'val'}]]
                ]);
            });
        });
    
        it('notifies a listener once on back-to-back changes', () => {
            const store = new Store({one: '1', two: {sub: {key: 'value'}}});
        
            const listener = jest.fn();
        
            store.subscribeToState([['two', 'sub']], listener);
        
            store.setPartialState(['two', 'sub', 'key'], 'val');
            store.setPartialState(['two', 'sub', 'key'], 'val');
        
            return testAfterNextTick(() => {
                expect(listener.mock.calls).toEqual([
                    [[{key: 'val'}]]
                ]);
            });
        });
    
        it('doesn\'t call an unrelated subscription', () => {
            const store = new Store({one: '1', two: {sub: {key: 'value'}}});
        
            const listener = jest.fn();
        
            store.subscribeToState([['two', 'sub']], listener);
        
            store.setPartialState(['two', 'three'], 'val');
        
            return testAfterNextTick(() => {
                expect(listener.mock.calls).toEqual([]);
            });
        });
    
        it('returns a function to unsubscribe listeners', () => {
            const store = new Store({one: '1', two: {sub: {key: 'value'}}});
        
            const listener = jest.fn();
        
            const unsubscribe = store.subscribeToState([['two', 'sub']], listener);
        
            expect(unsubscribe).toBeInstanceOf(Function);
        });
    
        it('correctly unsubscribes listeners', () => {
            const store = new Store({one: '1', two: {sub: {key: 'value'}}});
    
            const listener = jest.fn();
    
            const unsubscribe = store.subscribeToState([['two', 'sub']], listener);
            unsubscribe();
            
            store.setPartialState(['two', 'sub', 'key'], 'val');
    
            return testAfterNextTick(() => {
                expect(listener.mock.calls).toEqual([]);
            });
        });

        it('calls listeners when the subscriber is second-from-the-last part of the selector', () => {
            const store = new Store({
                foo: 'bar',
                deep: {nested: 'object'}
            });

            const deepStateListener = jest.fn();
            const deepNestedStateListener = jest.fn();

            store.subscribeToState([['deep']], deepStateListener);
            store.subscribeToState([['deep', 'nested']], deepNestedStateListener);

            expect.assertions(2);
            store.setPartialState(['deep'], {nested: 'new object'});

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    global.doDebug = true;
                    store.setPartialState(['deep', 'nested'], 'third object');

                    setTimeout(() => {
                        try {expect(deepStateListener).toHaveBeenCalledTimes(2);} catch(e) {reject(e);}
                        try {expect(deepNestedStateListener).toHaveBeenCalledTimes(2);} catch(e) {reject(e);}

                        resolve();
                    });
                });
            });
        });
    });
    
    describe('Middleware', () => {
        it('calls the constructor middleware', () => {
            const constructorfn1 = jest.fn();
            const constructorfn2 = jest.fn();
            
            const store = new Store({}, [
                {constructor: constructorfn1},
                {constructor: constructorfn2},
            ]);
            
            expect(constructorfn1.mock.calls).toHaveLength(1);
            expect(constructorfn1.mock.instances).toEqual([store]);
            
            expect(constructorfn2.mock.calls).toHaveLength(1);
            expect(constructorfn2.mock.instances).toEqual([store]);
        });
    
        it('calls the setState middleware', () => {
            const setstatefn = jest.fn(args => args);
            const STATE1 = {};
            const STATE2 = {};
        
            const store = new Store(STATE1, [{setState: setstatefn}]);
            store.setState(STATE2);
        
            expect(setstatefn.mock.calls).toEqual([
                [[STATE1]],
                [[STATE2]],
            ]);
        });
    
        it('calls the setPartialState middleware', () => {
            const setpartialstatefn = jest.fn(args => [['foo2'], 'baz']);
            const STATE1 = {foo: 'bar'};
            const STATE2 = {foo: 'bar', foo2: 'baz'};
        
            const store = new Store(STATE1, [{setPartialState: setpartialstatefn}]);
            store.setPartialState(['foo'], 'baz');
        
            expect(setpartialstatefn.mock.calls).toEqual([
                [[['foo'], 'baz']],
            ]);
            expect(store.state).toEqual(STATE2);
        });
    
        it('calls the getState middleware', () => {
            const STATE1 = {foo: 'bar'};
            const STATE2 = {foo: 'bar', foo2: 'baz'};
            const getstatefn = jest.fn(args => [STATE2]);
        
            const store = new Store(STATE1, [{getState: getstatefn}]);
    
            expect(store.getState()).toEqual(STATE2);
            expect(getstatefn.mock.calls).toEqual([
                [[STATE1]],
            ]);
        });
    
        it('calls the getPartialStateParseSelector middleware', () => {
            const STATE1 = {foo: 'bar', foo2: 'baz'};
            const getpartialstatefn = jest.fn(args => [['foo2']]);
        
            const store = new Store(STATE1, [{getPartialStateParseSelector: getpartialstatefn}]);
            const selector = ['foo'];
        
            expect(store.getPartialState(selector)).toEqual('baz');
            expect(getpartialstatefn.mock.calls).toEqual([
                [[selector]],
            ]);
        });
    
        it('calls the getPartialStateReturn middleware', () => {
            const STATE1 = {foo: 'bar'};
            const getpartialstatefn = jest.fn(args => ['baz']);
        
            const store = new Store(STATE1, [{getPartialStateReturn: getpartialstatefn}]);
            
            expect(store.getPartialState(['foo'])).toEqual('baz');
            expect(getpartialstatefn.mock.calls).toEqual([
                [['bar']],
            ]);
        });
        
        it('calls the dispatch middleware', () => {
            const EVENT1 = 'event1';
            const EVENT2 = 'event2';
            const PAYLOAD1 = {};
            const PAYLOAD2 = {};
            
            const dispatchfn = jest.fn(([event, payload]) => [EVENT2, PAYLOAD2]);
            const store = new Store({}, [{dispatch: dispatchfn}]);
            
            const listener = jest.fn();
            store.on(EVENT2, listener);
            
            store.dispatch(EVENT1, PAYLOAD1);
            
            expect(dispatchfn.mock.calls).toEqual([
                [[EVENT1, PAYLOAD1]],
            ]);
            expect(listener.mock.calls).toEqual([
                [PAYLOAD2, store.eventOptions],
            ]);
        });
    });

    describe('developer warnings', () => {
        it('calls console.warn when a non-array selector is passed to getPartialState', () => {
            const warn = console.warn = jest.fn();

            const store = new Store();

            try {store.getPartialState();} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith('Insula: invalid selector "[object Undefined]" pass to getPartialState');

            warn.mockClear();

            try {store.getPartialState(null);} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith('Insula: invalid selector "[object Null]" pass to getPartialState');

            warn.mockClear();

            try {store.getPartialState(5);} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith('Insula: invalid selector "5" pass to getPartialState');

            warn.mockClear();

            try {store.getPartialState({});} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith('Insula: invalid selector "[object Object]" pass to getPartialState');
        });

        it('calls console.warn when a non-array selector is passed to setPartialState', () => {
            const warn = console.warn = jest.fn();

            const store = new Store();

            try {store.setPartialState(null, {});} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith('Insula: invalid selector "[object Null]" pass to setPartialState');
        });

        it('calls console.warn when a non-array selector is passed to subscribeToState', () => {
            const warn = console.warn = jest.fn();

            const store = new Store();

            try {store.subscribeToState(5, () => {});} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith('Insula: invalid selector "5" pass to subscribeToState');

            warn.mockClear();

            try {store.subscribeToState([5, null], () => {});} catch(e) {}
            expect(warn).toHaveBeenCalledTimes(2);
            expect(warn.mock.calls).toEqual([
                ['Insula: invalid selector "5" pass to subscribeToState, selector at index 0'],
                ['Insula: invalid selector "[object Null]" pass to subscribeToState, selector at index 1']
            ]);
        });
    });
});