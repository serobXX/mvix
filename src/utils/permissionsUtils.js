import * as R from 'ramda'

import { _capitalize, _isNotEmpty, _uniqueId } from './lodash'
import {
  customFieldPermissionPageGroups,
  permissionGroupNames,
  permissionPageGroups,
  permissionTypes,
  customFieldGroups
} from 'constants/permissionGroups'

// TODO Rename
function appendTo(acc, cur) {
  return R.apply(R.append, [cur, acc])
}

function invertAppendTo(cur, acc) {
  return R.apply(R.append, [cur, acc])
}

function push(toArr, fromArr) {
  return R.reduce(appendTo, toArr, fromArr)
}

function findId(element, arr) {
  return R.apply(R.find(R.propEq('id', R.prop('id', element))), [arr])
}

function isIdIn(element, arr) {
  return !!R.apply(findId, [element, arr])
}

function indexOf(element, arr) {
  return R.indexOf(R.apply(findId, [element, arr]), arr)
}

function replaceId(element, arr) {
  return R.update(R.apply(indexOf, [element, arr]), element, arr)
}

function pushOrReplace(acc, cur) {
  return R.apply(R.ifElse(isIdIn, replaceId, invertAppendTo), [cur, acc])
}

function concat(toArr, fromArr) {
  return R.reduce(pushOrReplace, toArr, fromArr)
}

function updateArr(arr, newArr) {
  return R.apply(R.ifElse(R.isEmpty, push, concat), [arr, newArr])
}

export function update(arr, newArr, entity) {
  return R.apply(
    R.ifElse(
      _isNotEmpty,
      R.partial(updateArr, [arr]),
      R.partial(filter, [entity, arr, filterWithoutEntity])
    ),
    [newArr]
  )
}

function elementEntity(element) {
  return R.apply(
    R.compose(
      R.toLower,
      R.partial(R.prop, ['entity']),
      R.partial(R.prop, ['group'])
    ),
    [element]
  )
}

function filterFn(entity, element) {
  return R.equals(entity, elementEntity(element))
}

function filterWithoutEntity(entity, element) {
  return R.apply(R.compose(R.not, R.partial(R.equals, [entity])), [
    elementEntity(element)
  ])
}

export function filter(entity, arr, callback = filterFn) {
  return R.filter(R.partial(callback, [entity]), arr)
}

export function checkboxValue(isRead, id, permissions) {
  function findFn(element) {
    return R.equals(id, element.groupId)
  }

  function element() {
    return R.find(findFn, permissions)
  }

  function permissionName() {
    return isRead ? 'readPermission' : 'writePermission'
  }

  function isPermissionEqual() {
    return R.apply(R.propEq(permissionName(), 1), [element()])
  }

  return R.apply(
    R.ifElse(element, isPermissionEqual, () => false),
    []
  )
}

function idPropName(isGroups) {
  return isGroups ? 'groupId' : 'id'
}

export function createGetReqObj(isGroups, id, entity, params) {
  return {
    [idPropName(isGroups)]: id,
    entity: _capitalize(entity),
    params
  }
}

export function createPutReqObj(isGroups, id, data) {
  return {
    [idPropName(isGroups)]: id,
    data: data
  }
}

function requestObj(element) {
  return {
    groupId: R.prop('id', R.prop('group', element)),
    readPermission: R.prop('readPermission', element),
    writePermission: R.prop('writePermission', element)
  }
}

export function toRequestFormat(permissions) {
  return R.map(requestObj, permissions)
}

export function change(isRead, value, groupId, permissions) {
  function numValue() {
    return value ? 1 : 0
  }

  function invertNumValue() {
    return !value ? 1 : 0
  }

  function permissionName() {
    return isRead ? 'readPermission' : 'writePermission'
  }

  function invertPermissionName() {
    return isRead ? 'writePermission' : 'readPermission'
  }

  function createObj() {
    return R.apply(
      R.pipe(
        R.partial(R.assoc, ['groupId', groupId]),
        R.partial(R.assoc, [permissionName(), numValue()]),
        !isRead && value
          ? R.partial(R.assoc, [invertPermissionName(), 1])
          : R.partial(R.assoc, [invertPermissionName(), 0])
      ),
      [{}]
    )
  }

  function findById() {
    return R.find(R.propEq('groupId', groupId), permissions)
  }

  function isIdIn() {
    return Boolean(findById())
  }

  function indexOf() {
    return R.indexOf(findById(), permissions)
  }

  function assocObj() {
    return R.apply(
      R.pipe(
        R.partial(R.assoc, [permissionName(), invertNumValue()]),
        R.partial(R.assoc, [permissionName(), numValue()])
      ),
      [findById()]
    )
  }

  function update() {
    const indexOfRes = indexOf()
    const assocObjRes = assocObj()
    if (
      R.equals(assocObjRes, { groupId, readPermission: 0, writePermission: 0 })
    ) {
      return permissions.length > 1
        ? R.remove(indexOfRes, 1, permissions)
        : R.tail(permissions)
    }
    return R.update(indexOfRes, assocObjRes, permissions)
  }

  function push() {
    return R.append(createObj(), permissions)
  }

  function change() {
    return R.apply(R.ifElse(isIdIn, update, push), [])
  }

  return change()
}

export function checkPermissions(groups, permissions) {
  return groups.some(group => permissions.includes(group))
}

export const getPermissionGroup = (permissionPageGroup, name) => {
  return `${permissionPageGroup} ${name}`
}

export const getCustomFieldPermissionByGroup = (group, name) =>
  getPermissionGroup(
    customFieldPermissionPageGroups[permissionPageGroups[group]],
    `${name}`
  )

const parseCustomFields = permission => {
  let modifidPermission

  Object.values(customFieldGroups).every(group => {
    if (permission.group === permissionGroupNames[group]) {
      modifidPermission = {
        ...permission,
        group: getCustomFieldPermissionByGroup(group, permission.name),
        linkedGroup: permissionGroupNames[group]
      }
      return false
    }
    return true
  })

  return modifidPermission || permission
}

export const parsePermissionByGroup = permission => {
  permission = parseCustomFields(permission)
  switch (permission.group) {
    case permissionGroupNames.industries:
      return {
        ...permission,
        group: getPermissionGroup(permissionPageGroups.lead, 'industries')
      }
    case permissionGroupNames.solutions:
      return {
        ...permission,
        group: getPermissionGroup(permissionPageGroups.lead, 'solutions')
      }
    case permissionGroupNames.stage:
      return {
        ...permission,
        group: getPermissionGroup(permissionPageGroups.opportunity, 'stage')
      }
    default:
      return permission
  }
}

export const parsePermissionByName = permission => {
  switch (permission.name) {
    default:
      return permission
  }
}

export const getOtherPermissionRows = permissions =>
  permissions
    .filter(({ action }) => action === permissionTypes.other)
    .map(permission => ({ [permission.name]: permission }))

export const getCRUDPermissions = permissions =>
  permissions.filter(({ action }) => action !== permissionTypes.other)

export const isOtherPermissionRow = row =>
  Object.values(row)[0].action === permissionTypes.other

export const permissionRowsComparer = (row1, row2) => {
  if (isOtherPermissionRow(row1) && isOtherPermissionRow(row2)) {
    return 0
  }
  return isOtherPermissionRow(row1) ? 1 : -1
}

export const permissionNameToDisplayName = {}

export const splitByUpperForPermission = word => {
  if (word && word.length > 0) {
    const upperWithin = new RegExp('(?!^[A-Z])+([A-Z])+')
    const match = word.match(upperWithin)
    return match ? word.replace(upperWithin, ` ${match[0]}`) : word
  } else {
    return null
  }
}

export const getGroupPermissions = (permissions, groupName, groupValue) => {
  const subGroup = customFieldPermissionPageGroups[groupValue]
  const rule = new RegExp(`^${groupValue}+`, 'i')
  const subRule = new RegExp(`^${subGroup}+`, 'i')
  const matchedGroup = Object.keys(permissions).reduce((accumulator, name) => {
    const exactMatch = new RegExp(`^${groupValue}$`)
    const formattedName = exactMatch.test(name)
      ? name
      : splitByUpperForPermission(name.replace(groupName, ''))

    if (rule.test(name) && (!subGroup || !subRule.test(name))) {
      accumulator = [
        ...accumulator,
        {
          [formattedName]: getCRUDPermissions(permissions[name])
        },
        ...getOtherPermissionRows(permissions[name])
      ]
      delete permissions[name]
    }
    return accumulator.sort(permissionRowsComparer)
  }, [])

  if (subGroup) {
    const subPermissions = getGroupPermissions(permissions, subGroup, subGroup)
    if (subPermissions.length) {
      matchedGroup.push({
        'Custom Fields': subPermissions,
        isSubGroup: true
      })
    }
  }
  return matchedGroup
}

export const transformPermission = permissions => {
  let permission = permissions.map(item => {
    return parseCustomFields(item)
  })

  Object.values(customFieldGroups).forEach(group => {
    permission = [
      ...permission,
      ...createCRUDStaticPermissions(group, permission, true).filter(
        ({ attached }) => attached !== false
      )
    ]
  })

  return permission.reduce((permissionsObj, item) => {
    const { group, action } = item
    permissionsObj[group] = {
      [permissionTypes.create]: false,
      [permissionTypes.read]: false,
      [permissionTypes.update]: false,
      [permissionTypes.delete]: false,
      ...permissionsObj[group],
      [action]: true
    }
    return permissionsObj
  }, {})
}

export const createCRUDStaticPermissions = (
  group,
  permissions,
  ignoreAttached = false
) => {
  const permissionActions = [
    permissionTypes.create,
    permissionTypes.read,
    permissionTypes.delete,
    permissionTypes.update
  ]
  group = permissionGroupNames[group]
  const customFieldPermissions = permissions.filter(
    p => p.linkedGroup === group
  )

  return permissionActions.map(action => ({
    action,
    attached: customFieldPermissions.some(
      p => p.action === action && (ignoreAttached || p.attached)
    ),
    group,
    id: `static-permission-${_uniqueId()}`,
    name: group,
    isStaticPermission: true
  }))
}
