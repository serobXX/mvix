import React from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'

import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(() => ({
  inlineWrapper: {
    display: 'inline-block'
  },
  footerLink: {
    display: 'inline-block',
    color: '#0076b9',
    textDecoration: 'none'
  },
  footerLinkMargin: {},
  footerLinkText: {
    fontSize: 13,
    color: '#0076b9'
  }
}))

function createAttrs(href, target, rel) {
  return {
    href,
    target,
    rel
  }
}

function FooterLink({ href, label, inline, target }) {
  const classes = useStyles()
  const attrs = createAttrs(href, target, 'noopener noreferrer')
  if (inline) {
    return (
      <a {...attrs} className={classes.footerLink}>
        {label}
      </a>
    )
  }
  return (
    <Grid item>
      <a
        {...attrs}
        className={classNames(classes.footerLink, classes.footerLinkMargin)}
      >
        <Typography className={classes.footerLinkText}>{label}</Typography>
      </a>
    </Grid>
  )
}

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string,
  inline: PropTypes.bool,
  target: PropTypes.string
}

FooterLink.defaultProps = {
  label: '',
  inline: false,
  target: '_blank'
}

export default FooterLink
