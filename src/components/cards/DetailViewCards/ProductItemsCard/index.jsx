import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import GridCardBase from 'components/cards/GridCardBase'
import {
  numberMaximum,
  numberMinimum,
  requiredField
} from 'constants/validationMessages'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import customFieldNames from 'constants/customFieldNames'
import Spacing from 'components/containers/Spacing'
import { BlueButton, CircleIconButton, WhiteButton } from 'components/buttons'
import { SolutionSetModal } from 'components/modals'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import Tooltip from 'components/Tooltip'
import TableFooter from './TableFooter'
import TableContent from './TableContent'
import { _compact, _get, _isNotEmpty, _uniqueId } from 'utils/lodash'
import { CheckboxSwitcher } from 'components/formControls'
import { useGetSalesTaxesQuery } from 'api/salesTaxApi'
import { BIG_LIMIT } from 'constants/app'
import {
  calculateGrandTotal,
  calculateSubTotal,
  calculateTotalWithDiscountAndTax
} from 'utils/productItemUtils'
import useConfirmation from 'hooks/useConfirmation'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  cardContentWrap: {
    height: '100%',
    maxHeight: '805px',
    overflowY: 'auto',
    flexWrap: 'nowrap',
    position: 'relative',
    padding: '16px',
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: palette[type].scrollbar.background,
      borderRadius: '5px'
    }
  },
  footerRoot: {
    padding: '14px 25px',
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 4,
    left: 0,
    background: palette[type].card.background
  },
  iconButtonsRoot: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIcon: {
    ...typography.darkText[type],
    fontSize: 16,
    border: `1px solid ${palette[type].sideModal.content.border}`,
    height: 42,
    width: 42,
    paddingTop: 8
  },
  checkboxSwitchContainer: {
    justifyContent: 'flex-end'
  },
  checkboxSwitchLabel: {
    color: typography.darkText[type].color
  }
}))

const productItemsInitialValues = {
  productCode: '',
  productName: '',
  productId: '',
  productPrice: 0,
  quantity: 1,
  discount: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  isCustomProduct: false
}

const productGroupInitialValues = {
  contactId: '',
  address: '',
  addressId: ''
}

const initialValues = {
  items: [
    {
      ...productGroupInitialValues,
      items: [
        {
          ...productItemsInitialValues,
          id: _uniqueId()
        },
        {
          ...productItemsInitialValues,
          id: _uniqueId()
        }
      ]
    }
  ],
  subTotal: 0,
  tax: 0,
  discount: 0,
  grandTotal: 0,
  shipToMultiple: false
}

const itemValidationSchema = Yup.array().of(
  Yup.object().shape({
    productCode: Yup.string().required(requiredField),
    productId: Yup.string().required(requiredField),
    productPrice: Yup.number().required(requiredField),
    quantity: Yup.number().required(requiredField),
    discount: Yup.number(),
    total: Yup.number()
  })
)

const validationSchema = Yup.object().shape({
  items: Yup.array()
    .when('shipToMultiple', {
      is: true,
      then: () =>
        Yup.array().of(
          Yup.object().shape({
            addressId: Yup.string().required(requiredField),
            items: itemValidationSchema
          })
        ),
      otherwise: () =>
        Yup.array().of(
          Yup.object().shape({
            items: itemValidationSchema
          })
        )
    })
    .min(1, requiredField),
  discount: Yup.number().min(0, numberMinimum).max(100, numberMaximum),
  shipToMultiple: Yup.boolean()
})

const ProductItemsCard = ({
  title,
  data,
  leftFooterComponent,
  onSubmit,
  onlyEdit,
  isSubmitClick,
  isResetClick,
  disabledEdit = false,
  account,
  shippingAddress,
  onChangeFormValid,
  actions: parentAction,
  hideFooter = false,
  hideShipToMultiple = false
}) => {
  const classes = useStyles()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isEditAll, setEditAll] = useState(false)
  const initialFormValues = useRef(initialValues)
  const { showConfirmation } = useConfirmation()
  const { data: salesTaxData } = useGetSalesTaxesQuery({
    limit: BIG_LIMIT
  })
  const isSalesTax = ![0, false].includes(
    getCustomFieldValueByCode(account, customFieldNames.accountSalesTax)
  )

  useEffect(() => {
    if (onlyEdit) {
      setEditAll(true)
    }
  }, [onlyEdit])

  const submitValues = useCallback(
    values => {
      onSubmit(values)
      !onlyEdit && setEditAll(false)
    },
    [onSubmit, onlyEdit]
  )

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setValues,
    setFieldValue,
    validateForm,
    isValid
  } = useFormik({
    initialValues: initialFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit: submitValues
  })

  useEffect(() => {
    validateForm()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (onChangeFormValid) {
      onChangeFormValid(isValid)
    }
    //eslint-disable-next-line
  }, [isValid])

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

  useEffect(() => {
    if (_isNotEmpty(data)) {
      initialFormValues.current = {
        ...initialFormValues.current,
        items: (data.items?.length ? data.items : []).map(item => ({
          ...item,
          addressId:
            _compact([item.address?.address1, item.address?.address2]).join(
              ', '
            ) || '',
          items: (item.items?.length ? item.items : []).map(item => ({
            ...item,
            id: item.id || _uniqueId()
          }))
        })),
        subTotal: data.subTotal || 0,
        tax: data.tax || 0,
        discount: data.discount || 0,
        grandTotal: data.grandTotal || 0,
        shipToMultiple: data.shipToMultiple || false
      }
      setValues(initialFormValues.current)
    }
    //eslint-disable-next-line
  }, [data])

  const actions = useMemo(
    () => [
      ...(parentAction || []),
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        onClick: () => setEditAll(true),
        render: !onlyEdit && !disabledEdit
      },
      {
        label: 'Select a Solution',
        icon: getIconClassName(iconNames.solutionSet),
        onClick: () => setModalOpen(true),
        render: !disabledEdit
      }
    ],
    [parentAction, onlyEdit, disabledEdit]
  )

  useEffect(() => {
    if (isEditAll) {
      setValues({
        ...values,
        ...calculateTotalWithDiscountAndTax(
          {
            items: values.items,
            discount: values.discount,
            tax: values.shipToMultiple ? 0 : values.tax
          },
          values.shipToMultiple
        )
      })
    }
    //eslint-disable-next-line
  }, [values.items, values.discount])

  useEffect(() => {
    if (
      isEditAll &&
      shippingAddress &&
      !values.shipToMultiple &&
      salesTaxData.length
    ) {
      const saleTax =
        isSalesTax &&
        salesTaxData.find(
          ({ stateCode }) => stateCode === shippingAddress.state
        )
      setValues({
        ...values,
        tax: Number(saleTax?.tax || 0),
        ...calculateTotalWithDiscountAndTax({
          items: values.items,
          discount: values.discount,
          tax: saleTax?.tax
        })
      })
    }
    //eslint-disable-next-line
  }, [shippingAddress, isSalesTax])

  const handleEditAllDisable = useCallback(() => {
    setEditAll(false)
    handleReset()
  }, [handleReset])

  const handleSubmitValues = useCallback(() => {
    handleSubmit()
  }, [handleSubmit])

  const handleAddRow = index => () => {
    setFieldValue(`items.${index}.items`, [
      ...(values.items[index]?.items || []),
      { ...productItemsInitialValues, id: _uniqueId() }
    ])
  }

  const handleAddLocation = () => {
    setFieldValue(`items`, [
      ...values.items,
      {
        ...productGroupInitialValues,
        items: [{ ...productItemsInitialValues, id: _uniqueId() }]
      }
    ])
  }

  const handleRemoveRow = (parentIndex, index) => {
    let items = []
    if (
      values?.items &&
      values?.items.reduce((a, b) => a + b.items.length, 0) <= 1
    ) {
      items = [productItemsInitialValues]
    } else {
      items = [..._get(values, `items.${parentIndex}.items`, [])]
      items.splice(index, 1)
    }
    if (items.length === 0) {
      showConfirmation(
        'Are you sure you want to remove this item, this will also remove the Ship Location?',
        () => {
          const parentItems = [...values.items]
          parentItems.splice(parentIndex, 1)
          setFieldValue('items', parentItems)
          if (parentItems.length <= 1) {
            setFieldValue('shipToMultiple', false)
          }
        }
      )
    } else {
      setFieldValue(`items.${parentIndex}.items`, items)
    }
  }

  const handleSelectItem = useCallback(
    ({ items }) => {
      setFieldValue('items.0.items', [
        ...items.map(({ product, quantity }) => {
          const subTotal = calculateSubTotal(
            getCustomFieldValueByCode(
              product,
              customFieldNames.productPrice,
              0
            ),
            quantity
          )
          return {
            productCodeName: getCustomFieldValueByCode(
              product,
              customFieldNames.productCode
            ),
            productCode: product?.id,
            productId: product?.id,
            quantity: Number(quantity),
            productPrice: Number(
              getCustomFieldValueByCode(product, customFieldNames.productPrice)
            ),
            discount: 0,
            subTotal,
            tax: _get(values, 'items.0.items.0.tax', 0),
            total: calculateGrandTotal(
              subTotal,
              values.shipToMultiple ? _get(values, 'items.0.items.0.tax', 0) : 0
            )
          }
        })
      ])
      setModalOpen(false)
      setEditAll(true)
    },
    [setFieldValue, values]
  )

  const handleChangeShipToMultiple = useCallback(
    e => {
      const {
        target: { value }
      } = e

      const saleTax =
        isSalesTax &&
        salesTaxData.find(
          ({ stateCode }) => stateCode === shippingAddress?.state
        )

      handleChange(e)

      let items = [...values.items].map(item => ({
        ...item,
        items: item.items.map(_item => {
          const subTotal = calculateSubTotal(_item.productPrice, _item.quantity)
          const total = calculateGrandTotal(
            subTotal,
            value ? _item.tax : 0,
            _item.discount
          )

          return {
            ..._item,
            subTotal,
            total
          }
        })
      }))

      if (!value) {
        items = [
          {
            ...productGroupInitialValues,
            items: items.reduce((a, b) => a.concat(b.items), [])
          }
        ]

        setFieldValue('tax', Number(saleTax?.tax || 0))
      }

      if (value && items.length <= 1) {
        items.push({
          ...productGroupInitialValues,
          items: [{ ...productItemsInitialValues, id: _uniqueId() }]
        })
      }

      setFieldValue('items', items)
    },
    [
      values,
      handleChange,
      setFieldValue,
      salesTaxData,
      isSalesTax,
      shippingAddress?.state
    ]
  )

  return (
    <>
      <GridCardBase
        title={title}
        dropdown={false}
        removeScrollbar
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        contentWrapClassName={classes.cardContentWrap}
        iconButtonComponent={
          <div className={classes.iconButtonsRoot}>
            {actions
              .filter(({ render }) => render !== false)
              .map(({ icon, label, onClick }, index) => (
                <Grid item key={`action-tabs-${index}`}>
                  <Tooltip arrow title={label} placement="top">
                    <CircleIconButton
                      className={classNames('hvr-grow', classes.actionIcon)}
                      onClick={onClick}
                    >
                      <i className={icon} />
                    </CircleIconButton>
                  </Tooltip>
                </Grid>
              ))}
          </div>
        }
      >
        {!hideShipToMultiple && (
          <Spacing>
            <CheckboxSwitcher
              label={'Ship to Multiple Locations'}
              name={'shipToMultiple'}
              value={values?.shipToMultiple}
              onChange={handleChangeShipToMultiple}
              disabled={!isEditAll}
              switchContainerClass={classes.checkboxSwitchContainer}
              formControlLabelClass={classNames({
                [classes.checkboxSwitchLabel]: values.shipToMultiple
              })}
            />
          </Spacing>
        )}
        <TableContent
          values={values}
          errors={errors}
          touched={touched}
          setValues={setValues}
          handleBlur={handleBlur}
          isEditAll={isEditAll}
          onRemoveRow={handleRemoveRow}
          isMultipleShip={values.shipToMultiple}
          handleChange={handleChange}
          account={account}
          onAddRow={handleAddRow}
          salesTaxData={salesTaxData}
          hideShipToMultiple={hideShipToMultiple}
        />
        {!hideFooter && (
          <TableFooter
            values={values}
            errors={errors}
            touched={touched}
            isEditAll={isEditAll}
            leftFooterComponent={leftFooterComponent}
            handleAddRow={handleAddRow(0)}
            handleAddLocation={handleAddLocation}
            isMultipleShip={values.shipToMultiple}
            handleChange={handleChange}
            onEnableEdit={() => setEditAll(true)}
          />
        )}
      </GridCardBase>
      {isEditAll && !onlyEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            iconClassName={getIconClassName(iconNames.cancel)}
            onClick={handleEditAllDisable}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            onClick={handleSubmitValues}
            iconClassName={getIconClassName(iconNames.save)}
          >
            Save
          </BlueButton>
        </Spacing>
      )}
      <SolutionSetModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectItem}
      />
    </>
  )
}

export default ProductItemsCard
