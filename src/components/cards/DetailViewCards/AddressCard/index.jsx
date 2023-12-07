import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import * as Yup from 'yup'
import classNames from 'classnames'
import update from 'immutability-helper'
import { useFormik } from 'formik'

import GoogleMapWrapper from 'components/GoogleMapWrapper'
import GridCardBase from 'components/cards/GridCardBase'
import { UpperTab, UpperTabs } from 'components/tabs'
import { createTab } from 'components/tabs/SideTabGroup'
import { Text, TextWithTooltip } from 'components/typography'
import { requiredField } from 'constants/validationMessages'
import Icon from 'components/icons/Icon'
import { FormControlSelectLocations } from 'components/formControls'
import { BlueButton, WhiteButton } from 'components/buttons'
import Spacing from 'components/containers/Spacing'
import { _get, _isNotEmpty } from 'utils/lodash'
import { formToTouched } from 'utils/formik'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import {
  addressToBillingShipping,
  billingShippingToAddress,
  transformAddress
} from 'utils/detailViewUtils'
import CopyTextIcon from 'components/CopyTextIcon'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import AddressForm from './AddressForm'
import SelectAddressModal from './SelectAddressModal'
import customFieldNames from 'constants/customFieldNames'

const useStyles = makeStyles(
  ({ palette, type, fontSize, lineHeight, colors, typography }) => ({
    cardRoot: {
      display: 'flex',
      flexDirection: 'column',
      boxShadow: palette[type].pages.dashboard.card.boxShadow,
      '&:hover $copyIcon': {
        opacity: 1,
        visibility: 'visible',
        marginRight: 0
      }
    },
    cardContentRoot: {
      flexGrow: 1,
      borderRadius: 4
    },
    cardContentWrap: {
      height: '100%',
      flexDirection: 'row'
    },
    gridWrap: {
      height: '100%',
      flexDirection: 'column'
    },
    mapRoot: {
      width: '100%',
      height: '260px',
      position: 'relative'
    },
    mapContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    tabContentRoot: {
      flexGrow: 1,
      background: palette[type].card.background
    },
    tabContentFieldRoot: {
      background: 'transparent'
    },
    listRoot: {
      padding: '17px 20px 13px 20px',
      gap: 10,
      width: '100%',
      maxWidth: '100%'
    },
    listRow: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center'
    },
    listValueIcon: {
      textAlign: 'center',
      fontSize: 25,
      lineHeight: lineHeight.big,
      color: colors.highlight,
      marginRight: 10,
      width: 25,
      height: 30
    },
    listValueText: {
      ...typography.lightText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary
    },
    listValueNoDataText: {
      ...typography.lightText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      flexGrow: 1,
      textAlign: 'center'
    },
    addIcon: {
      ...typography.darkText[type],
      fontSize: fontSize.big
    },
    footerRoot: {
      paddingRight: 25,
      gridColumnGap: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      top: 2,
      left: 0,
      background: palette[type].card.background,
      paddingTop: 10,
      paddingBottom: 10
    },
    tabRoot: {
      flexGrow: 1,
      overflow: 'auto'
    },
    hoverOverActionRoot: {
      paddingTop: 5,
      paddingRight: 10,
      background: palette[type].pages.dashboard.card.background
    },
    hoverOverActionButton: {
      color: typography.darkText[type].color,
      transition: '0.3s opacity, 0.3s visibility, 0.3s margin',
      fontSize: '1rem'
    },
    copyIcon: {
      opacity: 0,
      visibility: 'hidden',
      transition: '0.3s opacity, 0.3s visibility, 0.3s margin-right',
      cursor: 'pointer',
      fontSize: 16,
      marginRight: '-35px'
    },
    upperTabsRoot: {
      background: palette[type].pages.dashboard.card.background
    },
    upperTabRoot: {
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary,
      '& span': {
        textTransform: 'capitalize !important'
      }
    },
    formControlDisable: {
      marginTop: 10
    },
    notValid: {
      color: 'red'
    }
  })
)

const DEFAULT_COORDS = { lat: 47.6184529, lng: -117.3789618 }

const addressSchema = Yup.object().shape({
  address1: Yup.string().required(requiredField),
  locationAddress: Yup.string(),
  city: Yup.string().required(requiredField),
  state: Yup.string().required(requiredField),
  country: Yup.string().required(requiredField),
  zipCode: Yup.string().required(requiredField)
})

const validationSchema = (
  name,
  onlyBillingAndShipping,
  onlyEdit,
  isShippingValidate
) =>
  Yup.object().shape({
    [name]: Yup.array().of(
      isShippingValidate
        ? Yup.lazy(item => {
            if (item.isShipping) {
              return addressSchema
            }
            return Yup.object()
          })
        : onlyEdit
        ? Yup.object()
        : onlyBillingAndShipping
        ? addressSchema
        : Yup.object().shape({
            address1: Yup.string().required(requiredField)
          })
    )
  })

const AddressCard = ({
  value,
  values: _parentValues,
  name,
  onEditSubmit,
  showEditorWithReadOnly = false,
  onlyBillingAndShipping = false,
  onlyEdit = false,
  isSubmitClick,
  isResetClick,
  accountId,
  returnDataOnBlur = false,
  onBlur,
  isShippingValidate = false
}) => {
  const [selectedTab, setSelectedTab] = useState()
  const [isAdd, setAdd] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const classes = useStyles({ isMapSmall: isEdit || isAdd })
  const initialValues = useRef({
    [name]: [],
    [customFieldNames.shipToMultiple]: false
  })

  const onSubmit = useCallback(
    values => {
      if (onlyBillingAndShipping) {
        onEditSubmit({
          ...addressToBillingShipping(values[name])
        })
      } else {
        onEditSubmit(values)
      }
    },
    [name, onlyBillingAndShipping, onEditSubmit]
  )

  const {
    values,
    errors,
    touched,
    isValid,
    setFieldValue,
    setValues,
    handleSubmit,
    handleReset,
    setTouched,
    handleChange,
    handleBlur: handleBlurField,
    validateField
  } = useFormik({
    initialValues: initialValues.current,
    validationSchema: validationSchema(
      name,
      onlyBillingAndShipping,
      onlyEdit,
      isShippingValidate
    ),
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    if (onlyEdit) {
      setEdit(true)
    }
  }, [onlyEdit])

  useEffect(() => {
    if (isSubmitClick) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      handleReset()
    }
    //eslint-disable-next-line
  }, [isResetClick])

  const addresses = useMemo(() => values[name], [values, name])

  useEffect(() => {
    initialValues.current = {
      [name]: [
        ...(onlyBillingAndShipping
          ? billingShippingToAddress(_parentValues)
          : value.length
          ? value
          : [
              {
                address1: '',
                address2: '',
                latitude: DEFAULT_COORDS.lat,
                longitude: DEFAULT_COORDS.lng
              }
            ])
      ]
    }
    setValues(initialValues.current)
    //eslint-disable-next-line
  }, [value, _parentValues])

  const tabs = useMemo(
    () =>
      addresses.map(({ isBilling, isShipping }, index) =>
        createTab(
          isBilling
            ? 'Bill Address'
            : isShipping
            ? 'Ship Address'
            : `Address ${index + 1}`,
          index
        )
      ),
    [addresses]
  )

  useEffect(() => {
    if (tabs.length && !selectedTab) {
      setSelectedTab(tabs[0]?.value)
    }
    //eslint-disable-next-line
  }, [tabs])

  const handleBlur = useCallback(
    e => {
      handleBlurField(e)
      if (returnDataOnBlur && onBlur) {
        if (onlyBillingAndShipping) {
          onBlur({
            ...addressToBillingShipping(values[name])
          })
        } else onBlur(values)
      }
    },
    [
      handleBlurField,
      returnDataOnBlur,
      values,
      name,
      onBlur,
      onlyBillingAndShipping
    ]
  )

  const handleChangeTab = useCallback((_, tab) => {
    setSelectedTab(tab)
  }, [])

  const selectedTabRecords = useMemo(
    () => addresses?.[selectedTab],
    [addresses, selectedTab]
  )
  const coords = useMemo(
    () =>
      selectedTabRecords && {
        lat: selectedTabRecords.latitude,
        lng: selectedTabRecords.longitude
      },
    [selectedTabRecords]
  )

  const handleAddAddress = useCallback(() => {
    setAdd(true)
    if (!!value.length) {
      setSelectedTab(values[name].length)
      setValues({
        [name]: [
          ...values[name],
          {
            address1: ''
          }
        ]
      })
    }
  }, [setValues, name, values, value])

  const handleCloneAddress = useCallback(() => {
    if (selectedTab || selectedTab === 0) {
      setAdd(true)
      setValues({
        [name]: [
          ...values[name],
          {
            ...values[name][selectedTab],
            isBilling: false,
            isShipping: false
          }
        ]
      })
      setSelectedTab(values[name].length)
    }
  }, [setValues, name, values, selectedTab])

  const handleCopyAddress = useCallback(() => {
    if (selectedTab || selectedTab === 0) {
      const index = selectedTab === 0 ? 1 : 0
      setEdit(true)
      setValues(
        update(values, {
          [name]: {
            [index]: {
              $set: {
                ...values[name][selectedTab],
                isBilling: index === 0,
                isShipping: index === 1
              }
            }
          }
        })
      )
      setSelectedTab(values[name].length - 1)
    }
  }, [setValues, name, values, selectedTab])

  const handleDeleteAddress = useCallback(async () => {
    if (selectedTab || selectedTab === 0) {
      const address = [...values[name]]
      address.splice(selectedTab, 1)
      setSelectedTab(null)
      await setValues({
        [name]: address
      })
      handleSubmit()
    }
  }, [selectedTab, setValues, name, values, handleSubmit])

  const handleChangeLocation = useCallback(
    ({ target: { name: _name, value: _value, data } }) => {
      const _addresses = transformAddress(_value, data)
      if (onlyBillingAndShipping) {
        _addresses.locationAddress = _value
        _addresses.state = _addresses.stateShort
        _addresses.country = _addresses.countryShort
        if (selectedTab === 0) {
          _addresses.isBilling = true
        } else _addresses.isShipping = true
      }
      if (_addresses) {
        setFieldValue(`${name}.${selectedTab}`, _addresses)
      } else setFieldValue(_name, _value)
    },
    [setFieldValue, name, selectedTab, onlyBillingAndShipping]
  )

  const handleSaveClick = async () => {
    if (onlyBillingAndShipping) {
      setTouched(formToTouched(values, [], true))
      await validateField(`${name}.${selectedTab}`)
      if (!_get(errors, `${name}.${selectedTab}`)) {
        onEditSubmit({
          ...addressToBillingShipping(values[name])
        })
        setEdit(false)
        setTouched(formToTouched(values, [], false))
      }
    } else {
      if (isValid) {
        handleSubmit()
        setEdit(false)
        setAdd(false)
      } else {
        setTouched(formToTouched(values, [], true))
      }
    }
  }

  const handleCancelClick = () => {
    if (isAdd) {
      setSelectedTab(0)
    }
    handleReset()
    setEdit(false)
    setAdd(false)
  }

  const handleSetAddress = useCallback(
    name => {
      onEditSubmit({
        addresses:
          values?.addresses &&
          values?.addresses.map((address, index) => ({
            ...address,
            ...(name === 'isBilling'
              ? {
                  isShipping:
                    selectedTab === index ? false : address.isShipping,
                  isBilling: false
                }
              : name === 'isShipping'
              ? {
                  isBilling: selectedTab === index ? false : address.isBilling,
                  isShipping: false
                }
              : {}),
            [name]: selectedTab === index
          }))
      })
    },
    [onEditSubmit, values?.addresses, selectedTab]
  )

  const dropdownItems = useMemo(
    () => [
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit, iconTypes.duotone),
        onClick: () => setEdit(true)
      },
      {
        label: 'Copy',
        icon: getIconClassName(iconNames.clone, iconTypes.duotone),
        onClick: handleCopyAddress,
        render: onlyBillingAndShipping
      },
      {
        label: 'Clone',
        icon: getIconClassName(iconNames.clone, iconTypes.duotone),
        onClick: handleCloneAddress,
        render: !!value.length && !onlyBillingAndShipping
      },
      {
        label: 'Select from Account Address',
        icon: getIconClassName(iconNames.account, iconTypes.duotone),
        onClick: () => setModalOpen(true),
        render: onlyBillingAndShipping && !!accountId
      },
      {
        label: 'Set as Bill Address',
        icon: getIconClassName(iconNames.addressCard, iconTypes.duotone),
        onClick: () => handleSetAddress('isBilling'),
        render:
          !!value.length &&
          !selectedTabRecords?.isBilling &&
          !onlyBillingAndShipping
      },
      {
        label: 'Set as Ship Address',
        icon: getIconClassName(iconNames.addressCard, iconTypes.duotone),
        onClick: () => handleSetAddress('isShipping'),
        render:
          !!value.length &&
          !selectedTabRecords?.isShipping &&
          !onlyBillingAndShipping
      },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete, iconTypes.duotone),
        onClick: handleDeleteAddress,
        render: !!value.length && !onlyBillingAndShipping
      },
      {
        label: 'Add New',
        icon: getIconClassName(iconNames.add),
        onClick: handleAddAddress,
        render: !onlyBillingAndShipping
      }
    ],
    [
      handleAddAddress,
      handleCloneAddress,
      handleDeleteAddress,
      value,
      handleSetAddress,
      selectedTabRecords,
      onlyBillingAndShipping,
      handleCopyAddress,
      accountId
    ]
  )

  const handleSelectAddress = useCallback(
    item => {
      const _addresses = { ...item }

      if (onlyBillingAndShipping) {
        _addresses.locationAddress = `${item.address1}, ${item.address2}`
        if (selectedTab === 0) {
          _addresses.isBilling = true
        } else _addresses.isShipping = true
      }

      setFieldValue(`${name}.${selectedTab}`, _addresses)
      setEdit(true)
      setModalOpen(false)
    },
    [name, selectedTab, onlyBillingAndShipping, setFieldValue]
  )

  return (
    <>
      <GridCardBase
        dropdown={false}
        title={!tabs.length ? 'Addresses' : ''}
        iconButtonComponent={
          <Icon
            icon={getIconClassName(iconNames.gridCardAdd)}
            onClick={handleAddAddress}
            className={classes.addIcon}
          />
        }
        removeSidePaddings
        removeScrollbar
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        contentWrapClassName={classes.cardContentWrap}
      >
        {!!tabs.length && (
          <Grid container className={classes.gridWrap}>
            <Grid item container wrap="nowrap">
              <Grid item className={classes.tabRoot}>
                <UpperTabs
                  value={selectedTab}
                  onChange={handleChangeTab}
                  className={classes.upperTabsRoot}
                >
                  {tabs.map(({ label, value }, index) => (
                    <UpperTab
                      key={`upper-tab-address-${value}`}
                      label={label}
                      value={value}
                      className={classNames(classes.upperTabRoot, {
                        [classes.notValid]:
                          _isNotEmpty(_get(errors, `${name}.${index}`)) &&
                          _isNotEmpty(_get(touched, `${name}.${index}`))
                      })}
                      disableRipple
                    />
                  ))}
                </UpperTabs>
              </Grid>
              {!onlyEdit && (
                <Grid item className={classes.hoverOverActionRoot}>
                  <HoverOverDropdownButton
                    iconButtonClassName={classes.hoverOverActionButton}
                    items={dropdownItems}
                  />
                </Grid>
              )}
            </Grid>
            <Grid
              container
              className={classNames(classes.tabContentRoot, {
                [classes.tabContentFieldRoot]: onlyBillingAndShipping
              })}
            >
              {!onlyBillingAndShipping && (
                <div className={classes.mapRoot}>
                  <GoogleMapWrapper
                    zoom={10}
                    coords={coords}
                    center={coords || DEFAULT_COORDS}
                    mapContainerClassName={classes.mapContainer}
                    isGrayScaleTheme
                  />
                </div>
              )}
              {selectedTabRecords &&
                (onlyBillingAndShipping ? (
                  <AddressForm
                    name={name}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleChangeLocation={handleChangeLocation}
                    isEdit={isEdit}
                    selectedTab={selectedTab}
                    showEditorWithReadOnly={showEditorWithReadOnly}
                    onDoubleClick={() => setEdit(true)}
                  />
                ) : (
                  <Grid
                    container
                    wrap="nowrap"
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.listRoot}
                  >
                    <div
                      className={classes.listRow}
                      onDoubleClick={() => setEdit(true)}
                    >
                      {isEdit || isAdd || showEditorWithReadOnly ? (
                        <FormControlSelectLocations
                          label={
                            showEditorWithReadOnly && !isEdit && !isAdd
                              ? ''
                              : 'Address'
                          }
                          name={`${name}.${selectedTab}.address1`}
                          value={`${[
                            _get(values, `${name}.${selectedTab}.address1`),
                            _get(values, `${name}.${selectedTab}.address2`)
                          ]
                            .filter(str => !!str)
                            .join(', ')}`}
                          error={_get(
                            errors,
                            `${name}.${selectedTab}.address1`
                          )}
                          touched={_get(
                            touched,
                            `${name}.${selectedTab}.address1`
                          )}
                          onChange={handleChangeLocation}
                          marginBottom={false}
                          withPortal
                          isClearable={false}
                          autoFocus={
                            !showEditorWithReadOnly && (isEdit || isAdd)
                          }
                          readOnlyWithoutSelection={
                            showEditorWithReadOnly && !isEdit && !isAdd
                          }
                          startAdornmentIcon={getIconClassName(
                            iconNames.location,
                            iconTypes.duotone
                          )}
                          fullWidth
                          formControlContainerClass={classNames({
                            [classes.formControlDisable]:
                              showEditorWithReadOnly && !isEdit && !isAdd
                          })}
                          isRequired
                        />
                      ) : (
                        <>
                          <i
                            className={classNames(
                              getIconClassName(
                                iconNames.location,
                                iconTypes.duotone
                              ),
                              classes.listValueIcon
                            )}
                          />
                          <div>
                            {selectedTabRecords.address1 ? (
                              <TextWithTooltip
                                rootClassName={classes.listValueText}
                                maxWidth={210}
                              >
                                {selectedTabRecords.address1}
                              </TextWithTooltip>
                            ) : (
                              <Text rootClassName={classes.listValueNoDataText}>
                                {'-----'}
                              </Text>
                            )}
                            {selectedTabRecords.address2 && (
                              <TextWithTooltip
                                rootClassName={classes.listValueText}
                                maxWidth={210}
                                onDoubleClick={() => setEdit(true)}
                              >
                                {selectedTabRecords.address2}
                              </TextWithTooltip>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {(selectedTabRecords.address1 ||
                      selectedTabRecords.address2) && (
                      <CopyTextIcon
                        iconClassName={classNames(
                          classes.listValueIcon,
                          classes.copyIcon
                        )}
                        copyText="Click to Copy Address"
                        copiedText="Address copied to clipboard"
                        text={`${selectedTabRecords.address1}, ${selectedTabRecords.address2}`}
                      />
                    )}
                  </Grid>
                ))}
            </Grid>
          </Grid>
        )}
      </GridCardBase>
      {(isAdd || isEdit) && !onlyEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            iconClassName={getIconClassName(iconNames.cancel)}
            onClick={handleCancelClick}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            onClick={handleSaveClick}
            iconClassName={getIconClassName(iconNames.save)}
          >
            Save
          </BlueButton>
        </Spacing>
      )}
      {isModalOpen && (
        <SelectAddressModal
          id={accountId}
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleSelectAddress}
        />
      )}
    </>
  )
}

AddressCard.defaultProps = {
  value: []
}

export default AddressCard
