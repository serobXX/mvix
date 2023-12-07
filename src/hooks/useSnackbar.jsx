import React, { useCallback, useMemo } from 'react'
import { useSnackbar as _useSnackbar } from 'notistack'
import { Button } from '@material-ui/core'

import { DEFAULT_NOTIFICATION_DURATION } from 'constants/app'

export default function useSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = _useSnackbar()

  const handleCloseSnackbar = useCallback(
    (key, cb) => {
      if (cb && typeof cb === 'function') cb()
      closeSnackbar(key)
    },
    [closeSnackbar]
  )

  const showSnackbar = useCallback(
    (message, variant = 'default', buttonText, callback, persist = false) => {
      enqueueSnackbar(message, {
        variant,
        action: buttonText
          ? key => (
              <Button
                color="secondary"
                size="small"
                onClick={() => handleCloseSnackbar(key, callback)}
              >
                {buttonText}
              </Button>
            )
          : undefined,
        preventDuplicate: true,
        autoHideDuration: DEFAULT_NOTIFICATION_DURATION,
        persist: buttonText && persist
      })
    },
    [enqueueSnackbar, handleCloseSnackbar]
  )

  return useMemo(
    () => ({
      showSnackbar
    }),
    [showSnackbar]
  )
}
