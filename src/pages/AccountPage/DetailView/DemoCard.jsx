import { useCallback, useEffect, useMemo } from 'react'

import {
  useAddDemoMutation,
  useDeleteDemoMutation,
  useLazyGetDemoQuery,
  useUpdateDemoMutation
} from 'api/accountApi'
import { DemoTrainingBaseCard } from 'components/cards'
import apiCacheKeys from 'constants/apiCacheKeys'
import queryParamsHelper from 'utils/queryParamsHelper'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'

const DemoCard = ({ accountId }) => {
  const [getItems, { data: items }] = useLazyGetDemoQuery()
  const [addItem, post] = useAddDemoMutation({
    fixedCacheKey: apiCacheKeys.accountDemo.add
  })
  const [updateItem, put] = useUpdateDemoMutation({
    fixedCacheKey: apiCacheKeys.accountDemo.update
  })
  const [deleteItem, del] = useDeleteDemoMutation({
    fixedCacheKey: apiCacheKeys.accountDemo.delete
  })

  useEffect(() => {
    if (accountId) {
      getItems({ accountId })
    }
    //eslint-disable-next-line
  }, [accountId])

  useNotifyAnalyzer({
    entityName: 'Demo',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const parsedItems = useMemo(
    () =>
      items
        ? items.map(({ demoDate, ...rest }) => ({
            ...rest,
            date: demoDate
          }))
        : [],

    [items]
  )

  const handleSubmit = useCallback(
    ({ id, date, ...values }) => {
      const data = queryParamsHelper({
        ...values,
        demoDate: date
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
      title="Demo"
      onSubmit={handleSubmit}
      onDeleteItem={handleDeleteItem}
      post={post}
      put={put}
    />
  )
}

export default DemoCard
