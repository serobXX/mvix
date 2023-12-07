import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import GridLayout from 'components/GridLayout'
import { TermAndConditionCard } from 'components/cards'
import {
  useAddTermsAndConditionsMutation,
  useDeleteTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation
} from 'api/termsAndConditionsApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px 0px'
  }
}))

const entities = {
  proposal: 'Proposal',
  invoice: 'Invoice'
}

const TermsAndConditionPage = () => {
  const classes = useStyles()
  const [values, setValues] = useState({
    [entities.proposal]: {
      termsAndConditions: ''
    },
    [entities.invoice]: {
      termsAndConditions: ''
    }
  })

  const { data: proposal } = useGetTermsAndConditionsQuery({
    entity: entities.proposal
  })
  const { data: invoice } = useGetTermsAndConditionsQuery({
    entity: entities.invoice
  })

  const [addItem] = useAddTermsAndConditionsMutation({
    fixedCacheKey: apiCacheKeys.termsAndConditions.update
  })
  const [updateItem, put] = useUpdateTermsAndConditionsMutation({
    fixedCacheKey: apiCacheKeys.termsAndConditions.update
  })
  const [deleteItem] = useDeleteTermsAndConditionsMutation({
    fixedCacheKey: apiCacheKeys.termsAndConditions.update
  })

  useEffect(() => {
    if (proposal) {
      setValues(v => ({
        ...v,
        [entities.proposal]: proposal?.[0] || {}
      }))
    }
  }, [proposal])

  useEffect(() => {
    if (invoice) {
      setValues(v => ({
        ...v,
        [entities.invoice]: invoice?.[0] || {}
      }))
    }
  }, [invoice])

  useNotifyAnalyzer({
    entityName: 'Terms and Conditions',
    watchArray: [put],
    labels: [notifyLabels.update]
  })

  const handleSubmit = useCallback(
    entity =>
      ({ termsAndCondition }) => {
        const value = values[entity]
        const data = {
          entity,
          termsAndCondition,
          // TODO: Remove this
          name: 'test'
        }

        if (value.id) {
          if (termsAndCondition) {
            updateItem({ id: value.id, data })
          } else {
            deleteItem(value.id)
          }
        } else if (!!termsAndCondition) {
          addItem(data)
        }
      },
    [addItem, updateItem, deleteItem, values]
  )

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 2.5,
        h: 20,
        i: 'proposal'
      },
      {
        x: 2.5,
        y: 0,
        w: 2.5,
        h: 20,
        i: 'invoice'
      }
    ],
    []
  )

  const cards = useMemo(
    () => ({
      proposal: (
        <TermAndConditionCard
          title="Terms for Proposals"
          name="termsAndCondition"
          text={values[entities.proposal]?.termsAndCondition || ''}
          onSubmit={handleSubmit(entities.proposal)}
        />
      ),
      invoice: (
        <TermAndConditionCard
          title="Terms for Invoices"
          name="termsAndCondition"
          text={values[entities.invoice]?.termsAndCondition || ''}
          onSubmit={handleSubmit(entities.invoice)}
        />
      )
    }),
    [values, handleSubmit]
  )

  return (
    <div className={classes.root}>
      <GridLayout positions={positions} cards={cards} disableDragging />
    </div>
  )
}

export default TermsAndConditionPage
