import React, { forwardRef } from 'react'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/styles/makeStyles'

import PropTypes from 'constants/propTypes'
import { FORM_FIELD_GAP } from 'constants/ui'

const useStyles = makeStyles(({ spacing }) => ({
  root: ({ variant, rowGap, columnGap }) => ({
    display: 'grid !important',
    gap: spacing(variant),
    ...(rowGap || rowGap === 0 ? { rowGap } : {}),
    ...(columnGap || columnGap === 0 ? { columnGap } : {})
  }),
  cols: ({ cols }) => ({
    gridTemplateColumns:
      typeof cols === 'string' && cols.includes('-')
        ? `${cols.split('-').join('fr ')}fr`
        : `repeat(${cols}, 1fr)`
  })
}))

const Container = forwardRef(
  (
    {
      children,
      cols,
      variant,
      rootClassName,
      rowGap,
      columnGap,
      isFormContainer,
      ...props
    },
    ref
  ) => {
    const classes = useStyles({
      cols,
      variant: variant > 6 ? 2 : variant,
      rowGap: isFormContainer ? FORM_FIELD_GAP : rowGap,
      columnGap
    })
    return (
      <Grid
        ref={ref}
        container
        className={classNames(classes.root, classes.cols, rootClassName)}
        {...props}
      >
        {children}
      </Grid>
    )
  }
)

Container.propTypes = {
  cols: PropTypes.containerCols,
  variant: PropTypes.containerVariant,
  rootClassName: PropTypes.className,
  rowGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnGap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFormContainer: PropTypes.bool
}

Container.defaultProps = {
  cols: 2,
  variant: 2,
  isFormContainer: false
}

export default Container
