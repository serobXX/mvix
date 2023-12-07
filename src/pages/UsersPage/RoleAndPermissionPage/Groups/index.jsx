import { useCallback, useEffect, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { WhiteButton } from 'components/buttons'
import { FormControlInput } from 'components/formControls'
import { CircularLoader } from 'components/loaders'
import { Text } from 'components/typography'
import { permissionPageGroups } from 'constants/permissionGroups'
import {
  useLazyGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation
} from 'api/roleApi'
import {
  createCRUDStaticPermissions,
  getCRUDPermissions,
  getGroupPermissions,
  getOtherPermissionRows,
  parsePermissionByGroup,
  parsePermissionByName,
  permissionRowsComparer,
  splitByUpperForPermission
} from 'utils/permissionsUtils'
import Toggle from './Toggle'
import Group from './Group'
import Scrollbars from 'components/Scrollbars'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import useSnackbar from 'hooks/useSnackbar'
import apiCacheKeys from 'constants/apiCacheKeys'
import useUser from 'hooks/useUser'
import { customFieldGroups } from 'constants/permissionGroups'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type }) => ({
  header: {
    display: 'grid',
    grid: '1fr / 1fr max-content',
    justifyItems: 'stretch',
    background: palette[type].pages.rbac.header.background,
    width: '100%',
    borderTop: 'none',
    borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`
  },
  searchRoot: {
    margin: '0px'
  },
  searchContainer: {
    padding: '8px'
  },
  subHeader: {
    display: 'grid',
    grid: '1fr / repeat(2,1fr)',
    justifyContent: 'end',
    alignItems: 'end',
    margin: '10px',
    padding: '0 0 8px 8px',
    borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`
  },
  title: {
    color: '#74809A',
    fontSize: '15px',
    justifySelf: 'start'
  },
  permissions: {
    display: 'grid',
    gridColumn: '1 / 5'
  },
  permissionsContent: {
    display: 'grid',
    grid: 'auto / repeat(4,1fr)',
    padding: '8px 0 8px 8px'
  },
  groups: {
    display: 'grid',
    grid: '1fr / repeat(4, 1fr)',
    gridGap: '8px',
    padding: '0 10px 10px'
  },

  inputIcon: {
    position: 'absolute',
    color: palette[type].pages.rbac.primary,
    right: '0',
    fontSize: '1.2rem',
    lineHeight: '32px',
    marginRight: '8px'
  },
  expandCollapse: {
    margin: '8px'
  },
  actionBar: {
    padding: '25px 20px 20px',
    backgroundColor: palette[type].sideModal.action.background,
    borderTop: palette[type].sideModal.action.border
  }
}))

const Groups = ({ activeRole = {}, roleLibraryPermission }) => {
  const classes = useStyles()
  const [ungroupedPermissions, setUngroupedPermissions] = useState([])
  const [groupedPermissions, setGroupedPermissions] = useState([])
  const [permissions, setPermissions] = useState([])
  const [expanded, setExpandState] = useState({})
  const [search, setSearch] = useState('')
  const [cache, setCache] = useState([])
  const [pendingUpdate, setPendingUpdate] = useState(null)
  const { showSnackbar } = useSnackbar()

  const userDetails = useUser()
  const [
    getRolePermissions,
    { data: rolePermissions, isFetching, reset: clearGetPermission }
  ] = useLazyGetRolePermissionsQuery()
  const [putPermission, permissionsUpdated] = useUpdateRolePermissionsMutation({
    fixedCacheKey: apiCacheKeys.role.updatePermission
  })

  useEffect(() => {
    if (activeRole?.id) {
      getRolePermissions(activeRole?.id)
    }
    //eslint-disable-next-line
  }, [activeRole])

  const updatePermissions = useCallback(
    (role, permissions) => {
      setPendingUpdate(role)
      if (role.lockedPermissions) {
        showSnackbar("Can't Edit Locked Role", 'warning')
      } else {
        const formattedPermissions = permissions
          .filter(
            permission =>
              permission.attached === true && !permission.isStaticPermission
          )
          .reduce(
            (accumulator, value) => {
              accumulator.permissionIds.push(value.id)
              return accumulator
            },
            { permissionIds: [] }
          )
        putPermission({ id: role.id, permissions: formattedPermissions })
      }
    }, //eslint-disable-next-line
    []
  )

  const clearPermissionsById = useCallback(() => {
    clearGetPermission && clearGetPermission()
    permissionsUpdated?.reset && permissionsUpdated.reset()
  }, [clearGetPermission, permissionsUpdated])

  useEffect(() => {
    if (rolePermissions && rolePermissions.length > 0) {
      let parsedPermissions = rolePermissions.map(permission => {
        return parsePermissionByName(parsePermissionByGroup(permission))
      })

      Object.values(customFieldGroups).forEach(group => {
        parsedPermissions = [
          ...parsedPermissions,
          ...createCRUDStaticPermissions(group, parsedPermissions)
        ]
      })
      setPermissions(parsedPermissions)
    }
    return () => clearPermissionsById()
    //eslint-disable-next-line
  }, [rolePermissions])

  useEffect(() => {
    if (
      permissionsUpdated &&
      pendingUpdate &&
      (permissionsUpdated.isSuccess || permissionsUpdated.isError)
    ) {
      const { isSuccess, isError } = permissionsUpdated
      if (isSuccess) {
        if (activeRole.id && activeRole.id === userDetails?.role?.id) {
          userDetails.getUserDetails()
        }
        showSnackbar('Role Permissions Updated', 'success')
        setPendingUpdate(null)
      } else if (isError) {
        showSnackbar("Role Permissions Couldn't be Updated", 'error')
      }
    } //eslint-disable-next-line
  }, [permissionsUpdated])

  useEffect(() => {
    if (permissions.length > 0) {
      const formattedPermissions = permissions.reduce(
        (accumulator, permission) => {
          accumulator[permission.group] =
            accumulator[permission.group] === undefined ||
            accumulator[permission.group] === null
              ? [permission]
              : [...accumulator[permission.group], permission]
          return accumulator
        },
        []
      )

      let permissionGroups = Object.entries(permissionPageGroups)
        .map(([group, filter]) => {
          const matchedGroup = getGroupPermissions(
            formattedPermissions,
            group,
            filter
          )
          return matchedGroup.length > 0 && { [group]: matchedGroup }
        })
        .filter(Boolean)

      permissionGroups.ungrouped = Object.entries(formattedPermissions)
        .reduce(
          (accumulator, [key, value]) => [
            ...accumulator,
            {
              [splitByUpperForPermission(key)]: getCRUDPermissions(value)
            },
            ...getOtherPermissionRows(value)
          ],
          []
        )
        .sort(permissionRowsComparer)

      setUngroupedPermissions(permissionGroups.ungrouped)

      const expandState = permissionGroups.reduce(
        (accumulator, value) => {
          accumulator[Object.keys(value)[0]] = true
          return accumulator
        },
        { all: true, ungrouped: true, other: true }
      )

      setExpandState(expandState)

      const chunks = []
      const spliceMagnitude = Math.ceil(permissionGroups.length / 4)
      let extra = permissionGroups.length % 4
      while (permissionGroups.length > 0) {
        chunks.push(
          permissionGroups.splice(0, spliceMagnitude - (extra ? 0 : 1))
        )
        extra && extra--
      }

      setGroupedPermissions([...chunks])
    }
  }, [permissions])

  useEffect(() => {
    if (search.length > 0) {
      const filter = new RegExp(`${search}`, 'i')
      if (cache.length < 1) {
        setCache(permissions)
      }
      const filteredPermissions = rolePermissions.filter(
        key => filter.test(key.group) || filter.test(key.name)
      )
      const parsedPermissions = [...filteredPermissions].map(permission => {
        return parsePermissionByName(parsePermissionByGroup(permission))
      })
      setPermissions(parsedPermissions)
    } else if (search.length < 1 && cache.length > 0) {
      setPermissions(cache)
      setCache([])
    } //eslint-disable-next-line
  }, [search])

  useEffect(() => {
    if (Object.entries(expanded).length > 0) {
      const { all: current } = expanded
      const all = Object.entries(expanded)
        .filter(([key, value]) => key !== 'all')
        .every(([key, value]) => value === !current)
      if (all) {
        toggleExpandState('all')
      }
    } //eslint-disable-next-line
  }, [expanded])

  const toggleExpandState = useCallback(
    state => {
      let derivedState = expanded
      switch (state) {
        case 'all':
          derivedState.all = !expanded.all
          for (let item in expanded) {
            expanded[item] = derivedState.all
          }
          setExpandState(Object.assign({}, expanded, derivedState))
          break
        case 'ungrouped':
          setExpandState(
            Object.assign({}, expanded, { ungrouped: !expanded.ungrouped })
          )
          break
        default:
          derivedState[state] = !derivedState[state]
          setExpandState(Object.assign({}, expanded, derivedState))
          break
      }
    },
    [expanded]
  )

  const toggleMaster = useCallback((action, value) => {
    setPermissions(prevState =>
      prevState.map(key => ({
        ...key,
        attached: key.action === action ? value : key.attached
      }))
    )
  }, [])

  const handleToggleClick = useCallback(updatedPermissions => {
    setPermissions(prevState => {
      let _permissions = prevState.map(p => {
        const newPermission = updatedPermissions.find(a =>
          a.isStaticPermission
            ? a.id === p.id ||
              (p.linkedGroup === a.group && a.action === p.action)
            : a.id === p.id
        )
        if (newPermission) {
          return {
            ...p,
            attached: newPermission.attached
          }
        }
        return p
      })
      const linkedGroup = updatedPermissions[0]?.linkedGroup
      if (linkedGroup) {
        _permissions = _permissions.map(p => {
          const newPermission = updatedPermissions.find(
            a =>
              p.isStaticPermission &&
              p.group === a.linkedGroup &&
              p.action === a.action
          )
          if (newPermission) {
            return {
              ...p,
              attached: _permissions.some(
                s =>
                  s.linkedGroup === p.group &&
                  s.action === p.action &&
                  s.attached
              )
            }
          }
          return p
        })
      }

      return _permissions
    })
  }, [])

  const handleReset = useCallback(
    () => setPermissions(permissions.map(key => ({ ...key, attached: false }))),
    [permissions]
  )

  return (
    (permissions.length > 0 ||
      !!(permissions.length === 0 && search.length)) && (
      <Grid container direction="column" wrap="nowrap">
        <Grid item container className={classes.header}>
          <FormControlInput
            endAdornment={
              <i
                className={classNames(
                  getIconClassName(iconNames.search),
                  classes.inputIcon
                )}
              />
            }
            formControlContainerClass={classes.searchContainer}
            onChange={e => setSearch(e.target.value)}
            formControlInputRootClass={classes.inputRoot}
            formControlLabelClass={classes.inputLabel}
            formControlRootClass={classes.searchRoot}
            formControlInputClass={classes.input}
            placeholder={'Search Features'}
            value={search}
            fullWidth
          />
          <WhiteButton
            className={`hvr-radial-out ${classes.expandCollapse}`}
            onClick={() => toggleExpandState('all')}
          >
            {`${expanded.all ? 'Collapse' : 'Expand'} All`}
          </WhiteButton>
        </Grid>

        <Grid item className={classes.subHeader}>
          <Text className={classes.title} component="h1">
            {'Features'}
          </Text>
          <Toggle
            handler={(action, value) => toggleMaster(action, value)}
            title={'Toggle All'}
            data={permissions}
            type="master"
          />
        </Grid>

        <Scrollbars>
          <Grid container className={classes.groups}>
            <Grid item className={classes.permissions}>
              <Group
                handler={() => toggleExpandState('ungrouped')}
                groupPermissions={ungroupedPermissions}
                expanded={expanded.ungrouped}
                title={'Permissions'}
                contentClassName={classes.permissionsContent}
                onToggleClick={handleToggleClick}
              />
            </Grid>
            {isFetching ? (
              <CircularLoader />
            ) : (
              groupedPermissions.map((column, index) => (
                <Grid key={`column-${index}`} item>
                  {Object.values(column).map((permissions, index) => (
                    <Group
                      groupPermissions={Object.values(permissions)[0]}
                      expanded={expanded[Object.keys(permissions)[0]]}
                      handler={title => toggleExpandState(title)}
                      onToggleClick={handleToggleClick}
                      title={Object.keys(permissions)[0]}
                      key={`permission-group-${index}`}
                    />
                  ))}
                </Grid>
              ))
            )}
          </Grid>
        </Scrollbars>
        <Grid item className={classes.actionBar}>
          <FormFooterLayout
            onSubmit={() => updatePermissions(activeRole, permissions)}
            onReset={handleReset}
            disabledSubmit={
              !roleLibraryPermission.update || permissionsUpdated.isLoading
            }
            isUpdate
          />
        </Grid>
      </Grid>
    )
  )
}

export default Groups
