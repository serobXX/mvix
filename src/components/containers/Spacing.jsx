import React, { forwardRef } from 'react'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/styles/makeStyles'

import {
  marginBottom,
  paddingTop,
  paddingHor,
  paddingVert,
  height,
  position,
  wordBreak,
  border,
  borderTop,
  borderBottom,
  borderLeft,
  borderRight,
  background,
  paddingBottom,
  flexGrow,
  paddingLeftClasses,
  paddingRightClasses
} from 'utils/styles'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(({ spacing, type, colors }) => ({
  'spacing-0': marginBottom(0, spacing),
  'spacing-1': marginBottom(1, spacing),
  'spacing-2': marginBottom(2, spacing),
  'spacing-2.5': marginBottom(2.5, spacing),
  'spacing-3': marginBottom(3, spacing),
  'spacing-4': marginBottom(4, spacing),
  'spacing-6': marginBottom(6, spacing),
  'paddingVert-1': paddingVert(1, spacing),
  'paddingVert-1.5': paddingVert(1.5, spacing),
  'paddingVert-2': paddingVert(2, spacing),
  'paddingVert-2.5': paddingVert(2.5, spacing),
  'paddingVert-3': paddingVert(3, spacing),
  'paddingVert-4': paddingVert(4, spacing),
  'paddingHor-1': paddingHor(1, spacing),
  'paddingHor-1.5': paddingHor(1.5, spacing),
  'paddingHor-2': paddingHor(2, spacing),
  'paddingHor-2.5': paddingHor(2.5, spacing),
  'paddingHor-3': paddingHor(3, spacing),
  'paddingHor-4': paddingHor(4, spacing),
  'height-auto': height('auto'),
  'height-full': height('100%'),
  'padding-top-0.5': paddingTop(0.5, spacing),
  'padding-top-1': paddingTop(1, spacing),
  'padding-top-1.5': paddingTop(1.5, spacing),
  'padding-top-2': paddingTop(2, spacing),
  'padding-top-3': paddingTop(3, spacing),
  'padding-top-4': paddingTop(4, spacing),
  'padding-top-4.5': paddingTop(4.5, spacing),
  'padding-top-5': paddingTop(5, spacing),
  'padding-bottom-1': paddingBottom(1, spacing),
  'padding-bottom-1.5': paddingBottom(1.5, spacing),
  'padding-bottom-2': paddingBottom(2, spacing),
  'padding-bottom-3': paddingBottom(3, spacing),
  'padding-bottom-4': paddingBottom(4, spacing),
  'padding-bottom-4.5': paddingBottom(4.5, spacing),
  'padding-bottom-5': paddingBottom(5, spacing),
  ...paddingLeftClasses(spacing),
  ...paddingRightClasses(spacing),
  'word-break-normal': wordBreak('normal'),
  'word-break-break-all': wordBreak('break-all'),
  'border-0': border(0, colors.border[type]),
  'border-1': border(1, colors.border[type]),
  'border-2': border(2, colors.border[type]),
  'border-3': border(3, colors.border[type]),
  'border-top-0': borderTop(0, colors.border[type]),
  'border-top-1': borderTop(1, colors.border[type]),
  'border-top-2': borderTop(2, colors.border[type]),
  'border-top-3': borderTop(3, colors.border[type]),
  'border-bottom-0': borderBottom(0, colors.border[type]),
  'border-bottom-1': borderBottom(1, colors.border[type]),
  'border-bottom-2': borderBottom(2, colors.border[type]),
  'border-bottom-3': borderBottom(3, colors.border[type]),
  'border-left-0': borderLeft(0, colors.border[type]),
  'border-left-1': borderLeft(1, colors.border[type]),
  'border-left-2': borderLeft(2, colors.border[type]),
  'border-left-3': borderLeft(3, colors.border[type]),
  'border-right-0': borderRight(0, colors.border[type]),
  'border-right-1': borderRight(1, colors.border[type]),
  'border-right-2': borderRight(2, colors.border[type]),
  'border-right-3': borderRight(3, colors.border[type]),
  'background-primary': background(colors.background.primary[type]),
  'background-secondary': background(colors.background.secondary[type]),
  'background-third': background(colors.background.third[type]),
  'flex-grow-1': flexGrow(1),
  relative: position('relative')
}))

const Spacing = forwardRef(
  (
    {
      variant,
      children,
      paddingVert,
      paddingHor,
      rootClassName,
      height,
      relative,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      wordBreak,
      borderTop,
      borderBottom,
      borderLeft,
      borderRight,
      border,
      background,
      flexGrow,
      ...props
    },
    ref
  ) => {
    const classes = useStyles()
    return (
      <Grid
        ref={ref}
        container
        direction="column"
        className={classNames(
          classes[`spacing-${variant}`],
          classes[`paddingVert-${paddingVert}`],
          classes[`paddingHor-${paddingHor}`],
          classes[`height-${height}`],
          classes[`padding-top-${paddingTop}`],
          classes[`padding-bottom-${paddingBottom}`],
          classes[`padding-right-${paddingRight}`],
          classes[`padding-left-${paddingLeft}`],
          classes[`word-break-${wordBreak}`],
          classes[`border-${border}`],
          classes[`border-top-${borderTop}`],
          classes[`border-bottom-${borderBottom}`],
          classes[`border-left-${borderLeft}`],
          classes[`border-right-${borderRight}`],
          classes[`background-${background}`],
          classes[`flex-grow-${flexGrow}`],
          rootClassName,
          {
            [classes.relative]: relative
          }
        )}
        {...props}
      >
        {children}
      </Grid>
    )
  }
)

Spacing.propTypes = {
  variant: PropTypes.marginBottom,
  paddingVert: PropTypes.paddingVert,
  paddingHor: PropTypes.paddingHor,
  paddingTop: PropTypes.padding,
  paddingBottom: PropTypes.padding,
  paddingLeft: PropTypes.padding,
  paddingRight: PropTypes.padding,
  height: PropTypes.height,
  wordBreak: PropTypes.wordBreak,
  borderTop: PropTypes.border,
  borderBottom: PropTypes.border,
  borderRight: PropTypes.border,
  borderLeft: PropTypes.border,
  border: PropTypes.border,
  background: PropTypes.background,
  flexGrow: PropTypes.flexGrow,
  rootClassName: PropTypes.className,
  relative: PropTypes.bool
}

Spacing.defaultProps = {
  variant: 2,
  height: 'auto'
}

export default Spacing
