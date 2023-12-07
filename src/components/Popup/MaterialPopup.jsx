import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'
import Popper from '@material-ui/core/Popper'

import PropTypes from 'constants/propTypes'
import { _get, _isEmpty } from 'utils/lodash'
import { materialPopupPosition } from 'constants/common'

const zIndex = 2000

const styles = ({ palette, type }) => ({
  root: {
    zIndex
  },
  content: {
    backgroundColor: palette[type].dropdown.background,
    boxShadow: `0 2px 4px 0 ${palette[type].dropdown.shadow}`,
    borderRadius: 5,
    zIndex
  },
  topOffset: {
    paddingTop: 10,
    '& > #arrow': {
      top: 5,
      transform: 'rotate(-45deg)'
    }
  },
  bottomOffset: {
    paddingBottom: 10,
    '& > #arrow': {
      bottom: 5,
      right: 10,
      transform: 'rotate(135deg)'
    }
  },
  leftOffset: {
    paddingLeft: 10,
    '& > #arrow': {
      left: 5,
      transform: 'rotate(225deg)'
    }
  },
  rightOffset: {
    paddingRight: 10,
    '& > #arrow': {
      right: 5,
      transform: 'rotate(45deg)'
    }
  },
  startOffset: {
    '& > #arrow': {
      left: '10px !important'
    }
  },
  endOffset: {
    '& > #arrow': {
      left: 'unset !important',
      right: 10
    }
  },
  arrow: {
    position: 'absolute',
    borderColor: `transparent ${palette[type].dropdown.background} transparent transparent`,
    borderWidth: '0px 10px 10px 0px',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    boxShadow: `${palette[type].dropdown.shadow} 1px -1px 3px -2px`
  }
})

const MaterialPopup = ({
  children,
  trigger,
  classes,
  placement = 'bottom',
  on,
  innerClasses = {},
  disabled,
  hasArrow,
  offset = 10,
  rootClassName,
  preventOverflow,
  modifiers,
  onOpen = f => f,
  onClose = f => f,
  style = {},
  overlayStyles = {},
  open: openFromParent,
  contentClassName,
  withPortal,
  anchorEl: anchorElFormParent,
  ...props
}) => {
  const [arrowRef, setArrowRef] = useState(null)
  const popperRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [didMouseLeaveTrigger, toggleDidMouseLeaveTrigger] = useState(true)
  const [didMouseLeaveContainer, toggleDidMouseLeaveContainer] = useState(true)

  const handleArrowRef = useCallback(node => {
    setArrowRef(node)
  }, [])

  const ref = useRef({
    didClickInside: null,
    anchor: null
  })

  const handleMouseOutside = useCallback(() => {
    ref.current.didClickInside = false
  }, [])

  const closePopup = useCallback(() => {
    ref.current.anchor = null
    setOpen(false)
    onClose()
  }, [onClose])

  const openPopup = useCallback(
    ({ currentTarget }) => {
      ref.current.anchor = currentTarget
      setOpen(true)
      onOpen()
    },
    [onOpen]
  )

  const clickInside = useCallback(() => {
    ref.current.didClickInside = true
  }, [])

  const toggle = useCallback(
    ({ currentTarget }) => {
      clickInside()
      ref.current.anchor = currentTarget
      !open && onOpen()
      open && onClose()
      setOpen(value => !value)
    },
    [clickInside, onOpen, onClose, open]
  )

  const hover = useCallback(
    ({ currentTarget }) => {
      toggleDidMouseLeaveTrigger(false)
      openPopup({ currentTarget })
    },
    [openPopup]
  )

  const mode = useMemo(() => {
    return disabled
      ? {}
      : on === 'click'
      ? { onClick: toggle, onMouseLeave: handleMouseOutside }
      : {
          onMouseLeave: () => toggleDidMouseLeaveTrigger(true),
          onMouseEnter: hover
        }
  }, [disabled, handleMouseOutside, hover, on, toggle])

  const contentListeners = useMemo(
    () => ({
      onMouseLeave:
        on === 'click'
          ? handleMouseOutside
          : () => toggleDidMouseLeaveContainer(true),
      onClick: clickInside,
      onMouseEnter:
        on === 'hover' ? () => toggleDidMouseLeaveContainer(false) : undefined
    }),
    [clickInside, handleMouseOutside, on]
  )

  useEffect(() => {
    const closeModalWhenClickOutside = () => {
      if (ref.current.didClickInside === false) {
        closePopup()
      }
    }
    document.addEventListener('click', closeModalWhenClickOutside)
    return () =>
      document.removeEventListener('click', closeModalWhenClickOutside)
    //eslint-disable-next-line
  }, [closePopup])

  useEffect(() => {
    if (on === 'hover') {
      if (didMouseLeaveTrigger && didMouseLeaveContainer) {
        closePopup()
      }
    }
    //eslint-disable-next-line
  }, [didMouseLeaveTrigger, didMouseLeaveContainer])

  useEffect(() => {
    //force position recalculation
    setTimeout(() => {
      forceUpdate()
    }, 0)
    //eslint-disable-next-line
  }, [popperRef.current])

  const memoTrigger = useMemo(
    () => React.cloneElement(trigger, mode),
    [mode, trigger]
  )

  return (
    <>
      {(openFromParent === undefined ? open : openFromParent) &&
        !_isEmpty(overlayStyles) && <div style={overlayStyles} />}
      {memoTrigger}
      <Popper
        style={style}
        ref={popperRef}
        anchorEl={anchorElFormParent || ref.current.anchor}
        open={openFromParent === undefined ? open : openFromParent}
        placement={placement}
        modifiers={{
          flip: {
            enabled: false
          },
          arrow: {
            enabled: hasArrow,
            element: arrowRef
          },
          ...(withPortal
            ? {
                preventOverflow: {
                  enabled: true,
                  boundariesElement: 'viewport',
                  ...preventOverflow
                }
              }
            : { preventOverflow }),

          ...(modifiers && modifiers)
        }}
        className={classNames(classes.root, rootClassName)}
        {...props}
      >
        <div
          {...contentListeners}
          className={classNames(classes.container, {
            [classes.topOffset]: placement.split('-')[0] === 'bottom',
            [classes.bottomOffset]: placement.split('-')[0] === 'top',
            [classes.rightOffset]: placement.split('-')[0] === 'left',
            [classes.leftOffset]: placement.split('-')[0] === 'right',
            [classes.startOffset]:
              ['bottom', 'top'].includes(placement.split('-')[0]) &&
              _get(placement.split('-'), '[1]') === 'start',
            [classes.endOffset]:
              ['bottom', 'top'].includes(placement.split('-')[0]) &&
              _get(placement.split('-'), '[1]') === 'end'
          })}
        >
          {hasArrow ? (
            <span id="arrow" className={classes.arrow} ref={handleArrowRef} />
          ) : null}
          <div className={classNames(classes.content, contentClassName)}>
            {typeof children === 'function' ? children(closePopup) : children}
          </div>
        </div>
      </Popper>
    </>
  )
}

MaterialPopup.propTypes = {
  on: PropTypes.oneOf(['click', 'hover']).isRequired,
  innerClasses: PropTypes.object,
  hasArrow: PropTypes.bool.isRequired,
  placement: PropTypes.materialPopupPosition,
  open: PropTypes.bool
}

MaterialPopup.defaultProps = {
  on: 'hover',
  hasArrow: true,
  placement: materialPopupPosition.bottomCenter
}

export default withStyles(styles)(MaterialPopup)
