import { Chip, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(({ colors }) => ({
  root: ({ backgroundColor = colors.light, color = '#fff' }) => ({
    borderRadius: '15px',
    backgroundColor: backgroundColor,
    color: color,
    height: 30
  }),
  icon: ({ iconColor, color }) => ({
    color: iconColor || color || '#fff',
    marginLeft: 12
  }),
  label: {
    lineHeight: '16px'
  }
}))

const BaseChip = ({
  iconClassName,
  icon,
  color,
  backgroundColor,
  iconColor,
  rootClassName,
  ...props
}) => {
  const classes = useStyles({ color, backgroundColor, iconColor })

  const chipIcon = iconClassName ? (
    <i className={classNames(iconClassName, classes.icon)} />
  ) : (
    icon
  )

  return (
    <Chip
      classes={{
        root: classNames(classes.root, rootClassName),
        label: classes.label
      }}
      icon={chipIcon}
      {...props}
    />
  )
}

export default BaseChip
