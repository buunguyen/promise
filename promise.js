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
            var ret = cb(value)
            if (ret === p) return p.reject(new TypeError('Cannot resolve itself'))
            if (ret instanceof Promise) return ret.then(p.resolve, p.reject)
            p.resolve(ret)
          } catch (e) {
            p.reject(e)
          }
        } else p[state === 'fulfilled' ? 'resolve' : 'reject'](value)
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