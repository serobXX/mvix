import React, { useCallback, useState } from 'react'
import update from 'immutability-helper'
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { withTheme } from '@material-ui/core'

import UploadMediaSVG from '/src/assets/icons/img_drag_and_drop_upload.svg'
import { Text, ErrorText, TextWithTooltip } from 'components/typography'
import PropTypes from 'constants/propTypes'
import { simulateEvent } from 'utils/formik'
import Spacing from 'components/containers/Spacing'
import Scrollbars from 'components/Scrollbars'
import { BlueButton, WhiteButton } from 'components/buttons'
import { fileToColor, getFileExtensionFromUrl } from 'utils/fileUpload'
import { themeTypes } from 'constants/ui'
import { _uniq } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const dropzoneStatusColor = ({
  isDragActive,
  isDragAccept,
  isDragReject,
  error,
  touched,
  theme
}) => {
  if (isDragAccept) return '#00e676'
  if (isDragReject || (error && touched)) return '#f84b6a'
  if (isDragActive) return theme.colors.highlight
  return theme.colors.highlight
}

const useStyles = makeStyles(({ colors, palette, type, typography }) => ({
  dropFilesWrap: props => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '350px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderRadius: 4,
    color: colors.highlight,
    outline: 'none',
    transition: 'border .2s ease-in-out',
    cursor: `${props.noClick ? 'default' : 'pointer'}`
  }),
  dropzoneText: {
    marginTop: '20px',
    color: colors.highlight
  },
  supportedFormats: {
    color: colors.highlight
  },
  filesItemRemove: {
    marginRight: 0,
    marginLeft: 'auto',
    cursor: 'pointer',
    color: typography.lightText[type].color,
    '&:hover': {
      color: colors.highlight
    }
  },
  dropFileRoot: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  helperRoot: {
    padding: '9px 11px 16px',
    background: palette[type].helperCard.background
  },
  helperTitle: {
    color: colors.highlight,
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  helperSubtitle: {
    color: colors.highlight
  },
  fileFolderIcon: {
    color: typography.lightText[type].color
  },
  headerRoot: {
    background: palette[type].helperCard.background,
    padding: 11
  },
  fileListRoot: ({ multiple }) => ({
    padding: 11,
    display: 'flex',
    flexDirection: 'row',
    gap: 11,
    flexWrap: 'wrap',
    ...(!multiple ? { alignItems: 'center', justifyContent: 'center' } : {})
  }),
  fileCardRoot: ({ multiple }) => ({
    width: !multiple ? '50%' : '31.75%',
    position: 'relative'
  }),
  fileCardTextRoot: {
    display: 'flex',
    flewWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  fileCardSubtext: {
    fontSize: 11,
    lineHeight: '30px'
  },
  downloadIcon: {
    color: typography.lightText[type].color,
    fontSize: 12,
    lineHeight: '24px'
  },
  fileCardPreview: ({ multiple }) => ({
    height: !multiple ? 165 : 100,
    background: 'red',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  fileCardText: {
    display: 'flex',
    borderRadius: 4,
    maxWidth: '80%',
    '& p': {
      padding: '10px 20px',
      fontSize: 30,
      lineHeight: '30px',
      background: '#fff',
      margin: 0,
      textTransform: 'uppercase'
    }
  },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    cursor: 'pointer',
    color: type === themeTypes.light ? '#000' : '#fff',
    fontSize: 16
  }
}))

const FileUpload = ({
  name,
  noClick,
  multiple,
  onChange,
  onBlur,
  files,
  error,
  touched,
  customClass,
  dropZoneText,
  supportedFormats = [],
  onFileTypeError,
  theme,
  max,
  isDownload
}) => {
  const classes = useStyles({ noClick, multiple })
  const [localError, setLocalError] = useState()
  const onDrop = useCallback(
    acceptedFiles => {
      setLocalError()
      const formats = supportedFormats.map(({ mime }) => mime)
      const aFiles = acceptedFiles.filter(file => formats.includes(file.type))
      if (aFiles.length !== acceptedFiles.length) {
        setLocalError(`File Format Not Supported`)
      }
      let newFiles = multiple ? [...files, ...aFiles] : aFiles
      if (multiple && newFiles.length > max) {
        newFiles = newFiles.slice(0, max)
        setLocalError(`Max ${max} files allowed`)
      }
      onChange({ target: { name, value: newFiles } })
    },
    // eslint-disable-next-line
    [name, files, onChange, max]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    noClick,
    multiple,
    onDropRejected: files => {
      onFileTypeError(`File type ${files[0].type} is not allowed`)
    }
  })

  const handleRemoveFile = index => e => {
    e.stopPropagation()
    onChange({
      target: {
        name,
        value: update(files, {
          $splice: [[index, 1]]
        })
      }
    })
  }

  const handleCancel = e => {
    e.stopPropagation()

    onChange(simulateEvent(name, []))
  }

  const handleBlur = useCallback(() => {
    onBlur(simulateEvent(name, true))
  }, [onBlur, name])

  const handleDownloadFile = useCallback(
    file => () => {
      if (file instanceof File) {
        const filename = file.name
        const blob = new Blob([file])
        const url = URL.createObjectURL(blob)

        const aTag = document.createElement('a')
        aTag.setAttribute('href', url)
        aTag.setAttribute('download', filename)
        aTag.click()
      }
    },
    []
  )

  return (
    <Spacing>
      <div
        {...(!!files?.length
          ? { className: classNames(classes.dropFilesWrap, customClass) }
          : getRootProps({
              className: classNames(classes.dropFilesWrap, customClass)
            }))}
        style={{
          borderColor: dropzoneStatusColor({
            isDragActive,
            isDragAccept,
            isDragReject,
            error: error,
            touched: touched,
            theme
          })
        }}
        onBlur={handleBlur}
      >
        {!!files?.length && (
          <Spacing
            variant={0}
            rootClassName={classes.headerRoot}
            justifyContent="space-between"
            direction="row"
          >
            <BlueButton onClick={handleCancel}>Cancel</BlueButton>
            {multiple && (
              <WhiteButton
                iconClassName={getIconClassName(iconNames.addMore)}
                {...getRootProps()}
              >
                Add More
              </WhiteButton>
            )}
          </Spacing>
        )}
        <div className={classes.dropFileRoot}>
          <input {...getInputProps()} />
          {!!files?.length ? (
            <Scrollbars>
              <div className={classes.fileListRoot}>
                {files.map((file, index) => (
                  <div
                    className={classes.fileCardRoot}
                    key={`file-preview-${index}`}
                  >
                    <div
                      className={classes.fileCardPreview}
                      style={{ background: fileToColor(file.name) }}
                    >
                      <div className={classes.fileCardText}>
                        <p style={{ color: fileToColor(file.name) }}>
                          {getFileExtensionFromUrl(file.name).replace('.', '')}
                        </p>
                      </div>
                    </div>
                    <div className={classes.fileCardTextRoot}>
                      <TextWithTooltip
                        maxWidth={isDownload ? 140 : 250}
                        rootClassName={classes.fileCardSubtext}
                      >
                        {file.name}
                      </TextWithTooltip>
                      {isDownload && (
                        <i
                          className={classNames(
                            getIconClassName(iconNames.download),
                            classes.downloadIcon
                          )}
                          onClick={handleDownloadFile(file)}
                        />
                      )}
                    </div>
                    <i
                      className={classNames(
                        getIconClassName(iconNames.delete2),
                        classes.removeIcon
                      )}
                      onClick={handleRemoveFile(index)}
                    />
                  </div>
                ))}
              </div>
            </Scrollbars>
          ) : (
            <>
              <img src={UploadMediaSVG} alt={'Drop and Drop your here'} />
              <Text rootClassName={classes.dropzoneText}>
                {dropZoneText ? dropZoneText : 'Drop files to Upload'}
              </Text>
            </>
          )}
        </div>
        <Spacing
          variant={0}
          rootClassName={classes.helperRoot}
          justifyContent="center"
          direction="row"
          spacing={1}
        >
          <Grid item>
            <Text rootClassName={classes.helperTitle}>Supported formats:</Text>
          </Grid>
          <Grid item>
            <Text rootClassName={classes.helperSubtitle}>
              {_uniq(supportedFormats?.map(({ ext }) => ext))?.join(', ')}
            </Text>
          </Grid>
        </Spacing>
      </div>
      {!Array.isArray(error) && (
        <ErrorText
          error={error || localError}
          condition={!!(error && touched) || !!localError}
        />
      )}
    </Spacing>
  )
}

FileUpload.propTypes = {
  name: PropTypes.string,
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  noClick: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  multiple: PropTypes.bool,
  customClass: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object
  ]),
  dropZoneText: PropTypes.string,
  max: PropTypes.number
}

FileUpload.defaultProps = {
  name: '',
  files: [],
  multiple: false,
  noClick: false,
  onChange: f => f,
  onBlur: f => f,
  customClass: '',
  touched: false,
  error: '',
  max: 5
}

export default withTheme(FileUpload)
