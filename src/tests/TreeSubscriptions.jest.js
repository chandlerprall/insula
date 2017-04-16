import Store from '../Store';
import TreeSubscription, {Node} from '../TreeSubscription';

describe('TreeSubscription', () => {
    describe('Node', () => {
        it('creates child nodes', () => {
            const node = new Node([]);
            const newNode = node.createNode('test');
            expect(newNode).toBeInstanceOf(Node);
            expect(newNode.selectorPath).toEqual(['test']);
        });
    
        it('correctly reports having a child node', () => {
            const node = new Node([]);
            node.createNode('test');
            expect(node.hasNode('test')).toBe(true);
        });
    
        it('correctly reports not having a child node', () => {
            const node = new Node([]);
            node.createNode('test');
            expect(node.hasNode('testing')).toBe(false);
        });
        
        it('retrives a child node', () => {
            const node = new Node([]);
            node.createNode('test');
            
            const child = node.get('test');
            expect(child).toBeInstanceOf(Node);
            expect(child.selectorPath).toEqual(['test']);
        });
        
        it('doesn\'t error when removing a subscriber that isn\'t subscribed', () => {
            const node = new Node([]);
            const subscriber = jest.fn();
            node.removeSubscriber(subscriber);
        });
    });
    
    describe('TreeSubscription', () => {
        it('collects top-level selector', () => {
            const STATE = {};
            const store = new Store({});
            const tree = new TreeSubscription(store);

            const subscriber = jest.fn();
            const selector = [];

            tree.subscribeSelector(selector, subscriber);
            const subscribers = tree.collectSubscribers([]);

            expect(subscribers).toEqual([subscriber]);
        });

        it('collects nested selector', () => {
            const store = new Store({one: {two: {}}});
            const tree = new TreeSubscription(store);

            const subscriber = jest.fn();
            const selector = ['one', 'two'];

            tree.subscribeSelector(selector, subscriber);
            const subscribers = tree.collectSubscribers(['one', 'two']);

            expect(subscribers).toEqual([subscriber]);
        });

        it('collects selectors nested beyond the selector', () => {
            const store = new Store({one: {two: {}}});
            const tree = new TreeSubscription(store);

            const subscriber = jest.fn();
            const selector = ['one', 'two'];

            tree.subscribeSelector(selector, subscriber);
            const subscribers = tree.collectSubscribers(['one']);

            expect(subscribers).toEqual([subscriber]);
        });
        
        it('collects parent selectors', () => {
            const store = new Store({one: {two: {}}});
            const tree = new TreeSubscription(store);
    
            const subscriber = jest.fn();
            const selector = ['one'];
    
            tree.subscribeSelector(selector, subscriber);
            const subscribers = tree.collectSubscribers(['one', 'two', 'three']);
    
            expect(subscribers).toEqual([subscriber]);
        });

        it('doesn\'t error if no selectors match', () => {
            const store = new Store();
            const tree = new TreeSubscription(store);
            const subscribers = tree.collectSubscribers(['one']);
            expect(subscribers).toEqual([]);
        });

        it('doesn\'t collect an unsubscribed selector', () => {
            const store = new Store();
            const tree = new TreeSubscription(store);

            const subscriber = jest.fn();

            tree.subscribeSelector(['one', 'two'], subscriber);
            tree.unsubscribeSelector(['one', 'two'], subscriber);
            const subscribers = tree.collectSubscribers(['one', 'two']);
            expect(subscribers).toEqual([]);
        });

        it('doesn\'t error when removing a non-subscribed subscriber', () => {
            const store = new Store();
            const tree = new TreeSubscription(store);

            const subscriber = jest.fn();

            tree.unsubscribeSelector(['one'], subscriber);
        });

        it('collects multiple subscribers', () => {
            const TWO_STATE = {};
            const ONE_STATE = {two: TWO_STATE};
            const store = new Store({one: ONE_STATE});
            const tree = new TreeSubscription(store);

            const subscriber1 = jest.fn();
            const selector1 = ['one'];
            const subscriber2 = jest.fn();
            const selector2 = ['one', 'two'];

            tree.subscribeSelector(selector1, subscriber1);
            tree.subscribeSelector(selector2, subscriber2);
            const subscribers = tree.collectSubscribers(['one']);

            expect(subscribers).toEqual([subscriber1, subscriber2]);
        });
        
        it('only collects a subscriber once per collection', () => {
            const TWO_STATE = {};
            const ONE_STATE = {two: TWO_STATE};
            const store = new Store({one: ONE_STATE});
            const tree = new TreeSubscription(store);
    
            const subscriber = jest.fn();
            const selector1 = ['one'];
            const selector2 = ['one', 'two'];
    
            tree.subscribeSelector(selector1, subscriber);
            tree.subscribeSelector(selector2, subscriber);
            const subscribers = tree.collectSubscribers(['one']);
    
            expect(subscribers).toEqual([subscriber]);
        });
    });
});