import { useCallback, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import Yup from 'utils/yup'

import { BlueButton, WhiteButton } from 'components/buttons'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import Container from 'components/containers/Container'
import {
  FormControlAutocomplete,
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import { requiredField } from 'constants/validationMessages'
import { getOptionsByFieldAndEntity } from 'utils/autocompleteOptions'
import { optionEntity } from 'constants/autocompleteOptions'

import {
  distanceUnitOptions,
  distanceUnitValues,
  massUnitValues
} from 'constants/packageProfile'
import { massUnitOptions } from 'constants/packageProfile'
import { _isEqual, _isNotEmpty } from 'utils/lodash'
import { simulateEvent } from 'utils/formik'

const useStyles = makeStyles(({ palette, type }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: '60%',
    background: palette[type].secondary,
    width: '40%',
    paddingTop: 10,
    paddingBottom: 6
  }
}))

const initialValues = {
  packageId: '',
  width: '',
  length: '',
  height: '',
  weight: '',
  distanceUnit: distanceUnitValues.cm,
  massUnit: massUnitValues.g
}

const validationSchema = Yup.object().shape({
  packageId: Yup.string().required(requiredField),
  length: Yup.number().required(requiredField),
  width: Yup.number().required(requiredField),
  height: Yup.number().required(requiredField),
  weight: Yup.number().required(requiredField)
})

const staticOptions = [
  {
    value: 0,
    label: 'Custom Dimensions'
  }
]

const PackageCard = ({
  name,
  values: parentValues,
  onChange,
  setPackageEdit
}) => {
  const classes = useStyles()

  const onSubmit = useCallback(
    values => {
      onChange(simulateEvent(name, values))
    },
    [name, onChange]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    setFieldValue,
    handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    if (parentValues) {
      setValues({
        ...values,
        ...parentValues
      })
    }
    //eslint-disable-next-line
  }, [parentValues])

  const handleChangePackage = useCallback(
    e => {
      const {
        target: { data, name, value }
      } = e

      if (_isNotEmpty(data)) {
        setValues({
          packageId: value,
          width: Number(data?.width),
          length: Number(data?.length),
          height: Number(data?.height),
          weight: Number(data?.weight),
          distanceUnit: data?.distanceUnit,
          massUnit: data?.massUnit
        })
      } else {
        setFieldValue(name, value)
      }
    },
    [setValues, setFieldValue]
  )

  const handleCancel = () => {
    setValues({
      ...values,
      ...parentValues
    })
  }

  const isEdit = useMemo(
    () => !_isEqual(values, { ...parentValues, packageId: values.packageId }),
    [values, parentValues]
  )

  useEffect(() => {
    setPackageEdit(isEdit)
    //eslint-disable-next-line
  }, [isEdit])

  return (
    <>
      <GridCardBase
        title={'Package'}
        dropdown={false}
        removeScrollbar
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
      >
        <Spacing variant={0}>
          <Container cols="3-2">
            <FormControlAutocomplete
              name="packageId"
              value={values.packageId}
              error={errors.packageId}
              touched={touched.packageId}
              onChange={handleChangePackage}
              getOptions={getOptionsByFieldAndEntity({
                entity: optionEntity.packageProfile,
                field: ['name'],
                passAllFields: true
              })}
              isSelectFirstOption
              staticOptions={staticOptions}
              fullWidth
              withProtal
            />
          </Container>
          <Container cols="3-3-3-2">
            <FormControlNumericInput
              name="length"
              label="Length"
              value={values.length}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.length}
              touched={touched.length}
              precision={4}
              fullWidth
              isRequired
            />
            <FormControlNumericInput
              name="width"
              label="Width"
              value={values.width}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.width}
              touched={touched.width}
              precision={4}
              fullWidth
              isRequired
            />
            <FormControlNumericInput
              name="height"
              label="Height"
              value={values.height}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.height}
              touched={touched.height}
              precision={4}
              fullWidth
              isRequired
            />
            <FormControlReactSelect
              label="Unit"
              name="distanceUnit"
              value={values.distanceUnit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.distanceUnit}
              touched={touched.distanceUnit}
              options={distanceUnitOptions}
              fullWidth
            />
          </Container>
          <Container cols="3-2-3-3">
            <FormControlNumericInput
              name="weight"
              label="Weight"
              value={values.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.weight}
              touched={touched.weight}
              precision={4}
              fullWidth
              isRequired
            />
            <FormControlReactSelect
              label="Unit"
              name="massUnit"
              value={values.massUnit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.massUnit}
              touched={touched.massUnit}
              formControlContainerClass={classes.labelMarginTop}
              options={massUnitOptions}
              fullWidth
            />
          </Container>
        </Spacing>
      </GridCardBase>
      {isEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            iconClassName={getIconClassName(iconNames.cancel)}
            onClick={handleCancel}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
          >
            Save
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default PackageCard
