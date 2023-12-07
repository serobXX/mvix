import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { withStyles } from '@material-ui/core'
import { Scrollbars as CustomScrollbars } from 'react-custom-scrollbars'
import { useLocation } from 'react-router-dom'

import PropTypes from 'constants/propTypes'

const styles = ({ palette, type }) => ({
  vertScrollTrack: {
    bottom: '2px',
    top: '2px',
    right: '2px',
    borderRadius: '3px',
    zIndex: 10,
    transition: 'opacity 500ms ease'
  },
  horzScrollTrack: {
    bottom: '2px',
    left: '2px',
    right: '2px',
    borderRadius: '3px',
    zIndex: 10,
    transition: 'opacity 500ms ease'
  },
  scrollThumb: {
    background: palette[type].scrollbar.background,
    height: '40px',
    borderRadius: 'inherit',
    cursor: 'pointer'
  }
})

const Scrollbars = forwardRef(
  (
    {
      classes,
      children,
      isScrolling,
      setIsScrolling,
      renderHorizontalScroll = false,
      scrollToTopTrigger,
      ...props
    },
    ref
  ) => {
    const [hovering, setHovering] = useState(false)
    const [mounted, setMounted] = useState(false)
    const scrollBar = useRef()

    const { pathname } = useLocation()

    useEffect(() => {
      if (mounted) scrollBar.current.scrollToTop()
      //eslint-disable-next-line
    }, [pathname, scrollToTopTrigger])

    useEffect(() => {
      setMounted(true)
      //eslint-disable-next-line
    }, [])

    useImperativeHandle(ref, () => ({
      ...scrollBar.current,
      scrollToTop(scroll = 0) {
        scrollBar.current.view.scroll({
          top: scroll,
          behavior: 'smooth'
        })
      },
      scrollToBottom(y) {
        if (y) {
          scrollBar.current.view.scroll({
            top: y,
            behavior: 'smooth'
          })
        } else {
          scrollBar.current.scrollToBottom()
        }
      },
      scrollToLeft(x) {
        if (x) {
          scrollBar.current.view.scroll({
            left: x,
            behavior: 'smooth'
          })
        } else {
          scrollBar.current.scrollToLeft()
        }
      },
      getClientWidth: scrollBar.current.getClientWidth,
      getScrollLeft: scrollBar.current.getScrollLeft,
      getScrollWidth: scrollBar.current.getScrollWidth
    }))

    const VerticalTrack = useCallback(
      ({ style }) => (
        <div
          className={classes.vertScrollTrack}
          style={{
            ...style,
            opacity: hovering ? 1 : 0
          }}
        />
      ),
      [classes.vertScrollTrack, hovering]
    )

    const Thumb = useCallback(
      ({ style }) => <div className={classes.scrollThumb} style={style} />,
      [classes.scrollThumb]
    )

    const HorizontalTrack = useCallback(
      ({ style }) =>
        renderHorizontalScroll ? (
          <div
            className={classes.horzScrollTrack}
            style={{
              ...style,
              opacity: hovering ? 1 : 0
            }}
          />
        ) : (
          <div style={{ display: 'none' }} className="track-horizontal" />
        ),
      [classes.horzScrollTrack, hovering, renderHorizontalScroll]
    )

    const handleScroll = useCallback(
      isScrolling => () => {
        setIsScrolling && setIsScrolling(isScrolling)
      },
      [setIsScrolling]
    )

    return (
      <CustomScrollbars
        ref={scrollBar}
        renderTrackVertical={style => VerticalTrack(style)}
        renderThumbVertical={style => Thumb(style)}
        renderTrackHorizontal={style => HorizontalTrack(style)}
        renderThumbHorizontal={style => Thumb(style)}
        {...(setIsScrolling && {
          onScrollStart: handleScroll(true),
          onScrollStop: handleScroll(false)
        })}
        onMouseOver={() => {
          if (!hovering) {
            setHovering(true)
          }
        }}
        onMouseLeave={() => setHovering(false)}
        autoHide
        hideTracksWhenNotNeeded
        {...props}
      >
        {children}
      </CustomScrollbars>
    )
  }
)

Scrollbars.propTypes = {
  onUpdate: PropTypes.func,
  autoHeight: PropTypes.bool,
  autoHeightMin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autoHeightMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default withStyles(styles)(Scrollbars)
