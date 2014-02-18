var nextTick = (process && process.nextTick) || setImmediate || setTimeout

function isObject(o) { return o && typeof o === 'object'}
function isFunction(f) { return f && typeof f === 'function'}

function Promise() {
  var state     = 'pending', 
      callbacks = [],
      value
  function then(onFulfilled, onRejected) {
    var p = new Promise()
    function callback() {
      var ret = value, 
          fn  = state === 'resolved' ? 'resolve' : 'reject', 
          cb  = state === 'resolved' ? onFulfilled : onRejected
      try {
        if (isFunction(cb)) {
          ret = cb(value)
          fn  = 'resolve'
        }
        if (ret === p) return p.reject(new TypeError('Can\'t resolve itself'))
        if (ret instanceof Promise) return ret.then(p.resolve, p.reject)
        p[fn](ret)
      } catch (e) {
        p.reject(e)
      }
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
      for (var cb; cb = callbacks.shift();) nextTick(cb)
    }
  }
  this.then    = then
  this.resolve = complete('resolved')
  this.reject  = complete('rejected')
}

if (isObject(module) && isObject(module.exports)) 
  module.exports = Promise
else window.Promise = Promise