import { useMemo } from 'react'

import { ProfileCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { defaultOwner, profileCardEditors } from 'constants/detailView'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { parseCurrency } from 'utils/generalUtils'
import { statusValues } from 'constants/commonOptions'
import ProductRecurringField from 'components/cards/DetailViewCards/ProfileCard/Fields/ProductRecurringField'
import Yup from 'utils/yup'
import { requiredField } from 'constants/validationMessages'
import { entityValues } from 'constants/customFields'
import ProductPriceField from 'components/cards/DetailViewCards/ProfileCard/Fields/ProductPriceField'

const initialValidationSchema = {
  [customFieldNames.productRecurringFrequency]: Yup.number()
    .when(customFieldNames.productRecurring, {
      is: true,
      then: () => Yup.number().required(requiredField)
    })
    .nullable()
}

const ProfileCardDetails = ({ item, onEditSubmit, layout }) => {
  const profileCardList = useMemo(
    () => [
      {
        value: getCustomFieldValueByCode(item, customFieldNames.productCode)
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.productPrice)
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.productUnitOfMeasure}.name`,
          ''
        )
      }
    ],
    [item]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.topChip]: {
        name: customFieldNames.productRecurring,
        value: getCustomFieldValueByCode(
          item,
          customFieldNames.productRecurring,
          false
        ),
        component: ProductRecurringField,
        isCustomField: true,
        values: {
          [customFieldNames.productRecurring]: getCustomFieldValueByCode(
            item,
            customFieldNames.productRecurring
          ),
          [customFieldNames.productRecurringFrequency]:
            getCustomFieldValueByCode(
              item,
              `${customFieldNames.productRecurringFrequency}.id`
            )
        },
        label: 'Recurring'
      },
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.product, iconTypes.duotone),
          name: customFieldNames.productCode,
          value: getCustomFieldValueByCode(item, customFieldNames.productCode),
          component: CustomField,
          isCustomField: true
        },
        {
          name: customFieldNames.productPrice,
          value: getCustomFieldValueByCode(item, customFieldNames.productPrice),
          component: ProductPriceField,
          label: 'Sales Price',
          isCustomField: true,
          icon: getIconClassName(iconNames.dollarSign, iconTypes.duotone)
        },
        {
          name: customFieldNames.productUnitOfMeasure,
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.productUnitOfMeasure}.id`
          ),
          icon: getIconClassName(iconNames.productUsageUnit, iconTypes.duotone),
          component: CustomField,
          isCustomField: true
        }
      ]
    }),
    [item]
  )

  const initialValue = useMemo(
    () => ({
      [customFieldNames.productRecurringFrequency]: getCustomFieldValueByCode(
        item,
        `${customFieldNames.productRecurringFrequency}.id`,
        ''
      ),
      isCustomProduct: item?.isCustomProduct
    }),
    [item]
  )

  return (
    <ProfileCard
      avatarText={getTitleBasedOnEntity(entityValues.product, item)}
      isJdenticonIcon
      subTitleLabel={'Sale Price:'}
      isAvatarEditable={false}
      subTitle={parseCurrency(
        getCustomFieldValueByCode(item, customFieldNames.productPrice, 0)
      )}
      topChipValue={
        getCustomFieldValueByCode(
          item,
          customFieldNames.productRecurring,
          false
        )
          ? 'Recurring'
          : 'Non-Recurring'
      }
      isTopChipActive={getCustomFieldValueByCode(
        item,
        customFieldNames.productRecurring,
        false
      )}
      displayList={profileCardList}
      owner={
        item.createdBy
          ? {
              first_name: item.createdBy.firstName,
              last_name: item.createdBy.lastName
            }
          : defaultOwner
      }
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      showEditorWithReadOnly
      initialValue={initialValue}
      initialValidationSchema={initialValidationSchema}
      isAvatarActive={item?.status === statusValues.active}
      onAvatarClick={() =>
        onEditSubmit({
          status:
            item?.status === statusValues.active
              ? statusValues.inactive
              : statusValues.active
        })
      }
    />
  )
}

export default ProfileCardDetails
