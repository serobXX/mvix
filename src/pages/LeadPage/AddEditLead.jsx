import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import * as Yup from 'yup'

import { HiddenContentSideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import {
  useAddLeadMutation,
  useLazyGetLeadByIdQuery,
  useUpdateLeadMutation
} from 'api/leadApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import customFieldNames from 'constants/customFieldNames'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { AddTaskCard, ProfileCard } from 'components/cards'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { profileCardEditors } from 'constants/detailView'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { FormControlSelectLocations } from 'components/formControls'
import { getEmails, getPhones, transformAddress } from 'utils/detailViewUtils'
import { simulateEvent } from 'utils/formik'
import NameWithSalutationField from 'components/cards/DetailViewCards/ProfileCard/Fields/NameWithSalutationField'
import { requiredField } from 'constants/validationMessages'
import useUser from 'hooks/useUser'
import { activityEntityType } from 'constants/activity'
import { _get } from 'utils/lodash'
import queryParamsHelper from 'utils/queryParamsHelper'

const useStyles = makeStyles(({ palette, type }) => ({
  sideModalScrollbar: {
    background: palette[type].body.background
  },
  sideModalHeader: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  container: {
    display: 'grid',
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    gridTemplateColumns: '419px auto'
  },
  profileFooterRoot: {
    height: 63,
    padding: '6px 10px 14px 10px'
  }
}))

const initialValidationSchema = {
  salutation: Yup.string().required(requiredField)
}

const AddEditLead = ({ layout }) => {
  const { id, view } = useParams()
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const navigate = useNavigate()
  const { data: user } = useUser()

  const [getItemById, { data: item }] = useLazyGetLeadByIdQuery()
  const [addItem, post] = useAddLeadMutation({
    fixedCacheKey: apiCacheKeys.lead.add
  })
  const [updateItem, put] = useUpdateLeadMutation({
    fixedCacheKey: apiCacheKeys.lead.update
  })

  const isEdit = !!id

  useEffect(() => {
    if (id) {
      getItemById(id)
    }
    //eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (isSubmitClick) {
      setSubmitClick(false)
    }
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      setResetClick(false)
    }
  }, [isResetClick])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(parseToAbsolutePath(routes.leads.list))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const handleSubmit = useCallback(() => {
    const {
      profile: { salutation, ...customFields },
      task
    } = values
    setSubmitting(true)

    const data = {
      salutation,
      customFields: queryParamsHelper(customFields),
      ...task
    }
    if (isEdit) {
      updateItem({
        id,
        data
      })
    } else {
      addItem(data)
    }
  }, [isEdit, id, values, addItem, updateItem])

  useEffect(() => {
    if (values.profile && values.task && !isSubmitting) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [values])

  const handleEditSubmit = useCallback(
    entity => _values => {
      let data = {
        ..._values
      }
      if (_values.addressData) {
        let addresses = [
          ...getCustomFieldValueByCode(item, customFieldNames.addresses, [])
        ]
        addresses.splice(0, 1, _values.addressData)
        data[customFieldNames.addresses] = addresses
      }
      delete data.address
      delete data.addressData

      setValues(v => ({
        ...v,
        [entity]: data
      }))
    },
    [item]
  )

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
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadStatus}.name`,
          ''
        )
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadType}.name`
        )
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.firstName)
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.leadTitle)
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.leadCompany)
      },
      {
        values: Object.values(emails).reverse()
      },
      {
        values: Object.values(phones).reverse()
      },
      {
        noData: !address.state && !address.city,
        render: null
      },
      {
        value: getCustomFieldValueByCode(
          item,
          customFieldNames.leadRequirements
        )
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadSolutionInterest}.name`
        )
      }
    ],
    [item, address, emails, phones]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.leadStatus, iconTypes.duotone),
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
        {
          icon: getIconClassName(iconNames.leadType, iconTypes.duotone),
          name: customFieldNames.leadType,
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.leadType}.id`,
            ''
          ),
          props: {
            initialFetchValue: getCustomFieldValueByCode(
              item,
              `${customFieldNames.leadType}.id`,
              ''
            )
          },
          component: CustomField,
          isCustomField: true
        },
        {
          name: customFieldNames.firstName,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.firstName,
            ''
          ),
          component: NameWithSalutationField,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true
        },
        {
          icon: getIconClassName(iconNames.leadTitle, iconTypes.duotone),
          name: customFieldNames.leadTitle,
          label: 'Title',
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.leadTitle,
            ''
          ),
          component: CustomField,
          isCustomField: true
        },
        {
          icon: getIconClassName(iconNames.leadCompany, iconTypes.duotone),
          name: customFieldNames.leadCompany,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.leadCompany,
            ''
          ),
          component: CustomField,
          isCustomField: true
        },
        {
          component: CustomField,
          icon: getIconClassName(iconNames.email2, iconTypes.duotone),
          props: {
            type: 'email',
            hideCopyBtn: true
          },
          values: emails,
          isCustomField: true
        },
        {
          component: CustomField,
          icon: getIconClassName(iconNames.phoneNumber2, iconTypes.duotone),
          values: phones,
          isCustomField: true,
          props: {
            hideCopyBtn: true
          }
        },
        {
          name: 'address',
          icon: getIconClassName(iconNames.location, iconTypes.duotone),
          value: !!(address.state || address.city)
            ? `${address.state || address.city} (${address.countryShort})`
            : '',
          component: FormControlSelectLocations,
          isSingleColumn: true,
          fullWidth: true,
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
        },
        {
          name: customFieldNames.leadRequirements,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.leadRequirements,
            ''
          ),
          component: CustomField,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true,
          label: 'Project Requirements',
          props: {
            autoHeightInput: true
          }
        },
        {
          icon: getIconClassName(iconNames.solution, iconTypes.duotone),
          name: customFieldNames.leadSolutionInterest,
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.leadSolutionInterest}.id`,
            ''
          ),
          props: {
            initialFetchValue: getCustomFieldValueByCode(
              item,
              `${customFieldNames.leadSolutionInterest}.id`,
              ''
            )
          },
          component: CustomField,
          isCustomField: true
        }
      ],
      [profileCardEditors.footer]: {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: customFieldNames.leadOwner,
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadOwner}.id`,
          user?.id
        ),
        component: CustomField,
        isCustomField: true,
        props: {
          initialFetchValue: getCustomFieldValueByCode(
            item,
            `${customFieldNames.leadOwner}.id`,
            user?.id
          ),
          withPortal: true
        }
      }
    }),
    [item, emails, phones, address, user?.id]
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
    <HiddenContentSideModal
      width="450px"
      afterWidth="930px"
      title={`${isEdit ? 'Edit' : 'Add'} a Lead`}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.leads[view])}
      footerLayout={
        <FormFooterLayout
          isUpdate={isEdit}
          onSubmit={() => setSubmitClick(true)}
          isPending={isSubmitting}
          onReset={() => setResetClick(true)}
        />
      }
      scrollbarClassName={classes.sideModalScrollbar}
      containerClassName={classes.container}
      hiddenComponent={
        <AddTaskCard
          internalNotes={_get(item, `internalNote.description`)}
          onSubmit={handleEditSubmit('task')}
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          entity={activityEntityType.lead}
        />
      }
    >
      <ProfileCard
        displayList={profileCardList}
        editors={profileEditors}
        owner={getCustomFieldValueByCode(
          item,
          customFieldNames.leadOwner,
          user
        )}
        hideOwnerIcon
        onEditSubmit={handleEditSubmit('profile')}
        layout={layout}
        hideHeader
        onlyEdit
        hideFormActions
        onlyProfileList
        initialValue={initialValue}
        initialValidationSchema={initialValidationSchema}
        footerRootClassName={classes.profileFooterRoot}
        isSubmitClick={isSubmitClick}
        isResetClick={isResetClick}
        isAdd={!isEdit}
      />
    </HiddenContentSideModal>
  )
}

export default AddEditLead
