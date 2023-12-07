import { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import {
  FormControlCustomField,
  FormControlReactSelect
} from 'components/formControls'
import { salutationOptions } from 'constants/commonOptions'
import customFieldNames from 'constants/customFieldNames'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    gap: 5,
    flexWrap: 'nowrap'
  },
  salutation: {
    maxWidth: 63
  },
  salutationLabel: {
    marginTop: 10
  },
  salutationError: {
    whiteSpace: 'nowrap'
  }
}))

const NameWithSalutationField = ({
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
  const [fieldIndex, setFieldIndex] = useState()

  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
      <FormControlReactSelect
        name="salutation"
        label=""
        options={salutationOptions}
        value={allValues?.salutation}
        onChange={onChange}
        onBlur={onBlur}
        error={allErrors?.salutation}
        touched={allTouched?.salutation}
        marginBottom={false}
        formControlContainerClass={classNames(classes.salutation, {
          [classes.salutationLabel]: !readOnlyWithoutSelection
        })}
        errorTextClass={classes.salutationError}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        onDoubleClick={() => setFieldIndex(0)}
        autoFocus={fieldIndex === 0 && autoFocus}
      />
      <CustomField
        onChange={onChange}
        onBlur={onBlur}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        {...props}
        onDoubleClick={() => setFieldIndex(1)}
        autoFocus={fieldIndex === 1 && autoFocus}
        startAdornmentIcon={getIconClassName(
          iconNames.nameField,
          iconTypes.duotone
        )}
        marginBottom={false}
      />
      <FormControlCustomField
        layout={layout}
        label={'Last Name'}
        hideLabel={hideLabel}
        name={customFieldNames.lastName}
        value={allValues?.[customFieldNames.lastName]}
        error={allErrors?.[customFieldNames.lastName]}
        touched={allTouched?.[customFieldNames.lastName]}
        onChange={onChange}
        onBlur={onBlur}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        onDoubleClick={() => setFieldIndex(2)}
        autoFocus={fieldIndex === 2 && autoFocus}
        marginBottom={false}
      />
    </div>
  )
}

export default NameWithSalutationField
