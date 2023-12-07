import React, { useCallback, useMemo, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'

import { setConfirmationRequired } from 'slices/appSlice'
import Spacing from 'components/containers/Spacing'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

export default function useConfirmation(options) {
  const {
    defaultOnConfirm,
    onCancel,
    confirmButtonText,
    cancelButtonText,
    confirmButtonIcon,
    confirmButtonIconClassName = getIconClassName(iconNames.confirm),
    cancelButtonIcon,
    cancelButtonIconClassName = getIconClassName(iconNames.cancel2),
    defaultMessage,
    singleButton,
    variant = 'warning',
    renderButtonsComponent
  } = options || {}

  const dispatch = useDispatch()
  const [confirmFunc, setConfirmFunc] = useState(null)
  const [cancelFunc, setCancelFunc] = useState(null)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleCloseSnackbar = useCallback(
    key => {
      closeSnackbar(key)
      dispatch(setConfirmationRequired(false))
    },
    [closeSnackbar, dispatch]
  )

  const showConfirmation = useCallback(
    (
      message = defaultMessage,
      callback,
      cancelCallback,
      customVariant,
      params
    ) => {
      dispatch(setConfirmationRequired(true))
      const onConfirmCallback = confirmFunc || callback || defaultOnConfirm
      const onCancelCallback = cancelFunc || cancelCallback || onCancel

      enqueueSnackbar(message, {
        variant: customVariant ? customVariant : variant,
        action: key =>
          renderButtonsComponent ? (
            typeof renderButtonsComponent === 'function' ? (
              renderButtonsComponent(params, () => handleCloseSnackbar(key))
            ) : (
              renderButtonsComponent
            )
          ) : (
            <>
              {!singleButton && (
                <Spacing variant={0} paddingRight={1}>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => {
                      handleCloseSnackbar(key)
                      onCancelCallback && onCancelCallback()
                    }}
                    startIcon={
                      cancelButtonIcon || (
                        <i className={cancelButtonIconClassName}></i>
                      )
                    }
                  >
                    {cancelButtonText || 'No'}
                  </Button>
                </Spacing>
              )}
              <Spacing variant={0}>
                <Button
                  color="secondary"
                  size="small"
                  onClick={() => {
                    handleCloseSnackbar(key)
                    onConfirmCallback && onConfirmCallback()
                  }}
                  startIcon={
                    confirmButtonIcon || (
                      <i className={confirmButtonIconClassName}></i>
                    )
                  }
                >
                  {confirmButtonText || (singleButton ? 'Ok' : 'Yes')}
                </Button>
              </Spacing>
            </>
          ),
        preventDuplicate: true,
        autoHideDuration: null
      })
    },
    [
      dispatch,
      enqueueSnackbar,
      confirmFunc,
      cancelFunc,
      defaultOnConfirm,
      onCancel,
      handleCloseSnackbar,
      defaultMessage,
      confirmButtonText,
      cancelButtonText,
      singleButton,
      cancelButtonIcon,
      cancelButtonIconClassName,
      confirmButtonIcon,
      confirmButtonIconClassName,
      variant,
      renderButtonsComponent
    ]
  )

  return useMemo(
    () => ({
      showConfirmation,
      closeConfirmation: handleCloseSnackbar,
      setConfirmFunc,
      setCancelFunc
    }),
    [showConfirmation, setConfirmFunc, setCancelFunc, handleCloseSnackbar]
  )
}

export const withConfirmation =
  (options = {}) =>
  Component =>
  props => {
    const confirmationProps = useConfirmation({ ...options })
    return <Component {...confirmationProps} {...props} />
  }
