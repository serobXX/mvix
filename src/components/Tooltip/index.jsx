import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { makeStyles, Tooltip as MaterialTooltip } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { tooltipStateSelector } from 'selectors/appSelectors'
import { addOpenedTooltip, removeOpenedTooltip } from 'slices/appSlice'

const useStyles = makeStyles(({ colors }) => ({
  root: {
    display: 'block'
  },
  labelWrapper: {
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
    '&:after': {
      // place dotted underline between bottom of the text
      // and bottom of the container
      // add 1px to compensate for border height
      bottom: 'calc(((100% - 1em) * 0.25) + 1px)',
      left: 0,
      width: '100%',
      borderTop: `1px dotted ${colors.highlight}`,
      position: 'absolute',
      content: '""'
    }
  },
  tooltip: ({ maxWidth }) => ({
    padding: '0px !important',
    maxWidth: maxWidth
  }),
  contentWrapper: {
    padding: 0
  },
  header: {
    padding: '10px 16px',
    fontSize: '15px',
    lineHeight: '18px',
    fontWeight: 600,
    backgroundColor: '#215c95',
    borderRadius: '5px 5px 0 0'
  },
  headerArrow: {
    color: '#215c95 !important'
  },
  content: {
    padding: '10px 16px',
    whiteSpace: 'pre-line'
  },
  hyphensAuto: {
    hyphens: 'auto'
  },
  wordBreakAll: {
    wordBreak: 'break-all'
  },
  wordWrap: {
    hyphens: 'none !important'
  }
}))

const Tooltip = ({
  containerClassName,
  tooltipContentClassName,
  customTooltipClasses,
  arrowWithHeaderColor,
  rootClasses,
  children,
  disableHoverListener = false,
  useUnderline = false,
  withWrapper = false,
  withHeader = false,
  headerText = '',
  title = '',
  maxWidth,
  useHyphens = false,
  id,
  single = false,
  disableTracking = false,
  ...props
}) => {
  const dispatch = useDispatch()
  const classes = useStyles({ maxWidth })

  const openedTooltips = useSelector(tooltipStateSelector)

  const [open, setOpen] = useState(false)
  const customClasses = useMemo(
    () => ({
      ...{
        tooltip: classNames(classes.tooltip, customTooltipClasses)
      },
      ...(arrowWithHeaderColor && { arrow: classes.headerArrow }),
      ...rootClasses
    }),
    [classes, customTooltipClasses, rootClasses, arrowWithHeaderColor]
  )

  const tooltipId = useMemo(() => id || title, [id, title])

  const handleOpen = () => {
    if (!disableTracking) {
      dispatch(addOpenedTooltip(tooltipId))
      if (single && !openedTooltips.length) {
        setOpen(true)
      }
    }
  }

  const handleClose = () => {
    if (!disableTracking) {
      dispatch(removeOpenedTooltip(tooltipId))
      setOpen(false)
    }
  }

  useEffect(() => {
    if (single) {
      if (openedTooltips.length > 1) {
        setOpen(false)
      } else if (openedTooltips.length === 1 && openedTooltips.includes(id)) {
        setOpen(true)
      }
    }
    // eslint-disable-next-line
  }, [openedTooltips])

  const wordBreakClasses = useMemo(() => {
    return {
      [classes.hyphensAuto]: useHyphens,
      [classes.wordWrap]: !useHyphens
    }
  }, [classes, useHyphens])

  const customTitle = useMemo(() => {
    if (withHeader) {
      return (
        <div className={classes.contentWrapper}>
          <div className={classNames(classes.header, wordBreakClasses)}>
            {headerText}
          </div>
          <div
            className={classNames(
              classes.content,
              tooltipContentClassName,
              wordBreakClasses
            )}
          >
            {title}
          </div>
        </div>
      )
    } else {
      return (
        <div className={classes.contentWrapper}>
          <div className={classNames(classes.content, wordBreakClasses)}>
            {title}
          </div>
        </div>
      )
    }
  }, [
    classes,
    withHeader,
    headerText,
    title,
    wordBreakClasses,
    tooltipContentClassName
  ])

  return (
    <MaterialTooltip
      onOpen={handleOpen}
      onClose={handleClose}
      {...(single && { open })}
      disableHoverListener={disableHoverListener}
      classes={customClasses}
      title={customTitle}
      {...props}
    >
      {withWrapper ? (
        <span
          className={classNames(classes.root, containerClassName, {
            [classes.labelWrapper]: useUnderline && !disableHoverListener
          })}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </MaterialTooltip>
  )
}

export default Tooltip
