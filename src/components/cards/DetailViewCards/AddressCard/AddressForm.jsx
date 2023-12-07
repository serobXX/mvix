import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import Container from 'components/containers/Container'
import {
  FormControlInput,
  FormControlSelectLocations
} from 'components/formControls'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(() => ({
  listContainer: {
    padding: '13px 20px 17px 20px'
  },
  strect: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  formControlDisable: {
    marginTop: 10
  }
}))

const AddressForm = ({
  name,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleChangeLocation,
  isEdit,
  selectedTab,
  showEditorWithReadOnly,
  onDoubleClick
}) => {
  const classes = useStyles()
  return (
    <Container rootClassName={classes.listContainer} cols="2" isFormContainer>
      <FormControlSelectLocations
        label={!isEdit ? '' : 'Address'}
        name={`${name}.${selectedTab}.locationAddress`}
        value={_get(values, `${name}.${selectedTab}.locationAddress`)}
        error={_get(errors, `${name}.${selectedTab}.locationAddress`)}
        touched={_get(touched, `${name}.${selectedTab}.locationAddress`)}
        onChange={handleChangeLocation}
        onBlur={handleBlur}
        marginBottom={false}
        withPortal
        isClearable={false}
        readOnlyWithoutSelection={showEditorWithReadOnly && !isEdit}
        startAdornmentIcon={getIconClassName(
          iconNames.location,
          iconTypes.duotone
        )}
        fullWidth
        formControlContainerClass={classNames(classes.strect, {
          [classes.formControlDisable]: showEditorWithReadOnly && !isEdit
        })}
        onDoubleClick={onDoubleClick}
      />
      <FormControlInput
        label={!isEdit ? '' : 'Street Address'}
        name={`${name}.${selectedTab}.address1`}
        value={_get(values, `${name}.${selectedTab}.address1`)}
        error={_get(errors, `${name}.${selectedTab}.address1`)}
        touched={_get(touched, `${name}.${selectedTab}.address1`)}
        onChange={handleChange}
        onBlur={handleBlur}
        marginBottom={false}
        readOnlyWithoutSelection={showEditorWithReadOnly && !isEdit}
        fullWidth
        formControlContainerClass={classNames(classes.strect, {
          [classes.formControlDisable]: showEditorWithReadOnly && !isEdit
        })}
        onDoubleClick={onDoubleClick}
      />
      <FormControlInput
        label={!isEdit ? '' : 'City'}
        name={`${name}.${selectedTab}.city`}
        value={_get(values, `${name}.${selectedTab}.city`)}
        error={_get(errors, `${name}.${selectedTab}.city`)}
        touched={_get(touched, `${name}.${selectedTab}.city`)}
        onChange={handleChange}
        onBlur={handleBlur}
        marginBottom={false}
        readOnlyWithoutSelection={showEditorWithReadOnly && !isEdit}
        fullWidth
        formControlContainerClass={classNames({
          [classes.formControlDisable]: showEditorWithReadOnly && !isEdit
        })}
        onDoubleClick={onDoubleClick}
      />
      <FormControlInput
        label={!isEdit ? '' : 'State'}
        name={`${name}.${selectedTab}.state`}
        value={_get(values, `${name}.${selectedTab}.state`)}
        error={_get(errors, `${name}.${selectedTab}.state`)}
        touched={_get(touched, `${name}.${selectedTab}.state`)}
        onChange={handleChange}
        onBlur={handleBlur}
        marginBottom={false}
        readOnlyWithoutSelection={showEditorWithReadOnly && !isEdit}
        fullWidth
        formControlContainerClass={classNames({
          [classes.formControlDisable]: showEditorWithReadOnly && !isEdit
        })}
        onDoubleClick={onDoubleClick}
      />
      <FormControlInput
        label={!isEdit ? '' : 'Zip'}
        name={`${name}.${selectedTab}.zipCode`}
        value={_get(values, `${name}.${selectedTab}.zipCode`)}
        error={_get(errors, `${name}.${selectedTab}.zipCode`)}
        touched={_get(touched, `${name}.${selectedTab}.zipCode`)}
        onChange={handleChange}
        onBlur={handleBlur}
        marginBottom={false}
        readOnlyWithoutSelection={showEditorWithReadOnly && !isEdit}
        fullWidth
        formControlContainerClass={classNames({
          [classes.formControlDisable]: showEditorWithReadOnly && !isEdit
        })}
        onDoubleClick={onDoubleClick}
      />
      <FormControlInput
        label={!isEdit ? '' : 'Country'}
        name={`${name}.${selectedTab}.country`}
        value={_get(values, `${name}.${selectedTab}.country`)}
        error={_get(errors, `${name}.${selectedTab}.country`)}
        touched={_get(touched, `${name}.${selectedTab}.country`)}
        onChange={handleChange}
        onBlur={handleBlur}
        marginBottom={false}
        readOnlyWithoutSelection={showEditorWithReadOnly && !isEdit}
        fullWidth
        formControlContainerClass={classNames({
          [classes.formControlDisable]: showEditorWithReadOnly && !isEdit
        })}
        onDoubleClick={onDoubleClick}
      />
    </Container>
  )
}

export default AddressForm
