import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { components } from 'react-select'

const useStyles = makeStyles(({ palette, type, colors }) => ({
  notchedOutline: ({ isFocused, showError, readOnlyWithoutSelection }) => ({
    top: '-5px',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: '0 8px',
    overflow: 'hidden',
    position: 'absolute',
    opacity: readOnlyWithoutSelection ? '0.5' : 1,
    border: `1px solid ${
      isFocused ? colors.highlight : palette[type].formControls.input.border
    }`,
    borderBottomColor: isFocused
      ? colors.highlight
      : palette[type].formControls.input.border,
    borderRadius: 'inherit',
    pointerEvents: 'none'
  }),
  notchedOutlineLabel: ({ isFocused, shrink }) => ({
    width: 'auto',
    height: 11,
    display: 'block',
    padding: 0,
    fontSize: '11.7px',
    maxWidth: isFocused || shrink ? '1000px' : '0.01px',
    textAlign: 'left',
    transition:
      isFocused || shrink
        ? 'max-width 100mscubic-bezier(0.0, 0, 0.2, 1) 50ms'
        : 'max-width 50ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    visibility: 'hidden',

    '& span': {
      display: 'inline-block',
      paddingLeft: 8,
      paddingRight: 8
    }
  }),
  requiredBorder: {
    borderLeftColor: `${colors.error} !important`,
    borderLeftWidth: `3px !important`
  }
}))

const SelectControl = ({ children, selectProps, ...props }) => {
  const classes = useStyles({
    isFocused: props.isFocused,
    shrink: !!props.getValue()?.length,
    showError: selectProps.showError,
    readOnlyWithoutSelection: selectProps.readOnlyWithoutSelection
  })
  return (
    <components.Control selectProps={selectProps} {...props}>
      {children}
      <fieldset
        aria-hidden="true"
        className={classNames(classes.notchedOutline, {
          [classes.requiredBorder]: selectProps.isRequired
        })}
      >
        <legend className={classes.notchedOutlineLabel}>
          {selectProps.label && <span>{selectProps.label}</span>}
        </legend>
      </fieldset>
    </components.Control>
  )
}

export default SelectControl
