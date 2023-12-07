import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import PropTypes from 'constants/propTypes'
import Footer from './Footer'
import backgroundImage from '/src/assets/images/sign-in.webp'
import Scrollbars from 'components/Scrollbars'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    position: 'relative',
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
    background: `url("${backgroundImage}") no-repeat`,
    backgroundSize: 'cover'
  },
  formWrap: {
    display: 'inline-block',
    position: 'absolute',
    top: '50%',
    left: '120px',
    zIndex: 2,
    width: '500px',
    padding: '25px 0px 25px 35px',
    background: palette[type].pages.singIn.background,
    transform: 'translateY(-50%)'
  },
  formContent: {
    paddingRight: 35
  }
}))

function AccountModal({
  rootClassName,
  formWrapClassName,
  formContentClassName,
  children,
  denseFooter,
  hideScrollbar = false
}) {
  const classes = useStyles()

  const ApplyScrollbar = useCallback(
    ({ children: _children }) =>
      hideScrollbar ? (
        _children
      ) : (
        <Scrollbars autoHeight autoHeightMax={'calc(100vh - 110px)'}>
          {_children}
        </Scrollbars>
      ),
    [hideScrollbar]
  )
  return (
    <div className={classNames(classes.root, rootClassName)}>
      <div className={classNames(classes.formWrap, formWrapClassName)}>
        <ApplyScrollbar>
          <div
            className={classNames(classes.formContent, formContentClassName)}
          >
            {children}
            <Footer dense={denseFooter} />
          </div>
        </ApplyScrollbar>
      </div>
    </div>
  )
}

AccountModal.propTypes = {
  rootClassName: PropTypes.className,
  formWrapClassName: PropTypes.className,
  formContentClassName: PropTypes.className,
  children: PropTypes.node,
  denseFooter: PropTypes.bool,
  hideScrollbar: PropTypes.bool
}

export default AccountModal
