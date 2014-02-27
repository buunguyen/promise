;(function() {
  function Promise() {
    var state     = 'pending', 
        callbacks = [],
        value
    function then(onFulfill, onReject) {
      var p = new Promise()
      function callback() {
        var cb = state === 'resolved' ? onFulfill : onReject
        if (typeof cb === 'function') {
          try {
            var ret = cb(value)
            if (ret === p) return p.reject(new TypeError('Cannot resolve itself'))
            if (ret instanceof Promise) return ret.then(p.resolve, p.reject)
            p.resolve(ret)
          } catch (e) {
            p.reject(e)
          }
        } else p[state === 'resolved' ? 'resolve' : 'reject'](value)
      }
      if (state === 'pending') callbacks.push(callback)
      else nextTick(callback)
      return p
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
    this.then    = then
    this.resolve = complete('resolved')
    this.reject  = complete('rejected')
  }

  Promise.all = function(promises) {
    var p = new Promise(), 
        values = []
    ;(function next(index) {
      promises[index].then(function(value) {
        values[index++] = value
        if (index < promises.length) next(index)
        else p.resolve(values)
      }, p.reject)
    })(0)
    return p
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise
    var nextTick = process.nextTick
  } else {
    window.Promise = Promise
    var nextTick = window.setImmediate || window.setTimeout
  }
})()