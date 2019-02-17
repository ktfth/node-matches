'use strict';

const assert = require('assert');

const matcher = require('./');

describe('Matcher includes', () => {
    it('pattern found on a string', () => {
        assert.ok(matcher.includes('foo', 'foobar'));
    });

    it('pattern not present on the string', () => {
        assert.ok(matcher.includes('buzz', 'foobar') === false);
    });
});

describe('Matcher simple pattern', () => {
    it('retrieve a value by your presence on the object', () => {
        assert.deepEqual(matcher.matches({ 'foo': 1, 'bar': 2, 'baz': 3 }, 'foo'), [1]);
    });

    it('retrieve multiple values by a presence in the object counting more than a once', () => {
        assert.deepEqual(matcher.matches({ 'foobar': 1, 'foobaz': 2, 'buzzbar': 3, 'buzzgi': 4 }, 'foo'), [1, 2]);
    });

    it('a common value interpreted by a underscore when nothing matches', () => {
        assert.deepEqual(matcher.matches({ 'foo': 1, 'bar': 2, '_': 'Common pattern value' }, 'buzz'), ['Common pattern value']);
    });
});
