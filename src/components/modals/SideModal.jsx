import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { withStyles, Grid, Slide, Fade } from '@material-ui/core'

import { CircleIconButton } from 'components/buttons'
import Scrollbars from 'components/Scrollbars'
import { TextWithTooltip } from 'components/typography'
import { SCREEN_MAX_WIDTH, themeTypes } from 'constants/ui'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const styles = ({ palette, type, fontSize, lineHeight }) => ({
  sideModalWrap: {
    position: 'fixed',
    top: 78,
    zIndex: 102,
    height: 'calc(100% - 78px)',
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH
  },
  sideModalWrapFullScreen: {
    display: 'flex',
    flexDirection: 'row-reverse',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 11
  },
  sideModal: {
    height: '100%',
    background: palette[type].sideModal.background,
    borderRadius: '0 8px 8px 0',
    marginLeft: 'auto'
  },
  sideModalInner: {
    height: '100%'
  },
  leftRadius: {
    borderRadius: '8px'
  },
  sideModalContent: {
    flex: '1 1 auto',
    maxHeight: '100% !important',
    height: '100%',
    overflow: 'visible !important'
  },
  sideModalHeader: {
    padding: '8px 35px 4px 35px'
  },
  sideModalFooter: {
    padding: '16px 20px 14px 20px',
    borderTop: `1px solid ${palette[type].sideModal.footer.border}`,
    backgroundColor: palette[type].sideModal.footer.backgroundColor
  },
  sideModalHeaderTitle: {
    fontSize: fontSize.big,
    lineHeight: lineHeight.big
  },
  icon: {
    color: palette[type].sideModal.header.titleColor,
    margin: '5px 0',
    marginLeft: '20px',
    padding: '9px 12px'
  },
  secondFooterColor: { backgroundColor: palette[type].sideModal.background },
  restIconWrap: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0px'
  },
  restIconWrapRightBorder: {
    padding: '5px 20px',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: palette[type].pageContainer.header.infoIcon.border
  }
})

const TRANSITION_DURATION = 250

const SideModal = ({
  classes,
  children,
  title,
  closeLink,
  headerClassName = '',
  titleWrapperClass = '',
  wrapClassName = '',
  innerClassName = '',
  childrenWrapperClass,
  footerClassName,
  footerLayout,
  width = '90%',
  animated = true,
  fullScreen = false,
  scrollContent = true,
  handleClose,
  headerGridClassName = '',
  headerRestComponent,
  scrollbarClassName,
  theme
}) => {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(true)
  const [transitionDuration] = useState(animated ? TRANSITION_DURATION : 0)

  const closeAnimated = useCallback(() => {
    const timer = setTimeout(() => {
      if (handleClose) {
        handleClose()
      } else {
        navigate({
          pathname: closeLink
        })
      }
      clearTimeout(timer)
    }, transitionDuration)
  }, [transitionDuration, navigate, closeLink, handleClose])

  const closeInstantly = useCallback(() => {
    if (handleClose) {
      handleClose()
    } else {
      navigate(closeLink)
    }
  }, [navigate, closeLink, handleClose])

  const handleCloseClick = useCallback(() => {
    setMounted(false)
    return animated ? closeAnimated() : closeInstantly()
  }, [setMounted, animated, closeAnimated, closeInstantly])

  const backgroundGradient = useMemo(
    () =>
      width === '100%'
        ? ' transparent'
        : theme.type === themeTypes.dark
        ? 'rgba(0,0,0,0.2)'
        : `linear-gradient(to left, rgba(255, 255, 255, 0) 5%, rgba(90, 90, 90, 0.16) ${width}, rgba(255, 255, 255, 0) 100%)`,
    [width, theme.type]
  )

  const ApplyScrollbars = useCallback(
    ({ children, className }) => {
      if (!fullScreen) {
        if (scrollContent) {
          return <Scrollbars className={className}>{children}</Scrollbars>
        }
      }
      return <>{children}</>
    },
    [fullScreen, scrollContent]
  )
  return (
    <Fade mountOnEnter unmountOnExit in={mounted} timeout={transitionDuration}>
      <div
        className={classNames(wrapClassName, {
          [classes.sideModalWrap]: !fullScreen,
          [classes.sideModalWrapFullScreen]: fullScreen
        })}
        style={{
          background: backgroundGradient
        }}
      >
        <Slide
          direction="left"
          mountOnEnter
          unmountOnExit
          in={mounted}
          timeout={transitionDuration}
        >
          <Grid
            container
            direction="column"
            alignItems="stretch"
            wrap="nowrap"
            style={{
              width: fullScreen ? '100%' : width
            }}
            className={classNames(
              classes.sideModal,
              { [classes.leftRadius]: fullScreen },
              innerClassName
            )}
          >
            <Grid item>
              <header
                className={[classes.sideModalHeader, headerClassName].join(' ')}
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  className={headerGridClassName}
                >
                  <Grid item className={titleWrapperClass}>
                    <TextWithTooltip
                      maxWidth={520}
                      color="title.primary"
                      rootClassName={classes.sideModalHeaderTitle}
                    >
                      {title}
                    </TextWithTooltip>
                  </Grid>
                  <Grid item>
                    <Grid container>
                      {headerRestComponent && (
                        <Grid
                          item
                          className={classNames(
                            classes.restIconWrap,
                            classes.restIconWrapRightBorder
                          )}
                        >
                          {headerRestComponent}
                        </Grid>
                      )}
                      {(closeLink || handleClose) && (
                        <Grid item>
                          <CircleIconButton
                            className={[classes.icon, 'hvr-grow'].join(' ')}
                            onClick={handleCloseClick}
                          >
                            <i className={getIconClassName(iconNames.cancel)} />
                          </CircleIconButton>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </header>
            </Grid>
            <ApplyScrollbars className={scrollbarClassName}>
              <Grid
                item
                className={classNames(
                  classes.sideModalContent,
                  childrenWrapperClass
                )}
              >
                {children}
              </Grid>
            </ApplyScrollbars>

            <Grid item>
              {footerLayout ? (
                <footer
                  className={classNames(
                    classes.sideModalFooter,
                    footerClassName
                  )}
                >
                  <Grid container>{footerLayout}</Grid>
                </footer>
              ) : null}
            </Grid>
          </Grid>
        </Slide>
      </div>
    </Fade>
  )
}

export default withStyles(styles, { withTheme: true })(SideModal)
