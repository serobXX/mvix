import classNames from 'classnames'
import { iconTypes } from 'constants/iconNames'

export const getIconClassName = (
  icon,
  iconType = iconTypes.regular,
  ...args
) => {
  return classNames(iconType, icon, ...args)
}
