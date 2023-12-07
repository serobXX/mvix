import { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { MaterialPopup } from 'components/Popup'
import Spacing from 'components/containers/Spacing'
import { FormControlRadioGroup } from 'components/formControls'
import { TextWithTooltip } from 'components/typography'
import { materialPopupPosition } from 'constants/common'
import { comparisonOptions, filterTypeOperators } from 'constants/filter'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import InputField from './InputField'
import CheckboxAccordion from 'components/Accordion/CheckboxAccordion'
import { _isNotEmpty } from 'utils/lodash'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  filterRoot: {
    padding: 10
  },
  radioLabel: {
    margin: 0
  },
  popupTriggerRoot: {
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
    '& i': {
      color: typography.lightText[type].color
    }
  },
  fromSidebarRoot: {
    padding: 10
  },
  filterRootSidebar: {
    padding: 0,
    width: '100%'
  }
}))

const initialValue = filterType => ({
  type:
    filterTypeOperators[filterType] &&
    filterTypeOperators[filterType]?.[0]?.value,
  value: ''
})

const popupStyle = {
  width: 200
}

const FilterField = ({
  label,
  name,
  values,
  filterProps: { isMultiSelection, filterType, ...filterProps } = {},
  component,
  handleChange,
  fromSidebar,
  isMultiFilter,
  handleResetField
}) => {
  const classes = useStyles()

  const rows = useMemo(
    () =>
      filterType
        ? values?.length
          ? values
          : [initialValue(filterType)]
        : [{ value: values?.value || '' }],
    [values, filterType]
  )

  const isOptionDisabled = useCallback(
    value => option => {
      return (
        option.value !== value &&
        values &&
        values.some(({ value: _value }) => _value === option.value)
      )
    },
    [values]
  )

  const renderContent = useMemo(
    () => (
      <div
        className={classNames(classes.filterRoot, {
          [classes.filterRootSidebar]: fromSidebar
        })}
      >
        {rows.map(({ type, value, comparison }, index) => (
          <Spacing key={`field-${name}-${index}`} variant={0}>
            {filterType && index > 0 && filterTypeOperators[filterType] && (
              <FormControlRadioGroup
                name="comparison"
                value={comparison}
                onChange={handleChange({ name, index, filterType })}
                options={comparisonOptions}
                fullWidth
                marginBottom={false}
                formControlOptionLabelClass={classes.radioLabel}
              />
            )}
            <InputField
              label={label}
              isMultiSelection={isMultiSelection}
              value={value}
              name={name}
              filterType={filterType}
              index={index}
              filterProps={filterProps}
              fromSidebar={fromSidebar}
              type={type}
              component={component}
              handleChange={handleChange}
              isOptionDisabled={isOptionDisabled(value)}
            />
          </Spacing>
        ))}
      </div>
    ),
    [
      classes,
      filterProps,
      filterType,
      fromSidebar,
      handleChange,
      isMultiSelection,
      label,
      name,
      rows,
      component,
      isOptionDisabled
    ]
  )

  const isOpen = useMemo(
    () =>
      values !== null &&
      values !== '' &&
      _isNotEmpty(values) &&
      !(values.length === 1 && !values?.[0]?.value),
    [values]
  )

  const handleChangeCheckbox = useCallback(
    open => {
      if (!open) {
        handleResetField({ name, filterType })
      }
    },
    [handleResetField, name, filterType]
  )

  return isMultiFilter && !fromSidebar ? (
    <MaterialPopup
      placement={materialPopupPosition.rightCenter}
      trigger={
        <div className={classes.popupTriggerRoot}>
          <TextWithTooltip maxWidth={150}>{label}</TextWithTooltip>
          <i className={getIconClassName(iconNames.arrowRight)} />
        </div>
      }
      withPortal
      style={popupStyle}
    >
      {renderContent}
    </MaterialPopup>
  ) : fromSidebar ? (
    <div className={classes.fromSidebarRoot}>
      <CheckboxAccordion
        title={label}
        initialOpen={isOpen}
        onChange={handleChangeCheckbox}
      >
        {renderContent}
      </CheckboxAccordion>
    </div>
  ) : (
    renderContent
  )
}

export default FilterField
