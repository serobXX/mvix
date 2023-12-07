import getOrExecute from 'utils/getOrExecute'
import { fontSize as fontSizeConstants } from 'constants/common'
import { _get } from 'utils/lodash'
import { isDark } from 'utils/color'

export const getStyles = (
  {
    palette,
    colors,
    type,
    typography,
    shapes,
    fontSize,
    lineHeight,
    fontWeight,
    formControls
  },
  isMulti,
  styles,
  fontSizeVariant,
  menuWidth,
  fullHeight,
  fixedHeight,
  isStartAdornment,
  isEndAdornment,
  isErrorIcon
) => {
  const {
    container,
    control,
    input,
    placeholder,
    menu,
    menuPortal,
    noOptionsMessage,
    option,
    multiValue,
    indicatorsContainer,
    loadingMessage,
    multiValueLabel,
    multiValueRemove,
    singleValue,
    onFocus,
    valueContainer,
    dropdownIndicator
  } = styles

  const fontSizeMap = {
    [fontSizeConstants.primary]: fontSize.primary,
    [fontSizeConstants.small]: fontSize.small,
    [fontSizeConstants.smallest]: fontSize.smallest
  }

  const smallerFontSizeMap = {
    [fontSizeConstants.primary]: fontSize.small,
    [fontSizeConstants.small]: fontSize.smallest,
    [fontSizeConstants.smallest]: fontSize.smallest
  }

  return {
    container: (provided, state) => ({
      ...provided,
      width: '100%',
      position: 'relative',
      ...(fullHeight ? { height: '100%' } : {}),
      ...getOrExecute(container, state)
    }),
    control: (provided, state) => ({
      ...provided,
      background: 'transparent',
      border: `none`,
      borderRadius: 4,
      boxSizing: 'border-box',
      padding: isMulti ? '2px 8px 2px 15px' : '1px 8px 1px 15px',
      paddingLeft: isStartAdornment
        ? formControls.input.paddingLeft + 21
        : formControls.input.paddingLeft,
      paddingTop: 5,
      paddingBottom: 3,
      height: 'inherit',
      minHeight: shapes.height.secondary,
      ...(fixedHeight ? { maxHeight: shapes.height.secondary } : {}),
      zIndex: 0,
      ...getOrExecute(control, state),

      '&:hover': {
        background: 'transparent',
        ...getOrExecute(_get(control, '&:hover', {}), state)
      },

      '& > div': {
        padding: 0,
        ...getOrExecute(_get(control, '& > div', {}), state)
      },

      ...(state.isFocused && {
        border: `none`,
        boxShadow: 'unset',
        ...onFocus
      }),

      ...(state.isDisabled && {
        cursor: 'default',
        backgroundColor: palette[type].formControls.disabled.background
      })
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: fontSizeMap[fontSizeVariant],
      backgroundColor: 'transparent',
      color: palette[type].formControls.input.color,
      fontFamily: typography.fontFamily,
      '& input': {
        fontFamily: 'inherit'
      },
      ...getOrExecute(input, state)
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: fontSizeMap[fontSizeVariant],
      color: palette[type].formControls.input.color,
      fontFamily: typography.fontFamily,
      ...formControls.placeholder,
      ...getOrExecute(placeholder, state)
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 9999,
      background: palette[type].formControls.select.background,
      ...(menuWidth ? { width: menuWidth } : {}),
      ...getOrExecute(menu, state)
    }),
    menuPortal: (provided, state) => ({
      ...provided,
      zIndex: 9999,
      ...getOrExecute(menuPortal, state)
    }),
    noOptionsMessage: (provided, state) => ({
      ...provided,
      fontFamily: typography.fontFamily,
      color: palette[type].formControls.input.color,
      ...getOrExecute(noOptionsMessage, state)
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: _get(state, 'data.isGroupLabel')
        ? '75%'
        : fontSizeMap[fontSizeVariant],
      fontWeight: _get(state, 'data.isGroupLabel') ? 500 : fontWeight.normal,
      textTransform: _get(state, 'data.isGroupLabel') ? 'uppercase' : 'none',
      label: _get(state, 'data.isGroupLabel') ? 'group' : '',
      color: _get(state, 'data.isGroupLabel')
        ? '#999'
        : palette[type].formControls.input.color,
      fontFamily: typography.fontFamily,
      background: state.isFocused
        ? palette[type].formControls.select.border
        : palette[type].formControls.select.background,
      cursor: _get(state, 'data.isGroupLabel') ? 'default' : 'pointer',
      ...getOrExecute(option, state),
      ...(_get(state, 'data.isGroupLabel') && {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '25px',
        padding: '5px 12px 0 12px'
      }),
      zIndex: 10,
      '&:hover': {
        background: state.isFocused
          ? palette[type].formControls.select.border
          : '',
        ...getOrExecute(_get(option, '&:hover', {}), state)
      },
      overflowWrap: 'break-word',

      ...(state.isDisabled && {
        background: _get(state, 'data.isGroupLabel')
          ? palette[type].formControls.select.background
          : palette[type].formControls.disabled.background,
        color: _get(state, 'data.isGroupLabel')
          ? '#999'
          : palette[type].formControls.disabled.color
      })
    }),
    multiValue: (provided, state) => ({
      ...provided,
      display: 'inline-flex',
      alignItems: 'center',
      height: 20,
      borderRadius: 16,
      padding: '0 5px 0 6px',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#3cd480',
      background: 'rgba(60, 212, 128, 0.25)',
      marginRight: 5,
      marginLeft: 0,
      marginTop: 3,
      marginBottom: 3,
      ...getOrExecute(multiValue, state)
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      ...getOrExecute(valueContainer, state),
      flexWrap: isMulti ? 'wrap' : 'nowrap',
      display: 'flex',
      ...(isMulti ? { overflowY: 'auto', height: '100%' } : {}),
      ...(fixedHeight ? { height: shapes.height.secondary - 13 } : {}),
      '& > div': {
        marginLeft: 0,
        zIndex: 2,
        ...getOrExecute(_get(valueContainer, '& > div', {}), state)
      }
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      padding: 0,
      ...getOrExecute(indicatorsContainer, state),

      '& > div': {
        padding: 0,
        ...getOrExecute(_get(indicatorsContainer, '& > div', {}), state)
      }
    }),
    loadingMessage: (provided, state) => ({
      ...provided,
      fontFamily: typography.fontFamily,
      ...getOrExecute(loadingMessage, state)
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      fontSize: smallerFontSizeMap[fontSizeVariant],
      fontWeight: fontWeight.bold,
      fontFamily: typography.fontFamily,
      marginRight: 5,
      color: '#3cd480',
      userSelect: 'none',
      ...getOrExecute(multiValueLabel, state)
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      background: isDark(state.data?.background)
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0,0,0,0.26)',
      transition: '0.1s',
      borderRadius: 16,
      ':hover': {
        background: isDark(state.data?.background) ? '#fff' : 'rgba(0,0,0,0.4)'
      },
      svg: {
        cursor: 'pointer'
      },
      'svg path': {
        fill: state.data?.background || '#fff'
      },

      ...getOrExecute(multiValueRemove, state)
    }),
    singleValue: (provided, state) => ({
      position: 'absolute',
      left: 0,
      zIndex: 1,
      '& > input, & > div': {
        ...provided,
        border: 'unset',
        background: 'transparent',
        fontFamily: typography.fontFamily,
        color: palette[type].formControls.input.color,
        fontSize: fontSizeMap[fontSizeVariant],
        fontWeight: fontWeight.normal,
        zIndex: -1,
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        maxWidth: '100%',
        ...getOrExecute(singleValue, state),

        '&:focus': {
          zIndex: 1
        }
      }
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      opacity: isEndAdornment || isErrorIcon ? `0 !important` : 0,
      visibility: 'hidden',
      transition: '0.3s opacity, 0.3s visibility',
      ...getOrExecute(dropdownIndicator, state)
    })
  }
}
