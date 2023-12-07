import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import Scrollbars from 'components/Scrollbars'
import FormControlInput from 'components/formControls/FormControlInput'
import RoleRow from './RoleRow'
import PropTypes from 'constants/propTypes'
import { useDeleteRoleMutation } from 'api/roleApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import { routes } from 'constants/routes'
import { CheckboxSwitcher } from 'components/formControls'
import { position } from 'constants/common'
import { statusValues } from 'constants/commonOptions'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, fontWeight, fontSize }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  searchContainer: {
    background: palette[type].pages.rbac.header.background,
    padding: '8px',
    borderTop: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`
  },
  inputIcon: {
    color: palette[type].pages.rbac.primary
  },
  searchRoot: {
    margin: '0px'
  },
  listingRoot: {
    flexGrow: 1
  },
  role: {
    height: '85px',
    cursor: 'pointer',
    padding: '10px 10px 10px 15px',
    borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`,
    overflow: 'hidden',
    '&:hover': {
      '& > div > i ': {
        color: palette[type].pages.rbac.roles.hover.color
      },
      '& $actionBtn': {
        opacity: 1,
        visibility: 'visible'
      }
    },
    '&.active': {
      background: palette[type].pages.rbac.roles.active.background,
      '& > div > i ': {
        color: palette[type].pages.rbac.roles.active.color
      },
      '& $actionBtn': {
        opacity: 1,
        visibility: 'visible'
      }
    }
  },
  actionBtn: {
    opacity: 0,
    visibility: 'hidden',
    transition: '0.3s'
  },
  roleIcon: {
    fontSize: '24px',
    color: '#9394A0',
    paddingLeft: 5
  },
  roleContent: {
    lineHeight: '1.25',
    marginLeft: '16px',
    overflow: 'hidden'
  },
  chip: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  name: {
    fontSize: fontSize.secondary,
    fontWeight: fontWeight.bold,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: palette[type].pages.rbac.emphasis
  },
  description: {
    maxHeight: '34px',
    fontSize: fontSize.small,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: '#8A8EA3'
  },
  roleOption: {
    minWidth: '61px',
    paddingLeft: '10px',
    paddingRight: '10px',
    color: palette[type].pages.rbac.roles.chip.color,
    border: `1px solid ${palette[type].pages.rbac.roles.chip.border}`,
    boxShadow: palette[type].pages.rbac.roles.chip.shadow,
    '&:hover': {
      borderColor: '#1C5DCA',
      background: '#1C5DCA',
      color: '#FFF'
    }
  },
  roleOptionIcon: {
    width: 18,
    height: 18
  }
}))

const RolesListing = ({
  roleData,
  activeRole,
  onSelectRole,
  fetcher,
  roleLibraryPermission
}) => {
  const classes = useStyles()
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [cache, setCache] = useState([])
  const [showDisabledRoles, setShowDisabledRoles] = useState(false)
  const { showConfirmation } = useConfirmation()
  const navigate = useNavigate()

  const [deleteRole] = useDeleteRoleMutation({
    fixedCacheKey: apiCacheKeys.role.delete
  })

  useEffect(() => {
    if (roleData) {
      setRoles(roleData)
      setCache([])
      setSearch('')
    }
  }, [roleData])

  const handleChangeSearch = ({ target: { value } }) => {
    setSearch(value)
    if (value.length > 0) {
      const filter = new RegExp(`${value}`, 'i')
      if (cache.length < 1) {
        setCache(roles)
      }
      const filteredRoles = roleData.filter(key => {
        return (
          // key.status === 'Active' &&
          filter.test(key.name) || filter.test(key.description)
        )
      })
      setRoles([...filteredRoles])
    } else if (value.length < 1 && cache.length > 0) {
      setRoles(cache)
      setCache([])
    }
  }

  const handleClickRole = role => () => {
    onSelectRole(role)
  }

  const handleEditRole = (event, role) => {
    event.stopPropagation()
    navigate(routes.users.toRoleAndPermEdit(role.id))
  }

  const handleDeleteRole = (event, role) => {
    event.stopPropagation()

    showConfirmation(getDeleteConfirmationMessage(role.name), () =>
      deleteRole(role.id)
    )
  }

  const handleChangeDisabledRoles = checked => {
    setShowDisabledRoles(checked)
    fetcher({
      ...(checked ? { status: statusValues.inactive } : {})
    })
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <FormControlInput
          endAdornment={
            <i
              className={classNames(
                getIconClassName(iconNames.search),
                classes.inputIcon
              )}
            />
          }
          onChange={handleChangeSearch}
          formControlRootClass={classes.searchRoot}
          placeholder={'Search Roles'}
          value={search}
          fullWidth
        />
        <CheckboxSwitcher
          label="Show Disabled Roles"
          labelPosition={position.right}
          value={showDisabledRoles}
          onChange={handleChangeDisabledRoles}
        />
      </div>
      <div className={classes.listingRoot}>
        <Scrollbars>
          {roles &&
            roles.length > 0 &&
            roles.map((role, index) => (
              <RoleRow
                key={`${role.name}-${index}`}
                role={role}
                onClickRole={handleClickRole(role)}
                onEditRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
                isActive={activeRole.name === role.name}
                classes={classes}
                roleLibraryPermission={roleLibraryPermission}
              />
            ))}
        </Scrollbars>
      </div>
    </div>
  )
}

RolesListing.propType = {
  roleData: PropTypes.array,
  activeRole: PropTypes.object,
  onSelectRole: PropTypes.func
}

RolesListing.defaultProps = {
  roleData: [],
  activeRole: {},
  onSelectRole: f => f
}

export default RolesListing
