import { useMemo } from 'react'

import { ProfileCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { profileCardEditors } from 'constants/detailView'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { CheckboxSwitcher } from 'components/formControls'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { parseCurrency } from 'utils/generalUtils'
import { statusReturnValues, statusValues } from 'constants/commonOptions'
import useUser from 'hooks/useUser'
import Yup from 'utils/yup'
import ProductRecurringField from 'components/cards/DetailViewCards/ProfileCard/Fields/ProductRecurringField'
import { requiredField } from 'constants/validationMessages'
import ProductPriceField from 'components/cards/DetailViewCards/ProfileCard/Fields/ProductPriceField'

const initialValidationSchema = {
  [customFieldNames.productRecurringFrequency]: Yup.number()
    .when(customFieldNames.productRecurring, {
      is: true,
      then: () => Yup.number().required(requiredField)
    })
    .nullable()
}

const ProfileCardDetails = ({
  item,
  onEditSubmit,
  layout,
  isSubmitClick,
  isResetClick
}) => {
  const { data: user } = useUser()

  const profileCardList = useMemo(
    () => [
      {
        value: getCustomFieldValueByCode(item, customFieldNames.productCode)
      },
      {
        value: parseCurrency(
          getCustomFieldValueByCode(item, customFieldNames.productPrice, 0)
        )
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.productUnitOfMeasure}.name`,
          ''
        )
      },
      {
        value: item?.status
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
          name: customFieldNames.productCode,
          icon: getIconClassName(iconNames.product, iconTypes.duotone),
          value: getCustomFieldValueByCode(item, customFieldNames.productCode),
          component: CustomField,
          isCustomField: true
        },
        {
          name: customFieldNames.productPrice,
          icon: getIconClassName(iconNames.dollarSign, iconTypes.duotone),
          value: getCustomFieldValueByCode(item, customFieldNames.productPrice),
          component: ProductPriceField,
          label: 'Sales Price',
          isCustomField: true
        },
        {
          name: customFieldNames.productUnitOfMeasure,
          icon: getIconClassName(iconNames.productUsageUnit, iconTypes.duotone),
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.productUnitOfMeasure}.id`
          ),
          component: CustomField,
          isCustomField: true
        },
        {
          name: 'status',
          value: item?.status,
          icon: getIconClassName(iconNames.support, iconTypes.duotone),
          component: CheckboxSwitcher,
          props: {
            returnValues: statusReturnValues,
            labelPosition: 'left'
          }
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
      status: item?.status || statusValues.active,
      isCustomProduct: item?.isCustomProduct
    }),
    [item]
  )

  return (
    <ProfileCard
      isAvatarEditable={false}
      topChipValue={getCustomFieldValueByCode(
        item,
        `${customFieldNames.productRecurringFrequency}.id`
      )}
      displayList={profileCardList}
      owner={
        item?.createdBy
          ? {
              first_name: item.createdBy.firstName,
              last_name: item.createdBy.lastName
            }
          : {
              first_name: user?.firstName,
              last_name: user?.lastName
            }
      }
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      onlyEdit
      isSubmitClick={isSubmitClick}
      isResetClick={isResetClick}
      showEditorWithReadOnly
      hideFormActions
      hideTitle
      initialValue={initialValue}
      initialValidationSchema={initialValidationSchema}
    />
  )
}

export default ProfileCardDetails
