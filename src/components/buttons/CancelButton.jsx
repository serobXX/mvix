import React from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { WhiteButton } from '.'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type }) => ({
  rowActionBtn: {
    minWidth: '32px',
    paddingLeft: '10px',
    paddingRight: '10px',
    boxShadow: `0 1px 0 0 ${palette[type].buttons.white.shadow}`,

    '&:hover': {
      borderColor: '#1c5dca',
      backgroundColor: '#1c5dca',
      color: '#fff'
    }
  },
  icon: {
    fontSize: 20
  }
}))

const CancelButton = ({ onClick }) => {
  const classes = useStyles()
  return (
    <WhiteButton
      className={classes.rowActionBtn}
      onClick={onClick}
      variant="danger"
    >
      <i
        className={classNames(getIconClassName(iconNames.cancel), classes.icon)}
      />
    </WhiteButton>
  )
}

export default CancelButton
