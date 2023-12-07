import TaskForm from 'components/cards/AddTaskCard/TaskForm'
import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput
} from 'components/formControls'
import iconNames from 'constants/iconNames'
import { getUserOptions } from 'utils/autocompleteOptions'
import { getIconClassName } from 'utils/iconUtils'

const CardForm = ({
  values,
  title,
  errors,
  touched,
  handleChange,
  handleBlur,
  classes
}) => {
  return (
    <>
      <Spacing>
        <Container cols="1" isFormContainer>
          <FormControlDatePicker
            name="date"
            value={values.date}
            label={`${title} Date`}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.date}
            touched={touched.date}
            startAdornmentIcon={getIconClassName(iconNames.date)}
            marginBottom={false}
            minDate={null}
          />
          <FormControlAutocomplete
            name="trainedBy"
            value={values.trainedBy}
            label={`${title} By`}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.trainedBy}
            touched={touched.trainedBy}
            startAdornmentIcon={getIconClassName(iconNames.salesPerson)}
            marginBottom={false}
            getOptions={getUserOptions(null, null, { passIdForNumber: true })}
            initialFetchValue={values.trainedBy}
            isRequired
          />
          <FormControlInput
            name="note"
            value={values.note}
            label={`${title} Notes (max 100 words)`}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.note}
            touched={touched.note}
            marginBottom={false}
            fullWidth
            multiline
            isRequired
          />
        </Container>
      </Spacing>
      <TaskForm
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        hideToggle
        grayHeaderClassName={classes.grayHeader}
      />
    </>
  )
}

export default CardForm
