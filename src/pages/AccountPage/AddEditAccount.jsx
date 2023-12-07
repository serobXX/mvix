import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import { HiddenContentSideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import { FormControlSelectLocations } from 'components/formControls'
import {
  useAddAccountMutation,
  useLazyGetAccountByIdQuery,
  useUpdateAccountMutation
} from 'api/accountApi'
import customFieldNames from 'constants/customFieldNames'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { AddTaskCard, ProfileCard } from 'components/cards'
import { activityEntityType } from 'constants/activity'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import useUser from 'hooks/useUser'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { profileCardEditors } from 'constants/detailView'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import queryParamsHelper from 'utils/queryParamsHelper'
import { simulateEvent } from 'utils/formik'
import { transformAddress } from 'utils/detailViewUtils'
import { _get } from 'utils/lodash'
import { entityValues } from 'constants/customFields'

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
  },
  profileMiddleRoot: {
    paddingBottom: 18
  }
}))

const AddEditAccount = ({ layout }) => {
  const { id, view } = useParams()
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const navigate = useNavigate()
  const { data: user } = useUser()

  const [getItemById, { data: item }] = useLazyGetAccountByIdQuery()
  const [addItem, post] = useAddAccountMutation({
    fixedCacheKey: apiCacheKeys.account.add
  })
  const [updateItem, put] = useUpdateAccountMutation({
    fixedCacheKey: apiCacheKeys.account.update
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
      navigate(parseToAbsolutePath(routes.accounts.list))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const handleSubmit = useCallback(() => {
    const {
      profile: { ...customFields },
      task
    } = values
    setSubmitting(true)

    const data = {
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

  const profileCardList = useMemo(
    () => [
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.accountRelation}.name`,
          ''
        )
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.accountPartnershipStatus}.name`,
          ''
        )
      },
      {
        value: getTitleBasedOnEntity(entityValues.account, item)
      },
      {
        noData: !address.state && !address.city,
        render: null
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.description)
      },
      {
        value: getCustomFieldValueByCode(
          item,
          customFieldNames.accountBuildConfig
        )
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.accountSupport)
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadSolutionInterest}.name`
        )
      },
      {
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.accountSalesTax}`
        )
      }
    ],
    [item, address]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.accountRelation, iconTypes.duotone),
          name: customFieldNames.accountRelation,
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.accountRelation}.id`,
            ''
          ),
          component: CustomField,
          isCustomField: true
        },
        {
          icon: getIconClassName(
            iconNames.accountPartnership,
            iconTypes.duotone
          ),
          name: customFieldNames.accountPartnershipStatus,
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.accountPartnershipStatus}.id`,
            ''
          ),
          component: CustomField,
          isCustomField: true,
          props: {
            initialFetchValue: getCustomFieldValueByCode(
              item,
              `${customFieldNames.accountPartnershipStatus}.id`,
              ''
            )
          }
        },
        {
          name: customFieldNames.accountName,
          value: getTitleBasedOnEntity(entityValues.account, item),
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          component: CustomField,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true
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
        },
        {
          name: customFieldNames.description,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.description,
            ''
          ),
          component: CustomField,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true,
          label: 'Description',
          props: {
            autoHeightInput: true
          }
        },
        {
          name: customFieldNames.accountBuildConfig,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.accountBuildConfig,
            ''
          ),
          component: CustomField,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true,
          props: {
            autoHeightInput: true
          }
        },
        {
          icon: getIconClassName(iconNames.support, iconTypes.duotone),
          name: customFieldNames.accountSupport,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.accountSupport,
            ''
          ),
          component: CustomField,
          isCustomField: true
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
        },
        {
          icon: getIconClassName(iconNames.salesTax, iconTypes.duotone),
          name: customFieldNames.accountSalesTax,
          value: getCustomFieldValueByCode(
            item,
            customFieldNames.accountSalesTax,
            false
          ),
          component: CustomField,
          isCustomField: true
        }
      ],
      [profileCardEditors.footer]: {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: customFieldNames.accountOwner,
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.accountOwner}.id`,
          user?.id
        ),
        component: CustomField,
        isCustomField: true,
        props: {
          initialFetchValue: getCustomFieldValueByCode(
            item,
            `${customFieldNames.accountOwner}.id`,
            user?.id
          ),
          withPortal: true
        }
      }
    }),
    [item, address, user?.id]
  )

  const initialValue = useMemo(
    () => ({
      [customFieldNames.accountSalesTax]: isEdit
        ? getCustomFieldValueByCode(
            item,
            customFieldNames.accountSalesTax,
            false
          )
        : true
    }),
    [isEdit, item]
  )

  return (
    <HiddenContentSideModal
      width="450px"
      afterWidth="930px"
      title={`${isEdit ? 'Edit' : 'Add'} an Account`}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.accounts[view])}
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
          entity={activityEntityType.accoount}
        />
      }
    >
      <ProfileCard
        displayList={profileCardList}
        editors={profileEditors}
        owner={getCustomFieldValueByCode(
          item,
          customFieldNames.accountOwner,
          user
        )}
        hideOwnerIcon
        onEditSubmit={handleEditSubmit('profile')}
        layout={layout}
        hideHeader
        onlyEdit
        hideFormActions
        onlyProfileList
        footerRootClassName={classes.profileFooterRoot}
        isSubmitClick={isSubmitClick}
        isResetClick={isResetClick}
        middleContentRootClassName={classes.profileMiddleRoot}
        initialValue={initialValue}
        isAdd={!isEdit}
      />
    </HiddenContentSideModal>
  )
}

export default AddEditAccount
