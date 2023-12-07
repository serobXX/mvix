import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { MaterialPopup } from 'components/Popup'
import { DateTimeView } from 'components/tableColumns/DateTimeViewColumn'
import { materialPopupPosition } from 'constants/common'
import customFieldNames from 'constants/customFieldNames'
import iconNames from 'constants/iconNames'
import { porposalStatusTypes } from 'constants/opportunityConstants'
import { useCallback, useMemo, useState } from 'react'
import { titleCase } from 'title-case'
import { getIconClassName } from 'utils/iconUtils'
import { _capitalize, _get } from 'utils/lodash'

const useStyles = makeStyles(({ palette, type, colors, typography }) => ({
  container: {
    float: 'left',
    borderBottom: `2px solid ${palette[type].detailPage.timelineLog.border}`,
    position: 'relative'
  },
  containerWidth: ({ cols }) => ({
    width: `${100 / cols}%`
  }),
  itemRoot: {
    verticalAlign: 'bottom',
    textAlign: 'center',
    maxWidth: 160,
    width: 160,
    minHeight: 45,
    position: 'relative',
    display: 'inline-block'
  },
  itemCard: {
    border: `2px solid ${palette[type].detailPage.timelineLog.border}`,
    minHeight: 82,
    marginBottom: 15,
    position: 'relative',
    borderRadius: '5px',
    verticalAlign: 'bottom',
    display: 'inline-block',
    width: '230px',
    background: palette[type].detailPage.timelineLog.card.background,
    padding: '16px',

    '&:after': {
      content: "''",
      width: 21,
      height: 21,
      borderBottom: `2px solid ${palette[type].detailPage.timelineLog.border}`,
      borderLeft: `2px solid ${palette[type].detailPage.timelineLog.border}`,
      borderColor: 'inherit',
      position: 'absolute',
      bottom: '-13px',
      transform: 'rotate(-45deg)',
      backgroundColor: palette[type].detailPage.timelineLog.circleBackground,
      left: '50%',
      marginLeft: '-11.5px'
    }
  },
  itemText: {
    overflow: 'hidden',
    display: '-webkit-box',
    lineClamp: 3,
    '-webkit-box-orient': 'vertical'
  },
  circleRoot: {
    height: 30,
    width: 30,
    background: palette[type].detailPage.timelineLog.card.background,
    border: `2px solid ${palette[type].detailPage.timelineLog.border}`,
    borderRadius: '15px',
    right: '5px',
    position: 'absolute',
    boxSizing: 'border-box',
    transitionDuration: '0.3s',
    display: 'grid',
    placeItems: 'center',

    '& i': {
      ...typography.lightText[type]
    },

    '&:hover': {
      background: colors.highlight,
      borderColor: colors.highlight,

      '& i': {
        color: '#fff'
      }
    }
  },
  itemBullet: {
    fontSize: 16,
    display: 'block',
    height: 30,
    width: 40,
    position: 'absolute',
    bottom: '-15px',
    left: '50%',
    marginLeft: '-20px',
    zIndex: 2
  },
  itemBgColor: ({ logsInCard }) => ({
    backgroundColor: logsInCard
      ? palette[type].tableLibrary.body.row.background
      : palette[type].body.background
  }),
  bulletFirst: {
    left: 0,
    width: 'auto',
    right: '50%',
    marginLeft: 0,
    marginRight: '-20px'
  },
  even: {
    marginTop: 75
  },
  odd: {
    float: 'right',
    marginTop: 140,
    borderBottomWidth: 0,
    borderTop: `2px solid ${palette[type].detailPage.timelineLog.border}`,
    textAlign: 'right',

    '& $itemRoot': {
      verticalAlign: 'top'
    },
    '& $itemDate': {
      bottom: '-20px'
    },
    '& $bulletFirst': {
      left: '50%',
      marginRight: 0,
      marginLeft: '-20px',
      right: 0,
      '& $circleRoot': {
        right: 'initial',
        left: 5
      }
    },
    '& $itemBullet': {
      bottom: 'initial',
      top: '-15px'
    },
    '& $downBar': {
      left: 0,
      top: '-15px',

      '&:after': {
        left: 80,
        height: 150
      }
    }
  },
  downBar: {
    backgroundColor: palette[type].body.background,
    position: 'absolute',
    bottom: '-15px',
    height: '30px',
    right: 0,
    width: 80,
    '&:after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: 0,
      height: 124,
      top: 15,
      width: 2,
      background: palette[type].detailPage.timelineLog.border
    }
  },
  itemDate: {
    position: 'absolute',
    bottom: '-65px',
    left: '50%',
    transform: 'translate(-50%, 0px)',
    width: '100%',
    opacity: '0.6',
    transitionDuration: '0.3s'
  },
  lastEven: {
    borderBottomColor: 'transparent',
    '& $bulletLast': {
      '&:before': {
        content: "''",
        position: 'absolute',
        width: 60,
        borderBottom: `2px solid ${palette[type].detailPage.timelineLog.border}`,
        top: '15px',
        left: '-150%'
      }
    }
  },
  lastOdd: {
    borderTopColor: 'transparent',
    '& $bulletLast': {
      '&:before': {
        content: "''",
        position: 'absolute',
        width: 60,
        borderTop: `2px solid ${palette[type].detailPage.timelineLog.border}`,
        top: '13px',
        right: '-151%'
      }
    }
  },
  bulletLast: {},
  down: {},
  popupContent: {
    background: 'transparent',
    boxShadow: 'none'
  },
  circleActive: {
    background: colors.highlight,
    borderColor: colors.highlight,

    '& i ': {
      color: '#fff'
    }
  },
  itemBoldText: {
    ...typography.darkAccent[type]
  },
  itemNormalText: {
    ...typography.lightText[type]
  },
  dateActive: {
    opacity: 1
  },
  evenFirstRow: {
    marginTop: 0
  }
}))

const logTypes = {
  create: 'create',
  edit: 'edit',
  delete: 'delete',
  system: 'system',
  mail: 'mail',
  note: 'note',
  proposal: 'proposal'
}

const TimelineCard = ({ item, index, isLast, open, onOpen, entity, cols }) => {
  const classes = useStyles({ cols, logsInCard: true })
  const [hover, setHover] = useState(false)

  const getIcon = useCallback(() => {
    switch (item?.logType) {
      case logTypes.create:
        return getIconClassName(iconNames.add2)
      case logTypes.edit:
        return getIconClassName(iconNames.edit2)
      case logTypes.delete:
        return getIconClassName(iconNames.delete2)
      case logTypes.system:
        return getIconClassName(iconNames.systemLogType)
      case logTypes.mail:
        return getIconClassName(iconNames.email2)
      case logTypes.note:
        return getIconClassName(iconNames.activity)
      case logTypes.proposal:
        switch (item?.newValue) {
          case porposalStatusTypes.created:
            return getIconClassName(iconNames.proposalCreated)
          case porposalStatusTypes.sent:
            return getIconClassName(iconNames.proposalSent)
          case porposalStatusTypes.opened:
            return getIconClassName(iconNames.proposalOpened)
          case porposalStatusTypes.accepted:
            return getIconClassName(iconNames.proposalAccepted)
          case porposalStatusTypes.declined:
            return getIconClassName(iconNames.proposalDeclined)
          default:
            return getIconClassName(iconNames.proposal)
        }
      default:
        return getIconClassName(iconNames.edit2)
    }
  }, [item?.logType, item?.newValue])

  const popupMessage = useMemo(() => {
    if (item?.logType === logTypes.create) {
      return (
        <>
          <span className={classes.itemBoldText}>{`New ${entity} `}</span>
          <span className={classes.itemNormalText}>{`created by`}</span>
          <span className={classes.itemBoldText}>{` ${_get(
            item,
            'updatedBy.firstName'
          )} ${_get(item, 'updatedBy.lastName')}`}</span>
        </>
      )
    } else if ([logTypes.edit, logTypes.system].includes(item?.logType)) {
      return (
        <>
          <span className={classes.itemBoldText}>{`${titleCase(
            item?.field || ''
          )} `}</span>
          <span className={classes.itemNormalText}>{`was changed `}</span>
          {_capitalize(item?.field) !==
            _capitalize(customFieldNames.addresses) && (
            <>
              <span className={classes.itemNormalText}>{`to`}</span>
              <span
                className={classes.itemBoldText}
              >{` ${item.newValue} `}</span>
            </>
          )}
          <span className={classes.itemNormalText}>{`by`}</span>
          <span className={classes.itemBoldText}>{` ${
            item?.logType === 'system'
              ? 'System'
              : `${_get(item, 'updatedBy.firstName')} ${_get(
                  item,
                  'updatedBy.lastName'
                )}`
          }`}</span>
        </>
      )
    } else if (item?.logType === logTypes.note) {
      return (
        <>
          <span className={classes.itemBoldText}>{`${titleCase(
            _get(item, 'activity.subject', '')
          )} `}</span>
          <span
            className={classes.itemNormalText}
          >{`activity was created by`}</span>
          <span className={classes.itemBoldText}>{` ${
            item?.logType === 'system'
              ? 'System'
              : `${_get(item, 'updatedBy.firstName')} ${_get(
                  item,
                  'updatedBy.lastName'
                )}`
          }`}</span>
        </>
      )
    } else if (item?.logType === logTypes.proposal) {
      return (
        <>
          <span className={classes.itemBoldText}>{`Proposal`}</span>
          <span className={classes.itemNormalText}>{` has been `}</span>
          <span className={classes.itemBoldText}>{item?.newValue}</span>
          <span className={classes.itemNormalText}>{` by `}</span>
          <span className={classes.itemBoldText}>{` ${
            [
              porposalStatusTypes.opened,
              porposalStatusTypes.accepted,
              porposalStatusTypes.declined
            ].includes(item?.newValue)
              ? 'Client'
              : `${_get(item, 'updatedBy.firstName')} ${_get(
                  item,
                  'updatedBy.lastName'
                )}`
          }`}</span>
        </>
      )
    }
  }, [classes, item, entity])

  return (
    <div
      className={classNames(classes.container, classes.containerWidth, {
        [classes.evenFirstRow]: index < cols,
        [classes.odd]: Math.floor(index / cols) % 2 !== 0,
        [classes.lastEven]: isLast && Math.floor(index / cols) % 2 === 0,
        [classes.lastOdd]: isLast && Math.floor(index / cols) % 2 !== 0,
        [classes.even]: Math.floor(index / cols) % 2 === 0
      })}
    >
      <div className={classes.itemRoot}>
        <div
          className={classNames(classes.itemBullet, classes.itemBgColor, {
            [classes.bulletFirst]: index % cols === 0,
            [classes.bulletLast]: isLast
          })}
        >
          <MaterialPopup
            on="hover"
            placement={materialPopupPosition.topCenter}
            trigger={
              <div
                className={classNames(classes.circleRoot, {
                  [classes.circleActive]: open
                })}
                onClick={() => {
                  open && setHover(false)
                  onOpen()
                }}
              >
                <i className={getIcon()} />
              </div>
            }
            preventOverflow={{
              enabled: true,
              boundariesElement: 'viewport'
            }}
            hasArrow={false}
            contentClassName={classes.popupContent}
            open={open || (hover === false ? false : undefined)}
            onOpen={() => setHover(true)}
            onClose={() => setHover(false)}
          >
            <div className={classes.itemCard}>
              <div className={classes.itemText}>{popupMessage}</div>
            </div>
          </MaterialPopup>
        </div>
        <div
          className={classNames(classes.itemDate, {
            [classes.dateActive]: open || hover
          })}
        >
          <DateTimeView date={item.createdAt} />
        </div>
      </div>
      {(index + 1) % cols === 0 && !isLast && (
        <div className={classNames(classes.downBar, classes.itemBgColor)}></div>
      )}
    </div>
  )
}

export default TimelineCard
