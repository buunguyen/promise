promise
=======
Minimal promise implementation (~60 LOC pre-min) for Node and browsers. Supports most of A+ spec, except 2.3.3 (i.e. integration with other promise libraries).
Usage:
```javascript
var p = new Promise();
p.then(callback, errback);
p.resolve(value);
p.reject(value);
```