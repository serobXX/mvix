import { useMemo } from 'react'

import { ProfileCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { entityValues } from 'constants/customFields'
import { defaultOwner, profileCardEditors } from 'constants/detailView'
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
  FormControlSelectLocations,
  FormControlTelInput
} from 'components/formControls'
import { simulateEvent } from 'utils/formik'
import {
  billingShippingToAddress,
  getPhones,
  transformAddress
} from 'utils/detailViewUtils'
import { parseCurrency } from 'utils/generalUtils'
import { routes, tableViews } from 'constants/routes'
import { CONTACT_AP_TYPE } from 'constants/contactConstants'
import SplitButton from 'components/buttons/SplitButton'
import {
  useCreateInvoiceMutation,
  useCreatePdfMutation,
  useCreatePreviewMutation
} from 'api/estimateApi'
import apiCacheKeys from 'constants/apiCacheKeys'

const ProfileCardDetails = ({ id, isFetching, item, onEditSubmit, layout }) => {
  const [createPreview] = useCreatePreviewMutation()
  const [createInvoice] = useCreateInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.add
  })
  const [createPdf] = useCreatePdfMutation()

  const address = useMemo(() => {
    return billingShippingToAddress(item?.customFields)?.[0] || {}
  }, [item])

  const [mainContacts, apContacts] = useMemo(() => {
    const main = [],
      ap = [],
      _contacts = [..._get(item, 'account.contacts', [])]
    if (_contacts) {
      _contacts
        .sort((a, b) => (b.id === item?.contact?.id ? 1 : -1))
        .forEach(contact => {
          const authority = getCustomFieldValueByCode(
            contact,
            `${customFieldNames.contactAuthority}`
          )
          if (
            Array.isArray(authority)
              ? authority.some(({ name }) => name === CONTACT_AP_TYPE)
              : authority?.name === CONTACT_AP_TYPE
          ) {
            ap.push({
              id: contact.id,
              title: getTitleBasedOnEntity(entityValues.contact, contact)
            })
          } else {
            main.push({
              id: contact.id,
              title: getTitleBasedOnEntity(entityValues.contact, contact)
            })
          }
        })
    }
    return [main, ap]
  }, [item])

  const phones = useMemo(() => getPhones(layout, item), [item, layout])

  const profileCardList = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.contact, iconTypes.duotone),
        values: mainContacts,
        to: ({ id }) => routes.contacts.toView(id)
      },
      {
        icon: getIconClassName(iconNames.phoneNumber2, iconTypes.duotone),
        values: Object.values(phones).reverse()
      },
      {
        icon: getIconClassName(iconNames.contact, iconTypes.duotone),
        title: 'AP',
        values: apContacts,
        to: ({ id }) => routes.contacts.toView(id)
      },
      {
        value: getTitleBasedOnEntity(entityValues.account, item?.account),
        to: routes.accounts.toView(item?.account?.id, tableViews.list)
      },
      {
        value: getTitleBasedOnEntity(
          entityValues.opportunity,
          item?.opportunity
        ),
        to: routes.opportunities.toView(item?.opportunity?.id, tableViews.list)
      },
      {
        noData: !address.state && !address.city,
        value: `${address.state || address.city} (${
          address.countryShort || address.country
        })`
      }
    ],
    [item, address, mainContacts, apContacts, phones]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.topChip]: null,
      [profileCardEditors.title]: null,
      [profileCardEditors.subTitle]: null,
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.contact, iconTypes.duotone),
          name: 'contactId',
          label: 'Contact',
          value: item?.contact?.id,
          component: FormControlAutocomplete,
          isSingleEditor: true,
          isRequired: true,
          props: ({ accountId, contactId }) => ({
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
        null,
        {
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          label: 'Account',
          name: 'accountId',
          value: _get(item, 'account.id'),
          component: FormControlAutocomplete,
          isRequired: true,
          props: {
            getOptions: getAccountOptions(),
            initialFetchValue: _get(item, 'account.id')
          }
        },
        {
          icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
          name: 'opportunityId',
          label: 'Opportunity',
          value: _get(item, 'opportunity.id'),
          component: FormControlAutocomplete,
          isRequired: true,
          props: {
            getOptions: getOpportunityOptions(),
            initialFetchValue: _get(item, 'opportunity.id')
          }
        },
        {
          icon: getIconClassName(iconNames.location, iconTypes.duotone),
          name: 'address',
          value: !!(address.state || address.city)
            ? `${address.state || address.city} (${
                address.countryShort || address.country
              })`
            : '',
          component: FormControlSelectLocations,
          props: {
            label: 'City, State, Country',
            formatLabel: ({ state, name, country }) =>
              `${name?.longName || name || ''}, ${state?.longName || ''} (${
                country?.shortName || ''
              })`,
            withPortal: true,
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
          getOwnerBasedOnEntity(entityValues.estimate, item)?.id ||
          defaultOwner?.id,
        component: FormControlAutocomplete,
        props: {
          getOptions: getUserOptions(null, null, {
            passIdForNumber: true
          }),
          initialFetchValue:
            getOwnerBasedOnEntity(entityValues.estimate, item)?.id ||
            defaultOwner?.id,
          withPortal: true
        }
      }
    }),
    [item, address, phones]
  )

  const actionButtons = useMemo(
    () => [
      {
        render: (
          <SplitButton
            items={[
              {
                label: 'Preview Estimate',
                icon: getIconClassName(iconNames.preview),
                value: 'preview',
                onClick: () => createPreview({ id })
              },
              {
                label: 'Create PDF',
                icon: getIconClassName(iconNames.pdf),
                value: 'createdPdf',
                onClick: () => createPdf({ id })
              },
              {
                label: 'Send Estimate',
                icon: getIconClassName(iconNames.sendMail),
                value: 'sendEstimate'
              },
              {
                label: 'Create Invoice',
                icon: getIconClassName(iconNames.invoice),
                value: 'createInvoice',
                onClick: () => createInvoice({ id })
              }
            ]}
            defaultSelected="preview"
          />
        )
      }
    ],
    [id, createPreview, createInvoice, createPdf]
  )

  return (
    <ProfileCard
      isFetching={isFetching}
      title={`${item?.id}: ${parseCurrency(
        item?.grandTotal ||
          (item?.estimateItems &&
            item?.estimateItems
              .reduce((a, b) => a + Number(b.price) * Number(b.quantity), 0)
              .toFixed(2))
      )}`}
      avatarText={getTitleBasedOnEntity(entityValues.estimate, item)}
      isJdenticonIcon
      subTitle={`Esimate ${item?.totalNoOfEstimates || 1} of ${
        item?.currentEstimate || 1
      } for ${_get(item, 'opportunity.id', '')}`}
      topChipIcon={getIconClassName(iconNames.opportunityStage)}
      topChipValue={_get(item, 'opportunity.stage.name', '')}
      displayList={profileCardList}
      owner={
        !!getOwnerBasedOnEntity(entityValues.estimate, item)?.id
          ? getOwnerBasedOnEntity(entityValues.estimate, item)
          : defaultOwner
      }
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      showEditorWithReadOnly
      actionButtons={actionButtons}
    />
  )
}

export default ProfileCardDetails
