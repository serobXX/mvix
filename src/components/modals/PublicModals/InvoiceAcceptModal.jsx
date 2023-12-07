import { useFormik } from 'formik'
import Yup from 'utils/yup'

import {
  FormControlFileInput2,
  FormControlInput
} from 'components/formControls'
import { DefaultModal } from '../'
import { requiredField } from 'constants/validationMessages'
import Container from 'components/containers/Container'

const initialValues = {
  poNumber: '',
  poFile: ''
}

const validationSchema = Yup.object().shape({
  poNumber: Yup.string().test(
    'poNumberRequired',
    requiredField,
    function (value) {
      const { poFile } = this.parent
      return poFile || value
    }
  ),
  poFile: Yup.mixed().test('fileFormat', 'Only PDF file Supported', value => {
    return !value?.type || ['application/pdf'].includes(value.type)
  })
})

const InvoiceAcceptModal = ({
  title = 'Accept Invoice',
  open,
  onClose,
  onSave,
  buttonPrimaryText = 'Accept'
}) => {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: onSave
    })

  return (
    <DefaultModal
      open={open}
      modalTitle={title}
      onCloseModal={onClose}
      onClickSave={handleSubmit}
      maxWidth="xs"
      buttonPrimaryText={buttonPrimaryText}
    >
      <Container cols="1">
        <FormControlInput
          name="poNumber"
          label="PO  Number"
          value={values.poNumber}
          error={errors.poNumber}
          touched={touched.poNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          marginBottom={false}
        />
        <FormControlFileInput2
          name="poFile"
          label="PO  File"
          value={values.poFile}
          error={errors.poFile}
          touched={touched.poFile}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          isClearable
        />
      </Container>
    </DefaultModal>
  )
}

export default InvoiceAcceptModal
