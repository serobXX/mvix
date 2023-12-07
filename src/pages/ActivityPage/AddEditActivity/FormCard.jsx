import { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'

import GridCardBase from 'components/cards/GridCardBase'
import Container from 'components/containers/Container'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlDateTimeRangePicker,
  FormControlInput,
  FormControlRadioIconButton,
  FormControlReactSelect,
  FormControlSelectSubject,
  FormControlSelectTag
} from 'components/formControls'
import {
  activityEntityAutoComplete,
  activityEntityOptions,
  activityStatusOptions,
  activityStatusValues,
  activityTypeOptions,
  activityTypeValues,
  priorityOptions
} from 'constants/activity'
import iconNames, { iconTypes } from 'constants/iconNames'
import { tagEntityType } from 'constants/tagConstants'
import { getUserOptions } from 'utils/autocompleteOptions'
import { simulateEvent } from 'utils/formik'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type }) => ({
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  cardWrapper: {
    width: '100%',
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
  cardContentRoot: {
    background: 'transparent',
    border: 'none'
  },
  activityNotesInput: {
    height: '125px !important'
  }
}))

const FormCard = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  disabledFields,
  hideRelatedFields,
  isEdit
}) => {
  const classes = useStyles()

  const handleChangeRelatedEntity = useCallback(
    e => {
      handleChange(e)
      handleChange(simulateEvent('relatedToId', ''))
    },
    [handleChange]
  )

  const handleChangeType = useCallback(
    e => {
      handleChange(e)
      if (!isEdit) {
        if (e.target.value === activityTypeValues.call)
          handleChange(
            simulateEvent('activityStatus', activityStatusValues.completed)
          )
        else {
          if (values.activityStatus === activityStatusValues.completed) {
            handleChange(
              simulateEvent('activityStatus', activityStatusValues.notStarted)
            )
          }
        }
      }
    },
    [handleChange, values.activityStatus, isEdit]
  )

  return (
    <GridCardBase
      cardWrapperClassName={classes.cardWrapper}
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      removeScrollbar
      removeSidePaddings
    >
      <Container alignItems="flex-start" isFormContainer>
        <FormControlRadioIconButton
          name="activityType"
          value={values.activityType}
          error={errors.activityType}
          touched={touched.activityType}
          onChange={handleChangeType}
          formControlContainerClass={classes.stretch}
          options={activityTypeOptions}
          disabled={disabledFields.includes('activityType')}
          marginBottom={false}
          fullWidth
        />
        {values.activityType === activityTypeValues.meeting ? (
          <FormControlDateTimeRangePicker
            startDateTimeName="startedAt"
            endDateTimeName="endedAt"
            startDateTimeLabel="Start On"
            endDateTimeLabel="End On"
            values={values}
            errors={errors}
            onChange={handleChange}
            touched={touched}
            formControlContainerClass={classes.stretch}
            fullWidth
            marginBottom={false}
            inputProps={{
              startAdornmentIcon: getIconClassName(
                iconNames.date,
                iconTypes.duotone
              )
            }}
          />
        ) : (
          <>
            <FormControlDatePicker
              label="Due Date"
              name="dueDate"
              value={values.dueDate}
              error={errors.dueDate}
              touched={touched.dueDate}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabledFields.includes('dueDate')}
              marginBottom={false}
              startAdornmentIcon={getIconClassName(
                iconNames.date,
                iconTypes.duotone
              )}
              fullWidth
            />
            <div></div>
          </>
        )}
        <FormControlSelectSubject
          label={'Subject'}
          name="subject"
          value={values.subject}
          error={errors.subject}
          touched={touched.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          formControlContainerClass={classes.stretch}
          marginBottom={false}
          disabled={disabledFields.includes('subject')}
          fullWidth
          isRequired
        />
        <FormControlInput
          label={'Activity Notes'}
          name="description"
          value={values.description}
          error={errors.description}
          touched={touched.description}
          onChange={handleChange}
          onBlur={handleBlur}
          formControlContainerClass={classes.stretch}
          formControlInputClass={classes.activityNotesInput}
          multiline
          fullWidth
          disabled={disabledFields.includes('description')}
          marginBottom={false}
        />
        <FormControlAutocomplete
          label="Task Owner"
          name="relatedTo"
          value={values.relatedTo}
          error={errors.relatedTo}
          touched={touched.relatedTo}
          onChange={handleChange}
          onBlur={handleBlur}
          getOptions={getUserOptions(undefined, undefined, {
            passIdForNumber: true
          })}
          initialFetchValue={values.relatedTo}
          marginBottom={false}
          disabled={disabledFields.includes('relatedTo')}
          startAdornmentIcon={getIconClassName(
            iconNames.salesPerson,
            iconTypes.duotone
          )}
          uniqueOptions
          fullWidth
        />
        <FormControlReactSelect
          label="Priority"
          name="priority"
          value={values.priority}
          error={errors.priority}
          touched={touched.priority}
          onChange={handleChange}
          onBlur={handleBlur}
          options={priorityOptions}
          disabled={disabledFields.includes('priority')}
          startAdornmentIcon={getIconClassName(
            iconNames.activityPriority,
            iconTypes.duotone
          )}
          marginBottom={false}
          fullWidth
        />
        {!hideRelatedFields && (
          <>
            <FormControlReactSelect
              label="Associated Entity"
              name="relatedToEntity"
              value={values.relatedToEntity}
              error={errors.relatedToEntity}
              touched={touched.relatedToEntity}
              options={activityEntityOptions}
              onChange={handleChangeRelatedEntity}
              onBlur={handleBlur}
              disabled={disabledFields.includes('relatedToEntity')}
              startAdornmentIcon={getIconClassName(
                iconNames.relatedEntity,
                iconTypes.duotone
              )}
              marginBottom={false}
              fullWidth
              isSort={false}
              withPortal
            />
            <FormControlAutocomplete
              label={`${values.relatedToEntity} Name`}
              name="relatedToId"
              value={values.relatedToId}
              error={errors.relatedToId}
              touched={touched.relatedToId}
              getOptions={activityEntityAutoComplete[values.relatedToEntity]}
              onChange={handleChange}
              onBlur={handleBlur}
              optionsDependency={values.relatedToEntity}
              disabled={disabledFields.includes('relatedToId')}
              staticOptions={
                values.relatedToIdOption ? [values.relatedToIdOption] : []
              }
              marginBottom={false}
              startAdornmentIcon={getIconClassName(
                iconNames.relatedRecord,
                iconTypes.duotone
              )}
              fullWidth
              uniqueOptions
              isRequired
            />
          </>
        )}
        <FormControlReactSelect
          label="Activity Status"
          name="activityStatus"
          value={values.activityStatus}
          error={errors.activityStatus}
          touched={touched.activityStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          options={activityStatusOptions}
          disabled={disabledFields.includes('activityStatus')}
          marginBottom={false}
          startAdornmentIcon={getIconClassName(
            iconNames.leadStatus,
            iconTypes.duotone
          )}
          fullWidth
        />
        <FormControlSelectTag
          label="Tag"
          name="tag"
          values={values.tag}
          error={errors.tag}
          touched={touched.tag}
          onChange={handleChange}
          onBlur={handleBlur}
          entityType={tagEntityType.activity}
          isOptional
          startAdornmentIcon={getIconClassName(
            iconNames.tag,
            iconTypes.duotone
          )}
          fullWidth
          marginBottom={false}
        />
      </Container>
    </GridCardBase>
  )
}

export default FormCard
