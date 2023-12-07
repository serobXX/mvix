import { useCallback, useEffect, useMemo } from 'react'

import {
  useAddTrainingMutation,
  useDeleteTrainingMutation,
  useLazyGetTrainingQuery,
  useUpdateTrainingMutation
} from 'api/accountApi'
import { DemoTrainingBaseCard } from 'components/cards'
import apiCacheKeys from 'constants/apiCacheKeys'
import queryParamsHelper from 'utils/queryParamsHelper'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'

const TrainingCard = ({ accountId }) => {
  const [getItems, { data: items }] = useLazyGetTrainingQuery()
  const [addItem, post] = useAddTrainingMutation({
    fixedCacheKey: apiCacheKeys.accountTraining.add
  })
  const [updateItem, put] = useUpdateTrainingMutation({
    fixedCacheKey: apiCacheKeys.accountTraining.update
  })
  const [deleteItem, del] = useDeleteTrainingMutation({
    fixedCacheKey: apiCacheKeys.accountTraining.delete
  })

  useEffect(() => {
    if (accountId) {
      getItems({ accountId })
    }
    //eslint-disable-next-line
  }, [accountId])

  useNotifyAnalyzer({
    entityName: 'Training',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const parsedItems = useMemo(
    () =>
      items
        ? items.map(({ trainingDate, ...rest }) => ({
            ...rest,
            date: trainingDate
          }))
        : [],

    [items]
  )

  const handleSubmit = useCallback(
    ({ id, date, ...values }) => {
      const data = queryParamsHelper({
        ...values,
        trainingDate: date
      })
      if (!!id) {
        updateItem({
          accountId,
          id,
          data
        })
      } else {
        addItem({
          accountId,
          data
        })
      }
    },
    [accountId, addItem, updateItem]
  )

  const handleDeleteItem = useCallback(
    id => {
      deleteItem({ id, accountId })
    },
    [deleteItem, accountId]
  )

  return (
    <DemoTrainingBaseCard
      items={parsedItems}
      title="Training"
      onSubmit={handleSubmit}
      onDeleteItem={handleDeleteItem}
      post={post}
      put={put}
    />
  )
}

export default TrainingCard
