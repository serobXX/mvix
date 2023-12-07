import { useMemo } from 'react'
import momentTimezone from 'moment-timezone'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { ProfileCard } from 'components/cards'
import { profileCardEditors } from 'constants/detailView'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { FormControlSelectLocations } from 'components/formControls'
import { simulateEvent } from 'utils/formik'
import { getEmails, getPhones, transformAddress } from 'utils/detailViewUtils'
import { defaultOwner } from 'constants/detailView'
import { entityValues } from 'constants/customFields'
import customFieldNames from 'constants/customFieldNames'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { leadStatusColors } from 'constants/leadConstants'
import NameWithSalutationField from 'components/cards/DetailViewCards/ProfileCard/Fields/NameWithSalutationField'
import Yup from 'utils/yup'
import { requiredField } from 'constants/validationMessages'
import Tooltip from 'components/Tooltip'

const initialValidationSchema = {
  salutation: Yup.string().required(requiredField)
}

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
  layout,
  onEditSubmit,
  onConvert
}) => {
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
        value: getCustomFieldValueByCode(item, customFieldNames.leadCompany)
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
        name: customFieldNames.leadStatus,
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadStatus}.id`,
          ''
        ),
        component: CustomField,
        isCustomField: true,
        props: {
          initialFetchValue: getCustomFieldValueByCode(
            item,
            `${customFieldNames.leadStatus}.id`,
            ''
          )
        }
      },
      [profileCardEditors.title]: {
        name: customFieldNames.firstName,
        value: getCustomFieldValueByCode(item, customFieldNames.firstName, ''),
        component: NameWithSalutationField,
        isCustomField: true,
        fullWidth: true
      },
      [profileCardEditors.subTitle]: {
        name: customFieldNames.leadTitle,
        value: getCustomFieldValueByCode(item, customFieldNames.leadTitle, ''),
        label: 'Title',
        component: CustomField,
        isCustomField: true
      },
      [profileCardEditors.list]: [
        {
          component: CustomField,
          props: {
            type: 'email'
          },
          values: emails,
          icon: getIconClassName(iconNames.email2, iconTypes.duotone),
          isCustomField: true
        },
        {
          component: CustomField,
          values: phones,
          icon: getIconClassName(iconNames.phoneNumber2, iconTypes.duotone),
          isCustomField: true,
          props: {
            hideCopyBtn: true
          }
        },
        {
          name: customFieldNames.leadCompany,
          icon: getIconClassName(iconNames.leadCompany, iconTypes.duotone),
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.leadCompany,
            ''
          ),
          component: CustomField,
          isCustomField: true
        },
        {
          name: 'address',
          icon: getIconClassName(iconNames.location, iconTypes.duotone),
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
        name: customFieldNames.leadOwner,
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadOwner}.id`,
          defaultOwner?.id
        ),
        component: CustomField,
        isCustomField: true,
        props: {
          initialFetchValue: getCustomFieldValueByCode(
            item,
            `${customFieldNames.leadOwner}.id`,
            defaultOwner?.id
          ),
          withPortal: true
        }
      }
    }),
    [item, emails, phones, address]
  )

  const profileActionButtons = useMemo(
    () => [
      {
        isFilled: true,
        icon: getIconClassName(iconNames.convertToAccount),
        text: 'Convert',
        onClick: e => onConvert(e, item)
      }
    ],
    [item, onConvert]
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
      title={getTitleBasedOnEntity(entityValues.lead, item)}
      avatar={item?.avatar}
      topChipIcon={getIconClassName(iconNames.leadStatus)}
      topChipValue={getCustomFieldValueByCode(
        item,
        `${customFieldNames.leadStatus}.name`,
        ''
      )}
      topChipProps={
        leadStatusColors[
          getCustomFieldValueByCode(item, `${customFieldNames.leadStatus}.name`)
        ]
      }
      displayList={profileCardList}
      actionButtons={profileActionButtons}
      owner={getCustomFieldValueByCode(
        item,
        customFieldNames.leadOwner,
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
