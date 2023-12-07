import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'

import useConfirmation from 'hooks/useConfirmation'

const useStyles = makeStyles(() => ({
  container: {
    height: 'calc(94vh - 137px)'
  }
}))

const ChunkErrorPage = () => {
  const classes = useStyles()
  const { showConfirmation } = useConfirmation({
    defaultMessage: 'New updates are available. Please reload the page',
    singleButton: true,
    confirmButtonText: 'Reload',
    defaultOnConfirm: () => window.location.reload(),
    variant: 'info',
    confirmButtonIconClassName: 'fa-regular fa-repeat'
  })

  useEffect(
    () => {
      showConfirmation()
    },
    // eslint-disable-next-line
    []
  )

  return <div className={classes.container} />
}

export default ChunkErrorPage
