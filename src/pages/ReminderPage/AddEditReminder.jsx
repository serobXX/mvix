import { useCallback, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import * as Yup from 'yup'

import { SideModal } from 'components/modals'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import {
  emailField,
  numberMinimum,
  requiredField
} from 'constants/validationMessages'
import apiCacheKeys from 'constants/apiCacheKeys'
import {
  CheckboxSwitcher,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect,
  FormControlSelectSubject,
  FroalaWysiwygEditor
} from 'components/formControls'
import Container from 'components/containers/Container'
import { useFormik } from 'formik'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import {
  useAddReminderMutation,
  useLazyGetReminderByIdQuery,
  useUpdateReminderMutation
} from 'api/reminderApi'
import { statusReturnValues, statusValues } from 'constants/commonOptions'
import {
  relatedEntityOptions,
  relatedEntityType,
  remindDateOptions,
  remindDateValues,
  remindEntityOptions,
  remindEntityValues,
  remindTypeOptions,
  remindTypeValues,
  reminderName,
  senderOptions
} from 'constants/reminderConstants'
import { position } from 'constants/common'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px'
  },
  fullWidth: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  innerContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    columnGap: 16
  },
  reminderText: {
    marginTop: 10,
    '& .fr-wrapper .fr-element': {
      height: `calc(100vh - 485px) !important`
    }
  }
}))

const initialValues = {
  name: reminderName,
  relatedEntity: relatedEntityType.invoice,
  remindEntity: remindEntityValues.account,
  remindDays: '',
  remindType: remindTypeValues.before,
  condition: remindDateValues.dueDate,
  sender: senderOptions[0]?.value || '',
  reminderCC: [],
  reminderBCC: [],
  subject: '',
  reminderText: '',
  status: statusValues.active
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required(requiredField),
  relatedEntity: Yup.string().required(requiredField),
  remindEntity: Yup.string().required(requiredField),
  remindDays: Yup.number().required(requiredField).min(0, numberMinimum),
  remindType: Yup.string().required(requiredField),
  sender: Yup.string().required(requiredField),
  subject: Yup.string().required(requiredField),
  reminderText: Yup.string().required(requiredField),
  reminderCC: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().email(emailField).required(requiredField)
    })
  ),
  reminderBCC: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().email(emailField).required(requiredField)
    })
  )
})

const AddEditReminder = () => {
  const { id } = useParams()
  const classes = useStyles()
  const initialFormValues = useRef(initialValues)

  const isEdit = !!id

  const navigate = useNavigate()

  const [getById, item] = useLazyGetReminderByIdQuery()
  const [addItem, post] = useAddReminderMutation({
    fixedCacheKey: apiCacheKeys.reminder.add
  })
  const [updateItem, put] = useUpdateReminderMutation({
    fixedCacheKey: apiCacheKeys.reminder.update
  })

  const onSubmit = useCallback(
    ({ reminderCC, reminderBCC, ...values }) => {
      const data = {
        ...values,
        reminderCC: reminderCC && reminderCC.map(({ value }) => value),
        reminderBCC: reminderBCC && reminderBCC.map(({ value }) => value)
      }

      if (id) {
        updateItem({
          id,
          data
        })
      } else {
        addItem(data)
      }
    },
    [id, addItem, updateItem]
  )

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setValues,
    validateForm,
    setFieldError
  } = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: true,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (id) {
      getById(id)
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (item.isSuccess && item.data) {
      const {
        name,
        relatedEntity,
        remindEntity,
        remindDays,
        remindType,
        reminderBCC,
        reminderCC,
        sender,
        subject,
        reminderText,
        status,
        condition
      } = item.data
      initialFormValues.current = {
        name,
        relatedEntity,
        remindEntity,
        remindDays,
        remindType,
        reminderBCC: reminderBCC.map(e => ({ label: e, value: e })),
        reminderCC: reminderCC.map(e => ({ label: e, value: e })),
        sender: Array.isArray(sender) ? sender[0] : sender,
        subject,
        reminderText,
        status,
        condition
      }

      setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      navigate(parseToAbsolutePath(routes.reminder.list))
    }
    // eslint-disable-next-line
  }, [post.isSuccess, put.isSuccess])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  return (
    <SideModal
      width="57%"
      title={`${isEdit ? 'Edit' : 'Add'} Reminder`}
      closeLink={parseToAbsolutePath(routes.reminder.list)}
      footerLayout={
        <FormFooterLayout
          opaqueSubmit={!isValid}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isUpdate={isEdit}
        />
      }
    >
      <Container cols="2" rootClassName={classes.container} isFormContainer>
        <FormControlInput
          label={'Reminder Name'}
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          marginBottom={false}
          fullWidth
          isRequired
        />
        <CheckboxSwitcher
          label={'Status'}
          name="status"
          value={values.status}
          returnValues={statusReturnValues}
          onChange={handleChange}
          marginBottom={false}
          labelPosition={position.top}
        />
        <div className={classes.innerContainer}>
          <FormControlReactSelect
            label={'Reminder To'}
            name="remindEntity"
            value={values.remindEntity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.remindEntity}
            touched={touched.remindEntity}
            options={remindEntityOptions}
            marginBottom={false}
            fullWidth
          />
          <FormControlReactSelect
            label={'Reminder For'}
            name="relatedEntity"
            value={values.relatedEntity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.relatedEntity}
            touched={touched.relatedEntity}
            options={relatedEntityOptions}
            marginBottom={false}
            fullWidth
          />
        </div>
        <div className={classes.innerContainer}>
          <FormControlNumericInput
            label={'Days'}
            name="remindDays"
            value={values.remindDays}
            min={0}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.remindDays}
            touched={touched.remindDays}
            marginBottom={false}
            isRequired
          />
          <FormControlReactSelect
            label={'Type'}
            name="remindType"
            value={values.remindType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.remindType}
            touched={touched.remindType}
            options={remindTypeOptions}
            marginBottom={false}
            fullWidth
          />
          <FormControlReactSelect
            label={'Date'}
            name="condition"
            value={values.condition}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.condition}
            touched={touched.condition}
            options={remindDateOptions}
            marginBottom={false}
            fullWidth
          />
        </div>
        <Container cols="3" rootClassName={classes.fullWidth}>
          <FormControlReactSelect
            label={'From'}
            name="sender"
            value={values.sender}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.sender}
            touched={touched.sender}
            options={senderOptions}
            marginBottom={false}
            fullWidth
          />
          <FormControlReactSelect
            label={'Cc'}
            name="reminderCC"
            value={values.reminderCC}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.reminderCC ? emailField : ''}
            touched={touched.reminderCC}
            isMulti
            isSearchable
            isCreatable
            noOptionsMessage="Enter Email"
            marginBottom={false}
            fullWidth
            isOptional
            createOptionLabelText={value => `Add "${value}"`}
          />
          <FormControlReactSelect
            label={'Bcc'}
            name="reminderBCC"
            value={values.reminderBCC}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.reminderBCC ? emailField : ''}
            touched={touched.reminderBCC}
            isMulti
            isSearchable
            isCreatable
            noOptionsMessage="Enter Email"
            marginBottom={false}
            fullWidth
            isOptional
            createOptionLabelText={value => `Add "${value}"`}
          />
        </Container>
        <FormControlSelectSubject
          label={'Subject'}
          name="subject"
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.subject}
          touched={touched.subject}
          marginBottom={false}
          formControlContainerClass={classes.fullWidth}
          fullWidth
        />
        <FroalaWysiwygEditor
          name="reminderText"
          value={values.reminderText}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.reminderText}
          touched={touched.reminderText}
          formControlContainerClass={classNames(
            classes.fullWidth,
            classes.reminderText
          )}
          marginBottom={false}
          fullWidth
          hidePlaceholder
        />
      </Container>
    </SideModal>
  )
}

export default AddEditReminder
