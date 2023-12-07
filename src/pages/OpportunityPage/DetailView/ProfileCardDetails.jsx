import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Yup from 'utils/yup'

import { ProfileCard } from 'components/cards'
import { entityValues } from 'constants/customFields'
import iconNames, { iconTypes } from 'constants/iconNames'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'
import { routes } from 'constants/routes'
import { removeAbsolutePath } from 'utils/urlUtils'
import customFieldNames from 'constants/customFieldNames'
import { parseCurrency } from 'utils/generalUtils'
import { defaultOwner, profileCardEditors } from 'constants/detailView'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput,
  FormControlNumericInput
} from 'components/formControls'
import {
  getAccountOptions,
  getContactOptions,
  getOptionsByFieldAndEntity,
  getUserOptions
} from 'utils/autocompleteOptions'
import { optionEntity } from 'constants/autocompleteOptions'
import { requiredField } from 'constants/validationMessages'

const initialValidationSchema = {
  accountId: Yup.number().required(requiredField),
  opportunityName: Yup.string().required(requiredField),
  stageId: Yup.number().required(requiredField),
  expectingClosingDate: Yup.string().required(requiredField),
  expectedRevenue: Yup.number().required(requiredField)
}

const ProfileCardDetails = ({
  isFetching,
  item,
  layout,
  onEditSubmit,
  id,
  view
}) => {
  const navigate = useNavigate()

  const contacts = useMemo(() => {
    const _contacts = _get(item, 'account.contacts', [])
    return [..._contacts]
      .sort((a, b) =>
        b.id ===
        getCustomFieldValueByCode(item, customFieldNames.contactName)?.id
          ? 1
          : -1
      )
      .map(b => {
        return getTitleBasedOnEntity(entityValues.contact, b)
      }, {})
  }, [item])

  const estimates = useMemo(
    () =>
      item?.estimates?.map(b => {
        return {
          id: b.id,
          title: `${getTitleBasedOnEntity(
            entityValues.estimate,
            b
          )}: ${parseCurrency(
            b.grandTotal ||
              (b.estimateItems || []).reduce(
                (x, y) => x + (Number(y.quantity) + Number(y.price)),
                0
              )
          )}`
        }
      }),
    [item?.estimates]
  )

  const profileCardList = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.contact, iconTypes.duotone),
        values: contacts
      },
      {
        value: getTitleBasedOnEntity(entityValues.account, item?.account)
      },
      {
        value: _get(item, `${customFieldNames.oppExpectedRevenue}`)
      },
      {
        icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
        values: estimates,
        to: ({ id }) => routes.estimates.toView(id)
      }
    ],
    [item, contacts, estimates]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.topChip]: {
        icon: getIconClassName(iconNames.opportunityStage, iconTypes.duotone),
        name: 'stageId',
        label: 'Stage',
        value: _get(item, `stage.id`, ''),
        component: FormControlAutocomplete,
        props: {
          getOptions: getOptionsByFieldAndEntity({
            field: 'name',
            entity: optionEntity.stage,
            passIdForNumber: true
          }),
          initialFetchValue: _get(item, `stage.id`, '')
        }
      },
      [profileCardEditors.title]: {
        icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
        name: customFieldNames.opportunityName,
        label: 'Opportunity Name',
        value: getTitleBasedOnEntity(entityValues.opportunity, item),
        component: FormControlInput,
        isRequired: true
      },
      [profileCardEditors.subTitle]: {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'expectingClosingDate',
        label: 'Expected Closing Date',
        value: _get(item, 'expectingClosingDate', ''),
        component: FormControlDatePicker,
        blurOnChange: true,
        isRequired: true
      },
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.contact, iconTypes.duotone),
          name: customFieldNames.contactName,
          label: 'Contact',
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.contactName}.id`
          ),
          component: FormControlAutocomplete,
          isSingleEditor: true,
          props: ({ accountId, ...rest }) => ({
            getOptions: getContactOptions(null, null, {
              options: { accountId }
            }),
            initialFetchValue: rest[customFieldNames.contactName]
          })
        },
        {
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          name: 'accountId',
          label: 'Account',
          value: _get(item, 'account.id'),
          component: FormControlAutocomplete,
          isRequired: true,
          props: {
            getOptions: getAccountOptions(),
            initialFetchValue: _get(item, 'account.id')
          }
        },
        {
          icon: getIconClassName(iconNames.expectedRevenue, iconTypes.duotone),
          name: customFieldNames.oppExpectedRevenue,
          label: 'Expected Revenue',
          component: FormControlNumericInput,
          isRequired: true,
          props: {
            precision: 2,
            fullWidth: true
          },
          value: _get(item, `${customFieldNames.oppExpectedRevenue}`, '')
        }
      ],
      [profileCardEditors.footer]: {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: customFieldNames.opportunityOwner,
        value: _get(
          item,
          `customFields.${customFieldNames.opportunityOwner}.id`,
          defaultOwner?.id
        ),
        component: FormControlAutocomplete,
        props: {
          getOptions: getUserOptions(null, null, {
            passIdForNumber: true
          }),
          initialFetchValue: _get(
            item,
            `customFields.${customFieldNames.opportunityOwner}.id`,
            defaultOwner?.id
          ),
          withPortal: true
        }
      }
    }),
    [item]
  )

  const handleCreateEstimate = useCallback(() => {
    navigate(
      routes.estimates.toDetailAdd(
        removeAbsolutePath(routes.opportunities.toView(id, view))
      ),
      {
        state: {
          accountId: item?.account?.id,
          contactId: getCustomFieldValueByCode(
            item,
            customFieldNames.contactName
          )?.id,
          opportunityId: id
        }
      }
    )
  }, [navigate, id, view, item])

  const profileActionButtons = useMemo(
    () => [
      {
        isFilled: true,
        icon: getIconClassName(iconNames.estimate),
        text: 'Create Estimate',
        onClick: handleCreateEstimate
      }
    ],
    [handleCreateEstimate]
  )

  return (
    <ProfileCard
      isFetching={isFetching}
      title={getTitleBasedOnEntity(entityValues.opportunity, item)}
      isJdenticonIcon
      subTitleLabel="Expected Closing"
      isAvatarEditable={false}
      subTitle={_get(item, `expectingClosingDate`, 'N/A') || 'N/A'}
      topChipIcon={getIconClassName(iconNames.opportunityStage)}
      topChipValue={_get(item, `stage.name`, '')}
      displayList={profileCardList}
      actionButtons={profileActionButtons}
      owner={_get(
        item,
        `customFields.${customFieldNames.opportunityOwner}`,
        defaultOwner
      )}
      editors={profileEditors}
      onEditSubmit={onEditSubmit}
      layout={layout}
      showEditorWithReadOnly
      initialValidationSchema={initialValidationSchema}
    />
  )
}

export default ProfileCardDetails
