import React from 'react'
import { CircularProgress, Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(({ palette, type }) => ({
  loaderWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: _get(
      palette,
      `${type}.loader.backgroundColor`,
      'rgba(255,255,255,.5)'
    ),
    zIndex: 1
  }
}))

function CircularLoader({ className }) {
  const classes = useStyles()
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classNames(classes.loaderWrapper, className)}
    >
      <CircularProgress size={30} thickness={5} />
    </Grid>
  )
}

export default CircularLoader
