import { useFormik } from 'formik'
import * as Yup from 'yup'

import FileUpload from 'components/FileUpload'
import Scrollbars from 'components/Scrollbars'
import Spacing from 'components/containers/Spacing'
import { DefaultModal } from 'components/modals'
import { ToggleTab } from 'components/tabs'
import { requiredField, validUrl } from 'constants/validationMessages'
import { JPEG, JPG, PNG } from 'constants/mimeTypes'
import { FormControlInput } from 'components/formControls'
import { simpleUrlRegExp } from 'constants/regExp'
import { isTruthy } from 'utils/generalUtils'
import useUrlContentValidation from 'hooks/useUrlContentValidation'
import { fileUploadTabValues, fileUploadTabs } from 'constants/fileUpload'
import { fileUploadValidationSchema } from 'constants/validation'
import useImagePixelValidation from 'hooks/useImagePixelValidation'

const fileFormats = [JPEG, JPG, PNG]

const initialValues = {
  avatar: '',
  type: fileUploadTabValues.upload
}

const validationSchema = Yup.object().shape({
  avatar: Yup.mixed()
    .when('type', {
      is: 'upload',
      then: () =>
        fileUploadValidationSchema(fileFormats).required(requiredField),
      otherwise: () => Yup.string().required(requiredField).url(validUrl)
    })
    .nullable()
})

const AvatarUploadModal = ({ open = false, onUpload, onClose }) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldError
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: ({ avatar }) => onUpload(avatar)
  })

  const isUrlValid = useUrlContentValidation({
    url: values.type === fileUploadTabValues.upload ? '' : values.avatar,
    errors,
    setFieldError,
    path: 'avatar',
    isFetchAllowed: isTruthy(
      values.type === fileUploadTabValues.url,
      values.avatar,
      simpleUrlRegExp.test(values.avatar)
    ),
    allowedDataMimeTypes: fileFormats.map(({ mime }) => mime)
  })

  const isImageValid = useImagePixelValidation({
    files: values.type === fileUploadTabValues.upload ? values.avatar : [],
    url: values.type === fileUploadTabValues.url ? values.avatar : '',
    errors,
    setFieldError,
    path: 'avatar',
    isFetchAllowed: isTruthy(!!values.avatar),
    maxWidth: 500,
    maxHeight: 500
  })

  const handleClose = () => {
    onClose()
    handleReset()
  }

  const handleChangeTab = (_, tab) => {
    if (tab) {
      setFieldValue('type', tab)
      setFieldValue('avatar', '')
    }
  }

  return (
    <DefaultModal
      open={open}
      buttonPrimaryText="Upload"
      onClickSave={handleSubmit}
      onCloseModal={handleClose}
      modalTitle="Upload Avatar"
      buttonPrimaryDisabled={!isUrlValid || !isImageValid}
    >
      <Spacing>
        <ToggleTab
          tabs={fileUploadTabs}
          value={values.type}
          onChange={handleChangeTab}
        />
      </Spacing>

      <Scrollbars autoHeight autoHeightMax="calc(100vh - 235px)">
        {values.type === fileUploadTabValues.upload && (
          <FileUpload
            name="avatar"
            files={values.avatar}
            supportedFormats={fileFormats}
            error={errors.avatar}
            touched={touched.avatar}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
        {values.type === fileUploadTabValues.url && (
          <FormControlInput
            name="avatar"
            label="File Url"
            value={values.avatar}
            error={errors.avatar}
            touched={touched.avatar}
            onChange={handleChange}
            onBlur={handleBlur}
            type="link"
            fullWidth
          />
        )}
      </Scrollbars>
    </DefaultModal>
  )
}

export default AvatarUploadModal
