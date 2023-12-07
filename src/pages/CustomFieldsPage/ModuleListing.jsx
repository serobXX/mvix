import { useCallback, useMemo } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import Scrollbars from 'components/Scrollbars'
import { routes } from 'constants/routes'
import { entityList } from 'constants/customFields'
import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import { Text } from 'components/typography'

const useStyles = makeStyles(({ palette, type, fontWeight, fontSize }) => ({
  root: {
    width: '100%',
    height: '100%'
  },
  cardRoot: {
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
  cardIcon: {
    fontSize: '24px',
    color: '#9394A0',
    paddingLeft: 5
  },
  cardContent: {
    lineHeight: '1.25',
    marginLeft: '16px',
    overflow: 'hidden'
  },
  actionRoot: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  name: {
    fontSize: fontSize.secondary,
    fontWeight: fontWeight.bold,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: palette[type].pages.rbac.emphasis
  }
}))

const ModuleListing = ({ selected, onSelect, permission }) => {
  const classes = useStyles()
  const navigate = useNavigate()

  const handleClick = value => () => {
    onSelect(value)
  }

  const handleEdit = useCallback(
    (event, value) => {
      navigate(routes.customFields.toEdit(null, value))
    },
    [navigate]
  )

  const actionLinks = useMemo(
    () => [
      {
        label: 'Edit',
        clickAction: handleEdit,
        render: permission.update
      }
    ],
    [permission.update, handleEdit]
  )

  return (
    <div className={classes.root}>
      <Scrollbars>
        {entityList.map(({ label, value, icon, color }) => (
          <Grid
            key={`custom-field-entity-list-${value}`}
            item
            container
            xs={12}
            wrap="nowrap"
            direction="row"
            alignItems="center"
            onClick={handleClick(value)}
            className={classNames(classes.cardRoot, {
              active: selected === value
            })}
          >
            <Grid item xs={1}>
              <i
                className={classNames(icon, classes.cardIcon)}
                style={{ color }}
              />
            </Grid>
            <Grid item xs={8} className={classes.cardContent}>
              <Text rootClassName={classes.name}>{label}</Text>
            </Grid>
            <Grid item xs={3} className={classes.actionRoot}>
              <ActionDropdownButton
                actionLinks={actionLinks}
                data={value}
                iconButtonClassName={classes.actionBtn}
              />
            </Grid>
          </Grid>
        ))}
      </Scrollbars>
    </div>
  )
}

export default ModuleListing
