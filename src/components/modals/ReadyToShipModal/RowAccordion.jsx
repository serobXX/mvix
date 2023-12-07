import { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import GridLayout from 'components/GridLayout'
import ProductItemsCard from './components/ProductItemsCard'
import PackageCard from './components/PackageCard'
import Accordion from 'components/Accordion'
import RateCard from './components/RateCard'
import { useCalculateShippingMutation } from 'api/shippingApi'
import { _compact, _isNotEmpty } from 'utils/lodash'
import { requiredField } from 'constants/validationMessages'

const useStyles = makeStyles(({ palette, type, typography, fontSize }) => ({
  gridLayoutRoot: {
    paddingLeft: 7,
    paddingTop: 10
  },
  accordionRoot: {
    background: palette[type].customAccordion.header.background,
    boxShadow: palette[type].pages.dashboard.card.boxShadow,
    paddingTop: 12,
    border: 'none',
    borderRadius: 4,
    marginBottom: '16px !important'
  },
  accordionHeader: {
    background: 'transparent',
    padding: '0px 27px',
    marginBottom: 6,
    borderBottom: `5px solid ${palette[type].customAccordion.header.background} !important`
  },
  accordionContent: {
    border: '5px solid ' + palette[type].customAccordion.header.background,
    borderTop: 'none',
    borderRightWidth: '4px',
    backgroundColor: palette[type].customAccordion.content.background
  },
  accordionTitle: {
    ...typography.darkText[type],
    fontSize: fontSize.primary,
    lineHeight: '1.667em'
  },
  accordionSummaryContent: {
    justifyContent: 'flex-start'
  }
}))

const RowAccordion = ({
  invoice,
  item,
  open,
  onChangeAccordion,
  name,
  values,
  errors,
  touched,
  onChange,
  index,
  isLast,
  hideAccordion
}) => {
  const classes = useStyles()
  const [isPackageEdit, setPackageEdit] = useState(false)

  const [postCalcShipping, { data: shipments, isLoading: shipmentLoading }] =
    useCalculateShippingMutation()

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 3,
        h: 15,
        autoHeight: true,
        i: 'product_items'
      },
      {
        x: 0,
        y: 15,
        w: 3,
        h: 10,
        autoHeight: true,
        i: 'package'
      },
      {
        x: 4,
        y: 0,
        w: 2,
        h: 20,
        i: 'rates'
      }
    ],
    []
  )

  const handleChangePackage = useCallback(
    e => {
      const {
        target: {
          value: { length, height, width, distanceUnit, weight, massUnit }
        }
      } = e
      const data = {
        invoiceId: invoice?.id,
        shippingGroup: [
          {
            itemGroupId: item?.itemGroupId,
            parcel: {
              length,
              width,
              height,
              distanceUnit,
              weight,
              massUnit
            }
          }
        ]
      }
      postCalcShipping(data)
      onChange(e)
    },
    [onChange, postCalcShipping, invoice?.id, item?.itemGroupId]
  )

  const handleChangeRate = useCallback(
    e => {
      onChange(e)
      if (!isLast) onChangeAccordion(index + 1)(null, true)
    },
    [onChange, onChangeAccordion, index, isLast]
  )

  const handleRefresh = useCallback(() => {
    const { length, height, width, distanceUnit, weight, massUnit } =
      values.package
    const data = {
      invoiceId: invoice?.id,
      shippingGroup: [
        {
          itemGroupId: item?.itemGroupId,
          parcel: {
            length,
            width,
            height,
            distanceUnit,
            weight,
            massUnit
          }
        }
      ]
    }
    postCalcShipping(data)
  }, [postCalcShipping, invoice?.id, values, item?.itemGroupId])

  const cards = useMemo(
    () => ({
      product_items: <ProductItemsCard itemGroup={item} item={invoice} />,
      package: (
        <PackageCard
          name={`${name}.package`}
          values={values.package}
          onChange={handleChangePackage}
          error={errors.package}
          touched={touched.package}
          setPackageEdit={setPackageEdit}
        />
      ),
      rates: (
        <RateCard
          list={shipments && Object.values(shipments)?.[0]}
          isLoading={shipmentLoading}
          name={`${name}.rateId`}
          value={values.rateId}
          onChange={handleChangeRate}
          isPackageEdit={isPackageEdit}
          error={errors.rateId}
          touched={touched.rateId}
          onRefresh={handleRefresh}
        />
      )
    }),
    [
      item,
      invoice,
      name,
      values,
      handleChangePackage,
      errors,
      touched,
      shipments,
      shipmentLoading,
      handleChangeRate,
      isPackageEdit,
      handleRefresh
    ]
  )

  const AccordionWrapper = useCallback(
    ({
      hideAccordion,
      children,
      open,
      onChangeAccordion,
      errors,
      touched,
      classes,
      index,
      item
    }) =>
      hideAccordion ? (
        children
      ) : (
        <Accordion
          rootClassName={classes.accordionRoot}
          summaryRootClassName={classes.accordionHeader}
          contentClass={classes.accordionContent}
          titleClasName={classes.accordionTitle}
          title={`Address: ${
            _compact([item.address?.address1, item.address?.address2]).join(
              ', '
            ) || ''
          }`}
          summaryContentClassName={classes.accordionSummaryContent}
          open={open}
          onChange={onChangeAccordion(index)}
          error={
            _isNotEmpty(touched) && _isNotEmpty(errors) ? requiredField : false
          }
        >
          {children}
        </Accordion>
      ),
    []
  )

  return (
    <AccordionWrapper
      hideAccordion={hideAccordion}
      open={open}
      onChangeAccordion={onChangeAccordion}
      errors={errors}
      touched={touched}
      classes={classes}
      index={index}
      item={item}
    >
      <div className={classes.gridLayoutRoot}>
        <GridLayout
          cards={cards}
          positions={positions}
          gridWidth={hideAccordion ? 1415 : 1390}
          disableDragging
        />
      </div>
    </AccordionWrapper>
  )
}

export default RowAccordion
