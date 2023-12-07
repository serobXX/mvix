import { useCallback, useMemo } from 'react'

import { ProfileCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { entityValues } from 'constants/customFields'
import { profileCardEditors } from 'constants/detailView'
import {
  getCustomFieldValueByCode,
  getOwnerBasedOnEntity,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { _get } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import {
  getAccountOptions,
  getContactOptions,
  getOpportunityOptions,
  getUserOptions
} from 'utils/autocompleteOptions'
import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlSelectLocations,
  FormControlTelInput
} from 'components/formControls'
import { simulateEvent } from 'utils/formik'
import {
  billingShippingToAddress,
  getPhones,
  transformAddress
} from 'utils/detailViewUtils'
import useUser from 'hooks/useUser'

const ProfileCardDetails = ({
  isFetching,
  item,
  onEditSubmit,
  layout,
  onlyEdit,
  initialValue,
  initialValidationSchema,
  isSubmitClick,
  isResetClick,
  disabledFields,
  onChangeFormValid,
  onBlur
}) => {
  const { data: user } = useUser()

  const address = useMemo(() => {
    return billingShippingToAddress(item?.customFields)?.[0] || {}
  }, [item])

  const phones = useMemo(() => getPhones(layout, item), [item, layout])

  const profileCardList = useMemo(
    () => [
      {
        value: item?.estimateName
      },
      {
        value: getTitleBasedOnEntity(entityValues.account, item?.account)
      },
      {
        value: item?.contact?.id
      },
      {
        values: Object.values(phones).reverse()
      },
      {
        value: getTitleBasedOnEntity(
          entityValues.opportunity,
          item?.opportunity
        )
      },
      {
        noData: !address.state && !address.city,
        value: `${address.state || address.city} (${
          address.countryShort || address.country
        })`
      }
    ],
    [item, address, phones]
  )

  const onChangeAccount = useCallback(
    handleChange => e => {
      const {
        target: { name, value, ...account }
      } = e
      handleChange(e)
      handleChange(simulateEvent('account', account))
    },
    []
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
          name: 'estimateName',
          label: 'Estimate Name',
          value: item?.estimateName,
          component: FormControlInput,
          isRequired: true
        },
        {
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          label: 'Account',
          name: 'accountId',
          value: _get(item, 'account.id'),
          component: FormControlAutocomplete,
          isRequired: true,
          props: ({ accountId }) => ({
            onChange: onChangeAccount,
            getOptions: getAccountOptions(null, null, { passAllFields: true }),
            initialFetchValue: accountId
          })
        },
        {
          icon: getIconClassName(iconNames.contact, iconTypes.duotone),
          name: 'contactId',
          label: 'Contact',
          value: item?.contact?.id,
          component: FormControlAutocomplete,
          isSingleEditor: true,
          isRequired: true,
          props: ({ contactId, accountId }) => ({
            getOptions: getContactOptions(null, null, {
              options: { accountId }
            }),
            initialFetchValue: contactId
          })
        },
        {
          component: FormControlTelInput,
          values: phones
        },
        {
          icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
          name: 'opportunityId',
          label: 'Opportunity',
          value: _get(item, 'opportunity.id'),
          component: FormControlAutocomplete,
          isRequired: true,
          props: ({ opportunityId }) => ({
            getOptions: getOpportunityOptions(),
            initialFetchValue: opportunityId
          })
        },
        {
          icon: getIconClassName(iconNames.location, iconTypes.duotone),
          name: 'address',
          value: !!address.city
            ? `${address.state || address.city} (${
                address.countryShort || address.country
              })`
            : '',
          component: FormControlSelectLocations,
          props: {
            withPortal: true,
            label: 'City, State, Country',
            formatLabel: ({ state, name, country }) =>
              `${name?.longName || name || ''}, ${state?.longName || ''} (${
                country?.shortName || ''
              })`,
            onChange:
              handleChange =>
              ({ target: { name, value, data } }) => {
                handleChange(simulateEvent(name, value))
                handleChange(
                  simulateEvent('addressData', transformAddress(value, data))
                )
              }
          }
        }
      ],
      [profileCardEditors.footer]: {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: customFieldNames.estimateOwner,
        value:
          getOwnerBasedOnEntity(entityValues.estimate, item)?.id || user?.id,
        component: FormControlAutocomplete,
        props: {
          getOptions: getUserOptions(null, null, {
            passIdForNumber: true
          }),
          initialFetchValue:
            getOwnerBasedOnEntity(entityValues.estimate, item)?.id || user?.id,
          withPortal: true
        }
      }
    }),
    [item, address, phones, user, onChangeAccount]
  )

  return (
    <ProfileCard
      isFetching={isFetching}
      displayList={profileCardList}
      owner={getCustomFieldValueByCode(
        item,
        customFieldNames.estimateOwner,
        user
      )}
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      showEditorWithReadOnly
      hideHeader={onlyEdit}
      onlyEdit={onlyEdit}
      hideFormActions={onlyEdit}
      initialValue={initialValue}
      initialValidationSchema={initialValidationSchema}
      isSubmitClick={isSubmitClick}
      isResetClick={isResetClick}
      disabledFields={disabledFields}
      onChangeFormValid={onChangeFormValid}
      returnDataOnBlur
      onBlur={onBlur}
    />
  )
}

export default ProfileCardDetails
