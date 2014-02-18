Promise = require("./promise")

exports.deferred = function() {
  var p = new Promise()
  return {
    promise: p,
    resolve: p.resolve,
    reject: p.reject
  }
}