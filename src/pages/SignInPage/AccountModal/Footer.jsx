import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classesNames from 'classnames'

import PropTypes from 'constants/propTypes'
import FooterLink from './FooterLink'

const useStyles = makeStyles(({ palette, type }) => ({
  footerGrid: {
    borderTop: `1px solid ${palette[type].pages.singIn.border}`,
    paddingTop: '10px'
  },
  dense: {
    marginBottom: '5px'
  }
}))

const footerLinks = [
  {
    label: 'Terms',
    link: 'https://mvixdigitalsignage.com/terms-of-use/'
  },
  {
    label: 'Privacy Policy',
    link: 'https://mvixdigitalsignage.com/privacy-policy/'
  },
  {
    label: 'About Mvix',
    link: 'https://mvixdigitalsignage.com/about-us/'
  }
]

function Footer({ dense }) {
  const classes = useStyles()

  return (
    <footer>
      <Grid
        container
        justifyContent="space-between"
        className={classesNames(classes.footerGrid, {
          [classes.dense]: dense
        })}
      >
        {footerLinks.map(({ link, label }, index) => (
          <FooterLink key={`footer-links-${index}`} href={link} label={label} />
        ))}
      </Grid>
    </footer>
  )
}

Footer.propTypes = {
  dense: PropTypes.bool
}

export default Footer
