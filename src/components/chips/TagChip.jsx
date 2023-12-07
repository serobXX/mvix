import React from 'react'
import { Chip, makeStyles } from '@material-ui/core'

import { defaultTag } from 'constants/chipsColorPalette'

const useStyles = makeStyles({
  root: {
    fontWeight: 'bold',
    position: 'relative',
    lineHeight: 1,
    padding: 5,
    height: 'auto',
    border: '1px solid',
    borderRadius: 16,
    fontSize: '11px',
    background: ({ background }) => (background ? background : '#d5e5fd'),
    color: ({ color }) => (color ? color : '#619bf9'),
    borderColor: ({ color, border }) =>
      border ? border : color ? color : '#619bf9',

    '&:focus': {
      backgroundColor: ({ background }) => (background ? background : '#d5e5fd')
    },

    '&:before': {
      top: '-1px',
      bottom: '-1px',
      right: '-11px',
      borderTop: '11px solid transparent',
      borderBottom: '11px solid transparent',
      borderLeft: '11px solid #d9dfec'
    },

    '&:after': {
      top: 0,
      bottom: 0,
      right: '-10px',
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      borderLeft: ({ background }) =>
        `10px solid ${background ? background : '#d5e5fd'}`
    },

    '& > span': {
      padding: 0
    }
  }
})

const TagChip = React.forwardRef(({ tag, ...props }, ref) => {
  const { tag: title, textColor, backgroundColor } = tag

  const classes = useStyles({
    color: textColor || defaultTag.textColor,
    background: backgroundColor || defaultTag.backgroundColor,
    border: backgroundColor || defaultTag.backgroundColor
  })
  return <Chip ref={ref} className={classes.root} label={title} {...props} />
})

export default TagChip
