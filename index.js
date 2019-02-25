'use strict';

const assert = require('assert');

const includesFn = (p = null, v = null) => {
    let constructorRawFn = v && v.constructor.toString();
    let tokenStart = constructorRawFn && constructorRawFn.indexOf('function ') + ('function '.length);
    let tokenEnd = constructorRawFn && constructorRawFn.indexOf('()');
    let token = constructorRawFn && constructorRawFn.slice(tokenStart, tokenEnd);
    return token && (global[token].prototype.indexOf !== undefined) && (v && (v.indexOf(p) !== -1) || v.indexOf(p) != -1 || v.indexOf(p) > -1 || v.indexOf(p) > 0);
};
assert.ok(includesFn('foo', 'foobarbaz'));
assert.ok(includesFn('buzz', 'foobarbaz') === false);

exports.includes = includesFn;

const isArray = (v = null) => includesFn('Array', v.constructor.toString());
assert.ok(isArray([]));
assert.ok(isArray([1, 2, 3]));
assert.ok(isArray('some value') === false);

exports.isArray = isArray;

class Symbol extends Object {
    constructor(v = null, fn = (p) => p) {
        super(v, fn);
        this.fn = (pattern) => fn.apply({pattern: pattern}, [v]);
        this.value = v;
    }
}

const isSymbol = (v = null) => includesFn('Symbol', v.constructor.toString());
assert.ok(isSymbol(new Symbol('some-value')));
assert.ok(isSymbol(new Symbol('some-value', v => v + '-another-value')));
assert.equal((new Symbol(1)).value, 1);
assert.equal((new Symbol(1, () => 2)).fn(), 2);
assert.equal((new Symbol(1, (p) => p + 2)).fn(), 3);

exports.isSymbol = isSymbol;
exports.Symbol = Symbol;

const matchesFn = (o = {}, v = null) => {
    let out = [];
    global['matcher'] = o;
    for (let k in o) {
        global['matcherPattern'] = k;
        global['matcherPatternValue'] = o[k];
        if (!isArray(v) && isSymbol(v) && v.fn(k) && (k !== '_')) {
            out.push(o[k]);
        } else if (!isArray(v) && !isSymbol(v) && includesFn(v, k) && (k !== '_')) {
            out.push(o[k]);
        } else if (isArray(v) && !isSymbol(v) && (v.filter(p => includesFn(p, k)).length > 0) && (k !== '_')) {
            out.push(o[k]);
        } else if (!out.length && (k === '_')) {
            out.push(o['_']);
        }
    }
    delete global['matcher'];
    delete global['matcherPattern'];
    delete global['matcherPatternValue'];
    return out;
};
assert.deepEqual(matchesFn({ 'foobarbaz': 1, 'foobarbuzz': 2, '_': 'Pattern not founded' }, 'foo'), [1, 2]);
assert.deepEqual(matchesFn({ 'foobarbaz': 1, 'foobizbuzz': 2, '_': 'Pattern not founded' }, ['foo', 'bar']), [1, 2]);
assert.deepEqual(matchesFn({ 'bar': 1, 'buzz': 2, '_': 'Pattern not founded' }, 'foo'), ['Pattern not founded']);
assert.deepEqual(matchesFn({ 'bar': 1, 'buzz': 2 }, 'foo'), []);
assert.deepEqual(matchesFn({ 'bar': 1, 'baz': 2, 'fizz': 3, '_': 10 }, new Symbol('fizz', v => {
    return !includesFn(v, global['matcherPattern']);
})), [1, 2]);
assert.deepEqual(matchesFn({ 'foobar': 1, 'foobaz': (x, y) => x * y, 'fizz': 3, '_': 'Common Pattern' }, new Symbol('foo', v => {
    return includesFn(v, global['matcherPattern']) && typeof(global['matcherPatternValue']) === 'function';
})).length, 1);

exports.matches = matchesFn;
