import { notifyLabels } from 'constants/notifyAnalyzer'
import { getItemSuccessMessage } from './snackbarMessages'

export const parseLabel = label => {
  switch (label) {
    case notifyLabels.add:
      return 'added'
    case notifyLabels.delete:
      return 'deleted'
    case notifyLabels.update:
      return 'updated'
    case notifyLabels.share:
      return 'shared'
    case notifyLabels.copy:
      return 'copied'
    case notifyLabels.start:
      return 'started'
    case notifyLabels.reject:
      return 'rejected'
    case notifyLabels.convert:
      return 'converted'
    case notifyLabels.restore:
      return 'restored'
    case notifyLabels.upload:
      return 'uploaded'
    case notifyLabels.sent:
      return 'sent'
    default:
      return 'added'
  }
}
/**
 *@param {function} pusher
 *@param {array} watchArray
 *@param {array} labels
 *@param {string} keyWord
 *@param {object} item
 *@param {function} clearItemToRemove
 *@param {boolean} hideErrorNotification
 **/
const notificationAnalyzer = (
  pusher,
  watchArray,
  labels,
  keyWord,
  item = {},
  clearItemToRemove = f => f,
  hideErrorNotification = false,
  hideNotification = false,
  successMessage,
  errorMessage
) => {
  let wasNotify = false
  let notifyReducer

  watchArray.forEach((reducer, index) => {
    const { isSuccess, isError, error } = reducer || {}
    if (isSuccess) {
      if (!hideNotification) {
        pusher(
          successMessage ||
            getItemSuccessMessage(
              item?.name?.trim() ? item.name : keyWord,
              parseLabel(labels?.[index])
            ),
          'success'
        )
      }
      if (clearItemToRemove) clearItemToRemove()
      wasNotify = true
      notifyReducer = reducer
    }
    if (isError) {
      if (!hideErrorNotification && !hideNotification) {
        pusher(
          errorMessage ||
            `${keyWord} was not ${parseLabel(labels?.[index])}: ${
              error.message
            }`,
          'error'
        )
      }
      wasNotify = true
      notifyReducer = reducer
    }
  })

  return { wasNotify, notifyReducer }
}

export default notificationAnalyzer
