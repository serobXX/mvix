import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  makeStyles
} from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import classNames from 'classnames'

import Toggle from './Toggle'
import OtherActionToggle from './OtherActionToggle'
import { isOtherPermissionRow } from 'utils/permissionsUtils'

const useStyles = makeStyles(({ palette, type }) => ({
  panelRoot: {
    marginBottom: '10px',
    border: `solid 1px ${palette[type].pages.rbac.group.border}`,
    background: palette[type].pages.rbac.background,
    borderRadius: '4px',
    '&:before': {
      display: 'none'
    }
  },
  panelExpanded: {
    margin: '0px',
    marginBottom: '10px'
  },

  summaryRoot: {
    paddingLeft: '8px',
    minHeight: '0px',
    background:
      palette[type].pages.createTemplate.settings.expansion.header.background,
    '&$summaryExpanded': {
      minHeight: '0px',
      borderBottom: `1px solid ${palette[type].pages.rbac.group.border}`
    }
  },
  summaryExpanded: {
    marginTop: 0,
    marginBottom: 0
  },
  summaryContent: {
    minHeight: '0px',
    margin: '0px',
    '&$summaryExpanded': {
      margin: '0px',
      minHeight: '0px'
    }
  },
  title: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].pages.createTemplate.settings.expansion.header.color,
    textTransform: 'capitalize'
  },
  icon: {
    color: palette[type].pages.createTemplate.settings.expansion.header.color
  },
  content: {
    display: 'grid',
    gap: '5px',
    padding: '8px',
    backgroundColor:
      palette[type].pages.createTemplate.settings.expansion.body.background
  },
  ungroupedToggleOverride: {
    grid: '1fr / 92px 184px'
  }
}))

const Group = ({
  title = '',
  groupPermissions = [],
  expanded,
  handler = f => f,
  onToggleClick,
  contentClassName
}) => {
  const classes = useStyles()
  return (
    <Accordion
      expanded={groupPermissions.length > 0 ? expanded : false}
      elevation={0}
      classes={{
        root: classes.panelRoot,
        expanded: classes.panelExpanded
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className={classes.icon} />}
        onClick={() => handler(title)}
        classes={{
          root: classes.summaryRoot,
          content: classes.summaryContent,
          expanded: classes.summaryExpanded
        }}
      >
        <Typography className={classes.title}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        className={classNames(classes.content, contentClassName)}
      >
        {groupPermissions.length > 0 &&
          groupPermissions.map(permissions => {
            return permissions.isSubGroup ? (
              <Group
                groupPermissions={Object.values(permissions)[0]}
                onToggleClick={onToggleClick}
                title={Object.keys(permissions)[0]}
                key={`permission-subgroup-${Object.keys(permissions)[0]}`}
              />
            ) : isOtherPermissionRow(permissions) ? (
              <OtherActionToggle
                key={`permission-toggle-${Object.values(permissions)[0].id}`}
                permissions={permissions}
                handleDataRefresh={onToggleClick}
                sectionTitle={title}
              />
            ) : (
              <Toggle
                classes={
                  title === 'Permissions'
                    ? {
                        container: classes.ungroupedToggleOverride
                      }
                    : {}
                }
                title={Object.keys(permissions)[0]}
                key={`permission-toggle-${Object.keys(permissions)[0]}`}
                data={permissions}
                handler={onToggleClick}
              />
            )
          })}
      </AccordionDetails>
    </Accordion>
  )
}

export default Group
