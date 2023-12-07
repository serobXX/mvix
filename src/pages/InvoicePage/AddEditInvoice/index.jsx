import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Yup from 'utils/yup'

import GridLayout from 'components/GridLayout'
import { AddressCard, TermAndConditionCard } from 'components/cards'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import { ConflictModal, SideModal } from 'components/modals'
import ProfileCardDetails from './ProfileCardDetails'
import {
  useAddInvoiceMutation,
  useLazyGetInvoiceByIdQuery,
  useUpdateInvoiceMutation
} from 'api/invoiceApi'
import InvoiceItemsCard from '../DetailView/InvoiceItemsCard'
import { useGetTermsAndConditionsQuery } from 'api/termsAndConditionsApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { requiredField } from 'constants/validationMessages'
import {
  addressToBillingShipping,
  transformToConflictAddress
} from 'utils/detailViewUtils'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import moment from 'moment'
import { BACKEND_DATE_FORMAT } from 'constants/dateTimeFormats'
import queryParamsHelper from 'utils/queryParamsHelper'
import exceptionNames from 'constants/beExceptionNames'
import { orderTypeValues } from 'constants/invoiceConstants'

const useStyles = makeStyles(({ type, palette }) => ({
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
    paddingRight: 6
  }
}))

const initialValidationSchema = {
  accountId: Yup.number().required(requiredField),
  contactId: Yup.number().required(requiredField),
  opportunityId: Yup.number()
    .when('orderType', {
      is: orderTypeValues.newBusiness,
      then: () => Yup.number().required(requiredField)
    })
    .nullable(),
  estimateId: Yup.number()
    .when('orderType', {
      is: orderTypeValues.newBusiness,
      then: () => Yup.number().required(requiredField)
    })
    .nullable(),
  dueDate: Yup.string().required(requiredField),
  orderType: Yup.string().required(requiredField)
}

const AddEditInvoice = ({ closeLink, fromDetailView = false }) => {
  const classes = useStyles()
  const { view, id, invoiceId } = useParams()
  const location = useLocation()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const [disabledFields, setDisabledFields] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const [localValues, setLocalValues] = useState({})
  const [isConflictModalOpen, setConflictModalOpen] = useState(false)
  const [conflictData, setConflictData] = useState()
  const [formValid, setFormValid] = useState({})
  const navigate = useNavigate()

  const { data: invoiceTnc } = useGetTermsAndConditionsQuery({
    entity: 'Invoice'
  })
  const [addItem, post] = useAddInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.add
  })
  const [updateItem, put] = useUpdateInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.update
  })
  const [getItemById, { data: item, isFetching }] = useLazyGetInvoiceByIdQuery()

  const isEdit = fromDetailView ? !!invoiceId : !!id

  useNotifyAnalyzer({
    entityName: 'Invoice',
    watchArray: [post, put],
    labels: [notifyLabels.add, notifyLabels.update],
    stopNotifying: !fromDetailView
  })

  useEffect(() => {
    if (fromDetailView ? invoiceId : id) {
      getItemById(fromDetailView ? invoiceId : id)
    }
    //eslint-disable-next-line
  }, [id, invoiceId])

  useEffect(() => {
    setInitialValues({
      paymentTerm: isEdit ? item?.payment_term : 'Prepay',
      orderType: isEdit ? item?.orderType : 'New business',
      status: isEdit ? item?.status : 'Open',
      dueDate: isEdit
        ? item?.dueDate
        : moment().add(7, 'days').format(BACKEND_DATE_FORMAT)
    })
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (location.state && fromDetailView) {
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
      navigate(closeLink || parseToAbsolutePath(routes.invoices.list))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const handleConflictClose = () => {
    setConflictModalOpen(false)
    setConflictData()
  }

  useEffect(() => {
    if (
      put.isError &&
      put.error?.code === 422 &&
      put.error?.exception === exceptionNames.changedAddressErrorException
    ) {
      setConflictData(transformToConflictAddress(put.error?.data))
      setConflictModalOpen(true)
    } else if (put.isSuccess) {
      handleConflictClose()
    }
  }, [put])

  const conflictDefaultValues = useMemo(() => {
    if (isConflictModalOpen && conflictData) {
      return conflictData.reduce((a, { fieldName, list }) => {
        a[fieldName] = list.reduce((x, { name, options }) => {
          x[name] = options[1]?.value
          return x
        }, {})
        return a
      }, {})
    }
  }, [conflictData, isConflictModalOpen])

  const handleSubmit = useCallback(
    (extraData = {}) => {
      const {
        profile,
        tnc,
        items: { productItems, ...fields },
        address
      } = values
      setSubmitting(true)

      const data = queryParamsHelper(
        {
          ...profile,
          account: null,
          ...productItems,
          ...tnc,
          ...extraData,
          customFields: queryParamsHelper({
            ...address,
            ...extraData?.customFields,
            ...fields
          })
        },
        [],
        ['productItems', 'customFields']
      )

      if (isEdit) {
        updateItem({
          id: fromDetailView ? invoiceId : id,
          data
        })
      } else {
        addItem(data)
      }
    },
    [addItem, values, fromDetailView, invoiceId, id, updateItem, isEdit]
  )

  useEffect(() => {
    if (
      values.profile &&
      values.items &&
      values.tnc &&
      values.address &&
      !isSubmitting
    ) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [values])

  const handleFormValid = useCallback(
    entity => isValid => {
      setFormValid(v => ({
        ...v,
        [entity]: isValid
      }))
    },
    []
  )

  const handleEditSubmit = useCallback(
    entity => _values => {
      let data = {
        ..._values
      }

      if (_values.addressData) {
        let addresses = [_values.addressData]
        data = {
          ...data,
          ...addressToBillingShipping(addresses)
        }
      }
      delete data.address
      delete data.addressData

      setValues(v => ({
        ...v,
        [entity]: data
      }))
    },
    []
  )

  const handleConflictConfirm = values => {
    handleSubmit({
      values
    })
  }

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
        h: 27,
        i: 'profile_card',
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
        x: 1,
        y: 0,
        w: 3,
        h: 35,
        i: 'product_items',
        autoHeight: true
      },
      {
        x: 1,
        y: 35,
        w: 3,
        h: 15,
        i: 'term_condition',
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
          isFetching={isFetching}
          onEditSubmit={handleEditSubmit('profile')}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          initialValidationSchema={initialValidationSchema}
          initialValue={initialValues}
          disabledFields={disabledFields}
          onChangeFormValid={handleFormValid('profile')}
          onBlur={handleBlur('profile')}
        />
      ),
      address_card: (
        <AddressCard
          name="address"
          values={item?.customFields}
          onEditSubmit={handleEditSubmit('address')}
          onlyBillingAndShipping
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          returnDataOnBlur
          onBlur={handleBlur('address')}
          isShippingValidate
        />
      ),
      product_items: (
        <InvoiceItemsCard
          item={item}
          onEditSubmit={handleEditSubmit('items')}
          disabledEdit
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          addresses={localValues?.address}
          onChangeFormValid={handleFormValid('items')}
          account={localValues?.profile?.account || item?.account}
        />
      ),
      term_condition: (
        <TermAndConditionCard
          name="termsAndConditions"
          text={
            isEdit
              ? item?.termsAndConditions
              : invoiceTnc?.[0]?.termsAndCondition
          }
          onSubmit={handleEditSubmit('tnc')}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
        />
      )
    }),
    [
      initialValues,
      handleEditSubmit,
      isResetClick,
      isSubmitClick,
      invoiceTnc,
      disabledFields,
      isEdit,
      item,
      isFetching,
      localValues?.address,
      handleBlur,
      handleFormValid,
      localValues?.profile
    ]
  )

  const handleSubmitClick = () => {
    setSubmitClick(true)
  }

  return (
    <SideModal
      width={'100%'}
      title={`${isEdit ? 'Edit' : 'Create'} an Invoice`}
      headerClassName={classes.sideModalHeader}
      closeLink={closeLink || parseToAbsolutePath(routes.invoices[view])}
      footerLayout={
        <FormFooterLayout
          onSubmit={handleSubmitClick}
          isPending={isSubmitting}
          onReset={() => setResetClick(true)}
          isUpdate={isEdit}
          opaqueSubmit={Object.values(formValid).includes(false)}
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
      {isConflictModalOpen && (
        <ConflictModal
          title="Address Conflict"
          open={isConflictModalOpen}
          data={conflictData}
          values={conflictDefaultValues}
          onClose={handleConflictClose}
          onSubmit={handleConflictConfirm}
        />
      )}
    </SideModal>
  )
}

export default AddEditInvoice
