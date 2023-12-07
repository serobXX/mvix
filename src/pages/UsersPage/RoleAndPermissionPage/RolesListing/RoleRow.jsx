import { useMemo } from 'react'
import { Grid } from '@material-ui/core'
import classNames from 'classnames'

import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import Text from 'components/typography/Text'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const RoleRow = ({
  classes,
  role,
  onClickRole,
  onDeleteRole,
  onEditRole,
  isActive,
  roleLibraryPermission
}) => {
  const actionLinks = useMemo(
    () => [
      {
        label: 'Edit',
        clickAction: onEditRole,
        render: roleLibraryPermission.update
      },
      {
        icon: getIconClassName(iconNames.delete),
        label: 'Delete',
        clickAction: onDeleteRole,
        render: roleLibraryPermission.delete
      }
    ],
    [onDeleteRole, onEditRole, roleLibraryPermission]
  )
  return (
    <Grid
      item
      container
      xs={12}
      wrap="nowrap"
      direction="row"
      alignItems="center"
      onClick={onClickRole}
      className={classNames(classes.role, {
        active: isActive
      })}
    >
      <Grid item xs={1}>
        <i
          className={`${getIconClassName(iconNames.userGear)} ${
            classes.roleIcon
          }`}
        />
      </Grid>
      <Grid
        title={role.description}
        item
        xs={8}
        className={classes.roleContent}
      >
        <Text rootClassName={classes.name}>{role.name}</Text>
        <Text rootClassName={classes.description}>{role.description}</Text>
      </Grid>
      <Grid item xs={3} className={classes.chip}>
        <ActionDropdownButton
          actionLinks={actionLinks}
          data={role}
          iconButtonClassName={classes.actionBtn}
        />
      </Grid>
    </Grid>
  )
}

export default RoleRow
