import { useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import Tooltip from 'components/Tooltip'
import { CircleIconButton } from 'components/buttons'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { ActivityCard, EmailCard } from 'components/cards'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  iconButtonsRoot: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    float: 'right',
    paddingTop: 7,
    paddingBottom: 8
  },
  actionIcon: {
    ...typography.darkText[type],
    fontSize: 16,
    border: `1px solid ${palette[type].sideModal.content.border}`,
    height: 42,
    width: 42
  },
  actionIconSelected: {
    background: colors.highlight,
    color: '#fff',
    '& i': {
      transform: 'scale(1.25)'
    },
    '&:hover': {
      background: colors.highlight,
      color: '#fff'
    }
  },
  logCardHeaderText: {
    lineHeight: '40px'
  }
}))

const tabValues = {
  task: 'Task',
  email: 'Email'
}

const EntityActivityCard = ({ entity, id, item, parentUrl = '/' }) => {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState('Task')

  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )

  const tabs = useMemo(
    () =>
      [
        {
          label: 'Tasks',
          value: tabValues.task,
          icon: getIconClassName(iconNames.activityTask),
          render: activityPermission.read
        },
        {
          label: 'Email',
          value: tabValues.email,
          icon: getIconClassName(iconNames.activityEmail)
        }
      ].filter(({ render }) => render !== false),
    [activityPermission]
  )

  const handleChangeTab = _tab => () => {
    if (_tab) {
      setSelectedTab(_tab)
    }
  }

  return (
    <>
      <div className={classes.iconButtonsRoot}>
        {tabs.map(({ icon, label, value }, index) => (
          <Grid item key={`action-tabs-${index}`}>
            <Tooltip arrow title={label} placement="top">
              <CircleIconButton
                className={classNames('hvr-grow', classes.actionIcon, {
                  [classes.actionIconSelected]: selectedTab === value
                })}
                onClick={handleChangeTab(value)}
              >
                <i className={icon} />
              </CircleIconButton>
            </Tooltip>
          </Grid>
        ))}
      </div>
      {selectedTab === tabValues.task && (
        <ActivityCard
          id={id}
          parentUrl={parentUrl}
          entity={entity}
          item={item}
          cardHeaderTextClasses={[classes.logCardHeaderText]}
        />
      )}
      {selectedTab === tabValues.email && (
        <EmailCard
          id={id}
          entity={entity}
          item={item}
          cardHeaderTextClasses={[classes.logCardHeaderText]}
        />
      )}
    </>
  )
}

export default EntityActivityCard
