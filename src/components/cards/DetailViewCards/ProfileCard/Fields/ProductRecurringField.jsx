import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { FormControlCustomField } from 'components/formControls'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import customFieldNames from 'constants/customFieldNames'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    gap: 8,
    flexWrap: 'nowrap'
  }
}))

const ProductRecurringField = ({
  onChange,
  formControlContainerClass,
  allErrors,
  allTouched,
  allValues,
  onBlur,
  readOnlyWithoutSelection,
  autoFocus,
  hideLabel,
  layout,
  ...props
}) => {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
      <CustomField
        onChange={onChange}
        onBlur={onBlur}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        {...props}
        marginBottom={false}
      />
      {props.value && (
        <FormControlCustomField
          layout={layout}
          name={customFieldNames.productRecurringFrequency}
          value={allValues?.[customFieldNames.productRecurringFrequency]}
          error={allErrors?.[customFieldNames.productRecurringFrequency]}
          touched={allTouched?.[customFieldNames.productRecurringFrequency]}
          onChange={onChange}
          onBlur={onBlur}
          startAdornmentIcon={getIconClassName(
            iconNames.repeat,
            iconTypes.duotone
          )}
          readOnlyWithoutSelection={readOnlyWithoutSelection}
          marginBottom={false}
          autoFocus
          isRequired
        />
      )}
    </div>
  )
}

export default ProductRecurringField
