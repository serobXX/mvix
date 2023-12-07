import * as R from 'ramda'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'
import uniq from 'lodash/uniq'
import capitalize from 'lodash/capitalize'
import reduce from 'lodash/reduce'
import keys from 'lodash/keys'
import includes from 'lodash/includes'
import merge from 'lodash/merge'
import toNumber from 'lodash/toNumber'
import subtract from 'lodash/subtract'
import isString from 'lodash/isString'
import camelCase from 'lodash/camelCase'
import mapValues from 'lodash/mapValues'
import isObject from 'lodash/isObject'
import set from 'lodash/set'
import isArray from 'lodash/isArray'
import differenceBy from 'lodash/differenceBy'
import isFunction from 'lodash/isFunction'
import has from 'lodash/has'
import cloneDeep from 'lodash/cloneDeep'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import groupBy from 'lodash/groupBy'
import uniqueId from 'lodash/uniqueId'
import pick from 'lodash/pick'
import compact from 'lodash/compact'

function _isNotEmpty(arg) {
  return arg && R.apply(R.compose(R.not, R.isEmpty), [arg])
}

export {
  get as _get,
  isEmpty as _isEmpty,
  debounce as _debounce,
  uniqBy as _uniqBy,
  uniq as _uniq,
  capitalize as _capitalize,
  reduce as _reduce,
  keys as _keys,
  includes as _includes,
  merge as _merge,
  toNumber as _toNumber,
  subtract as _subtract,
  isString as _isString,
  camelCase as _camelCase,
  _isNotEmpty,
  mapValues as _mapValues,
  isObject as _isObject,
  set as _set,
  isArray as _isArray,
  differenceBy as _differenceBy,
  isFunction as _isFunction,
  has as _has,
  cloneDeep as _cloneDeep,
  differenceWith as _differenceWith,
  isEqual as _isEqual,
  groupBy as _groupBy,
  uniqueId as _uniqueId,
  pick as _pick,
  compact as _compact
}
