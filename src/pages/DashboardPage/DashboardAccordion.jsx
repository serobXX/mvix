import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import Accordion from 'components/Accordion'
import Tooltip from 'components/Tooltip'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type, typography, fontSize }) => ({
  accordionRoot: {
    background: palette[type].pages.dashboard.card.background,
    boxShadow: palette[type].pages.dashboard.card.boxShadow,
    paddingTop: 12,
    border: 'none',
    borderRadius: 4
  },
  accordionHeader: {
    background: 'transparent',
    padding: '0px 27px',
    marginBottom: 6,
    borderBottom: `5px solid ${palette[type].pages.dashboard.card.background} !important`
  },
  accordionContent: {
    border: '5px solid ' + palette[type].pages.dashboard.card.background,
    borderTop: 'none',
    borderRightWidth: '4px',
    backgroundColor: palette[type].body.background
  },
  accordionTitle: {
    ...typography.darkText[type],
    fontSize: fontSize.secondary,
    lineHeight: '1.667em'
  },
  accordionSummaryContent: {
    justifyContent: 'space-between'
  },
  refreshIcon: {
    color: typography.lightText[type].color,
    marginTop: 3,
    marginRight: 10,
    cursor: 'pointer'
  },
  rotating: {
    animation: '$rotating 2s linear infinite'
  },
  '@keyframes rotating': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  }
}))

const DashboardAccordion = ({
  hideAccordion,
  title,
  children,
  onRefresh,
  hideRefresh,
  refreshLoading = false,
  ...props
}) => {
  const classes = useStyles()
  return hideAccordion ? (
    children
  ) : (
    <Accordion
      rootClassName={classes.accordionRoot}
      summaryRootClassName={classes.accordionHeader}
      contentClass={classes.accordionContent}
      titleClasName={classes.accordionTitle}
      title={title}
      summaryContentClassName={classes.accordionSummaryContent}
      headerComponent={
        !hideRefresh && (
          <Tooltip
            title="Refresh Data"
            arrow
            placement="top"
            disableHoverListener={refreshLoading}
          >
            <i
              className={classNames(
                getIconClassName(iconNames.refresh),
                classes.refreshIcon,
                {
                  [classes.rotating]: refreshLoading
                }
              )}
              onClick={!refreshLoading ? onRefresh : undefined}
            />
          </Tooltip>
        )
      }
      {...props}
    >
      {children}
    </Accordion>
  )
}

export default DashboardAccordion
