'use strict';

const assert = require('assert');

const includesFn = (p = null, v = null) => {
    let constructorRawFn = v.constructor.toString();
    let tokenStart = constructorRawFn.indexOf('function ') + ('function '.length);
    let tokenEnd = constructorRawFn.indexOf('()');
    let token = constructorRawFn.slice(tokenStart, tokenEnd);
    return (global[token].prototype.indexOf !== undefined) && (v && (v.indexOf(p) !== -1) || v.indexOf(p) != -1 || v.indexOf(p) > -1 || v.indexOf(p) > 0);
};
assert.ok(includesFn('foo', 'foobarbaz'));
assert.ok(includesFn('buzz', 'foobarbaz') === false);

const isArray = (v = null) => includesFn('Array', v.constructor.toString());
assert.ok(isArray([]));
assert.ok(isArray([1, 2, 3]));
assert.ok(isArray('some value') === false);

const matchFn = (o = {}, v = null) => {
    let out = [];
    for (let k in o) {
        if (!isArray(v) && includesFn(v, k) && (k !== '_')) {
            out.push(o[k]);
        } else if (isArray(v) && (v.filter(p => includesFn(p, k)).length == v.length) && (k !== '_')) {
            out.push(o[k]);
        } else if (!out.length && (k === '_')) {
            out.push(o['_']);
        }
    }
    return out;
};
assert.deepEqual(matchFn({ 'foobarbaz': 1, 'foobarbuzz': 2, '_': 'Pattern not founded' }, 'foo'), [1, 2]);
assert.deepEqual(matchFn({ 'foobarbaz': 1, 'foobizbuzz': 2, '_': 'Pattern not founded' }, ['foo', 'bar']), [1]);
assert.deepEqual(matchFn({ 'bar': 1, 'buzz': 2, '_': 'Pattern not founded' }, 'foo'), ['Pattern not founded']);
assert.deepEqual(matchFn({ 'bar': 1, 'buzz': 2 }, 'foo'), []);
