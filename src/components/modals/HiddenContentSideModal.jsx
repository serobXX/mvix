import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { SideModal } from 'components/modals'
import iconNames from 'constants/iconNames'
import { useEffect, useState } from 'react'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  modalInner: ({ width }) => ({
    width: `${width} !important`
  }),
  modalOpened: {
    transition:
      '0.3s width, transform 250ms cubic-bezier(0, 0, 0.2, 1) 0ms !important'
  },
  panelModalWidth: ({ afterWidth }) => ({
    width: `${afterWidth} !important`
  }),
  container: {
    display: 'flex',
    gap: 16
  },
  panelRoot: {
    display: 'flex',
    height: 627
  },
  hiddenPanel: {
    opacity: '0',
    visibility: 'hidden',
    width: 0,
    transition: '0.3s opacity, 0.3s visibility, 0.3s width'
  },
  hiddenPanelVisible: {
    opacity: 1,
    visibility: 'visible',
    width: '452px'
  },
  arrow: ({ isPanelVisible }) => ({
    width: '21px',
    height: 60,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    background: palette[type].card.background,
    color: typography.lightText[type].color,
    margin: 'auto 0px',
    marginLeft: isPanelVisible ? 0 : '-16px',
    boxShadow:
      'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
  })
}))

const HiddenContentSideModal = ({
  width,
  afterWidth,
  children,
  containerClassName,
  hiddenComponent,
  panelRootClassName,
  hiddenPanelVisibleClassName,
  ...props
}) => {
  const [isPanelVisible, setPanelVisible] = useState(false)
  const [isModalOpened, setModalOpened] = useState(false)
  const classes = useStyles({
    width,
    afterWidth,
    isPanelVisible
  })

  useEffect(() => {
    setTimeout(() => setModalOpened(true), [1000])
  }, [])

  return (
    <SideModal
      innerClassName={classNames(classes.modalInner, {
        [classes.modalOpened]: isModalOpened,
        [classes.panelModalWidth]: isPanelVisible
      })}
      {...props}
    >
      <div className={classNames(classes.container, containerClassName)}>
        {children}
        <div className={classNames(classes.panelRoot, panelRootClassName)}>
          <div
            className={classNames(classes.hiddenPanel, {
              [classes.hiddenPanelVisible]: isPanelVisible,
              [hiddenPanelVisibleClassName]: isPanelVisible
            })}
          >
            {hiddenComponent}
          </div>
          <div
            className={classes.arrow}
            onClick={() => setPanelVisible(v => !v)}
          >
            <i
              className={getIconClassName(
                isPanelVisible ? iconNames.arrowLeft : iconNames.arrowRight
              )}
            />
          </div>
        </div>
      </div>
    </SideModal>
  )
}

export default HiddenContentSideModal
