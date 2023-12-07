import React, { isValidElement, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import ReactGridLayout from 'react-grid-layout'
import update from 'immutability-helper'
import ResizeObserver from 'react-resize-observer'

import { _pick, _isEqual } from 'utils/lodash'
import {
  GRID_COLS,
  GRID_MARGIN,
  GRID_ROW_HEIGHT,
  GRID_WIDTH
} from 'constants/detailView'

import 'react-grid-layout/css/styles.css'

const useStyles = makeStyles(({ colors }) => ({
  gridLayoutRoot: {
    margin: '-20px',

    '& .react-draggable': {
      cursor: 'pointer',
      '&:before': {
        // content: '""',
        position: 'absolute',
        width: 4,
        height: '100%',
        left: 0,
        top: 0,
        transform: 'scale3d(0,0,0)',
        transformOrigin: 'bottom',
        transition: 'transform 150ms ease-in-out, background 200ms ease-out',
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6
      },
      '&:hover:before': {
        background: colors.highlight,
        zIndex: '99',
        transform: 'none'
      }
    },
    '& .react-draggable-dragging': {
      boxShadow: '2px 4px 16px -4px #30598E20',
      cursor: 'grabbing',
      '&:before': {
        background: colors.highlight,
        transform: 'scale3d(2,1,1) !important',
        transformOrigin: 'left  !important',
        transition: 'transform 150ms ease-in  !important',
        zIndex: '9999  !important'
      }
    },
    '& .react-grid-placeholder': {
      background: 'transparent !important'
    }
  },
  cardHasHigherIndex: {
    zIndex: 1
  },
  cardRoot: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  cardHeight: {
    height: 'fit-content'
  }
}))

const cardsWithHigherIndex = []

const isEqualGridPositions = (arr1, arr2) => {
  const modifiedArr1 = arr1.map(a => _pick(a, ['x', 'y', 'h', 'w', 'i']))
  const modifiedArr2 = arr2.map(a => _pick(a, ['x', 'y', 'h', 'w', 'i']))
  return _isEqual(modifiedArr1, modifiedArr2)
}

const GridLayout = ({
  cards = {},
  positions = [],
  onUpdateColumns = f => f,
  isDisableDragging = {},
  disableDragging = false,
  autoHeight = false,
  gridWidth,
  cols
}) => {
  const classes = useStyles()
  const [ctrlKeyPressed, setCtrlKeyPresses] = useState(false)
  const [dragging, setDragging] = useState({})
  const [cardPositions, setCardPositions] = useState([])

  useEffect(() => {
    setCardPositions(positions)
  }, [positions])

  const handleKeyDown = e => {
    if (e.keyCode === 17) {
      setCtrlKeyPresses(true)
    }
  }
  const handleKeyUp = e => {
    if (e.keyCode === 17) {
      setCtrlKeyPresses(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleChangeLayout = useCallback(
    layout => {
      if (!isEqualGridPositions(layout, positions)) {
        onUpdateColumns(layout)
      }
    },
    [onUpdateColumns, positions]
  )

  const handleDragStart = (_, card) => {
    setDragging(d => ({
      ...d,
      [card.i]: true
    }))

    setTimeout(() => {
      setDragging(d => ({
        ...d,
        [card.i]: false
      }))
    }, 2000)
  }

  const handleDragStop = (_, card) => {
    setDragging(d => ({
      ...d,
      [card.i]: false
    }))
  }

  const handleResizeCard =
    (index, isAutoHeight) =>
    ({ height }) => {
      const h = (
        (height + GRID_MARGIN) /
        (GRID_ROW_HEIGHT + GRID_MARGIN)
      ).toFixed(2)
      if (cardPositions[index].h !== Number(h) && isAutoHeight) {
        setCardPositions(p =>
          update(p, {
            [index]: {
              h: {
                $set: Number(h)
              }
            }
          })
        )
      }
    }

  return (
    <>
      <ReactGridLayout
        className={classes.gridLayoutRoot}
        layout={cardPositions}
        cols={cols || GRID_COLS}
        rowHeight={GRID_ROW_HEIGHT}
        width={gridWidth || GRID_WIDTH}
        margin={[GRID_MARGIN, GRID_MARGIN]}
        onLayoutChange={handleChangeLayout}
        draggableCancel=".react-grid-disable-dragging"
        draggableHandle=".react-grid-enable-dragging"
        isResizable={false}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
      >
        {cardPositions.map(
          (
            {
              i,
              disableDragging: stopDragging,
              ctrlDragging,
              autoHeight: cardAutoHeight
            },
            index
          ) => {
            const Card = cards[i]
            return (
              <div
                key={i}
                className={classNames({
                  'react-grid-disable-dragging':
                    disableDragging ||
                    stopDragging ||
                    (ctrlDragging && ctrlKeyPressed),
                  [classes.cardHasHigherIndex]:
                    cardsWithHigherIndex.includes(i),
                  'react-grid-enable-dragging':
                    !disableDragging && !isDisableDragging[i]
                })}
              >
                <div
                  className={classNames(classes.cardRoot, {
                    [classes.cardHeight]: autoHeight || cardAutoHeight
                  })}
                >
                  {!isValidElement(Card) ? (
                    <Card isDragging={dragging[i] || false} />
                  ) : (
                    Card
                  )}
                  <ResizeObserver
                    onResize={handleResizeCard(
                      index,
                      autoHeight || cardAutoHeight
                    )}
                  />
                </div>
              </div>
            )
          }
        )}
      </ReactGridLayout>
    </>
  )
}

export default GridLayout
