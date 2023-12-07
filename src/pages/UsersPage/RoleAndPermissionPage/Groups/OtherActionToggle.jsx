import React from 'react'

import Tooltip from 'components/Tooltip'
import { Text } from 'components/typography'
import { permissionNameToDisplayName } from 'utils/permissionsUtils'
import { CheckboxSwitcher } from 'components/formControls'
import Spacing from 'components/containers/Spacing'
import { _capitalize } from 'utils/lodash'

const OtherActionToggle = ({
  permissions,
  handleDataRefresh,
  sectionTitle
}) => {
  const permission = Object.values(permissions)[0]

  const { level, name, attached, description } = permission

  const handleToggle = value => {
    permission.attached = value
    handleDataRefresh && handleDataRefresh()
  }

  const parsedName =
    permissionNameToDisplayName[name] ||
    name
      .replace(`${level} `, '')
      .replace(new RegExp(`^${sectionTitle}`), '')
      .split(' ')
      .map(word => _capitalize(word))
      .join(' ')

  return (
    <Spacing
      variant={0}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Tooltip title={description} arrow placement="top">
        <Text>{parsedName}</Text>
      </Tooltip>
      <CheckboxSwitcher value={attached} onChange={handleToggle} />
    </Spacing>
  )
}

export default OtherActionToggle
