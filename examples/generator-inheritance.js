const xmatcher = require('../');

console.log(xmatcher.matches((async function () {
    return await function* self() {
        this.example = 'some-value';
        return this;
    }
})()), new xmatcher.Symbol('some-value', v => {
    return xmatcher.includes(v, global['matcherPatternValue']);
}));
