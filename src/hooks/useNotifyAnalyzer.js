import { useEffect } from 'react'
import { _isEmpty } from 'utils/lodash'
import notificationAnalyzer from 'utils/notifyUtils'
import useSnackbar from './useSnackbar'

const useNotifyAnalyzer = ({
  fetcher = f => f,
  onSuccess = f => f,
  onError = f => f,
  cleaner = f => f,
  entityName = '',
  watchArray = [],
  labels = [],
  item = {},
  clearItemToRemove = f => f,
  params = {},
  hideErrorNotification = false,
  hideNotification = false,
  stopNotifying = false,
  successMessage,
  errorMessage
}) => {
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    if (!stopNotifying) {
      const { wasNotify, notifyReducer } = notificationAnalyzer(
        showSnackbar,
        watchArray,
        labels,
        entityName,
        item,
        clearItemToRemove,
        hideErrorNotification,
        hideNotification,
        successMessage,
        errorMessage
      )

      const isEmptyErrors = watchArray.every(({ error } = {}) =>
        _isEmpty(error)
      )

      if (wasNotify) {
        cleaner()
        watchArray.forEach(watch => {
          watch?.reset && watch.reset()
        })
        // updates list of items only in there are no errors from the server.
        isEmptyErrors && fetcher(params)
        if (isEmptyErrors) onSuccess(notifyReducer)
        else onError(notifyReducer)
      }
    }
    // eslint-disable-next-line
  }, watchArray)
}

export default useNotifyAnalyzer
