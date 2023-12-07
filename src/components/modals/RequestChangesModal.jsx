import { makeStyles } from '@material-ui/core'
import moment from 'moment'

import Scrollbars from 'components/Scrollbars'
import { DefaultModal } from '.'
import Accordion from 'components/Accordion'
import { Text } from 'components/typography'
import { DATE_TIME_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { EmptyPlaceholder } from 'components/placeholder'

const useStyles = makeStyles(() => ({
  scrollbarRoot: {
    height: '400px !important',
    maxHeight: 'calc(100vh - 140px)'
  },
  modalContent: {
    padding: 0
  },
  itemsRoot: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '20px'
  },
  text: {
    whiteSpace: 'pre'
  }
}))

const RequestChangesModal = ({ open, onClose, items }) => {
  const classes = useStyles()
  return (
    <DefaultModal
      open={open}
      onCloseModal={onClose}
      withActions={false}
      modalTitle="Requested Changes"
      maxWidth="md"
      contentClass={classes.modalContent}
    >
      <Scrollbars className={classes.scrollbarRoot}>
        {!!items?.length ? (
          <div className={classes.itemsRoot}>
            {items.map(({ changes, createdAt }, index) => (
              <Accordion
                key={`request-changes-${index}`}
                title={moment(createdAt).format(DATE_TIME_VIEW_FORMAT)}
                initialOpen={index === 0}
              >
                <Text rootClassName={classes.text}>{changes}</Text>
              </Accordion>
            ))}
          </div>
        ) : (
          <EmptyPlaceholder
            text="No Requested Changes"
            variant="small"
            fullHeight
          />
        )}
      </Scrollbars>
    </DefaultModal>
  )
}

export default RequestChangesModal
