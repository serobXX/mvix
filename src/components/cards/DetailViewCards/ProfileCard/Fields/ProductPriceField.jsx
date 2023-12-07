import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { CheckboxSwitcher } from 'components/formControls'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    gap: 6,
    flexDirection: 'column'
  },
  customPriceRoot: {
    marginTop: 10
  }
}))

const ProductPriceField = ({
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
      <CheckboxSwitcher
        label="Dynamic Price"
        name={'isCustomProduct'}
        value={allValues?.isCustomProduct}
        onChange={onChange}
        onBlur={onBlur}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        formControlLabelClass={classes.customPriceLabel}
        switchContainerClass={classes.customPriceRoot}
        marginBottom={false}
      />
      {!allValues?.isCustomProduct && (
        <CustomField
          onChange={onChange}
          onBlur={onBlur}
          readOnlyWithoutSelection={readOnlyWithoutSelection}
          {...props}
          fullWidth
          marginBottom={false}
        />
      )}
    </div>
  )
}

export default ProductPriceField
