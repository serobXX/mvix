import { useCallback, useEffect, useRef } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Card from '../Card'
import { Text } from 'components/typography'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import {
  DATE_TIME_VIEW_FORMAT,
  NORMAL_DATE_FORMAT
} from 'constants/dateTimeFormats'
import { FormControlInput } from 'components/formControls'
import { activityFieldNames } from 'constants/activity'
import { requiredField } from 'constants/validationMessages'
import TaskForm from './TaskForm'
import useUser from 'hooks/useUser'
import { convertArr, fromChipObj } from 'utils/select'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  cardWrapper: {
    width: '100%',
    height: '100%',
    cursor: 'default'
  },
  cardRoot: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '25px 18px',
    overflow: 'hidden',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  header: {
    height: 50,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',

    '& i': {
      color: colors.highlight,
      fontSize: 18
    },
    '& p': {
      fontStyle: 'italic'
    }
  },
  internalNotesRoot: {
    marginTop: 10
  },
  internalNotesInput: {
    height: '100px !important'
  },
  taskFormRoot: {
    marginBottom: 15
  }
}))

const initialValues = entity => ({
  internalNotes: '',
  activity: {
    isActive: false,
    [activityFieldNames.dueDate]: '',
    [activityFieldNames.subject]: '',
    [activityFieldNames.description]: '',
    [activityFieldNames.relatedTo]: '',
    [activityFieldNames.priority]: 'Normal',
    [activityFieldNames.activityStatus]: 'Not started',
    [activityFieldNames.activityType]: 'Task',
    [activityFieldNames.relatedToEntity]: entity,
    [activityFieldNames.tag]: []
  }
})

const validationSchema = Yup.object().shape({
  internalNotes: Yup.string().nullable(),
  activity: Yup.object().shape({
    isActive: Yup.bool(),
    [activityFieldNames.dueDate]: Yup.string()
      .when('isActive', {
        is: true,
        then: () => Yup.string().required(requiredField)
      })
      .nullable(),
    [activityFieldNames.subject]: Yup.string()
      .when('isActive', {
        is: true,
        then: () => Yup.string().required(requiredField)
      })
      .nullable(),
    [activityFieldNames.description]: Yup.string()
      .when('isActive', {
        is: true,
        then: () => Yup.string().required(requiredField)
      })
      .nullable(),
    [activityFieldNames.relatedTo]: Yup.string()
      .when('isActive', {
        is: true,
        then: () => Yup.string().required(requiredField)
      })
      .nullable(),
    [activityFieldNames.priority]: Yup.string()
      .when('isActive', {
        is: true,
        then: () => Yup.string().required(requiredField)
      })
      .nullable()
  })
})
const activityField = 'activity'

const AddTaskCard = ({
  internalNotes = '',
  onSubmit,
  isSubmitClick,
  isResetClick,
  entity,
  hideInternalNote = false,
  values: valuesFromParent
}) => {
  const classes = useStyles()
  const user = useUser()
  const tz = momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()

  const initialFormValues = useRef(initialValues(entity))

  const onSubmitValues = useCallback(
    ({ activity, ...values }) => {
      const data = {
        ...values,
        activity: {
          ...activity,
          tag: convertArr(activity.tag, fromChipObj)
        }
      }
      onSubmit(data)
    },
    [onSubmit]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit,
    handleReset
  } = useFormik({
    initialValues: initialFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit: onSubmitValues
  })

  useEffect(() => {
    if (isSubmitClick) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      handleReset()
    }
    //eslint-disable-next-line
  }, [isResetClick])

  useEffect(() => {
    if (user?.data?.id) {
      initialFormValues.current = {
        ...initialFormValues.current,
        activity: {
          ...initialFormValues.current.activity,
          [activityFieldNames.relatedTo]: user?.data?.id,
          [activityFieldNames.dueDate]: moment()
            .add(2, 'days')
            .format(NORMAL_DATE_FORMAT)
        }
      }
      setValues(initialFormValues.current)
    }
    //eslint-disable-next-line
  }, [user])

  useEffect(() => {
    if (internalNotes) {
      initialFormValues.current = {
        ...initialFormValues.current,
        internalNotes
      }
      setValues(initialFormValues.current)
    }
    //eslint-disable-next-line
  }, [internalNotes])

  useEffect(() => {
    if (valuesFromParent) {
      setValues({
        ...values,
        activity: {
          ...values.activity,
          ...valuesFromParent
        }
      })
    }
    //eslint-disable-next-line
  }, [valuesFromParent])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card rootClassName={classes.cardRoot} dropdown={false} icon={false}>
        <div className={classes.header}>
          <i className={getIconClassName(iconNames.clock)} />
          <Text>{`${moment().format(DATE_TIME_VIEW_FORMAT)} ${tz}`}</Text>
        </div>
        <div className={classes.internalNotesRoot}>
          {!hideInternalNote && (
            <FormControlInput
              label="Activity Notes"
              name="internalNotes"
              fullWidth
              multiline
              formControlInputClass={classes.internalNotesInput}
              value={values.internalNotes}
              onChange={handleChange}
            />
          )}
        </div>
        <TaskForm
          name={activityField}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          rootClassName={classes.taskFormRoot}
          ownerPrioritySingleRow
        />
      </Card>
    </Grid>
  )
}

export default AddTaskCard
