import { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import {
  FormControlAutocomplete,
  FormControlCustomField
} from 'components/formControls'
import customFieldNames from 'constants/customFieldNames'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { CLOSED_LOST } from 'constants/opportunityConstants'
import { getLookupOptions } from 'utils/customFieldUtils'
import { customFieldLookupType } from 'constants/customFields'
import { simulateEvent } from 'utils/formik'

const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    flexWrap: 'nowrap'
  }
}))

const StageLostReasonField = ({
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
  value,
  ...props
}) => {
  const classes = useStyles()
  const [fieldIndex, setFieldIndex] = useState()

  const handleChange = useCallback(
    e => {
      const {
        target: { label }
      } = e
      onChange(e)
      onChange(simulateEvent('stageName', label))
    },
    [onChange]
  )

  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
      <FormControlAutocomplete
        onChange={handleChange}
        onBlur={onBlur}
        readOnlyWithoutSelection={readOnlyWithoutSelection}
        value={value}
        {...props}
        getOptions={getLookupOptions(customFieldLookupType.stage)}
        initialFetchValue={value}
        onDoubleClick={() => setFieldIndex(1)}
        autoFocus={fieldIndex === 1 && autoFocus}
        startAdornmentIcon={getIconClassName(
          iconNames.opportunityStage,
          iconTypes.duotone
        )}
        marginBottom={false}
      />
      <div>
        {allValues?.stageName === CLOSED_LOST && (
          <FormControlCustomField
            layout={layout}
            label={hideLabel ? '' : 'Lost Reason'}
            name={customFieldNames.lostReason}
            value={allValues?.[customFieldNames.lostReason]}
            error={allErrors?.[customFieldNames.lostReason]}
            touched={allTouched?.[customFieldNames.lostReason]}
            onChange={onChange}
            onBlur={onBlur}
            readOnlyWithoutSelection={readOnlyWithoutSelection}
            onDoubleClick={() => setFieldIndex(2)}
            autoFocus={fieldIndex === 2 && autoFocus}
            marginBottom={false}
            isRequired
          />
        )}
      </div>
    </div>
  )
}

export default StageLostReasonField
