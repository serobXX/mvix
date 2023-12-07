import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import moment from 'moment'

import StageCard from './StageCard'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { Text, TextWithTooltip } from 'components/typography'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import Tooltip from 'components/Tooltip'
import { CLOSED_LOST, CLOSED_WON } from 'constants/opportunityConstants'
import { OpportunityClosedLostModal } from 'components/modals'
import { _compact } from 'utils/lodash'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'

const useStyles = makeStyles(({ typography, type }) => ({
  root: {
    display: 'flex',
    width: '100%',
    paddingTop: 7.5
  },
  listRoot: {
    flexGrow: 1,
    display: 'flex',
    gap: 25,
    paddingRight: 25,
    overflow: 'hidden'
  },
  resultRoot: {},
  notClosedRoot: {
    display: 'flex',
    gap: 10
  },
  notClosedCard: {
    display: 'grid',
    placeItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 4,

    '& i': {
      fontSize: 30
    }
  },
  notClosedSuccess: {
    background: '#daf8be',
    '& i': {
      color: '#47830f'
    }
  },
  notClosedDanger: {
    background: '#f8bebe',
    '& i': {
      color: '#ba1b1b'
    }
  },
  closedRoot: {
    display: 'flex',
    gap: 10
  },
  closedCard: {
    padding: 10,
    borderRadius: 4,
    display: 'flex',
    gap: 10,
    height: 70,
    alignItems: 'center'
  },
  closedCardIcon: {
    fontSize: 30
  },
  closedCardSuccess: {
    background: '#47830f',
    '& p': {
      color: '#fff',
      textAlign: 'right'
    },
    '& i': {
      color: '#cdcccc'
    }
  },
  closedCardIconSuccess: {
    color: '#47830f'
  },
  closedCard2: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  closedCard2Title: {
    ...typography.darkAccent[type]
  },
  closedCardDanger: {
    background: '#ba1b1b',
    '& p': {
      color: '#fff'
    },
    '& i': {
      color: '#cdcccc'
    }
  },
  closedCardIconDanger: {
    color: '#ba1b1b'
  },
  closedCardTitle: {
    whiteSpace: 'nowrap'
  },
  closedCardText: {
    lineHeight: '16px'
  },
  popupContentRoot: {
    width: 300,
    padding: 20
  }
}))

const OpportunityStageCard = ({
  stages,
  currentStage,
  closedAt,
  closedDuration,
  closedLostReason,
  onChange,
  layout,
  item
}) => {
  const classes = useStyles()
  const [width, setWidth] = useState(100)
  const [isClosedLostModalOpen, setClosedLostModalOpen] = useState(false)
  const listRef = useRef()

  const [closedWonItem, closedLostItem, stageList] = useMemo(() => {
    let closedWon = {},
      closedLost = {}
    let lastActiveStageIndex = stages.findIndex(
      ({ stageId }) => stageId === currentStage?.id
    )
    let isClosedLost = false

    if (
      lastActiveStageIndex > -1 &&
      stages[lastActiveStageIndex].stage === CLOSED_LOST
    ) {
      let activeStageIndex = [...stages]
        .reverse()
        .findIndex(
          ({ duration, stage }) =>
            !!duration && ![CLOSED_LOST, CLOSED_WON].includes(stage)
        )
      if (activeStageIndex <= -1) {
        activeStageIndex = stages.length - 1
      }

      lastActiveStageIndex = stages.length - 1 - activeStageIndex

      isClosedLost = true
    }

    let _stages = stages
      .map((stage, index) => ({
        ...stage,
        isActive:
          index <= lastActiveStageIndex ||
          (stage.stage === CLOSED_LOST && isClosedLost)
      }))
      .filter(stage => {
        if (stage.stage === CLOSED_WON) {
          closedWon = stage
          return false
        } else if (stage.stage === CLOSED_LOST) {
          closedLost = stage
          return false
        }
        return !(
          stage.stage.includes(CLOSED_LOST) ||
          stage.stage.includes(CLOSED_LOST.replace(' ', '-'))
        )
      })

    return [closedWon, closedLost, _stages]
  }, [stages, currentStage])

  useEffect(() => {
    if (listRef.current) {
      setWidth(
        (listRef.current?.clientWidth - 25 * stageList.length) /
          stageList.length
      )
    }
  }, [stageList, currentStage])

  const renderClosed = useCallback(
    (isSuccess = true) => {
      const _item = isSuccess
        ? closedWonItem
        : {
            ...closedLostItem,
            tooltipHeader: 'Opportunity is Closed Lost',
            tooltipText: _compact([
              closedLostReason,
              getCustomFieldValueByCode(item, customFieldNames.lostDetails)
            ]).join(', ')
          }
      return (
        <div className={classes.closedRoot}>
          <Tooltip
            headerText={_item?.tooltipHeader}
            title={_item?.tooltipText}
            disableHoverListener={!_item?.tooltipText}
            withHeader
            placement={'top'}
            arrow
          >
            <div
              className={classNames(classes.closedCard, {
                [classes.closedCardSuccess]: isSuccess,
                [classes.closedCardDanger]: !isSuccess
              })}
            >
              <i
                className={classNames(
                  getIconClassName(
                    isSuccess ? iconNames.thumbsUp : iconNames.thumbsDown,
                    iconTypes.solid
                  ),
                  classes.closedCardIcon
                )}
              />
              <div>
                <Text rootClassName={classes.closedCardTitle} weight="bold">
                  {_item?.stage}
                </Text>
                {!!_item?.duration && (
                  <TextWithTooltip
                    rootClassName={classes.closedCardText}
                    maxWidth={80}
                  >
                    {_item?.duration}
                  </TextWithTooltip>
                )}
              </div>
            </div>
          </Tooltip>
          <div className={classes.closedCard2}>
            <i
              className={classNames(
                getIconClassName(
                  isSuccess ? iconNames.medal : iconNames.sadFace,
                  isSuccess ? iconTypes.solid : iconTypes.regular
                ),
                classes.closedCardIcon,
                {
                  [classes.closedCardIconSuccess]: isSuccess,
                  [classes.closedCardIconDanger]: !isSuccess
                }
              )}
            />
            <div>
              <Text rootClassName={classes.closedCard2Title} weight="bold">
                {isSuccess ? 'Congurations !' : 'Sorry !'}
              </Text>
              <Text whiteSpace="no-wrap">{`Deal ${
                isSuccess ? 'Won' : 'Lost'
              } in ${closedDuration}`}</Text>
              <Text whiteSpace="no-wrap">{`Deal Closed on ${
                closedAt && moment(closedAt).format(DATE_VIEW_FORMAT)
              }`}</Text>
            </div>
          </div>
        </div>
      )
    },
    [
      classes,
      closedWonItem,
      closedLostItem,
      closedAt,
      closedDuration,
      closedLostReason,
      item
    ]
  )

  const handleSubmitClosedLost = useCallback(
    (values, successMessage) => {
      onChange(
        {
          stageId: closedLostItem.stageId,
          ...values
        },
        successMessage
      )
      setClosedLostModalOpen(false)
    },
    [onChange, closedLostItem.stageId]
  )

  return (
    <div className={classes.root}>
      <div className={classes.listRoot} ref={listRef}>
        {stageList.map(({ stageId, stage, duration, isActive }) => (
          <StageCard
            width={width}
            title={stage}
            duration={duration}
            isActive={isActive}
            onClick={() => onChange({ stageId })}
          />
        ))}
      </div>
      <div className={classes.resultRoot}>
        {!closedWonItem.isActive && !closedLostItem.isActive ? (
          <div className={classes.notClosedRoot}>
            <div
              className={classNames(
                classes.notClosedCard,
                classes.notClosedSuccess
              )}
              onClick={() => onChange({ stageId: closedWonItem?.stageId })}
            >
              <i
                className={getIconClassName(
                  iconNames.thumbsUp,
                  iconTypes.solid
                )}
              />
            </div>

            <div
              className={classNames(
                classes.notClosedCard,
                classes.notClosedDanger
              )}
              onClick={() => setClosedLostModalOpen(true)}
            >
              <i
                className={getIconClassName(
                  iconNames.thumbsDown,
                  iconTypes.solid
                )}
              />
            </div>
          </div>
        ) : closedWonItem.isActive &&
          closedWonItem?.stageId === currentStage?.id ? (
          renderClosed()
        ) : closedLostItem.isActive &&
          closedLostItem?.stageId === currentStage?.id ? (
          renderClosed(false)
        ) : null}
      </div>
      {isClosedLostModalOpen && (
        <OpportunityClosedLostModal
          open={isClosedLostModalOpen}
          onClose={() => setClosedLostModalOpen(false)}
          layout={layout}
          onSave={handleSubmitClosedLost}
          item={item}
        />
      )}
    </div>
  )
}

export default OpportunityStageCard
