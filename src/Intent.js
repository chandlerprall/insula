export default function Intent(name, mutator) {
    if (!(this instanceof Intent)) {
        return new Intent(name, mutator);
    }

    if (name == null) {
        throw new Error('Intent must be created with a name.');
    }

    if (typeof mutator !== 'function') {
        throw new Error('Intent must be created with a mutator function.');
    }

    this.name = name;
    this.mutator = mutator;
}

Intent.prototype.mutate = function mutate(value, payload) {
    return this.mutator(value, payload);
};