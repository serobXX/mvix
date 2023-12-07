import { useEffect, useState } from 'react'
import {
  CircularProgress,
  ClickAwayListener,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'
import { FLASH_DURATION } from 'constants/previewModal'
import { Resizable } from 're-resizable'
import Draggable from 'react-draggable'

const useStyles = makeStyles(({ palette, type }) => ({
  screenPreviewModalWrap: {
    position: 'relative'
  },
  screenPreviewModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    minWidth: '52px',
    minHeight: '56px',
    border: 'none',
    boxShadow: `0 2px 4px 0 ${palette[type].modal.shadow}`,
    zIndex: 1300,
    animation: '$tvFlicker 0.5s infinite alternate'
  },
  '@keyframes tvFlicker': {
    '0%': { boxShadow: '0 0 100px 0 rgba(225, 235, 255, 0.4)' },
    '100%': { boxShadow: '0 0 60px 0 rgba(200, 220, 255, 0.6)' }
  },
  backDrop: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    background: palette[type].dialog.overlay,
    zIndex: 1299
  },
  childrenWrap: {
    cursor: 'pointer'
  },
  progress: {
    color: '#1c5dca'
  },
  screenWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: '7px',
    backgroundImage: 'linear-gradient(240deg, #111 50%, #333 100%)'
  },
  screenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    backgroundColor: 'black',
    content: '""',
    transition: 'opacity 2s',
    backgroundImage: 'linear-gradient(240deg, #111 50%, #333 100%)',
    borderRadius: '8px'
  },
  frameMask: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    filter: 'brightness(2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  frameEntryVisible: {
    animation: `$enable linear ${FLASH_DURATION}ms`
  },
  frameExitVisible: {
    animation: `$enable linear ${FLASH_DURATION}ms`,
    animationDirection: 'reverse'
  },
  screen: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    width: 'calc(100% - 24px)',
    height: 'calc(100% - 24px)',
    backgroundColor: 'black'
  },
  screenInnerBorder: {
    display: 'flex',
    height: '100%',
    width: '100%',
    borderTop: '2px solid #272727',
    borderRight: '2px solid #202020',
    borderLeft: '2px solid #161616',
    borderBottom: '2px solid #181818',
    overflow: 'hidden',
    position: 'relative'
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  controls: {
    position: 'absolute',
    top: '-18px',
    right: '1px',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: '18px 18px 0 18px',
    backgroundColor: '#111',
    gap: '11px'
  },
  controlsFullScreen: {
    top: '20px',
    right: '22px',
    transition: 'all 0.4s ease',
    borderRadius: '18px'
  },
  controlsFullScreenWithSettings: {
    right: '322px'
  },
  controlsItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: palette[type].card.greyHeader.color,
    padding: '2px',
    transition: 'opacity .25s ease, color .25s ease',
    height: '20px',
    width: '20px',
    '& svg': {
      height: 20,
      width: 20
    },
    '& i': {
      fontSize: 20
    },
    '&.draggable-handle': {
      cursor: 'move',
      '&:hover': {
        cursor: 'move'
      }
    },
    '&:hover, &.is-active': {
      cursor: 'pointer',
      color: '#3f51b5'
    },
    '&.is-disable': {
      color: 'inherit',
      opacity: '0.5',
      cursor: 'default !important'
    }
  },
  lastControlItem: {
    padding: '2.5px',
    '& svg': {
      width: '16px',
      height: '16px'
    }
  },
  lightIcon: {
    animation: '$pulse linear 4s infinite'
  },
  '@keyframes pulse': {
    '0%, 20%': {
      color: palette[type].card.greyHeader.color
    },
    '30%': {
      color: 'black'
    },
    '40%, 60%': {
      color: palette[type].card.greyHeader.color
    },
    '70%': {
      color: 'white'
    },
    '80%, 100%': {
      color: palette[type].card.greyHeader.color
    }
  },
  '@keyframes enable': {
    '0%': {
      opacity: 1,
      height: '2px',
      width: '10%'
    },
    '60%': {
      height: '2px',
      width: '100%'
    },
    '80%': {
      height: '50%'
    },
    '100%': {
      opacity: 1,
      height: '100%',
      width: '100%'
    }
  },
  removeMarginLeft: {
    marginLeft: 0
  },
  orientationIcon: {
    fontSize: 22,

    '&:hover': {
      transform: 'rotate(180deg)',
      transition: '0.9s'
    }
  },
  modalContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    position: 'relative',
    '&::before': {
      content: '',
      display: 'block',
      position: 'absolute',
      bottom: '3%',
      left: '36%',
      height: '0.5%',
      width: '28%',
      background: '#ddd',
      borderRadius: '50%',
      boxShadow: '0 0 3px 0 white'
    }
  },
  modalLoader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 200
  },
  refreshContainer: {
    pointerEvents: 'none',
    position: 'relative',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity .4s ease',
    '& > i': {
      transform: 'rotateZ(180deg)',
      color: '#74809A',
      fontSize: '64px',
      cursor: 'pointer',
      transition: 'transform .6s ease'
    }
  },
  refreshContainerVisible: {
    pointerEvents: 'all',
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    '& > i': {
      transform: 'rotateZ(0deg)'
    }
  },
  widthHolder: {
    content: "''",
    width: '100%'
  }
}))

const PreviewModalBase = ({
  isVisible,
  isLoading,
  isFullScreen,
  onClickAway,
  setModalPosition,
  updatedModalPosition,
  dimensions,
  controls,
  content,
  isClosing,
  onResizeStart,
  onResize,
  onResizeStop
}) => {
  const classes = useStyles()
  const [initialized, setInitialized] = useState(false)
  const [entryAnimationVisible, setEntryAnimationVisible] = useState(false)
  const [exitAnimationVisible, setExitAnimationVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setEntryAnimationVisible(true)
      setTimeout(() => {
        setInitialized(true)
        setEntryAnimationVisible(false)
      }, FLASH_DURATION)
    }
  }, [isVisible])

  useEffect(() => {
    if (isClosing) {
      setInitialized(false)
      setExitAnimationVisible(true)
      setTimeout(() => {
        setExitAnimationVisible(false)
      }, FLASH_DURATION)
    }
    // eslint-disable-next-line
  }, [isClosing])

  return (
    <div className={classes.screenPreviewModalWrap}>
      {isVisible && (
        <>
          <div className={classes.backDrop}>
            <ClickAwayListener onClickAway={onClickAway}>
              <Draggable
                disabled={isFullScreen}
                handle=".draggable-handle"
                onStop={(e, data) => setModalPosition({ x: data.x, y: data.y })}
                position={updatedModalPosition}
                bounds={'parent'}
              >
                <div
                  className={classes.screenPreviewModal}
                  style={{ marginTop: isFullScreen ? '0' : '18px' }}
                >
                  <Resizable
                    enable={{
                      top: !isFullScreen,
                      right: !isFullScreen,
                      bottom: !isFullScreen,
                      left: !isFullScreen,
                      topRight: !isFullScreen,
                      bottomRight: !isFullScreen,
                      bottomLeft: !isFullScreen,
                      topLeft: !isFullScreen
                    }}
                    maxWidth={window.innerWidth}
                    maxHeight={window.innerHeight}
                    size={{
                      width: dimensions.width,
                      height: dimensions.height
                    }}
                    onResizeStart={onResizeStart}
                    onResize={onResize}
                    onResizeStop={onResizeStop}
                  >
                    <div className={classes.modal}>
                      <div className={classes.modalContent}>
                        <div className={classes.screenWrapper}>
                          {controls && (
                            <div
                              className={classNames(classes.controls, {
                                [classes.controlsFullScreen]: isFullScreen,
                                [classes.controlsFullScreenWithSettings]:
                                  isFullScreen
                              })}
                            >
                              {controls}
                            </div>
                          )}
                          <div className={classes.screen}>
                            <div className={classes.screenInnerBorder}>
                              {isLoading ? (
                                <div className={classes.modalLoader}>
                                  <CircularProgress
                                    size={30}
                                    thickness={5}
                                    className={classes.progress}
                                  />
                                </div>
                              ) : (
                                <>
                                  <div
                                    className={classNames(classes.frameMask, {
                                      [classes.frameEntryVisible]:
                                        entryAnimationVisible,
                                      [classes.frameExitVisible]:
                                        exitAnimationVisible
                                    })}
                                  />
                                  {!isClosing && initialized && content}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Resizable>
                </div>
              </Draggable>
            </ClickAwayListener>
          </div>
        </>
      )}
    </div>
  )
}

export default PreviewModalBase
