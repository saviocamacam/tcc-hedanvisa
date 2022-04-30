

export default class Counter {
    private keys: any[] = [];

    constructor(iterable = []) {
        this.update(iterable);
    }

    public update(iterable = []) {
        iterable.forEach(item => {
            if (this[item] === undefined)
                this.keys.push(item);
            this[item] = (this[item] || 0) + 1;
        });
    }

    public most_common(n=null) {
        return this.keys
            .map(key => ([ key, this[key] ]))
            .sort((a, b) => a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0)
            .slice(0, (n || this.keys.length));
    }

    public getKeys() {
        return this.keys;
    }

    public getValues() {
        return this.keys.map(key => this[key]);
    }

    public toString() {
        const items = this.keys.reduce(
            (array, key) => [...array, `${key}: ${this[key]}`], []
        ).join(', ');
        return "Counter(" + items + ")";
    }
}