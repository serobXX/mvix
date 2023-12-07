import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, Paper, Typography, makeStyles } from '@material-ui/core'

import { DropdownHoverListItem } from 'components/dropdowns'
import { MaterialPopup } from 'components/Popup'
import { PermissionChip } from 'components/chips'
import { CheckboxSwitcher } from 'components/formControls'
import { TextWithTooltip } from 'components/typography'
import { _capitalize } from 'utils/lodash'

const placeholders = ['read', 'create', 'update', 'delete']

const useStyles = makeStyles(({ palette, type }) => ({
  container: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  containerMaster: {
    display: 'grid',
    grid: '1fr / max-content minmax(100px,min-content)',
    justifyContent: 'end'
  },
  name: {
    color: palette[type].pages.rbac.primary,
    textTransform: 'capitalize',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineHeight: '1.25',
    width: '100px'
  },
  nameMaster: {
    fontWeight: 'bold',
    lineHeight: '1.75',
    fontSize: '12px',
    width: '60px'
  },
  permissions: ({ type: compType }) => ({
    display: 'flex',
    flexFlow: 'row wrap',
    width: 'auto',
    minHeight: '30px',
    minWidth: '175px',
    flexGrow: 1,
    ...(compType !== 'master' ? { maxWidth: '195px' } : { minWidth: '195px' }),
    border: `solid 1px ${palette[type].pages.rbac.toggle.border}`,
    background: palette[type].pages.rbac.background,
    padding: '2.5px',
    '&:hover': {
      boxShadow: palette[type].pages.rbac.shadow
    }
  }),
  permissionsMaster: {
    flexFlow: 'row nowrap'
  },

  switchBase: {
    height: '20px'
  },
  switchRoot: {
    transform: 'translateX(16px)'
  },
  switchContainer: {
    width: '100%'
  },

  controlRoot: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  controlLabel: {
    color: 'inherit'
  }
}))

const Toggle = ({ type, title = '', data = {}, handler = f => f }) => {
  const classes = useStyles({ type })
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    if (Object.keys(data).length > 0 && type !== 'master') {
      const actions = Object.values(data)[0].reduce(
        (accumulator, permission) => {
          const _permission = { ...permission }
          if (!accumulator[_permission.action]) {
            accumulator[_permission.action] = _permission
          } else {
            const ids = accumulator[_permission.action].duplicateIds || []
            accumulator[_permission.action].duplicateIds = [
              ...ids,
              _permission.id
            ]
            _permission.hidden = true
            accumulator[_permission.name] = _permission
          }
          return accumulator
        },
        {}
      )
      const permissions = placeholders.map(key =>
        actions.hasOwnProperty(key)
          ? actions[key]
          : { action: key, attached: false, placeholder: true }
      )
      setPermissions(
        permissions.concat(
          Object.values(actions).filter(({ hidden }) => hidden)
        )
      )
    } else if (Object.keys(data).length > 0 && type === 'master') {
      const permissions = []
      for (let value of placeholders) {
        const actionState = data
          .filter(({ action }) => action === value)
          .some(action => !action.attached)
        permissions.push({ action: value, attached: !actionState })
      }
      setPermissions(permissions)
    }
    //eslint-disable-next-line
  }, [data])

  const handleChange = useCallback(
    (value, id) => {
      const permission = permissions.filter(p => p.id === id)[0]
      permission.attached = !value
      if (permission.duplicateIds) {
        permission.duplicateIds.forEach(duplicateId => {
          const permission = permissions.find(p => p.id === duplicateId)
          if (permission) {
            permission.attached = !value
          }
        })
      }
      setPermissions([...permissions])
      handler([...permissions])
    },
    [permissions, handler]
  )

  const masterToggle = (action, value) => {
    const mutated = permissions.map(key => {
      if (key.action === action) {
        key.attached = !value
      }
      return key
    })
    setPermissions(mutated)
    handler(action, !value)
  }

  const visiblePermissions = useMemo(
    () => permissions.filter(({ hidden }) => !hidden),
    [permissions]
  )

  const renderRow = useMemo(() => {
    return visiblePermissions.some(({ placeholder }) => !placeholder) ? (
      <Grid container className={classes.container}>
        <TextWithTooltip
          rootClassName={classes.name}
          component="h3"
          maxWidth={105}
        >
          {_capitalize(title.trim())}
        </TextWithTooltip>
        <MaterialPopup
          on="hover"
          hasArrow={false}
          trigger={
            <Paper elevation={0} className={classes.permissions}>
              {visiblePermissions.length > 0 &&
                visiblePermissions.map((permission, index) => {
                  return (
                    <PermissionChip
                      key={`permission-chip-${index}`}
                      active={permission.attached}
                      value={permission.action}
                      hidden={permission.placeholder}
                    />
                  )
                })}
            </Paper>
          }
        >
          <Grid item>
            {visiblePermissions.length > 0 &&
              visiblePermissions.map(
                permission =>
                  permission.hasOwnProperty('placeholder') === false && (
                    <DropdownHoverListItem
                      key={`permission-id-${permission.id}`}
                    >
                      <CheckboxSwitcher
                        label={permission.action}
                        tooltip={permission.description || ''}
                        switchContainerClass={classes.switchContainer}
                        formControlRootClass={classes.controlRoot}
                        formControlLabelClass={classes.controlLabel}
                        switchBaseClass={classes.switchBase}
                        switchRootClass={classes.switchRoot}
                        onChange={() =>
                          handleChange(permission.attached, permission.id)
                        }
                        value={permission.attached}
                      />
                    </DropdownHoverListItem>
                  )
              )}
          </Grid>
        </MaterialPopup>
      </Grid>
    ) : null
  }, [visiblePermissions, title, handleChange, classes])

  return type === 'master' ? (
    <Grid
      container
      className={`${classes.container} ${classes.containerMaster}`}
    >
      <Typography
        component="h3"
        className={`${classes.name} ${classes.nameMaster}`}
      >
        {title}
      </Typography>
      <Paper
        elevation={0}
        className={`${classes.permissions} ${classes.permissionsMaster}`}
      >
        {visiblePermissions.length > 0 &&
          visiblePermissions.map((permission, index) => {
            return (
              <PermissionChip
                clickHandler={() =>
                  masterToggle(permission.action, permission.attached)
                }
                key={`permission-chip-${index}`}
                active={permission.attached}
                value={permission.action}
              />
            )
          })}
      </Paper>
    </Grid>
  ) : (
    renderRow
  )
}

export default Toggle
