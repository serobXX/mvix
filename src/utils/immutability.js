import update, { extend } from 'immutability-helper'

extend('$auto', function (value, object) {
  return object ? update(object, value) : update({}, value)
})
extend('$autoArray', function (value, object) {
  return object ? update(object, value) : update([], value)
})

export default update
