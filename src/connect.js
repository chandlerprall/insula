import React, {Component, PropTypes} from 'react';

export default function connect(transformer) {
    return (view) => {
        class ConnectedClass extends Component {
            constructor(props, context, ...rest) {
                super(props, context, ...rest);

                this.store = context.capacitorStore;

                this.onStoreUpdate = output => {
                    this.setState({transformerOutput: output});
                };

                this.state = {
                    transformerOutput: this.store.subscribeTransformer(transformer, this.onStoreUpdate)
                };
            }

            componentWillUnmount() {
                this.store.unsubscribeTransformer(transformer, this.onStoreUpdate);
            }

            getProps() {
                const fromParent = this.props;
                const {transformerOutput: fromTransformer} = this.state;
                return {
                    ...fromParent,
                    ...fromTransformer,
                    dispatch: this.store.dispatch.bind(this.store)
                };
            }

            render() {
                return React.createElement(view, this.getProps());
            }
        }

        ConnectedClass.displayName = `CapacitorConnect<${view.displayName}>`;

        ConnectedClass.propTypes = {

        };

        ConnectedClass.contextTypes = {
            capacitorStore: PropTypes.object.isRequired
        };

        return ConnectedClass;
    };
}