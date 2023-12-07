import { useCallback, useEffect, useMemo, useState } from 'react'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import PreviewModalBase from './PreviewModalBase'
import useWindowDimensions from 'hooks/useWindowDimensions'
import {
  FLASH_DURATION,
  landscapeDefaultDimensions
} from 'constants/previewModal'
import useEscKeyDownListener from 'hooks/useEscKeyDownListener'
import usePreviewModalFeatures from 'hooks/usePreviewModalDimentions'
import Tooltip from 'components/Tooltip'
import { _isString } from 'utils/lodash'
import { createPortal } from 'react-dom'

const useStyles = makeStyles(({ palette, type }) => ({
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
  contentRoot: {
    width: '100%',
    height: '100%',
    background: '#fff',
    overflow: 'auto',

    '& .fr-view': {
      width: '100%',
      minHeight: '100%',
      display: 'flow-root'
    },

    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#25252550',
      borderRadius: '5px'
    }
  }
}))

const controlPopupClassName = []

const PreviewModal = ({
  open,
  isLoading,
  template,
  onClose,
  controls: controlsArr
}) => {
  const classes = useStyles()
  const [isResizing, setResizing] = useState(false)
  const [isFullScreen, setFullScreen] = useState(false)
  const [dimensions, setDimensions] = useState(landscapeDefaultDimensions)
  const [oldDimensions, setOldDimensions] = useState(null)
  const [modalPosition, setModalPosition] = useState({})
  const [isClosing, setClosing] = useState(false)
  const [resizingPosition, setResizingPosition] = useState({ x: 0, y: 0 })
  const windowDimensions = useWindowDimensions()
  const { getNewDimensions } = usePreviewModalFeatures()

  const setModalCenter = useCallback(
    sizes => {
      if (!sizes) sizes = dimensions
      const { width, height } = sizes
      const x = (windowDimensions.width - width) / 2
      const y = (windowDimensions.height - height) / 2
      setModalPosition({ x, y })
    },
    [dimensions, windowDimensions.height, windowDimensions.width]
  )

  const handleFullScreen = useCallback(() => {
    const body = document.querySelector('body')

    if (isFullScreen) {
      body.style.overflowY = 'auto'
      setDimensions(oldDimensions)
      setOldDimensions(null)
    } else {
      body.style.overflowY = 'hidden'
      setOldDimensions(dimensions)
      const { innerWidth, innerHeight } = window
      setDimensions({
        width: innerWidth,
        height: innerHeight
      })
    }

    setFullScreen(!isFullScreen)
  }, [dimensions, isFullScreen, oldDimensions])

  const handleModalClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      if (isFullScreen) handleFullScreen()
      setClosing(false)
      onClose()
    }, FLASH_DURATION)
  }, [handleFullScreen, isFullScreen, onClose])

  const handleWindowResize = useCallback(() => {
    const newDimensions = {
      width: Math.min(dimensions.width, window.innerWidth),
      height: Math.min(dimensions.height, window.innerHeight)
    }

    setDimensions(newDimensions)
    setModalPosition({
      x: window.innerWidth / 2 - newDimensions.width / 2,
      y: window.innerHeight / 2 - newDimensions.height / 2
    })
  }, [dimensions])

  useEscKeyDownListener(handleModalClose)

  useEffect(() => {
    if (isFullScreen) {
      const { width, height } = windowDimensions
      setDimensions({ width, height })
    }
    // eslint-disable-next-line
  }, [windowDimensions])

  useEffect(() => {
    setModalCenter()
    // eslint-disable-next-line
  }, [isFullScreen])

  useEffect(() => {
    const nextDimensions = getNewDimensions(landscapeDefaultDimensions)
    setDimensions(nextDimensions)
    setModalCenter(nextDimensions)
    // eslint-disable-next-line
  }, [open])

  useEffect(() => {
    if (isFullScreen) {
      setModalCenter()
    }
    // eslint-disable-next-line
  }, [dimensions])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  const updatedModalPosition = useMemo(() => {
    if (isResizing) {
      return {
        x: modalPosition.x - resizingPosition.x,
        y: modalPosition.y - resizingPosition.y
      }
    }

    return modalPosition
  }, [modalPosition, resizingPosition, isResizing])

  const onClickAway = useCallback(
    e => {
      const elements = e.composedPath ? e.composedPath() : e.path
      const isControlPopup = (elements || []).some(({ className }) => {
        return (
          _isString(className) &&
          controlPopupClassName.find(v => className.includes(v))
        )
      })

      if (!isResizing && !isControlPopup && elements.length > 3)
        handleModalClose()
    },
    [handleModalClose, isResizing]
  )

  const controls = useMemo(() => {
    return (
      <>
        {!isFullScreen && (
          <div className={classNames(classes.controlsItem, 'draggable-handle')}>
            <Tooltip arrow title={'Move'}>
              <i className="fa-solid fa-grip-dots-vertical" />
            </Tooltip>
          </div>
        )}
        {controlsArr?.length &&
          controlsArr.map(({ tooltip, icon, onClick }, index) => (
            <div
              key={`controls-${index}`}
              className={classes.controlsItem}
              onClick={onClick}
            >
              <Tooltip arrow title={tooltip}>
                <i className={icon} />
              </Tooltip>
            </div>
          ))}
        <div
          className={classNames(classes.controlsItem)}
          onClick={() => handleFullScreen()}
        >
          <Tooltip arrow title={`${isFullScreen ? 'Collapse' : 'Maximize'}`}>
            <i
              className={`fa-sharp fa-solid ${
                isFullScreen ? 'fa-minimize' : 'fa-maximize'
              }`}
            />
          </Tooltip>
        </div>
        <div
          className={classNames(classes.controlsItem, classes.lastControlItem)}
          onClick={() => handleModalClose()}
        >
          <Tooltip arrow title={'Close'}>
            <i className="fa-duotone fa-power-off" />
          </Tooltip>
        </div>
      </>
    )
  }, [classes, handleFullScreen, handleModalClose, isFullScreen, controlsArr])

  const content = useMemo(() => {
    return (
      <div className={classes.contentRoot}>
        <FroalaEditorView model={template} />
      </div>
    )
  }, [template, classes.contentRoot])

  const handleResizeStart = useCallback(() => {
    setResizing(true)
  }, [])

  const handleResize = useCallback(
    (e, direction, ref, d) => {
      if (direction === 'top' || direction === 'topRight') {
        setResizingPosition({
          x: 0,
          y: modalPosition.y - d.height >= 0 ? d.height : modalPosition.y
        })
      } else if (direction === 'left' || direction === 'bottomLeft') {
        setResizingPosition({
          x: modalPosition.x - d.width >= 0 ? d.width : modalPosition.x,
          y: 0
        })
      } else if (direction === 'topLeft') {
        setResizingPosition({
          x: modalPosition.x - d.width >= 0 ? d.width : modalPosition.x,
          y: modalPosition.y - d.height >= 0 ? d.height : modalPosition.y
        })
      }
    },
    [modalPosition]
  )

  const handleResizeStop = useCallback(
    (e, direction, ref, d) => {
      const newWidth = dimensions.width + d.width
      const newHeight = dimensions.height + d.height
      setDimensions({ width: newWidth, height: newHeight })

      setModalPosition({
        x: modalPosition.x - resizingPosition.x,
        y: modalPosition.y - resizingPosition.y
      })
      setResizingPosition({ x: 0, y: 0 })

      setResizing(false)
    },
    [dimensions, modalPosition, resizingPosition]
  )

  return createPortal(
    <PreviewModalBase
      isVisible={open}
      isLoading={isLoading}
      isFullScreen={isFullScreen}
      controls={controls}
      content={content}
      isClosing={isClosing}
      onClickAway={onClickAway}
      setModalPosition={setModalPosition}
      updatedModalPosition={updatedModalPosition}
      dimensions={dimensions}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
    />,
    document.body
  )
}

export default PreviewModal
