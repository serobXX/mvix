import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import { SideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import { requiredField } from 'constants/validationMessages'
import { tagEntityType } from 'constants/tagConstants'
import {
  useAddEstimateMutation,
  useLazyGetEstimateByIdQuery,
  useUpdateEstimateMutation
} from 'api/estimateApi'
import { useLazyGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { entityValues } from 'constants/customFields'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { makeStyles } from '@material-ui/core'
import GridLayout from 'components/GridLayout'
import ProfileCardDetails from './ProfileCardDetails'
import { AddressCard, DetailTagCard } from 'components/cards'
import EstimateItemsCard from '../DetailView/EstimateItemsCard'
import queryParamsHelper from 'utils/queryParamsHelper'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'

const useStyles = makeStyles(({ palette, type }) => ({
  sideModalHeader: {
    padding: '17px 24px',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    background: palette[type].body.background,
    borderLeft: `2px solid ${palette[type].sideModal.content.border}`,
    borderRight: `2px solid ${palette[type].sideModal.content.border}`,
    padding: 20,
    paddingRight: 6,
    minHeight: '100%'
  }
}))

const initialValidationSchema = {
  estimateName: Yup.string().required(requiredField),
  accountId: Yup.number().required(requiredField),
  contactId: Yup.number().required(requiredField),
  opportunityId: Yup.number().required(requiredField)
}

const AddEditEstimate = ({
  layout: _layout,
  closeLink,
  loadLayout = false,
  fromDetailView = false,
  isClone = false
}) => {
  const { id, view, estimateId } = useParams()
  const classes = useStyles()
  const location = useLocation()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const [localValues, setLocalValues] = useState({})
  const [disabledFields, setDisabledFields] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const [formValid, setFormValid] = useState({})
  const navigate = useNavigate()

  const [getItemById, { data: item, isFetching }] =
    useLazyGetEstimateByIdQuery()
  const [addItem, post] = useAddEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.add
  })
  const [updateItem, put] = useUpdateEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.update
  })

  const [getCustomFieldLayout, { data: customFieldLayout }] =
    useLazyGetCustomFieldsByEntityQuery()

  const isEdit = isClone ? false : fromDetailView ? !!estimateId : !!id

  useNotifyAnalyzer({
    entityName: 'Estimate',
    watchArray: [post, put],
    labels: [notifyLabels.add, notifyLabels.update],
    stopNotifying: !fromDetailView
  })

  useEffect(() => {
    if (loadLayout) {
      getCustomFieldLayout({
        entityType: entityValues.estimate
      })
    }
    //eslint-disable-next-line
  }, [loadLayout])

  const layout = useMemo(
    () => _layout || customFieldLayout,
    [_layout, customFieldLayout]
  )

  useEffect(() => {
    if (fromDetailView ? estimateId : id) {
      getItemById(fromDetailView ? estimateId : id)
    }
    //eslint-disable-next-line
  }, [id, estimateId])

  useEffect(() => {
    if (location.state && !isEdit && fromDetailView) {
      setInitialValues(val => ({
        ...val,
        ...location.state
      }))
      setDisabledFields(Object.keys(location.state))
    }
    //eslint-disable-next-line
  }, [location.state])

  useEffect(() => {
    if (isSubmitClick) {
      setSubmitClick(false)
    }
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      setResetClick(false)
    }
  }, [isResetClick])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(closeLink || parseToAbsolutePath(routes.estimates.list))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const handleSubmit = useCallback(() => {
    const {
      profile: {
        estimateName,
        accountId,
        opportunityId,
        contactId,
        account,
        ...customFields
      },
      items: { productItems, estimateValidityDuration, ...fields },
      tag: { tag },
      address
    } = values
    setSubmitting(true)

    const data = {
      estimateName,
      accountId,
      opportunityId,
      contactId,
      ...productItems,
      tag,
      estimateValidityDuration,
      customFields: queryParamsHelper({
        ...customFields,
        ...fields,
        ...address
      })
    }

    if (isEdit) {
      updateItem({
        id: fromDetailView ? estimateId : id,
        data
      })
    } else {
      addItem(data)
    }
  }, [addItem, updateItem, estimateId, fromDetailView, id, isEdit, values])

  useEffect(() => {
    if (
      values.profile &&
      values.items &&
      values.tag &&
      values.address &&
      !isSubmitting
    ) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [values])

  const handleEditSubmit = useCallback(
    entity => _values => {
      let data = {
        ..._values
      }

      setValues(v => ({
        ...v,
        [entity]: data
      }))
    },
    []
  )

  const handleFormValid = useCallback(
    entity => isValid => {
      setFormValid(v => ({
        ...v,
        [entity]: isValid
      }))
    },
    []
  )

  const handleBlur = useCallback(
    entity => _values => {
      let data = {
        ..._values
      }
      setLocalValues(v => ({
        ...v,
        [entity]: data
      }))
    },
    []
  )

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 17,
        i: 'profile_card',
        autoHeight: true
      },
      {
        x: 1,
        y: 0,
        w: 3,
        h: 35,
        i: 'product_items',
        autoHeight: true
      },
      {
        x: 4,
        y: 0,
        w: 1,
        h: 16,
        i: 'address_card',
        autoHeight: true
      },
      {
        x: 4,
        y: 16,
        w: 1,
        h: 10,
        i: 'tag_card',
        autoHeight: true
      }
    ],
    []
  )

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          item={isFetching ? {} : item}
          onEditSubmit={handleEditSubmit('profile')}
          layout={layout}
          isFetching={isFetching}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          initialValidationSchema={initialValidationSchema}
          initialValue={initialValues}
          disabledFields={disabledFields}
          isAdd={!isEdit}
          onChangeFormValid={handleFormValid('profile')}
          onBlur={handleBlur('profile')}
        />
      ),
      product_items: (
        <EstimateItemsCard
          item={item}
          layout={layout}
          onEditSubmit={handleEditSubmit('items')}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          addresses={localValues?.address}
          onChangeFormValid={handleFormValid('items')}
          account={localValues?.profile?.account || item?.account}
        />
      ),
      address_card: (
        <AddressCard
          name="addresses"
          values={item?.customFields}
          onEditSubmit={handleEditSubmit('address')}
          onlyEdit
          onlyBillingAndShipping
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          returnDataOnBlur
          onBlur={handleBlur('address')}
        />
      ),
      tag_card: (
        <DetailTagCard
          entity={tagEntityType.estimate}
          values={item?.tag}
          onChange={handleEditSubmit('tag')}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
        />
      )
    }),
    [
      isFetching,
      item,
      layout,
      handleEditSubmit,
      isResetClick,
      isSubmitClick,
      disabledFields,
      initialValues,
      handleBlur,
      localValues?.address,
      isEdit,
      handleFormValid,
      localValues?.profile
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={`${isClone ? 'Clone' : isEdit ? 'Edit' : 'Add'} an Estimate`}
      headerClassName={classes.sideModalHeader}
      closeLink={closeLink || parseToAbsolutePath(routes.estimates[view])}
      footerLayout={
        <FormFooterLayout
          isUpdate={isEdit}
          onSubmit={() => setSubmitClick(true)}
          isPending={isSubmitting}
          onReset={() => setResetClick(true)}
          opaqueSubmit={Object.values(formValid).includes(false)}
          submitLabel={isEdit ? 'Update Estimate' : 'Create Estimate'}
        />
      }
    >
      <div className={classes.container}>
        <GridLayout
          positions={positions}
          cards={cards}
          disableDragging
          gridWidth={1800}
        />
      </div>
    </SideModal>
  )
}

export default AddEditEstimate
