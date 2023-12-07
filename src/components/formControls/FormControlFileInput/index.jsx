import { useCallback, useState } from 'react'

import FormControlInput from '../FormControlInput'
import { simulateEvent } from 'utils/formik'
import PropTypes from 'constants/propTypes'
import { position, tooltipTypes } from 'constants/common'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { DefaultModal } from 'components/modals'
import Scrollbars from 'components/Scrollbars'
import FileUpload from 'components/FileUpload'
import {
  CSV,
  DOC,
  DOCX,
  GIF,
  JPEG,
  JPG,
  JSON,
  MP4,
  MPGA,
  PDF,
  PNG,
  PPT,
  PPTX,
  TEXT_XML,
  TXT,
  WEBM,
  XLS,
  XLSX,
  XML
} from 'constants/mimeTypes'

const FormControlFileInput = ({
  label,
  isMulti,
  max,
  value,
  supportedFormats,
  disabled,
  name,
  onChange,
  onFocus,
  onBlur,
  fullWidth,
  touched,
  error,
  formControlContainerClass,
  marginBottom,
  fullHeight,
  isOptional,
  tooltip,
  tooltipType,
  tooltipHeader,
  labelPosition,
  startAdornment,
  startAdornmentIcon,
  endAdornment,
  endAdornmentIcon,
  readOnly,
  readOnlyWithoutSelection,
  autoFocus,
  ...props
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [files, setFiles] = useState([])

  const handleChange = useCallback(({ target: { value: _value } }) => {
    setFiles(_value)
  }, [])

  const handleClick = useCallback(() => {
    if (!readOnly) {
      setModalOpen(true)
      setFiles(value || [])
    }
  }, [value, readOnly])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setFiles([])
  }, [])

  const handleAttach = useCallback(() => {
    if (name) {
      onChange(simulateEvent(name, files))
    } else {
      onChange(name, files)
    }
    handleCloseModal()
  }, [name, files, onChange, handleCloseModal])

  return (
    <>
      <FormControlInput
        name={name}
        fullWidth={fullWidth}
        label={label}
        touched={touched}
        error={error}
        formControlContainerClass={formControlContainerClass}
        marginBottom={marginBottom}
        fullHeight={fullHeight}
        isOptional={isOptional}
        disabled={disabled}
        tooltip={tooltip}
        tooltipType={tooltipType}
        tooltipHeader={tooltipHeader}
        labelPosition={labelPosition}
        startAdornment={startAdornment}
        startAdornmentIcon={startAdornmentIcon}
        endAdornment={endAdornment}
        endAdornmentIcon={endAdornmentIcon}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={handleClick}
        value={value?.length > 1 ? `${value.length} files` : value?.[0]?.name}
        {...props}
        readOnly
      />

      {isModalOpen && (
        <DefaultModal
          open={isModalOpen}
          buttonPrimaryText="Attach"
          onClickSave={handleAttach}
          onCloseModal={handleCloseModal}
          modalTitle="Upload File"
        >
          <Scrollbars autoHeight autoHeightMax="calc(100vh - 235px)">
            <FileUpload
              name={name}
              files={files}
              supportedFormats={supportedFormats}
              onChange={handleChange}
              multiple={isMulti}
              max={max}
              isDownload
            />
          </Scrollbars>
        </DefaultModal>
      )}
    </>
  )
}

FormControlFileInput.propTypes = {
  label: PropTypes.string,
  max: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  supportedFormats: PropTypes.array,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  fullWidth: PropTypes.bool,
  touched: PropTypes.bool,
  error: PropTypes.string,
  formControlContainerClass: PropTypes.className,
  isOptional: PropTypes.bool,
  tooltip: PropTypes.string,
  tooltipType: PropTypes.string,
  tooltipHeader: PropTypes.string,
  labelPosition: PropTypes.inputFieldLabelPosition,
  isMulti: PropTypes.bool
}

FormControlFileInput.defaultProps = {
  isMulti: false,
  max: 10,
  onChange: f => f,
  onBlur: f => f,
  isOptional: false,
  tooltip: '',
  tooltipType: tooltipTypes.text,
  labelPosition: position.top,
  startAdornmentIcon: getIconClassName(iconNames.fileAttach, iconTypes.duotone),
  supportedFormats: [
    JPEG,
    JPG,
    PNG,
    PDF,
    GIF,
    WEBM,
    MPGA,
    MP4,
    CSV,
    JSON,
    XML,
    TEXT_XML,
    DOC,
    DOCX,
    PPT,
    PPTX,
    XLS,
    XLSX,
    TXT
  ]
}

export default FormControlFileInput
