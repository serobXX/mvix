import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import moment from 'moment'
import * as Yup from 'yup'

import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { HiddenContentSideModal } from 'components/modals'
import { requiredField } from 'constants/validationMessages'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import {
  useAddActivityMutation,
  useLazyGetActivityByIdQuery,
  useUpdateActivityMutation
} from 'api/activityApi'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import queryParamsHelper from 'utils/queryParamsHelper'
import {
  endDateValidationSchema,
  startDateValidationSchema
} from 'constants/validation'
import {
  BACKEND_DATE_FORMAT,
  BACKEND_DATE_TIME_FORMAT,
  NORMAL_DATE_TIME_AP_FORMAT
} from 'constants/dateTimeFormats'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import FormCard from './FormCard'
import ReminderCard from './ReminderCard'
import useUser from 'hooks/useUser'
import { activityEntityType, activityTypeValues } from 'constants/activity'
import { AddTaskCard } from 'components/cards'
import { simulateEvent } from 'utils/formik'

const useStyles = makeStyles(({ palette, type }) => ({
  sideModalHeader: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  sideModalScrollbar: {
    background: palette[type].body.background
  },
  container: {
    display: 'grid',
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    gridTemplateColumns: '470px auto'
  },
  sideModalPanelRoot: ({ fromDetailView }) => ({
    height: fromDetailView ? 455 : 515
  })
}))

const initialValues = {
  relatedTo: '',
  startedAt: '',
  endedAt: '',
  activityType: activityTypeValues.task,
  activityStatus: 'Not started',
  priority: 'Normal',
  dueDate: '',
  subject: '',
  relatedToEntity: activityEntityType.lead,
  relatedToId: '',
  description: '',
  reminders: [],
  tag: []
}

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(requiredField),
  description: Yup.string().nullable(),
  activityType: Yup.string().required(requiredField),
  activityStatus: Yup.string().required(requiredField),
  dueDate: Yup.string().when('activityType', {
    is: type => type !== activityTypeValues.meeting,
    then: () => Yup.string().required(requiredField)
  }),
  priority: Yup.string().required(requiredField),
  relatedTo: Yup.string().required(requiredField),
  relatedToEntity: Yup.string().required(requiredField),
  relatedToId: Yup.string().required(requiredField),
  startedAt: startDateValidationSchema('endedAt')
    .when('activityType', {
      is: activityTypeValues.meeting,
      then: () => startDateValidationSchema('endedAt').required(requiredField)
    })
    .nullable(),
  endedAt: endDateValidationSchema('startedAt')
    .when('activityType', {
      is: activityTypeValues.meeting,
      then: () => endDateValidationSchema('startedAt').required(requiredField)
    })
    .nullable(),
  reminders: Yup.array().of(
    Yup.object().shape({
      reminderType: Yup.string().required(requiredField),
      reminderUnit: Yup.string().required(requiredField),
      reminderTime: Yup.number().required(requiredField).min(1, requiredField)
    })
  )
})

const AddEditActivity = ({
  closeLink,
  fromDetailView = false,
  hideRelatedFields = false
}) => {
  const { id, activityId, view } = useParams()
  const location = useLocation()
  const classes = useStyles({ fromDetailView })
  const initiFormValues = useRef(initialValues)
  const navigate = useNavigate()
  const [disabledFields, setDisabledFields] = useState([])
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)

  const [isSubmitting, setSubmitting] = useState(false)
  const { data: user } = useUser()

  const [getItemById, { data: item }] = useLazyGetActivityByIdQuery()
  const [addActivity, post] = useAddActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.add
  })
  const [updateActivity, put] = useUpdateActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.update
  })

  const isEdit = fromDetailView ? !!activityId : !!id

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      const { tag, startedAt, endedAt, activity } = values
      const data = queryParamsHelper({
        ...values,
        relatedToIdOption: null,
        dueDate:
          values.activityType === activityTypeValues.meeting
            ? moment(startedAt, NORMAL_DATE_TIME_AP_FORMAT).format(
                BACKEND_DATE_TIME_FORMAT
              )
            : values.dueDate,
        startedAt:
          startedAt &&
          moment(startedAt, NORMAL_DATE_TIME_AP_FORMAT).format(
            BACKEND_DATE_TIME_FORMAT
          ),
        endedAt:
          endedAt &&
          moment(endedAt, NORMAL_DATE_TIME_AP_FORMAT).format(
            BACKEND_DATE_TIME_FORMAT
          ),
        tag: convertArr(tag, fromChipObj),
        ...(activity?.isActive
          ? {
              activity: {
                ...activity,
                relatedToEntity: values.relatedToEntity,
                relatedToId: values.relatedToId
              }
            }
          : { activity: null })
      })
      if (isEdit) {
        updateActivity({ id: fromDetailView ? activityId : id, data })
      } else {
        addActivity(data)
      }
    },
    [isEdit, addActivity, updateActivity, id, activityId, fromDetailView]
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
    setFieldError,
    validateForm
  } = useFormik({
    initialValues: initiFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    // eslint-disable-next-line
  }, [])

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
    if (location.state && !isEdit) {
      initiFormValues.current = {
        ...initiFormValues.current,
        ...location.state
      }
      setDisabledFields(Object.keys(location.state))
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [location.state])

  useEffect(() => {
    if (!isEdit) {
      initiFormValues.current = {
        ...initiFormValues.current,
        relatedTo: user?.id,
        dueDate: moment().format(BACKEND_DATE_FORMAT)
      }
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [user?.id])

  useEffect(() => {
    if (fromDetailView ? activityId : id) {
      getItemById(fromDetailView ? activityId : id)
    }
    //eslint-disable-next-line
  }, [id, activityId])

  useEffect(() => {
    if (item) {
      const {
        relatedTo,
        startedAt,
        endedAt,
        activityType,
        activityStatus,
        priority,
        dueDate,
        subject,
        relatedToEntity,
        relatedItem,
        description,
        reminders,
        tag
      } = item
      initiFormValues.current = {
        ...initiFormValues.current,
        relatedTo: relatedTo?.id,
        relatedToIdOption: {
          label: getTitleBasedOnEntity(relatedToEntity, relatedItem),
          value: relatedItem?.id
        },
        startedAt: startedAt
          ? moment(startedAt, BACKEND_DATE_TIME_FORMAT).format(
              NORMAL_DATE_TIME_AP_FORMAT
            )
          : '',
        endedAt: endedAt
          ? moment(endedAt, BACKEND_DATE_TIME_FORMAT).format(
              NORMAL_DATE_TIME_AP_FORMAT
            )
          : '',
        activityType,
        activityStatus,
        priority,
        dueDate,
        subject,
        relatedToEntity,
        relatedToId: relatedItem?.id,
        description,
        reminders,
        tag: convertArr(tag, tagToChipObj)
      }
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(closeLink || parseToAbsolutePath(routes.activity[view]))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  const handleTaskSubmit = useCallback(
    ({ activity }) => {
      handleChange(simulateEvent('activity', activity))
      handleSubmit()
    },
    [handleChange, handleSubmit]
  )

  const handleResetValues = () => {
    handleReset()
    setResetClick(true)
  }

  const parseTitle = useMemo(() => {
    if (values.activityType === activityTypeValues.task) {
      return `${isEdit ? 'Edit' : 'Create'} a Task`
    } else if (values.activityType === activityTypeValues.call) {
      return 'Log a Call'
    } else if (values.activityType === activityTypeValues.meeting) {
      return 'Schedule a Meeting'
    } else {
      return `${isEdit ? 'Edit' : 'Add'} an Activtiy`
    }
  }, [values.activityType, isEdit])

  const handleSubmitValues = useCallback(() => {
    if (values.activityType === activityTypeValues.task) {
      handleSubmit()
    }
    setSubmitClick(true)
  }, [handleSubmit, values.activityType])

  const followUpTaskValues = useMemo(
    () => ({
      subject: values.subject
    }),
    [values.subject]
  )

  return (
    <HiddenContentSideModal
      width="500px"
      afterWidth="980px"
      title={parseTitle}
      headerClassName={classes.sideModalHeader}
      closeLink={closeLink || parseToAbsolutePath(routes.activity[view])}
      panelRootClassName={classes.sideModalPanelRoot}
      footerLayout={
        <FormFooterLayout
          onSubmit={handleSubmitValues}
          isPending={isSubmitting}
          opaqueSubmit={!isValid}
          onReset={handleResetValues}
          isUpdate={isEdit}
        />
      }
      scrollbarClassName={classes.sideModalScrollbar}
      containerClassName={classes.container}
      hiddenComponent={
        values.activityType === activityTypeValues.call ? (
          <AddTaskCard
            onSubmit={handleTaskSubmit}
            isSubmitClick={isSubmitClick}
            isResetClick={isResetClick}
            values={followUpTaskValues}
            hideInternalNote
          />
        ) : (
          <ReminderCard
            name="reminders"
            values={values.reminders}
            errors={errors.reminders}
            touched={touched.reminders}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
        )
      }
    >
      <FormCard
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabledFields={disabledFields}
        hideRelatedFields={hideRelatedFields}
        isEdit={isEdit}
      />
    </HiddenContentSideModal>
  )
}

export default AddEditActivity
