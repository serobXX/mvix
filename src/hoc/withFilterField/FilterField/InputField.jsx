import { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import { filterTypeOperators, filterTypeValues } from 'constants/filter'
import { simulateEvent } from 'utils/formik'
import Tooltip from 'components/Tooltip'

const useStyles = makeStyles(({ typography, type }) => ({
  hoverListItem: {
    padding: `2px 8px`
  },
  triggerIcon: {
    fontSize: 16,
    width: 16,
    height: 16,
    color: typography.lightText[type].color,
    display: 'grid',
    cursor: 'pointer'
  },
  hoverContentRoot: {
    padding: 10
  },
  hoverPopupCard: {
    width: 165
  }
}))

const hoverPopupStyle = { width: 185 }

const InputField = ({
  label,
  name,
  value,
  isMultiSelection,
  filterType,
  index,
  filterProps,
  fromSidebar,
  type,
  component: Component,
  handleChange,
  disabled,
  initialFetchValue,
  isOptionDisabled
}) => {
  const classes = useStyles()

  const operators = useMemo(
    () =>
      (filterTypeOperators[filterType] || []).map(operator => ({
        ...operator,
        onClick: () =>
          handleChange({ name, index, filterType })(
            simulateEvent('type', operator.value)
          )
      })),
    [handleChange, name, index, filterType]
  )
  const selectedOpertors = useMemo(
    () => operators.find(({ value }) => value === type),
    [operators, type]
  )

  const hoverTrigger = useMemo(() => {
    const { img, icon, label } = selectedOpertors || {}
    return (
      <Tooltip title={label} placement="top" arrow>
        {img ? (
          <img src={img} alt="" className={classes.triggerIcon} />
        ) : (
          <i className={classNames(icon, classes.triggerIcon)} />
        )}
      </Tooltip>
    )
  }, [selectedOpertors, classes])

  const startAdornmentRender = useMemo(() => {
    return operators.length ? (
      <HoverOverDropdownButton
        popupOn="click"
        items={operators}
        listItemClassName={classes.hoverListItem}
        hoverCardHeight={32.5}
        cardRowSpacing={5}
        color={'#74809A'}
        trigger={hoverTrigger}
        popupStyle={hoverPopupStyle}
        popupContentRootClassName={classes.hoverContentRoot}
        popupHoverCardClassName={classes.hoverPopupCard}
      />
    ) : null
  }, [classes, hoverTrigger, operators])

  return (
    <Component
      placeholder={label}
      name={'value'}
      {...(isMultiSelection ? { values: value } : { value })}
      onChange={handleChange({
        name,
        index,
        filterType
      })}
      marginBottom={false}
      fullWidth
      initialFetchValue={initialFetchValue || value}
      {...filterProps}
      {...(fromSidebar ? { fixedHeight: false } : {})}
      startAdornment={!disabled && startAdornmentRender}
      disabled={disabled}
      {...(isOptionDisabled &&
      [filterTypeValues.select, filterTypeValues.lookup].includes(filterType)
        ? { isOptionDisabled }
        : {})}
    />
  )
}

export default InputField
