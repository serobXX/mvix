import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormik } from 'formik'

import { DefaultModal } from 'components/modals'
import {
  FormControlAutocomplete,
  FormControlCustomField,
  FormControlReactSelect,
  FormControlSelectTag
} from 'components/formControls'
import { customFieldLookupType, entityValues } from 'constants/customFields'
import { getUserOptions } from 'utils/autocompleteOptions'
import { convertArr, fromChipObj } from 'utils/select'
import customFieldNames from 'constants/customFieldNames'
import { updateFieldName } from 'constants/library'
import { statusOptions } from 'constants/commonOptions'
import Yup from 'utils/yup'
import { requiredField } from 'constants/validationMessages'
import { getLookupOptions } from 'utils/customFieldUtils'
import { estimateStatusOptions } from 'constants/estimate'

const UpdateFieldModal = ({
  open,
  onSubmit,
  onClose,
  field = updateFieldName.tag,
  entityType,
  value,
  title,
  isCustomField,
  layout
}) => {
  const [validationSchema, setValidationSchema] = useState(Yup.object())
  const initialValues = useRef({})

  const submitValues = useCallback(
    values => {
      let data = {}
      if (isCustomField) {
        data = {
          customFields: {
            ...values
          }
        }
      } else if (field === updateFieldName.tag) {
        data = {
          tag: [...(value || []), ...convertArr(values.tag, fromChipObj)]
        }
      } else if (field === updateFieldName.owner) {
        let fieldName = customFieldNames.leadOwner
        if (entityType === entityValues.lead) {
          fieldName = customFieldNames.leadOwner
        } else if (entityType === entityValues.account) {
          fieldName = customFieldNames.accountOwner
        } else if (entityType === entityValues.contact) {
          fieldName = customFieldNames.contactOwner
        } else if (entityType === entityValues.opportunity) {
          fieldName = customFieldNames.opportunityOwner
        } else if (entityType === entityValues.estimate) {
          fieldName = customFieldNames.estimateOwner
        } else if (entityType === entityValues.ticket) {
          fieldName = 'ticketOwner'
        }
        if (isCustomField) {
          data = {
            customFields: { [fieldName]: values.owner }
          }
        } else {
          data = { [fieldName]: values.owner }
        }
      } else if (
        [updateFieldName.status, updateFieldName.estimateStatus].includes(field)
      ) {
        data = {
          status: values.status
        }
      } else if (field === updateFieldName.account) {
        data = {
          accountId: values.accountId
        }
      } else if (field === updateFieldName.stage) {
        data = {
          stageId: values.stageId
        }
      }

      onSubmit(data)
    },
    [onSubmit, entityType, field, value, isCustomField]
  )

  const { values, errors, touched, setValues, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues.current,
      validationSchema,
      enableReinitialize: true,
      onSubmit: submitValues
    })

  useEffect(() => {
    if (field) {
      initialValues.current = {
        ...(field === updateFieldName.tag ? { tag: [] } : {}),
        ...(field === updateFieldName.owner ? { owner: value } : {}),
        ...([updateFieldName.status, updateFieldName.estimateStatus].includes(
          field
        )
          ? { status: value || '' }
          : {}),
        ...(field === updateFieldName.account ? { accountId: value } : {}),
        ...(field === updateFieldName.stage ? { stageId: value } : {}),
        ...(isCustomField ? { [field]: '' } : {})
      }
      setValues(initialValues.current)

      setValidationSchema(
        Yup.object().shape({
          ...Object.keys(initialValues.current).reduce((a, b) => {
            a[b] = Yup.mixed().required(requiredField)
            return a
          }, {})
        })
      )
    }
    //eslint-disable-next-line
  }, [value, field])

  const renderField = useMemo(() => {
    if (isCustomField) {
      return (
        <FormControlCustomField
          layout={layout}
          name={field}
          value={values[field]}
          onChange={handleChange}
          error={errors[field]}
          touched={touched[field]}
        />
      )
    }
    switch (field) {
      case updateFieldName.tag:
        return (
          <FormControlSelectTag
            label="Tag"
            name="tag"
            values={values.tag}
            onChange={handleChange}
            entityType={entityType}
            withPortal
            marginBottom={false}
            fullWidth
            error={errors.tag}
            touched={touched.tag}
          />
        )
      case updateFieldName.owner:
        return (
          <FormControlAutocomplete
            label="Owner"
            name="owner"
            values={values.owner}
            onChange={handleChange}
            getOptions={getUserOptions(null, null, { passIdForNumber: true })}
            initialFetchValue={values.owner}
            withPortal
            marginBottom={false}
            fullWidth
            error={errors.owner}
            touched={touched.owner}
          />
        )
      case updateFieldName.status:
      case updateFieldName.estimateStatus:
        return (
          <FormControlReactSelect
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            marginBottom={false}
            options={
              field === updateFieldName.estimateStatus
                ? estimateStatusOptions()
                : statusOptions
            }
            fullWidth
            withPortal
            error={errors.status}
            touched={touched.status}
          />
        )
      case updateFieldName.account:
        return (
          <FormControlAutocomplete
            label="Account"
            name="accountId"
            value={values.accountId}
            onChange={handleChange}
            marginBottom={false}
            getOptions={getLookupOptions(customFieldLookupType.account)}
            initialFetchValue={values.accountId}
            fullWidth
            withPortal
            error={errors.accountId}
            touched={touched.accountId}
          />
        )
      case updateFieldName.stage:
        return (
          <FormControlAutocomplete
            label="Stage"
            name="stageId"
            value={values.stageId}
            onChange={handleChange}
            marginBottom={false}
            getOptions={getLookupOptions(customFieldLookupType.stage)}
            initialFetchValue={values.stageId}
            fullWidth
            withPortal
            error={errors.stageId}
            touched={touched.stageId}
          />
        )
      default:
        return null
    }
  }, [
    values,
    handleChange,
    entityType,
    field,
    layout,
    isCustomField,
    errors,
    touched
  ])

  return (
    <DefaultModal
      maxWidth="xs"
      modalTitle={title}
      open={open}
      onClickSave={handleSubmit}
      onCloseModal={onClose}
    >
      {renderField}
    </DefaultModal>
  )
}

export default UpdateFieldModal
