import { useCallback } from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'

import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import {
  CheckboxSwitcher,
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput,
  FormControlReactSelect,
  FormControlSelectSubject,
  FormControlSelectTag
} from 'components/formControls'
import { Text } from 'components/typography'
import { priorityOptions } from 'constants/activity'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getUserOptions } from 'utils/autocompleteOptions'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'
import { tagEntityType } from 'constants/tagConstants'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  grayHeader: {
    margintTop: 10,
    marginBottom: 10,
    marginLeft: '-18px',
    marginRight: '-18px',
    backgroundColor: palette[type].detailPage.profileCard.footer.background,
    padding: '10px 9px 10px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    '& p': {
      ...typography.darkText[type]
    }
  }
}))

const TaskForm = ({
  name,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  rootClassName,
  grayHeaderClassName,
  hideToggle,
  ownerPrioritySingleRow
}) => {
  const classes = useStyles()

  const getFieldName = useCallback(
    fieldName => {
      if (name) {
        return `${name}.${fieldName}`
      }
      return fieldName
    },
    [name]
  )

  const getFieldData = useCallback(
    (data, fieldName) => {
      if (name) {
        return _get(data, `${name}.${fieldName}`)
      }
      return data[fieldName]
    },
    [name]
  )

  return (
    <Spacing variant={0} rootClassName={rootClassName}>
      <div className={classNames(classes.grayHeader, grayHeaderClassName)}>
        <Text>Follow Up Task</Text>
        {!hideToggle && (
          <CheckboxSwitcher
            name={getFieldName(`isActive`)}
            value={getFieldData(values, 'isActive')}
            onChange={handleChange}
          />
        )}
      </div>
      <Container cols="1" isFormContainer>
        <FormControlDatePicker
          name={getFieldName(`dueDate`)}
          value={getFieldData(values, 'dueDate')}
          label={`Due Date`}
          onChange={handleChange}
          onBlur={handleBlur}
          error={getFieldData(errors, 'dueDate')}
          touched={getFieldData(touched, 'dueDate')}
          startAdornmentIcon={getIconClassName(
            iconNames.date,
            iconTypes.duotone
          )}
          marginBottom={false}
          disabled={getFieldData(values, 'isActive') === false}
        />
        <FormControlSelectSubject
          name={getFieldName(`subject`)}
          value={getFieldData(values, 'subject')}
          label={'Subject'}
          onChange={handleChange}
          onBlur={handleBlur}
          error={getFieldData(errors, 'subject')}
          touched={getFieldData(touched, 'subject')}
          marginBottom={false}
          fullWidth
          disabled={getFieldData(values, 'isActive') === false}
          isRequired
        />
        <FormControlInput
          name={getFieldName(`description`)}
          value={getFieldData(values, 'description')}
          label={`Activity Notes`}
          onChange={handleChange}
          onBlur={handleBlur}
          error={getFieldData(errors, 'description')}
          touched={getFieldData(touched, 'description')}
          marginBottom={false}
          fullWidth
          multiline
          disabled={getFieldData(values, 'isActive') === false}
          isRequired
        />
        <Container cols={ownerPrioritySingleRow ? 2 : 1} isFormContainer>
          <FormControlAutocomplete
            name={getFieldName(`relatedTo`)}
            value={getFieldData(values, 'relatedTo')}
            label={`Task Owner`}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldData(errors, 'relatedTo')}
            touched={getFieldData(touched, 'relatedTo')}
            startAdornmentIcon={getIconClassName(
              iconNames.salesPerson,
              iconTypes.duotone
            )}
            marginBottom={false}
            getOptions={getUserOptions(null, null, { passIdForNumber: true })}
            disabled={getFieldData(values, 'isActive') === false}
            initialFetchValue={getFieldData(values, 'relatedTo')}
            withPortal
          />
          <FormControlReactSelect
            name={getFieldName(`priority`)}
            value={getFieldData(values, 'priority')}
            label={`Priority`}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldData(errors, 'priority')}
            touched={getFieldData(touched, 'priority')}
            startAdornmentIcon={getIconClassName(
              iconNames.newBusiness,
              iconTypes.duotone
            )}
            marginBottom={false}
            options={priorityOptions}
            disabled={getFieldData(values, 'isActive') === false}
            withPortal
          />
          <FormControlSelectTag
            label="Tag"
            name={getFieldName(`tag`)}
            values={getFieldData(values, 'tag')}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getFieldData(errors, 'tag')}
            touched={getFieldData(touched, 'tag')}
            entityType={tagEntityType.activity}
            isOptional
            startAdornmentIcon={getIconClassName(
              iconNames.tag,
              iconTypes.duotone
            )}
            disabled={getFieldData(values, 'isActive') === false}
            marginBottom={false}
          />
        </Container>
      </Container>
    </Spacing>
  )
}

export default TaskForm
