import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { DefaultModal } from 'components/modals'
import Scrollbars from 'components/Scrollbars'
import { TextWithTooltip } from 'components/typography'
import { EmptyPlaceholder } from 'components/placeholder'
import UserPic from 'components/UserPic'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  dialogContentRoot: {
    padding: '10px 0px'
  },
  rowRoot: {
    padding: '10px 20px',
    borderBottom: `1px solid ${palette[type].pages.dashboard.card.background}`,
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  emptyPlaceholder: {
    height: 300
  },
  rowTitle: {
    ...typography.darkAccent[type]
  }
}))

const RoleDeleteModal = ({ open, onClose, data }) => {
  const classes = useStyles()

  return (
    <DefaultModal
      modalTitle={'Related Users'}
      open={open}
      onCloseModal={onClose}
      maxWidth="xs"
      useDialogContent={false}
      hasCancelBtn={false}
      buttonPrimaryText={'Ok'}
      buttonPrimaryIcon={getIconClassName(iconNames.confirm)}
      onClickSave={onClose}
    >
      <Scrollbars autoHeight autoHeightMin={'min(450px, calc(100vh - 200px))'}>
        <div className={classes.dialogContentRoot}>
          {!data?.length ? (
            <EmptyPlaceholder
              rootClassName={classes.emptyPlaceholder}
              fullHeight
              text={'No Records Found'}
            />
          ) : (
            data.map(item => (
              <div
                className={classNames(classes.rowRoot)}
                key={`users-${item.id}`}
              >
                <UserPic
                  userName={`${item.first_name} ${item.last_name}`}
                  src={item.avatar}
                  noStatus
                  small
                />
                <TextWithTooltip
                  maxWidth={340}
                  rootClassName={classes.rowTitle}
                >
                  {`${item.first_name} ${item.last_name}`}
                </TextWithTooltip>
              </div>
            ))
          )}
        </div>
      </Scrollbars>
    </DefaultModal>
  )
}

export default RoleDeleteModal
