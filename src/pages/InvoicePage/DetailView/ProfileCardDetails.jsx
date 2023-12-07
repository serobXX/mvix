import { useCallback, useEffect, useMemo, useState } from 'react'

import { ProfileCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { entityValues } from 'constants/customFields'
import { defaultOwner, profileCardEditors } from 'constants/detailView'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { _get, _uniqBy } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import {
  FormControlAutocomplete,
  FormControlReactSelect,
  FormControlSelectLocations
} from 'components/formControls'
import {
  billingShippingToAddress,
  getPhones,
  transformAddress
} from 'utils/detailViewUtils'
import { parseCurrency } from 'utils/generalUtils'
import { routes, tableViews } from 'constants/routes'
import { CONTACT_AP_TYPE } from 'constants/contactConstants'
import { useGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import {
  invoiceStatusOptions,
  invoiceStatusValues,
  orderTypeValues
} from 'constants/invoiceConstants'
import {
  getAccountOptions,
  getContactOptions,
  getEstimateOptions,
  getOpportunityOptions,
  getUserOptions
} from 'utils/autocompleteOptions'
import { simulateEvent } from 'utils/formik'
import {
  useSendInvoiceMutation,
  useUpdateInvoiceMutation
} from 'api/invoiceApi'
import useSnackbar from 'hooks/useSnackbar'
import SplitButton from 'components/buttons/SplitButton'
import { PublicLinkModal } from 'components/modals'
import { parsePublicLink } from 'utils/appUtils'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { InvoiceAcceptModal } from 'components/modals/PublicModals'

const ProfileCardDetails = ({ id, isFetching, item, onEditSubmit }) => {
  const [isLinkModalOpen, setLinkModalOpen] = useState(false)
  const [isApprovedModalOpen, setApprovedModalOpen] = useState(false)
  const { data: layout } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.contact
  })
  const [sendInvoice, invoiceReducer] = useSendInvoiceMutation()
  const { showSnackbar } = useSnackbar()

  const [approveInvoice, approvedReducer] = useUpdateInvoiceMutation({
    fixedCacheKey: 'invoiceApproved'
  })

  useNotifyAnalyzer({
    watchArray: [approvedReducer],
    successMessage: 'Invoice Approved for Fullfilment',
    errorMessage: _get(approvedReducer, 'error.message'),
    onError: ({ error }) => {
      if (
        error.code === 422 &&
        error.message.includes('Order cannot be Approved')
      ) {
        setApprovedModalOpen(true)
      }
    }
  })

  useEffect(() => {
    if (invoiceReducer.isSuccess) {
      showSnackbar('Invoice Sent', 'success')
      invoiceReducer.reset()
    } else if (invoiceReducer.isError) {
      showSnackbar('Invoice not sent', 'error')
      invoiceReducer.reset()
    }
    //eslint-disable-next-line
  }, [invoiceReducer])

  const address = useMemo(() => {
    return billingShippingToAddress(item?.customFields)?.[0] || {}
  }, [item])

  const [mainContacts, apContacts] = useMemo(() => {
    const main = [],
      ap = [],
      _contacts = _uniqBy(
        [
          ..._get(item, 'account.contacts', []),
          ...(item?.clientAdmin ? [item?.clientAdmin] : [])
        ],
        'id'
      )
    if (_contacts) {
      _contacts
        .sort((a, b) => (b.id === item?.clientAdmin?.id ? 1 : -1))
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
              title:
                getTitleBasedOnEntity(entityValues.contact, contact) ||
                contact.id
            })
          } else {
            main.push({
              id: contact.id,
              title:
                getTitleBasedOnEntity(entityValues.contact, contact) ||
                contact.id
            })
          }
        })
    }
    return [main, ap]
  }, [item])

  const phones = useMemo(
    () => getPhones(layout, item?.clientAdmin),
    [item?.clientAdmin, layout]
  )

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
        icon: getIconClassName(iconNames.account, iconTypes.duotone),
        value: getTitleBasedOnEntity(entityValues.account, item?.account),
        to: routes.accounts.toView(item?.account?.id, tableViews.list)
      },
      {
        icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
        value: getTitleBasedOnEntity(
          entityValues.opportunity,
          item?.opportunity
        ),
        to: routes.opportunities.toView(item?.opportunity?.id, tableViews.list)
      },
      {
        icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
        value: item?.estimateName,
        to: routes.estimates.toView(item?.estimateId, tableViews.list)
      },
      {
        icon: getIconClassName(iconNames.location, iconTypes.duotone),
        noData: !address.state && !address.city,
        value: `${address.state || address.city} (${
          address.countryShort || address.country
        })`
      }
    ],
    [item, address, mainContacts, apContacts, phones]
  )

  const handlePreview = useCallback(() => {
    window.open(
      `${window.location.origin}${routes.preview.toInvoice(id)}`,
      '_blank',
      'rel=noopener noreferrer'
    )
  }, [id])

  const handleInvoiceApproved = useCallback(() => {
    approveInvoice({
      id: item?.id,
      data: {
        status: invoiceStatusValues.approvedForFullfilment
      }
    })
  }, [approveInvoice, item?.id])

  const actionButtons = useMemo(
    () => [
      {
        render: (
          <SplitButton
            items={[
              {
                label: 'Send Invoice',
                icon: getIconClassName(iconNames.sendMail),
                value: 'sendInvoice',
                onClick: () => sendInvoice(id),
                render: [
                  invoiceStatusValues.draft,
                  invoiceStatusValues.paymentPending,
                  invoiceStatusValues.partiallyPaid,
                  invoiceStatusValues.sent,
                  invoiceStatusValues.open
                ].includes(item?.status)
              },
              {
                label: 'Approved for Fullfilment',
                icon: getIconClassName(iconNames.confirm),
                value: 'approved',
                onClick: handleInvoiceApproved,
                render: [
                  invoiceStatusValues.paymentCompleted,
                  invoiceStatusValues.termsAccepted
                ].includes(item?.status)
              },
              {
                label: 'Preview Invoice',
                icon: getIconClassName(iconNames.preview),
                value: 'previewInvoice',
                onClick: handlePreview
              },
              {
                label: 'Invoice Link',
                icon: getIconClassName(iconNames.invoice),
                value: 'invoiceLink',
                onClick: () => setLinkModalOpen(true)
              }
            ]}
            defaultSelected={
              [
                invoiceStatusValues.paymentCompleted,
                invoiceStatusValues.termsAccepted
              ].includes(item?.status)
                ? 'approved'
                : 'previewInvoice'
            }
          />
        )
      }
    ],
    [sendInvoice, id, handlePreview, handleInvoiceApproved, item?.status]
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
          icon: getIconClassName(iconNames.contact, iconTypes.duotone),
          name: 'contactId',
          label: 'Contact',
          value: item?.clientAdmin?.id,
          component: FormControlAutocomplete,
          isSingleEditor: true,
          isRequired: true,
          props: ({ accountId, contactId }) => ({
            getOptions: getContactOptions(null, null, {
              options: { accountId }
            }),
            optionsDependency: accountId,
            initialFetchValue: contactId
          })
        },
        null,
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
          isRequired: item?.orderType === orderTypeValues.newBusiness,
          props: ({ accountId }) => ({
            getOptions: getOpportunityOptions(null, null, {
              options: { accountId }
            }),
            optionsDependency: accountId,
            initialFetchValue: _get(item, 'opportunity.id')
          })
        },
        {
          icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
          name: 'estimateId',
          label: 'Estimate',
          value: _get(item, 'estimateId'),
          component: FormControlAutocomplete,
          isRequired: item?.orderType === orderTypeValues.newBusiness,
          props: ({ accountId, contactId, opportunityId, estimateId }) => ({
            getOptions: getEstimateOptions(null, null, {
              options: { accountId, contactId, opportunityId }
            }),
            optionsDependency: accountId || contactId || opportunityId,
            initialFetchValue: _get(item, 'estimateId')
          })
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
        name: 'ownerId',
        value: item?.invoiceOwner?.id || defaultOwner?.id,
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
    [item, address]
  )

  return (
    <>
      <ProfileCard
        isFetching={isFetching}
        title={`${item?.invoiceNumber}: ${parseCurrency(item?.grandTotal)}`}
        avatarText={item?.invoiceNumber}
        isJdenticonIcon
        subTitle={`Esimate ${item?.totalNoOfEstimates || 1} of ${
          item?.currentEstimate || 1
        } for ${_get(item, 'opportunity.id', '')}`}
        topChipIcon={getIconClassName(iconNames.invoice)}
        topChipValue={_get(item, 'status', '')}
        displayList={profileCardList}
        owner={!!item?.invoiceOwner?.id ? item?.invoiceOwner : defaultOwner}
        editors={profileEditors}
        onEditSubmit={onEditSubmit}
        showEditorWithReadOnly
        actionButtons={actionButtons}
      />
      <PublicLinkModal
        open={isLinkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        modalTitle={'Invoice Link'}
        tokenList={item?.publicToken || []}
        transformLink={token => parsePublicLink(routes.public.toInvoice(token))}
        entityType={'Invoice'}
        entityId={item?.id}
      />
      {isApprovedModalOpen && (
        <InvoiceAcceptModal
          title={'Approve Invoice'}
          open={isApprovedModalOpen}
          onClose={() => setApprovedModalOpen(false)}
          onSave={() => setApprovedModalOpen(false)}
          buttonPrimaryText="Approve"
        />
      )}
    </>
  )
}

export default ProfileCardDetails
