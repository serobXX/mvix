import { makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import Yup from 'utils/yup'

import { FormControlInput } from 'components/formControls'
import { DefaultModal } from '../'
import { requiredField } from 'constants/validationMessages'

const useStyles = makeStyles(() => ({
  textareaInput: {
    height: '400px'
  }
}))

const initialValues = {
  changes: ''
}

const validationSchema = Yup.object().shape({
  changes: Yup.string().required(requiredField)
})

const RequestChangesModal = ({ open, onClose, onSave }) => {
  const classes = useStyles()
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: onSave
    })

  return (
    <DefaultModal
      open={open}
      modalTitle="Request Changes"
      onCloseModal={onClose}
      onClickSave={handleSubmit}
      maxWidth="xs"
    >
      <FormControlInput
        name="changes"
        label="Changes"
        value={values.changes}
        error={errors.changes}
        touched={touched.changes}
        onChange={handleChange}
        onBlur={handleBlur}
        formControlInputClass={classes.textareaInput}
        multiline={true}
        fullWidth
      />
    </DefaultModal>
  )
}

export default RequestChangesModal
