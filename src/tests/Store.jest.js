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
                [EVENT, PAYLOAD, store.eventOptions]
            ]);
        });
    
        it('dispatches events with the expected options', () => {
            const store =  new Store();
    
            const EVENT = 'event';
            const PAYLOAD = {testing: true};
    
            const listener = jest.fn();
    
            store.on(EVENT, listener);
            store.dispatch(EVENT, PAYLOAD);
    
            const options = listener.mock.calls[0][2];
            expect(options.dispatch).toBeInstanceOf(Function);
            expect(options.getState).toBeInstanceOf(Function);
            expect(options.setState).toBeInstanceOf(Function);
            expect(options.setPartialState).toBeInstanceOf(Function);
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
                [EVENT, PAYLOAD, store.eventOptions]
            ]);
            expect(listener2.mock.calls).toEqual([
                [EVENT, PAYLOAD, store.eventOptions]
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
                [EVENT1, PAYLOAD, store.eventOptions],
                [EVENT2, PAYLOAD, store.eventOptions]
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
        
            const listener = jest.fn((event, payload, {setState}) => {
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
        
            const listener = jest.fn((event, payload, {setPartialState}) => {
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
    });
});