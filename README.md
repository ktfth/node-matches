# Matcher

## Description

Library of pattern matching based on pure types and symbols

## Usage

```
[sudo] npm i -S matcher
```

### Example

```javascript
const matcher = require('xmatcher');

console.log(matcher.matches({ 'foo': 1, 'bar': 2, 'baz': 3, '_': 'Common value' }, 'bar'));
// [ 2 ]
```
