;(function() {
  // core
  function Promise() {
    var state     = 'pending', 
        callbacks = [],
        value

    this.then    = then
    this.resolve = complete('fulfilled')
    this.reject  = complete('rejected')

    function then(onFulfilled, onRejected) {
      var p = new Promise()
      if (state === 'pending') callbacks.push(callback)
      else nextTick(callback)
      return p

      function callback() {
        var cb = state === 'fulfilled' ? onFulfilled : onRejected
        if (typeof cb === 'function') {
          try {
            resolve(p, cb(value))
          } catch (e) {
            p.reject(e)
          }
        } 
        else if (state === 'fulfilled') resolve(p, value)
        else p.reject(value)
      }

      function resolve(p, x) {
        if (p === x) p.reject(new TypeError('Cannot resolve itself'))
        else if (x && (typeof x === 'object' || typeof x === 'function')) {
          var called = false
          try {
            var then = x.then
            if (typeof then === 'function') {
              then.call(x, 
                function(y) {
                  called || resolve(p, y)
                  called = true
                },
                function(r) {
                  called || p.reject(r)
                  called = true
                }
              )
            } else p.resolve(x)
          } catch(e) {
            called || p.reject(e)
          }
        } 
        else p.resolve(x)
      }
    }

    function complete(_state) {
      return function(_value) {
        if (state !== 'pending') return
        state = _state
        value = _value
        nextTick(function() {
          for (var cb; cb = callbacks.shift();) cb()
        })
      }
    }  
  }

  // more
  Promise.all = function(promises) {
    var cp     = new Promise(), 
        values = [],
        remain = promises.length
    for (var i = 0; promises[i]; i++) {
      (function(i) {
        promises[i].then(function(value) {
          values[i] = value
          if (--remain === 0) cp.resolve(values)
        }, cp.reject)
      })(i)
    }
    return cp
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise
    var nextTick = process.nextTick
  } else {
    window.Promise = Promise
    var nextTick = window.setImmediate || window.setTimeout
  }
})()