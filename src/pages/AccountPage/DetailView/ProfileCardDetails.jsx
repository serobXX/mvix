import { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import momentTimezone from 'moment-timezone'
import classNames from 'classnames'

import { ProfileCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { entityValues } from 'constants/customFields'
import { defaultOwner, profileCardEditors } from 'constants/detailView'
import {
  getCustomFieldValueByCode,
  getOwnerBasedOnEntity,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { _get, _isNotEmpty } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import Tooltip from 'components/Tooltip'
import { getUserOptions } from 'utils/autocompleteOptions'
import {
  FormControlAutocomplete,
  FormControlSelectLocations
} from 'components/formControls'
import { simulateEvent } from 'utils/formik'
import { transformAddress } from 'utils/detailViewUtils'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { routes } from 'constants/routes'
import { CONTACT_AP_TYPE } from 'constants/contactConstants'

const useStyles = makeStyles(
  ({ typography, type, fontSize, lineHeight, colors }) => ({
    timezoneText: {
      ...typography.darkText[type],
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary
    },
    timezoneIcon: {
      ...typography.darkText[type],
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary,
      color: colors.highlight,
      marginLeft: 10
    }
  })
)

const ProfileCardDetails = ({
  isFetching,
  item,
  onEditSubmit,
  layout,
  opportunitiesData
}) => {
  const classes = useStyles()

  const address = useMemo(() => {
    return (
      _get(item, `customFields.${customFieldNames.addresses}`, [])?.[0] || {}
    )
  }, [item])

  const [mainContacts, apContacts] = useMemo(() => {
    const main = [],
      ap = []
    if (item?.contacts) {
      item.contacts.forEach(contact => {
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
  }, [item?.contacts])

  const latestOpportunity = useMemo(
    () =>
      opportunitiesData?.length
        ? [...opportunitiesData].sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : 1
          )?.[0]
        : {},
    [opportunitiesData]
  )

  const profileCardList = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.contact, iconTypes.duotone),
        title: 'Main',
        values: mainContacts,
        to: ({ id }) => routes.contacts.toView(id)
      },
      {
        icon: getIconClassName(iconNames.contact, iconTypes.duotone),
        title: 'AP',
        values: apContacts,
        to: ({ id }) => routes.contacts.toView(id)
      },
      {
        icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
        value:
          _isNotEmpty(latestOpportunity) &&
          `${getTitleBasedOnEntity(
            entityValues.opportunity,
            latestOpportunity
          )}: $${getCustomFieldValueByCode(
            latestOpportunity,
            customFieldNames.oppExpectedRevenue,
            0
          )}`
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.accountSupport)
      },
      {
        noData: !address.state && !address.city,
        rightSideRender: address.timeZoneName && (
          <Tooltip
            headerText={address.timeZoneName}
            title={`Current Time at Lead's Location: ${momentTimezone()
              .tz(address.timeZoneId)
              .format('hh:mm a')}`}
            withHeader
            arrow
            placement="top"
          >
            <i
              className={classNames(
                getIconClassName(iconNames.clock),
                classes.timezoneIcon
              )}
            />
          </Tooltip>
        ),
        value: `${address.state || address.city} (${address.countryShort})`
      }
    ],
    [classes, item, address, mainContacts, apContacts, latestOpportunity]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.topChip]: {
        icon: getIconClassName(iconNames.accountRelation, iconTypes.duotone),
        name: customFieldNames.accountRelation,
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.accountRelation}.id`
        ),
        component: CustomField,
        isCustomField: true
      },
      [profileCardEditors.title]: {
        icon: getIconClassName(iconNames.nameField, iconTypes.duotone),
        name: customFieldNames.accountName,
        value: getCustomFieldValueByCode(item, customFieldNames.accountName),
        component: CustomField,
        isCustomField: true
      },
      [profileCardEditors.subTitle]: null,
      [profileCardEditors.list]: [
        null,
        null,
        null,
        {
          icon: getIconClassName(iconNames.support, iconTypes.duotone),
          name: customFieldNames.accountSupport,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.accountSupport
          ),
          component: CustomField,
          isCustomField: true
        },
        {
          icon: getIconClassName(iconNames.location, iconTypes.duotone),
          name: 'address',
          value: !!(address.state || address.city)
            ? `${address.state || address.city} (${address.countryShort})`
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
        name: customFieldNames.accountOwner,
        value:
          getOwnerBasedOnEntity(entityValues.account, item)?.id ||
          defaultOwner?.id,
        component: FormControlAutocomplete,
        props: {
          getOptions: getUserOptions(null, null, {
            passIdForNumber: true
          }),
          initialFetchValue:
            getOwnerBasedOnEntity(entityValues.account, item)?.id ||
            defaultOwner?.id,
          withPortal: true
        }
      }
    }),
    [item, address]
  )

  return (
    <ProfileCard
      isFetching={isFetching}
      title={getTitleBasedOnEntity(entityValues.account, item)}
      avatar={item?.avatar}
      subTitleLabel={'CMS Account ID:'}
      subTitle={item?.id}
      topChipIcon={getIconClassName(iconNames.accountRelation)}
      topChipValue={getCustomFieldValueByCode(
        item,
        `${customFieldNames.accountRelation}.name`
      )}
      displayList={profileCardList}
      owner={
        !!getOwnerBasedOnEntity(entityValues.account, item)?.id
          ? getOwnerBasedOnEntity(entityValues.account, item)
          : defaultOwner
      }
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      showEditorWithReadOnly
    />
  )
}

export default ProfileCardDetails
