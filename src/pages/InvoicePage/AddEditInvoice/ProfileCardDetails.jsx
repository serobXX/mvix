import { useCallback, useMemo } from 'react'

import { ProfileCard } from 'components/cards'
import { entityValues } from 'constants/customFields'
import { profileCardEditors } from 'constants/detailView'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { _get } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlReactSelect,
  FormControlSelectLocations
} from 'components/formControls'
import {
  invoiceStatusOptions,
  orderTypeOptions,
  orderTypeValues,
  paymentTermOptions
} from 'constants/invoiceConstants'
import {
  getAccountOptions,
  getContactOptions,
  getEstimateOptions,
  getOpportunityOptions,
  getUserOptions
} from 'utils/autocompleteOptions'
import useUser from 'hooks/useUser'
import {
  billingShippingToAddress,
  transformAddress
} from 'utils/detailViewUtils'
import { simulateEvent } from 'utils/formik'

const ProfileCardDetails = ({
  isFetching,
  item,
  onEditSubmit,
  onlyEdit,
  isSubmitClick,
  isResetClick,
  initialValue,
  initialValidationSchema,
  disabledFields,
  onChangeFormValid,
  onBlur
}) => {
  const { data: user } = useUser()

  const address = useMemo(() => {
    return billingShippingToAddress(item?.customFields)?.[0] || {}
  }, [item])

  const profileCardList = useMemo(
    () => [
      {
        value: getTitleBasedOnEntity(entityValues.account, item?.account)
      },
      {
        value: getTitleBasedOnEntity(entityValues.contact, item?.contact)
      },
      {
        value: getTitleBasedOnEntity(
          entityValues.opportunity,
          item?.opportunity
        )
      },
      {
        value: item?.estimateName
      },
      {
        value: item?.paymentTerm
      },
      {
        value: item?.dueDate
      },
      {
        value: item?.orderType
      },
      {
        noData: !address.state && !address.city,
        value: `${address.state || address.city} (${
          address.countryShort || address.country
        })`
      }
    ],
    [item, address]
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
      [profileCardEditors.topChip]: {
        icon: getIconClassName(iconNames.invoice),
        name: 'status',
        label: 'Status',
        value: item?.status,
        component: FormControlReactSelect,
        props: {
          options: invoiceStatusOptions,
          withPortal: true
        }
      },
      [profileCardEditors.list]: [
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
          label: 'Contact',
          name: 'contactId',
          value: _get(item, 'clientAdmin.id'),
          component: FormControlAutocomplete,
          isRequired: true,
          props: ({ accountId, contactId }) => ({
            getOptions: getContactOptions(null, null, {
              options: { accountId: accountId }
            }),
            optionsDependency: accountId,
            initialFetchValue: contactId
          })
        },
        {
          icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
          label: 'Opportunity',
          name: 'opportunityId',
          value: _get(item, 'opportunity.id'),
          component: FormControlAutocomplete,
          props: ({ accountId, opportunityId, orderType }) => ({
            getOptions: getOpportunityOptions(null, null, {
              options: { accountId }
            }),
            optionsDependency: accountId,
            initialFetchValue: opportunityId,
            isRequired: orderType === orderTypeValues.newBusiness
          })
        },
        {
          icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
          label: 'Estimate',
          name: 'estimateId',
          value: item?.estimateId,
          component: FormControlAutocomplete,
          props: ({
            accountId,
            contactId,
            opportunityId,
            estimateId,
            orderType
          }) => ({
            getOptions: getEstimateOptions(null, null, {
              options: { accountId, contactId, opportunityId }
            }),
            optionsDependency: accountId || contactId || opportunityId,
            initialFetchValue: estimateId,
            isRequired: orderType === orderTypeValues.newBusiness
          })
        },
        {
          icon: getIconClassName(iconNames.payment),
          name: 'paymentTerm',
          label: 'Payment Term',
          value: item?.payment_term,
          component: FormControlReactSelect,
          props: {
            options: paymentTermOptions,
            withPortal: true,
            isSort: false
          }
        },
        {
          icon: getIconClassName(iconNames.date),
          name: 'dueDate',
          label: 'Due Date',
          value: item?.dueDate,
          component: FormControlDatePicker,
          props: {
            withPortal: true
          }
        },
        {
          icon: getIconClassName(iconNames.orderType),
          name: 'orderType',
          label: 'Order Type',
          value: item?.orderType,
          component: FormControlReactSelect,
          props: {
            options: orderTypeOptions,
            withPortal: true
          }
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
        name: 'ownerId',
        value: item?.invoiceOwner?.id || user?.id,
        component: FormControlAutocomplete,
        props: ({ ownerId }) => ({
          getOptions: getUserOptions(null, null, {
            passIdForNumber: true
          }),
          initialFetchValue: ownerId,
          withPortal: true
        })
      }
    }),
    [item, user, address, onChangeAccount]
  )

  return (
    <ProfileCard
      isFetching={isFetching}
      hideTitle
      topChipIcon={getIconClassName(iconNames.invoice)}
      topChipValue={_get(item, 'status', '')}
      displayList={profileCardList}
      owner={!!item?.invoiceOwner?.id ? item?.invoiceOwner : user}
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      showEditorWithReadOnly
      onlyEdit={onlyEdit}
      hideFormActions
      isSubmitClick={isSubmitClick}
      isResetClick={isResetClick}
      initialValidationSchema={initialValidationSchema}
      initialValue={initialValue}
      disabledFields={disabledFields}
      onChangeFormValid={onChangeFormValid}
      returnDataOnBlur
      onBlur={onBlur}
    />
  )
}

export default ProfileCardDetails
