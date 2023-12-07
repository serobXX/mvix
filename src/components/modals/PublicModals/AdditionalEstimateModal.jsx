import { makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import Yup from 'utils/yup'

import { FormControlInput } from 'components/formControls'
import { DefaultModal } from '../'
import { requiredField } from 'constants/validationMessages'
import { useEffect } from 'react'

const useStyles = makeStyles(() => ({
  textareaInput: {
    height: '400px'
  }
}))

const initialValues = {
  subject: '',
  changes: ''
}

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(requiredField),
  changes: Yup.string().required(requiredField)
})

const AdditionalEstimateModal = ({
  open,
  onClose,
  onSubmit,
  initialValues: parentValues
}) => {
  const classes = useStyles()
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    if (parentValues) {
      setValues({
        ...values,
        ...parentValues
      })
    }
    //eslint-disable-next-line
  }, [parentValues])

  return (
    <DefaultModal
      open={open}
      modalTitle="Additional Estimates"
      onCloseModal={onClose}
      onClickSave={handleSubmit}
      maxWidth="sm"
    >
      <FormControlInput
        name="subject"
        label="Subject"
        value={values.subject}
        error={errors.subject}
        touched={touched.subject}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
      />
      <FormControlInput
        name="changes"
        label="Description"
        value={values.changes}
        error={errors.changes}
        touched={touched.changes}
        onChange={handleChange}
        onBlur={handleBlur}
        formControlInputClass={classes.textareaInput}
        placeholder={
          'Please describe additional project requirements to assist us in creating additional estimates'
        }
        multiline={true}
        fullWidth
      />
    </DefaultModal>
  )
}

export default AdditionalEstimateModal
