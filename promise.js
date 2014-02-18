var nextTick = (process && process.nextTick) || setImmediate || setTimeout

function isObject(o) { return o && typeof o === 'object'}
function isFunction(f) { return f && typeof f === 'function'}

function Promise() {
  var state = 'pending', 
      callbacks = [],
      value
  this.then = function(onFulfilled, onRejected) {
    var p = new Promise()
    function callback() {
      var ret = value, 
          fn = state === 'resolved' ? 'resolve' : 'reject', 
          cb = state === 'resolved' ? onFulfilled : onRejected
      try {
        if (isFunction(cb)) {
          ret = cb(value)
          fn = 'resolve'
        }
        if (ret === p) 
          p.reject(new TypeError('Can\'t resolve itself'))
        else if (ret instanceof Promise)
          ret.then(p.resolve, p.reject)
        else p[fn](ret)
      } catch (e) {
        p.reject(e)
      }
    }
    if (state === 'pending') callbacks.push(callback)
    else nextTick(callback)
    return p
  }
  function handle(_state) {
    return function done(_value) {
      if (state !== 'pending') return
      state = _state
      value = _value
      for (var cb; cb = callbacks.shift();) nextTick(cb)
    }
  }
  this.resolve = handle('resolved')
  this.reject = handle('rejected')
}

if (isObject(module) && isObject(module.exports)) 
  module.exports = Promise
else window.Promise = Promise