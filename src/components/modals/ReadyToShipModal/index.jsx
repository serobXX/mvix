import { useCallback, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { DefaultModal } from '..'
import { useLazyGetInvoiceByIdQuery } from 'api/invoiceApi'
import Scrollbars from 'components/Scrollbars'
import { CircularLoader } from 'components/loaders'
import RowAccordion from './RowAccordion'
import { useFormik } from 'formik'
import Yup from 'utils/yup'
import { requiredField } from 'constants/validationMessages'
import { _get } from 'utils/lodash'
import { useAddLabelMutation } from 'api/shippingApi'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'

const useStyles = makeStyles(({ palette, type }) => ({
  modalContent: {
    background: palette[type].body.background
  }
}))

const initialValues = {
  shippingGroup: []
}

const validationSchema = Yup.object().shape({
  shippingGroup: Yup.array().of(
    Yup.object().shape({
      rateId: Yup.string().required(requiredField),
      itemGroupId: Yup.string().required(requiredField),
      package: Yup.object()
    })
  )
})

const ReadyToShipModal = ({
  title = 'Ready to Ship',
  open,
  onClose,
  onSuccess,
  data
}) => {
  const classes = useStyles()
  const [getById, { data: invoice, isFetching }] = useLazyGetInvoiceByIdQuery()
  const initialFetchValue = useRef(initialValues)
  const [openedAccordion, setOpenAccordion] = useState(0)

  const [postLabel, labelReducer] = useAddLabelMutation()

  useNotifyAnalyzer({
    entityName: 'Invoice Shipment',
    watchArray: [labelReducer],
    labels: [notifyLabels.add],
    onSuccess
  })

  const onSubmit = useCallback(
    values => {
      const data = {
        invoiceId: invoice?.id,
        shippingGroup: values.shippingGroup.map(({ rateId, itemGroupId }) => ({
          rateId,
          itemGroupId
        }))
      }
      postLabel(data)
    },
    [invoice?.id, postLabel]
  )

  const { values, errors, touched, handleChange, setValues, handleSubmit } =
    useFormik({
      initialValues: initialFetchValue.current,
      validationSchema,
      onSubmit
    })

  useEffect(() => {
    if (data?.id) {
      getById(data?.id, true)
    }
    //eslint-disable-next-line
  }, [data?.id])

  useEffect(() => {
    if (invoice?.itemGroups?.length) {
      initialFetchValue.current = {
        shippingGroup: invoice.itemGroups.map(item => ({
          ...item,
          rateId: '',
          itemGroupId: item.id,
          package: {}
        }))
      }
      setOpenAccordion(0)
      setValues(initialFetchValue.current)
    }
    //eslint-disable-next-line
  }, [invoice?.itemGroups])

  const handleChangeAccordion = index => (_, open) => {
    if (open) {
      setOpenAccordion(index)
    } else {
      setOpenAccordion(-1)
    }
  }

  return (
    <DefaultModal
      modalTitle={title}
      open={open}
      onCloseModal={onClose}
      onClickSave={handleSubmit}
      maxWidth="xl"
      contentClass={classes.modalContent}
      buttonPrimaryDisabled={labelReducer?.isLoading}
    >
      <Scrollbars autoHeight autoHeightMin={'min(700px, calc(100vh - 200px))'}>
        {isFetching && <CircularLoader />}
        {values.shippingGroup.map((item, index) => (
          <RowAccordion
            invoice={invoice}
            item={item}
            key={`shipping-group-${item?.itemGroupId}`}
            open={openedAccordion === index}
            onChangeAccordion={handleChangeAccordion}
            index={index}
            isLast={values.shippingGroup?.length === index + 1}
            name={`shippingGroup.${index}`}
            values={_get(values, `shippingGroup.${index}`, {})}
            errors={_get(errors, `shippingGroup.${index}`, {})}
            touched={_get(touched, `shippingGroup.${index}`, {})}
            onChange={handleChange}
            hideAccordion={
              !getCustomFieldValueByCode(
                invoice,
                customFieldNames.shipToMultiple
              )
            }
          />
        ))}
      </Scrollbars>
    </DefaultModal>
  )
}

export default ReadyToShipModal
