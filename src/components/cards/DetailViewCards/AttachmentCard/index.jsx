import { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { EmptyPlaceholder } from 'components/placeholder'
import GridCardBase from '../../GridCardBase'
import Icon from 'components/icons/Icon'
import AddAttachmentModal from './AddAttachmentModal'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { TextWithTooltip } from 'components/typography'
import { CircleIconButton } from 'components/buttons'
import { isValidUrl } from 'utils/urlUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(
  ({ palette, typography, type, fontSize, lineHeight, colors }) => ({
    cardRoot: {
      display: 'flex',
      flexDirection: 'column',
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    cardContentRoot: {
      flexGrow: 1
    },
    cardContentWrap: {
      height: '100%',
      padding: 0,
      flexWrap: 'nowrap'
    },
    addIcon: {
      ...typography.darkText[type],
      fontSize: fontSize.big
    },
    rowRoot: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5px 20px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    rowTextRoot: {
      flexGrow: 1,
      display: 'flex'
    },
    rowText: {
      ...typography.darkText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary
    },
    iconBtnRoot: {
      display: 'flex'
    },
    iconButton: {
      '& i': {
        color: typography.lightText[type].color,
        fontSize: 18
      }
    }
  })
)

const AttachmentCard = ({
  parentId,
  items,
  post,
  del,
  addAttachment,
  deleteAttachment
}) => {
  const classes = useStyles()
  const [addModalOpen, setAddModalOpen] = useState(false)

  const handleAdd = () => {
    setAddModalOpen(true)
  }

  const handleClose = () => {
    setAddModalOpen(false)
  }

  useNotifyAnalyzer({
    entityName: 'Attachment',
    watchArray: [post, del],
    labels: [notifyLabels.upload, notifyLabels.delete],
    onSuccess: handleClose
  })

  const handleUpload = useCallback(
    ({ file, link, name }) => {
      let data
      if (file) {
        data = new FormData()
        data.append('file', file[0])
        data.append('name', name)
      } else {
        data = {
          link,
          name
        }
      }
      addAttachment({
        parentId,
        data
      })
    },
    [addAttachment, parentId]
  )

  const handleDownload =
    (url, fileName = 'file') =>
    () => {
      if (isValidUrl(url)) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.click()
          })
          .catch(console.error)
      }
    }

  const handleDeleteFile = id => () => {
    deleteAttachment({
      parentId,
      id
    })
  }

  return (
    <GridCardBase
      title="Attachments"
      dropdown={false}
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      contentWrapClassName={classes.cardContentWrap}
      iconButtonComponent={
        <Icon
          icon={getIconClassName(iconNames.gridCardAdd)}
          onClick={handleAdd}
          className={classes.addIcon}
        />
      }
    >
      {items.length ? (
        items.map(({ attachmentLink, name, id }) => (
          <div key={`attachment-${id}`} className={classes.rowRoot}>
            <div className={classes.rowTextRoot}>
              <TextWithTooltip maxWidth={190} rootClassName={classes.rowText}>
                {name || attachmentLink}
              </TextWithTooltip>
            </div>
            <div className={classes.iconBtnRoot}>
              {attachmentLink && isValidUrl(attachmentLink) && (
                <CircleIconButton
                  className={classes.iconButton}
                  onClick={handleDownload(attachmentLink, name)}
                >
                  <i className={getIconClassName(iconNames.download)} />
                </CircleIconButton>
              )}
              <CircleIconButton
                className={classes.iconButton}
                onClick={handleDeleteFile(id)}
              >
                <i className={getIconClassName(iconNames.delete2)} />
              </CircleIconButton>
            </div>
          </div>
        ))
      ) : (
        <EmptyPlaceholder
          text="No Attachments"
          requestText="Click to upload files"
          variant="small"
          onClick={handleAdd}
        />
      )}
      {addModalOpen && (
        <AddAttachmentModal
          open={addModalOpen}
          onClose={handleClose}
          onUpload={handleUpload}
        />
      )}
    </GridCardBase>
  )
}

AttachmentCard.defaultProps = {
  items: [],
  post: {},
  put: {},
  del: {},
  addAttachment: f => f,
  updateAttachment: f => f,
  delAttachment: f => f
}

export default AttachmentCard
