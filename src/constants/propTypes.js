import ReactPropTypes from 'prop-types'
import {
  fontSize,
  materialPopupPosition,
  popupPosition,
  position
} from './common'
import { tableEntities } from './library'
import { statusValues } from './commonOptions'

const PropTypes = {
  ...ReactPropTypes,
  className: ReactPropTypes.string,
  marginBottom: ReactPropTypes.oneOf([0, 1, 2, 2.5, 3, 4, 6]),
  paddingVert: ReactPropTypes.oneOf([0, 1, 1.5, 2, 2.5, 3, 4]),
  paddingHor: ReactPropTypes.oneOf([0, 1, 1.5, 2, 2.5, 3, 4]),
  padding: ReactPropTypes.oneOf([0, 0.5, 1, 1.5, 2, 3, 4, 4.5, 5]),
  height: ReactPropTypes.oneOf(['full', 'auto']),
  wordBreak: ReactPropTypes.oneOf(['normal', 'break-all']),
  border: ReactPropTypes.oneOf([0, 1, 2, 3]),
  background: ReactPropTypes.oneOf(['primary', 'secondary', 'third']),
  flexGrow: ReactPropTypes.oneOf([1]),
  fontWeight: ReactPropTypes.oneOf(['normal', 'bold']),
  fontStyle: ReactPropTypes.oneOf(['normal', 'italic']),
  whiteSpace: ReactPropTypes.oneOf(['normal', 'pre', 'no-wrap', 'pre-line']),
  color: ReactPropTypes.oneOf([
    'inherit',
    'light',
    'dark',
    'highlight',
    'title.primary',
    'warning'
  ]),
  fontSize: ReactPropTypes.oneOf([
    fontSize.primary,
    fontSize.secondary,
    fontSize.small,
    fontSize.smaller,
    fontSize.smallest,
    fontSize.big,
    fontSize.bigger,
    fontSize.biggest
  ]),
  popupPosition: ReactPropTypes.oneOf([...Object.values(popupPosition)]),
  materialPopupPosition: ReactPropTypes.oneOf([
    ...Object.values(materialPopupPosition)
  ]),
  containerCols: function (props, propName, componentName) {
    if (!/^\d+(?:-\d+)*$/.test(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`, expected value in \`number\` or cols separted by \`-\``
      )
    }
  },
  containerVariant: ReactPropTypes.oneOf([0, 1, 2, 2.5, 3, 4, 6]),
  ref: ReactPropTypes.oneOfType([ReactPropTypes.object, ReactPropTypes.func]),
  inputFieldLabelPosition: ReactPropTypes.oneOf([
    position.top,
    position.bottom,
    position.left,
    position.right
  ]),
  inputFieldFontSize: ReactPropTypes.oneOf([
    fontSize.primary,
    fontSize.small,
    fontSize.smallest
  ]),
  tableEntities: ReactPropTypes.oneOf(Object.values(tableEntities)),
  statusField: ReactPropTypes.oneOf([
    statusValues.active,
    statusValues.inactive,
    statusValues.disabled
  ])
}

export default PropTypes
