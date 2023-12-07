import { froalaEntityNames } from 'constants/froalaConstants'
import { placeholderEntityValues } from 'constants/froalaPlaceholder'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from './customFieldUtils'
import customFieldNames from 'constants/customFieldNames'
import { _has } from './lodash'
import { entityValues } from 'constants/customFields'
import { calculateGrandTotal, calculateSubTotal } from './productItemUtils'

export const getPlaceholderPreviewData = (data, entity) => {
  switch (entity) {
    case froalaEntityNames.leadEmail:
      return {
        [placeholderEntityValues.lead]: data
      }
    case froalaEntityNames.accountEmail:
      return {
        [placeholderEntityValues.account]: data
      }
    case froalaEntityNames.contactEmail:
      return {
        [placeholderEntityValues.contact]: data,
        [placeholderEntityValues.account]: data?.accountId
      }
    case froalaEntityNames.opportunityEmail:
      return {
        [placeholderEntityValues.opportunity]: data,
        [placeholderEntityValues.account]: data?.account,
        [placeholderEntityValues.contact]: getCustomFieldValueByCode(
          data,
          customFieldNames.contactName
        )
      }
    case froalaEntityNames.proposalEmail:
      return {
        [placeholderEntityValues.proposal]: data?.proposal,
        [placeholderEntityValues.opportunity]: data,
        [placeholderEntityValues.account]: data?.account,
        [placeholderEntityValues.contact]: getCustomFieldValueByCode(
          data,
          customFieldNames.contactName
        )
      }
    case froalaEntityNames.estimateEmail:
      return {
        [placeholderEntityValues.estimate]: data,
        [placeholderEntityValues.account]: data?.account,
        [placeholderEntityValues.contact]: data?.contact,
        [placeholderEntityValues.opportunity]: data?.opportunity
      }
    default:
      return {}
  }
}

export const generatePlaceholderPreview = (
  value,
  data,
  isRemoveUnusedPlacehoder
) => {
  const keys = value.match(/\${[^}]*}/g)
  let _value = value
  keys &&
    keys.forEach(key => {
      const _key = key.replace('${', '').replace('}', '')
      const [group, field] = _key.split('.')
      if (
        group &&
        data?.[group] &&
        field &&
        (_has(data[group].customFields, field) || _has(data[group], field))
      ) {
        let fieldData =
          getCustomFieldValueByCode(data[group], field) || data[group]?.[field]

        if (Array.isArray(fieldData) && typeof fieldData[0] === 'object') {
          fieldData = fieldData.map(({ name }) => name).join(', ')
        } else if (Array.isArray(fieldData)) {
          fieldData = fieldData?.join(', ')
        } else if (typeof fieldData === 'object' && fieldData?.name) {
          fieldData = fieldData?.name
        } else if (typeof fieldData === 'object' && fieldData.first_name) {
          fieldData = `${fieldData.first_name} ${fieldData.last_name}`
        } else {
          fieldData = String(fieldData)
        }

        _value = _value.replaceAll(key, fieldData)
      } else if (isRemoveUnusedPlacehoder) {
        _value = _value.replaceAll(key, '')
      }
    })
  return _value
}

export const convertToProductItems = item => {
  return {
    items: item?.itemGroups
      ? item?.itemGroups.map(({ contact, address, items: _items }) => ({
          contact: getTitleBasedOnEntity(entityValues.contact, contact),
          address: address?.address1,
          items: _items.map(({ discount, taxPercent, quantity, product }) => {
            const subTotal = calculateSubTotal(
              getCustomFieldValueByCode(
                product,
                customFieldNames.productPrice,
                0
              ),
              quantity
            )
            return {
              productCode: getCustomFieldValueByCode(
                product,
                customFieldNames.productCode,
                ''
              ),
              productName: getCustomFieldValueByCode(
                product,
                customFieldNames.productName,
                ''
              ),
              productPrice: Number(
                getCustomFieldValueByCode(
                  product,
                  customFieldNames.productPrice,
                  0
                )
              ),
              discount: Number(discount || 0),
              quantity: Number(quantity),
              subTotal,
              tax: Number(taxPercent || 0),
              total: calculateGrandTotal(
                subTotal,
                Boolean(
                  getCustomFieldValueByCode(
                    item,
                    customFieldNames.shipToMultiple
                  )
                )
                  ? taxPercent
                  : 0,
                discount
              )
            }
          })
        }))
      : [],
    subTotal: Number(item?.subTotal),
    tax: Number(item?.taxPercent || 0),
    discount: Number(item?.discountPercent || 0),
    grandTotal: Number(item?.grandTotal)
  }
}
