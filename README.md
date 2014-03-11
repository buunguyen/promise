promise
=======
A+ promise implementation that is described in this [article](url). The file `promise.js` is the one discussed in the article, it implements most of A+, except for the compatibility requirement with other promise libraries (section 2.3.3). For the full implementation of A+, look at `promise.full.js`.

#### Usage:
```javascript
var p = new Promise()
p.then(callback, errback)
p.resolve(value)
p.reject(value)

Promise.all(p1, p2).then(callback, errback)
```

#### Test
```
npm test
```