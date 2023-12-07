import { useFormik } from 'formik'
import * as Yup from 'yup'

import FileUpload from 'components/FileUpload'
import Scrollbars from 'components/Scrollbars'
import Spacing from 'components/containers/Spacing'
import { DefaultModal } from 'components/modals'
import { ToggleTab } from 'components/tabs'
import {
  fileFormat,
  fileSize,
  requiredField,
  requiredFile,
  validUrl
} from 'constants/validationMessages'
import {
  AVI,
  BMP,
  CSV,
  GIF,
  JPEG,
  JPG,
  JSON,
  MP3,
  MP4,
  OGG,
  PDF,
  PNG,
  SVG,
  TEXT_XML,
  WAV,
  WEBM,
  XML
} from 'constants/mimeTypes'
import { FormControlInput } from 'components/formControls'
import { simpleUrlRegExp } from 'constants/regExp'
import { isTruthy } from 'utils/generalUtils'
import useUrlContentValidation from 'hooks/useUrlContentValidation'
import { simulateEvent } from 'utils/formik'
import { fileUploadTabValues, fileUploadTabs } from 'constants/fileUpload'

const fileFormats = [
  PDF,
  JPEG,
  JPG,
  PNG,
  BMP,
  GIF,
  SVG,
  MP3,
  OGG,
  WAV,
  WEBM,
  MP4,
  AVI,
  CSV,
  JSON,
  XML,
  TEXT_XML
]

const initialValues = {
  type: fileUploadTabValues.upload,
  link: '',
  file: null,
  name: ''
}

const validationSchema = Yup.object().shape({
  file: Yup.mixed()
    .when('type', {
      is: fileUploadTabValues.upload,
      then: () =>
        Yup.mixed()
          .required(requiredFile)
          .test('fileFormat', fileFormat, value => {
            return (
              value &&
              value[0] &&
              fileFormats.map(({ mime }) => mime).includes(value[0].type)
            )
          })
          .test('fileSize', fileSize('5MB'), value => {
            return value && value[0] && value[0].size <= 5242880
          })
    })
    .nullable(),
  link: Yup.string().when('type', {
    is: fileUploadTabValues.url,
    then: () => Yup.string().required(requiredField).url(validUrl)
  }),
  name: Yup.string().required(requiredField).nullable()
})

const AddAttachmentModal = ({ open = false, onUpload, onClose }) => {
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
    onSubmit: onUpload
  })

  const isUrlValid = useUrlContentValidation({
    url: values.link,
    errors,
    setFieldError,
    path: 'link',
    isFetchAllowed: isTruthy(
      values.type === fileUploadTabValues.url,
      values.link,
      simpleUrlRegExp.test(values.link)
    ),
    allowedDataMimeTypes: fileFormats.map(({ mime }) => mime)
  })

  const handleClose = () => {
    onClose()
    handleReset()
  }

  const handleChangeTab = (_, tab) => {
    if (tab) {
      setFieldValue('type', tab)
    }
  }

  const handleChangeFile = e => {
    const {
      target: { value }
    } = e
    handleChange(e)
    if (value?.length) {
      handleChange(simulateEvent('name', value?.[0]?.name))
    }
  }

  return (
    <DefaultModal
      open={open}
      buttonPrimaryText="Upload"
      onClickSave={handleSubmit}
      onCloseModal={handleClose}
      modalTitle="Add Attachment"
      buttonPrimaryDisabled={!isUrlValid}
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
            name="file"
            files={values.file}
            supportedFormats={fileFormats}
            error={errors.file}
            touched={touched.file}
            onChange={handleChangeFile}
            onBlur={handleBlur}
          />
        )}
        {values.type === fileUploadTabValues.url && (
          <FormControlInput
            name="link"
            label="File Url"
            value={values.link}
            error={errors.link}
            touched={touched.link}
            onChange={handleChange}
            onBlur={handleBlur}
            type="link"
            fullWidth
          />
        )}
        <FormControlInput
          name="name"
          label="File Name"
          value={values.name}
          error={errors.name}
          touched={touched.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
        />
      </Scrollbars>
    </DefaultModal>
  )
}

export default AddAttachmentModal
