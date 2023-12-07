import React, { useCallback } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import eventNames from 'constants/eventNames'
import useSnackbar from 'hooks/useSnackbar'
import { AUTO_LOGOUT_TIME } from 'constants/app'

function InactivityTimer() {
  const { showSnackbar } = useSnackbar()

  const onIdle = useCallback(() => {
    showSnackbar(
      'For security reasons, you were automatically logged out of the CRM due to no activity',
      'error',
      'Ok',
      null,
      true
    )
    document.dispatchEvent(new Event(eventNames.logout))
  }, [showSnackbar])

  useIdleTimer({
    onIdle,
    timeout: AUTO_LOGOUT_TIME * 1000,
    debounce: 1000
  })

  return <></>
}

export default InactivityTimer
