import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { FroalaWysiwygEditor } from '..'
import { DIVIDER, froalaToolbarNames } from 'constants/froalaConstants'
import {
  insertTemplateCommand,
  loadEmailAttachmentCommand,
  pageColorPopup
} from '../FroalaWysiwygEditor/config'
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
import { simulateEvent } from 'utils/formik'
import classNames from 'classnames'
import { Card } from 'components/cards'
import { TextWithTooltip } from 'components/typography'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { TemplateModal } from 'components/modals'
import { templateEntityValues } from 'constants/templateConstants'
import useUser from 'hooks/useUser'

const useStyles = makeStyles(({ typography, type }) => ({
  root: {
    position: 'relative',
    width: '100%'
  },
  fileInput: {
    display: 'none'
  },
  editorRoot: ({ paddingBottom }) => ({
    '& .fr-wrapper': {
      paddingBottom,

      '& p': {
        backgroundColor: 'transparent !important'
      },

      '& .fr-iframe': {
        minHeight: 300
      }
    }
  }),
  attachmentRoot: {
    position: 'absolute',
    padding: '0px 20px',
    bottom: 20,
    left: 0,
    width: '100%',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  attachmentCard: {
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  attachmentTitle: {
    flexGrow: 1,
    width: 'fit-content',
    ...typography.darkAccent[type]
  },
  cancelIcon: {
    color: typography.lightText[type].color,
    fontSize: 14,
    cursor: 'pointer'
  }
}))

pageColorPopup()

const FormControlEmailEditor = ({
  attachmentName,
  attachmentValue,
  onChange,
  supportedFormats,
  formControlContainerClass,
  name,
  hideAttachment = false,
  hideTemplate = false,
  config,
  value,
  disabled,
  readOnly,
  readOnlyWithoutSelection,
  rootClassName,
  isEdit = false,
  ...props
}) => {
  const fileRef = useRef()
  const [templateModal, setTemplateModal] = useState(false)
  const templateRef = useRef()
  const { data: user } = useUser()

  const paddingBottom = useMemo(() => {
    return attachmentValue?.length * 52 + 20
  }, [attachmentValue])

  const classes = useStyles({ paddingBottom })

  useEffect(() => {
    if (!hideAttachment) {
      loadEmailAttachmentCommand(function () {
        if (fileRef.current) {
          fileRef.current.click()
        }
      })
    }
  }, [hideAttachment])

  useEffect(() => {
    if (!hideTemplate) {
      insertTemplateCommand(function () {
        setTemplateModal(true)
        templateRef.current = this
      })
    }
  }, [hideTemplate])

  useEffect(() => {
    if (
      !isEdit &&
      user?.userSignature &&
      !disabled &&
      !readOnly &&
      !readOnlyWithoutSelection
    ) {
      const doc = new DOMParser().parseFromString(value, 'text/html')
      if (
        !doc.querySelector('.signature') &&
        !doc.querySelector('[fr-original-class=signature]')
      ) {
        onChange(
          simulateEvent(
            name,
            `${value || ''}<p></p><p></p><div class="signature"><p>---</p>${
              user?.userSignature
            }</div>`
          )
        )
      }
    }
    //eslint-disable-next-line
  }, [value, user?.userSignature])

  const emailConfig = useMemo(
    () => ({
      ...config,
      toolbarButtons: {
        moreText: {
          buttons: [
            froalaToolbarNames.bold,
            froalaToolbarNames.italic,
            froalaToolbarNames.underline,
            froalaToolbarNames.strikeThrough,
            DIVIDER,
            froalaToolbarNames.fontFamily,
            froalaToolbarNames.fontSize,
            froalaToolbarNames.textColor,
            froalaToolbarNames.backgroundColor,
            DIVIDER,
            froalaToolbarNames.paragraphFormat,
            froalaToolbarNames.align,
            froalaToolbarNames.formatOL,
            froalaToolbarNames.formatUL,
            froalaToolbarNames.outdent,
            froalaToolbarNames.indent,
            DIVIDER,
            ...(hideTemplate ? [] : [froalaToolbarNames.insertTemplate]),
            froalaToolbarNames.fontAwesome,
            froalaToolbarNames.insertImage,
            froalaToolbarNames.insertLink,
            froalaToolbarNames.emoticons,
            ...(hideAttachment ? [] : [froalaToolbarNames.insertAttachment]),

            DIVIDER,
            froalaToolbarNames.getPDF,
            froalaToolbarNames.codeView
          ],
          buttonsVisible: 22
        }
      },
      useClasses: false
    }),
    [hideAttachment, hideTemplate, config]
  )

  const handleChangeFile = useCallback(
    ({ target: { files } }) => {
      if (files.length) {
        onChange(
          simulateEvent(attachmentName, [...(attachmentValue || []), ...files])
        )
      }
    },
    [attachmentName, attachmentValue, onChange]
  )

  const handleRemoveAttachment = useCallback(
    index => () => {
      const files = [...attachmentValue] || []
      files.splice(index, 1)
      onChange(simulateEvent(attachmentName, files))
    },
    [attachmentName, attachmentValue, onChange]
  )

  const handleCloseModal = () => {
    setTemplateModal(false)
    templateRef.current = null
  }

  const handleSelectModal = ({ template }) => {
    if (templateRef.current) {
      templateRef.current.html.set(template)
      onChange(simulateEvent(name, template))
    }
    handleCloseModal()
  }

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <FroalaWysiwygEditor
        config={emailConfig}
        onChange={onChange}
        formControlContainerClass={classNames(
          classes.editorRoot,
          formControlContainerClass
        )}
        name={name}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        {...props}
      />
      <input
        type="file"
        onChange={handleChangeFile}
        className={classes.fileInput}
        ref={fileRef}
        accept={supportedFormats.map(({ ext }) => ext).join(', ')}
      />
      <div className={classes.attachmentRoot}>
        {attachmentValue.map((file, index) => (
          <Card
            rootClassName={classes.attachmentCard}
            key={`email-attachment-${index}`}
          >
            <TextWithTooltip
              rootClassName={classes.attachmentTitle}
              maxWidth={'100%'}
            >
              {file.name}
            </TextWithTooltip>
            <i
              className={classNames(
                getIconClassName(iconNames.cancel),
                classes.cancelIcon
              )}
              onClick={handleRemoveAttachment(index)}
            />
          </Card>
        ))}
      </div>
      <TemplateModal
        open={templateModal}
        onClose={handleCloseModal}
        onSelect={handleSelectModal}
        entity={templateEntityValues.email}
      />
    </div>
  )
}

FormControlEmailEditor.defaultProps = {
  attachmentValue: [],
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

export default FormControlEmailEditor
