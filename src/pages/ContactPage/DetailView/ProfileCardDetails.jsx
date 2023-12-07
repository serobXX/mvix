import { useMemo } from 'react'
import momentTimezone from 'moment-timezone'
import { makeStyles } from '@material-ui/core'

import { ProfileCard } from 'components/cards'
import { profileCardEditors } from 'constants/detailView'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import Tooltip from 'components/Tooltip'
import classNames from 'classnames'
import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlSelectLocations,
  FormControlTelInput
} from 'components/formControls'
import { getAccountOptions, getUserOptions } from 'utils/autocompleteOptions'
import { simulateEvent } from 'utils/formik'
import { getEmails, getPhones, transformAddress } from 'utils/detailViewUtils'
import { DEFAULT_LEAD_TITLE, defaultOwner } from 'constants/detailView'
import { entityValues } from 'constants/customFields'
import customFieldNames from 'constants/customFieldNames'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { routes, tableViews } from 'constants/routes'
import Yup from 'utils/yup'
import NameWithSalutationField from 'components/cards/DetailViewCards/ProfileCard/Fields/NameWithSalutationField'
import { requiredField } from 'constants/validationMessages'

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

const initialValidationSchema = {
  salutation: Yup.string().required(requiredField)
}

const ProfileCardDetails = ({ isFetching, item, layout, onEditSubmit }) => {
  const classes = useStyles()
  const address = useMemo(() => {
    return (
      getCustomFieldValueByCode(item, customFieldNames.addresses, [])?.[0] || {}
    )
  }, [item])

  const emails = useMemo(() => getEmails(layout, item), [item, layout])

  const phones = useMemo(() => getPhones(layout, item), [item, layout])

  const profileCardList = useMemo(
    () => [
      {
        isEmail: true,
        values: Object.values(emails).reverse()
      },
      {
        values: Object.values(phones).reverse()
      },
      {
        value: getTitleBasedOnEntity(entityValues.account, item?.accountId),
        to: routes.accounts.toView(item?.accountId?.id, tableViews.list)
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
    [item, classes, address, emails, phones]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.topChip]: {
        icon: getIconClassName(iconNames.contactAuthority, iconTypes.duotone),
        name: customFieldNames.contactAuthority,
        value: Array.isArray(
          getCustomFieldValueByCode(
            item,
            `${customFieldNames.contactAuthority}`,
            []
          )
        )
          ? getCustomFieldValueByCode(
              item,
              `${customFieldNames.contactAuthority}`,
              []
            )?.map(({ id, name }) => ({ label: name, value: id }))
          : getCustomFieldValueByCode(
              item,
              `${customFieldNames.contactAuthority}.id`
            ),
        component: CustomField,
        isCustomField: true
      },
      [profileCardEditors.title]: {
        name: customFieldNames.firstName,
        value: getCustomFieldValueByCode(item, customFieldNames.firstName, ''),
        component: NameWithSalutationField,
        isCustomField: true,
        fullWidth: true
      },
      [profileCardEditors.subTitle]: {
        icon: getIconClassName(iconNames.leadTitle, iconTypes.duotone),
        label: 'Title',
        name: customFieldNames.leadTitle,
        value: getCustomFieldValueByCode(item, customFieldNames.leadTitle, ''),
        component: CustomField,
        isCustomField: true
      },
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.email2, iconTypes.duotone),
          component: FormControlInput,
          props: {
            type: 'email'
          },
          values: emails
        },
        {
          component: FormControlTelInput,
          values: phones
        },
        {
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          name: 'accountId',
          label: 'Account',
          value: item?.accountId?.id,
          component: FormControlAutocomplete,
          isRequired: true,
          props: {
            getOptions: getAccountOptions(),
            initialFetchValue: item?.accountId?.id
          }
        },
        {
          icon: getIconClassName(iconNames.location, iconTypes.duotone),
          name: 'address',
          value: !!(address.state || address.city)
            ? `${address.state || address.city} (${address.countryShort})`
            : '',
          component: FormControlSelectLocations,
          props: {
            label: 'City, State, Country',
            withPortal: true,
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
        name: customFieldNames.contactOwner,
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.contactOwner}.id`,
          defaultOwner?.id
        ),
        component: FormControlAutocomplete,
        props: {
          getOptions: getUserOptions(null, null, {
            passIdForNumber: true
          }),
          initialFetchValue: getCustomFieldValueByCode(
            item,
            `${customFieldNames.contactOwner}.id`,
            defaultOwner?.id
          ),
          withPortal: true
        }
      }
    }),
    [item, emails, phones, address]
  )

  const initialValue = useMemo(
    () => ({
      salutation: item?.salutation || 'Mr.',
      [customFieldNames.lastName]: getCustomFieldValueByCode(
        item,
        customFieldNames.lastName
      )
    }),
    [item]
  )

  return (
    <ProfileCard
      isFetching={isFetching}
      title={getTitleBasedOnEntity(entityValues.contact, item)}
      avatar={item?.avatar}
      subTitle={getCustomFieldValueByCode(
        item,
        customFieldNames.leadTitle,
        DEFAULT_LEAD_TITLE
      )}
      topChipIcon={getIconClassName(iconNames.contactAuthority)}
      topChipValue={
        Array.isArray(
          getCustomFieldValueByCode(
            item,
            `${customFieldNames.contactAuthority}`
          )
        )
          ? getCustomFieldValueByCode(
              item,
              `${customFieldNames.contactAuthority}`
            )
              .map(({ name }) => name)
              .join(', ')
          : getCustomFieldValueByCode(
              item,
              `${customFieldNames.contactAuthority}.name`
            )
      }
      displayList={profileCardList}
      owner={getCustomFieldValueByCode(
        item,
        customFieldNames.contactOwner,
        defaultOwner
      )}
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      initialValue={initialValue}
      initialValidationSchema={initialValidationSchema}
      showEditorWithReadOnly
    />
  )
}

export default ProfileCardDetails
