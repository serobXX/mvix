import { useFormik } from 'formik'
import * as Yup from 'yup'

import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import { DefaultModal } from 'components/modals'
import { requiredField } from 'constants/validationMessages'
import {
  CheckboxSwitcher,
  FormControlAutocomplete,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import { useCallback, useEffect, useMemo } from 'react'
import { getLookupOptions, updateFieldValueByKey } from 'utils/customFieldUtils'
import { position } from 'constants/common'
import { exceedCharacters } from 'constants/validationMessages'
import {
  customFieldTypes,
  optionsCustomFieldTypes
} from 'constants/customFields'
import Scrollbars from 'components/Scrollbars'
import OptionsField from './OptionsField'
import { _get, _uniqueId } from 'utils/lodash'
import { useGetCustomFieldSettingsQuery } from 'api/customFieldApi'
import { snakeCaseToSplitCapitalize } from 'utils/stringConversion'
import { simulateEvent } from 'utils/formik'

const initialValues = {
  name: '',
  lookupType: null,
  isMultiple: false,
  isRequired: false,
  isUnique: false,
  options: [],
  showTooltip: false,
  tooltip: '',
  tooltipType: 'text',
  showTooltipHeader: false,
  tooltipHeader: '',
  property: {
    maxValue: '',
    decimal: '',
    defaultValue: '',
    charLimit: {
      isActive: false,
      maxChar: 100,
      minChar: 0
    },
    file: {
      isMulti: false,
      max: 2
    }
  }
}

const tooltipTypeOptions = [
  {
    label: 'On Label',
    value: 'text'
  },
  {
    label: 'Info Icon',
    value: 'icon'
  }
]

const FieldProperitesModal = ({
  open,
  onCloseModal,
  item,
  fields,
  setFields,
  activeTab,
  setDisplayFields
}) => {
  const { data: settings = {} } = useGetCustomFieldSettingsQuery()
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(requiredField),
        showTooltip: Yup.bool(),
        tooltip: Yup.string()
          .when('showTooltip', {
            is: true,
            then: () => Yup.string().required(requiredField)
          })
          .max(255, exceedCharacters('Tooltip'))
          .nullable(),
        showTooltipHeader: Yup.bool(),
        tooltipHeader: Yup.string()
          .when('showTooltipHeader', {
            is: true,
            then: () => Yup.string().required(requiredField)
          })
          .max(50, exceedCharacters('Tooltip Header'))
          .nullable(),
        options: optionsCustomFieldTypes.includes(item?.type)
          ? Yup.array()
              .min(1, requiredField)
              .of(
                Yup.object().shape({
                  value: Yup.string().required(requiredField)
                })
              )
          : Yup.array(),
        lookupType:
          item?.type === customFieldTypes.lookup
            ? Yup.string().required(requiredField).nullable()
            : Yup.string().nullable(),
        property: Yup.object()
          .shape({
            maxValue:
              item?.type === customFieldTypes.price
                ? Yup.number().required(requiredField).nullable()
                : Yup.number().nullable(),
            decimal:
              item?.type === customFieldTypes.price
                ? Yup.number().required(requiredField).nullable()
                : Yup.number().nullable(),
            charLimit: Yup.object()
              .shape({
                isActive: Yup.bool(),
                minChar: Yup.number()
                  .when('isActive', {
                    is: true,
                    then: () => Yup.number().required(requiredField)
                  })
                  .nullable(),
                maxChar: Yup.number()
                  .when('isActive', {
                    is: true,
                    then: () => Yup.number().required(requiredField)
                  })
                  .nullable()
              })
              .nullable(),
            file: Yup.object()
              .shape({
                isMulti: Yup.bool(),
                max: Yup.number()
                  .when('isMulti', {
                    is: true,
                    then: () => Yup.number().required(requiredField)
                  })
                  .nullable()
              })
              .nullable()
          })
          .nullable()
      }),
    [item?.type]
  )

  const onSubmit = useCallback(
    ({ showTooltip, options, showTooltipHeader, tooltipHeader, ...values }) => {
      const data = {
        ...values,
        options:
          options &&
          options.map(({ value, code }) => ({ label: value, value: code })),
        tooltip: showTooltip ? values.tooltip : '',
        property: {
          ...values.property,
          tooltipHeader: showTooltipHeader ? tooltipHeader : ''
        }
      }
      updateFieldValueByKey({
        fields,
        code: item.isItem ? item.code : item.value,
        activeTab,
        setFields,
        setDisplayFields,
        values: data,
        isTab: !item.isItem
      })
      onCloseModal()
    },
    [fields, item, activeTab, setFields, setDisplayFields, onCloseModal]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    if (item) {
      const {
        name,
        lookupType,
        isRequired,
        isMultiple,
        isUnique,
        options = [],
        tooltip,
        tooltipType = 'text',
        property,
        label,
        isItem
      } = item

      setValues({
        name: isItem ? name : label,
        lookupType,
        isRequired,
        isMultiple,
        isUnique,
        options:
          options &&
          options.map(({ label, value }) => ({
            value: label,
            code: _uniqueId(),
            id: value
          })),
        tooltip,
        tooltipType,
        property: Array.isArray(property) ? {} : property,
        showTooltip: !!tooltip,
        showTooltipHeader: !!property?.tooltipHeader,
        tooltipHeader: property?.tooltipHeader || ''
      })
    }
    //eslint-disable-next-line
  }, [item])

  const lookupTypeOptions = useMemo(() => {
    if (!settings || !settings.lookupType) {
      return []
    }
    return settings.lookupType.map(lookup => ({
      value: lookup,
      label: snakeCaseToSplitCapitalize(lookup)
    }))
  }, [settings])

  const parsedOptions = useMemo(
    () =>
      values.options?.map(({ value }) => ({
        value,
        label: value
      })),
    [values.options]
  )

  const handleChangeOption = useCallback(
    e => {
      handleChange(e)
      if (
        !e.target.value.some(
          ({ value }) => value === values.property?.defaultValue
        )
      ) {
        handleChange(simulateEvent('property.defaultValue', ''))
      }
    },
    [handleChange, values]
  )

  const handleChangeLookupType = useCallback(
    e => {
      handleChange(simulateEvent('property.defaultValue', ''))
      handleChange(e)
    },
    [handleChange]
  )

  const handleChangeCharLimit = useCallback(
    e => {
      const {
        target: { value }
      } = e
      handleChange(e)
      if (value) {
        !_get(values, 'property.charLimit.minChar') &&
          handleChange(simulateEvent('property.charLimit.minChar', 0))
        !_get(values, 'property.charLimit.maxChar') &&
          handleChange(simulateEvent('property.charLimit.maxChar', 100))
      }
    },
    [values, handleChange]
  )

  return (
    <DefaultModal
      open={open}
      modalTitle={'Edit Properties'}
      onCloseModal={onCloseModal}
      onClickSave={handleSubmit}
    >
      <Scrollbars autoHeight autoHeightMax={'calc(100vh - 195px)'}>
        <Spacing>
          <Container cols="1" isFormContainer>
            <FormControlInput
              name="name"
              label="Field Label"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              fullWidth
              marginBottom={false}
              isRequired
            />
            {item?.isItem &&
              ![
                customFieldTypes.tab,
                customFieldTypes.image,
                customFieldTypes.file
              ].includes(item.type) && (
                <Container isFormContainer>
                  <CheckboxSwitcher
                    label="Required"
                    labelPlacement={position.left}
                    name={'isRequired'}
                    value={values.isRequired}
                    onChange={handleChange}
                    marginBottom={false}
                  />
                  <CheckboxSwitcher
                    label="Unique"
                    labelPlacement={position.left}
                    name={'isUnique'}
                    value={values.isUnique}
                    onChange={handleChange}
                    marginBottom={false}
                  />
                </Container>
              )}
            {optionsCustomFieldTypes.includes(item?.type) && (
              <OptionsField
                label="Options"
                name="options"
                errors={errors.options}
                touched={touched.options}
                onChange={handleChangeOption}
                values={values.options}
              />
            )}
            {item?.type === customFieldTypes.lookup && (
              <FormControlReactSelect
                name="lookupType"
                label="Lookup Type"
                value={values.lookupType}
                onChange={handleChangeLookupType}
                onBlur={handleBlur}
                error={errors.lookupType}
                touched={touched.lookupType}
                options={lookupTypeOptions}
                fullWidth
                marginBottom={false}
                withPortal
                isRequired
              />
            )}
            {item?.type === customFieldTypes.select && (
              <FormControlReactSelect
                name="property.defaultValue"
                label="Default Value"
                value={values.property?.defaultValue}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.property?.maxValue}
                touched={!!touched.property}
                fullWidth
                marginBottom={false}
                options={parsedOptions}
                withPortal
                isClearable
              />
            )}
            {item?.type === customFieldTypes.lookup && (
              <>
                <CheckboxSwitcher
                  name="isMultiple"
                  label="Multiple Values Selection"
                  value={values.isMultiple}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.isMultiple}
                  touched={touched.defaultValue}
                  marginBottom={false}
                />
                <FormControlAutocomplete
                  name="property.defaultValue"
                  label="Default Value"
                  value={values.property?.defaultValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.property?.defaultValue}
                  touched={!!touched.property}
                  fullWidth
                  isMulti={values.isMultiple}
                  marginBottom={false}
                  getOptions={getLookupOptions(values.lookupType)}
                  optionsDependency={values.lookupType}
                  isClearable
                  withPortal
                />
              </>
            )}
            {item?.type === customFieldTypes.price && (
              <>
                <FormControlNumericInput
                  name="property.maxValue"
                  label="Maximum Value"
                  value={values.property?.maxValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.property?.maxValue}
                  touched={!!touched.property}
                  fullWidth
                  marginBottom={false}
                  isRequired
                />
                <FormControlNumericInput
                  name="property.decimal"
                  label="Number of decimal places"
                  value={values.property?.decimal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.property?.decimal}
                  touched={!!touched.property}
                  fullWidth
                  marginBottom={false}
                  isRequired
                />
              </>
            )}
            {[customFieldTypes.text, customFieldTypes.textarea].includes(
              item?.type
            ) && (
              <Container cols="3" alignItems="center" isFormContainer>
                <CheckboxSwitcher
                  label="Character Limit"
                  labelPlacement={position.left}
                  name={'property.charLimit.isActive'}
                  value={_get(values, 'property.charLimit.isActive', false)}
                  onChange={handleChangeCharLimit}
                  marginBottom={false}
                />
                {_get(values, 'property.charLimit.isActive', false) && (
                  <>
                    <FormControlNumericInput
                      label="Min Characters"
                      name="property.charLimit.minChar"
                      value={_get(values, 'property.charLimit.minChar')}
                      error={_get(errors, 'property.charLimit.minChar')}
                      touched={_get(
                        touched,
                        'property.charLimit.isActive',
                        false
                      )}
                      min={0}
                      onChange={handleChange}
                      marginBottom={false}
                      fullWidth
                    />
                    <FormControlNumericInput
                      label="Max Characters"
                      name="property.charLimit.maxChar"
                      value={_get(values, 'property.charLimit.maxChar')}
                      error={_get(errors, 'property.charLimit.maxChar')}
                      touched={_get(
                        touched,
                        'property.charLimit.isActive',
                        false
                      )}
                      min={0}
                      onChange={handleChange}
                      marginBottom={false}
                      fullWidth
                    />
                  </>
                )}
              </Container>
            )}
            {[customFieldTypes.file].includes(item?.type) && (
              <Container cols="2-3" isFormContainer>
                <CheckboxSwitcher
                  label="Upload Multiple Files"
                  labelPlacement={position.left}
                  name={'property.file.isMulti'}
                  value={_get(values, 'property.file.isMulti', false)}
                  onChange={handleChange}
                  marginBottom={false}
                />
                {_get(values, 'property.file.isMulti', false) && (
                  <FormControlNumericInput
                    label="Max Files"
                    name="property.file.max"
                    value={_get(values, 'property.file.max')}
                    error={_get(errors, 'property.file.max')}
                    touched={_get(touched, 'property.file.isMulti', false)}
                    min={2}
                    max={10}
                    onChange={handleChange}
                    marginBottom={false}
                    fullWidth
                    isRequired
                  />
                )}
              </Container>
            )}
            <Container cols="1-2" alignItems="center" isFormContainer>
              <CheckboxSwitcher
                label="Show Tooltip"
                labelPlacement={position.left}
                name={'showTooltip'}
                value={values.showTooltip}
                onChange={handleChange}
                marginBottom={false}
              />
              {values.showTooltip && (
                <>
                  <FormControlReactSelect
                    name="tooltipType"
                    label="Tooltip Type"
                    value={values.tooltipType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.tooltipType}
                    touched={touched.tooltipType}
                    options={tooltipTypeOptions}
                    fullWidth
                    marginBottom={false}
                    withPortal
                  />
                  <CheckboxSwitcher
                    label="Show Header"
                    labelPlacement={position.left}
                    name={'showTooltipHeader'}
                    value={values.showTooltipHeader}
                    onChange={handleChange}
                    marginBottom={false}
                  />

                  <FormControlInput
                    name="tooltipHeader"
                    label="Tooltip Header"
                    value={values.tooltipHeader}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.tooltipHeader}
                    touched={touched.tooltipHeader}
                    fullWidth
                    marginBottom={false}
                    withPortal
                    disabled={!values.showTooltipHeader}
                    isRequired={values.showTooltipHeader}
                  />
                </>
              )}
            </Container>
            {values.showTooltip && (
              <FormControlInput
                name="tooltip"
                label="Tooltip Text"
                value={values.tooltip}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.tooltip}
                touched={touched.tooltip}
                fullWidth
                marginBottom={false}
                multiline
                isRequired
              />
            )}
          </Container>
        </Spacing>
      </Scrollbars>
    </DefaultModal>
  )
}

export default FieldProperitesModal
