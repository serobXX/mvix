import { memo, useCallback } from 'react'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  DialogContent,
  withStyles
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import classNames from 'classnames'

import { BlueButton, WhiteButton } from 'components/buttons'
import { Text } from 'components/typography'
import useEscKeyDownListener from 'hooks/useEscKeyDownListener'
import PropTypes from 'constants/propTypes'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const styles = ({ palette, type, spacing }) => ({
  backdrop: {
    background: palette[type].dialog.overlay
  },
  container: {
    background: palette[type].body.background,
    boxShadow: palette[type].dialog.shadow
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: palette[type].dialog.header.background,
    borderBottom: `solid 1px ${palette[type].dialog.border}`,
    padding: '10px 20px 5px 20px',
    height: palette[type].dialog.header.height
  },
  title: {
    color: palette[type].dialog.title
  },
  close: {
    width: '46px',
    height: '46px',
    margin: '0px',
    padding: '0px',
    color: palette[type].dialog.closeButton,
    marginLeft: 'auto'
  },
  content: {
    background: palette[type].dialog.background,
    padding: '10px 20px 0px',
    minHeight: '77px'
  },
  contentPaddingNormal: {
    paddingLeft: spacing(4),
    paddingRight: spacing(4)
  },
  actionBar: {
    display: 'flex',
    background: palette[type].dialog.header.background,
    borderTop: `solid 1px ${palette[type].dialog.border}`,
    padding: '0 20px',
    height: '55px',
    margin: '0'
  },
  overflowHeader: {
    borderRadius: '8px 8px 0 0'
  },
  overflowVisible: {
    overflow: 'visible'
  },
  overflowFooter: {
    overflow: 'visible',
    borderRadius: '0 0 8px 8px'
  }
})

const DefaultModal = ({
  hasCloseIcon = true,
  modalTitle = '',
  classes,
  isSaveLoad = false,
  onClickSave = f => f,
  onCloseModal = f => f,
  children,
  contentClass,
  open = false,
  actions,
  hasCancelBtn = true,
  hasSaveBtn = true,
  isUpdate = false,
  maxWidth = 'sm',
  buttonPrimaryText = 'Save',
  buttonSecondaryText = 'Cancel',
  buttonPrimaryIcon = getIconClassName(iconNames.save),
  buttonSecondaryIcon = getIconClassName(iconNames.cancel),
  useDialogContent = true,
  withActions = true,
  titleComponent = '',
  headerClassName = '',
  footerClassName = '',
  containerClassName = '',
  rootClassName = '',
  overflowVisible,
  buttonPrimaryOpaque,
  buttonPrimaryDisabled,
  contentPaddingVariant = 'small'
}) => {
  const handleSave = useCallback(() => {
    onClickSave()
  }, [onClickSave])

  useEscKeyDownListener(onCloseModal)
  return (
    <Dialog
      classes={{
        paper: classNames(
          classes.container,
          { [classes.overflowVisible]: overflowVisible },
          containerClassName
        ),
        root: rootClassName
      }}
      open={open}
      maxWidth={maxWidth}
      disableEnforceFocus
      disableEscapeKeyDown
      BackdropProps={{
        className: classes.backdrop
      }}
      fullWidth
    >
      <DialogTitle
        className={classNames(
          classes.header,
          { [classes.overflowHeader]: overflowVisible },
          headerClassName
        )}
        disableTypography
      >
        {modalTitle && (
          <Grid item container direction="column">
            <Text
              variant="big"
              weight="bold"
              rootClassName={classes.title}
              component="h2"
            >
              {modalTitle}
            </Text>
          </Grid>
        )}

        {titleComponent}

        {hasCloseIcon ? (
          <IconButton className={classes.close} onClick={onCloseModal}>
            <CloseIcon />
          </IconButton>
        ) : (
          ''
        )}
      </DialogTitle>

      {useDialogContent ? (
        <DialogContent
          className={classNames(
            contentClass,
            {
              [classes.overflowVisible]: overflowVisible,
              [classes.contentPaddingNormal]: contentPaddingVariant === 'normal'
            },
            classes.content
          )}
        >
          {children}
        </DialogContent>
      ) : (
        children
      )}

      {withActions && (
        <>
          {actions ? (
            <DialogActions
              className={classNames(
                classes.actionBar,
                { [classes.overflowFooter]: overflowVisible },
                footerClassName
              )}
            >
              {actions}
            </DialogActions>
          ) : (
            <DialogActions
              className={classNames(
                classes.actionBar,
                { [classes.overflowFooter]: overflowVisible },
                footerClassName
              )}
            >
              {' '}
              {hasCancelBtn && (
                <WhiteButton
                  onClick={onCloseModal}
                  variant={buttonSecondaryText === 'Cancel' ? 'danger' : ''}
                  iconClassName={buttonSecondaryIcon}
                >
                  {buttonSecondaryText}
                </WhiteButton>
              )}
              {hasSaveBtn && (
                <BlueButton
                  onClick={handleSave}
                  iconClassName={buttonPrimaryIcon}
                  progress={isSaveLoad}
                  opaque={buttonPrimaryOpaque}
                  disabled={buttonPrimaryDisabled}
                >
                  {!isUpdate ? buttonPrimaryText : 'Update'}
                </BlueButton>
              )}
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  )
}

DefaultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  modalTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  inputPlaceholder: PropTypes.string,
  onClickSave: PropTypes.func,
  onCloseModal: PropTypes.func,
  buttonPrimaryText: PropTypes.string,
  buttonSecondaryText: PropTypes.string,
  buttonPrimaryIcon: PropTypes.string,
  buttonSecondaryIcon: PropTypes.string,
  useDialogContent: PropTypes.bool,
  headerClassName: PropTypes.string,
  rootClassName: PropTypes.string,
  actions: PropTypes.node,
  hasCancelBtn: PropTypes.bool,
  hasSaveBtn: PropTypes.bool,
  overflowVisible: PropTypes.bool,
  withActions: PropTypes.bool,
  buttonPrimaryOpaque: PropTypes.bool,
  buttonPrimaryDisabled: PropTypes.bool,
  contentPaddingVariant: PropTypes.oneOf(['small', 'normal'])
}

export default memo(withStyles(styles)(DefaultModal))
