import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { HiddenContentSideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import { requiredField } from 'constants/validationMessages'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import {
  useAddOpportunityMutation,
  useLazyGetOpportunityByIdQuery,
  useUpdateOpportunityMutation
} from 'api/opportunityApi'
import {
  getCustomFieldValueByCode,
  getLookupOptions,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { _get } from 'utils/lodash'
import { useLazyGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { customFieldLookupType, entityValues } from 'constants/customFields'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import customFieldNames from 'constants/customFieldNames'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { activityEntityType } from 'constants/activity'
import { AddTaskCard, ProfileCard } from 'components/cards'
import useUser from 'hooks/useUser'
import { makeStyles } from '@material-ui/core'
import { profileCardEditors } from 'constants/detailView'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import Yup from 'utils/yup'
import StageLostReasonField from './StageLostReasonField'
import {
  CLOSED_LOST,
  opportunityTypeOptions,
  opportunityTypeValues
} from 'constants/opportunityConstants'
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
  accountId: Yup.number().required(requiredField),
  opportunityName: Yup.string().required(requiredField),
  projectType: Yup.string().required(requiredField),
  stageId: Yup.number().required(requiredField),
  expectingClosingDate: Yup.string().required(requiredField),
  expectedRevenue: Yup.number().required(requiredField),
  [customFieldNames.lostReason]: Yup.number()
    .when('stageName', {
      is: CLOSED_LOST,
      then: () => Yup.number().required(requiredField)
    })
    .nullable()
}

const AddEditOpportunity = ({
  layout: _layout,
  closeLink,
  loadLayout = false,
  fromDetailView = false
}) => {
  const { id, view, opportunityId } = useParams()
  const classes = useStyles()
  const location = useLocation()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const [disabledFields, setDisabledFields] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const navigate = useNavigate()
  const { data: user } = useUser()

  const [getItemById, { data: item }] = useLazyGetOpportunityByIdQuery()
  const [addItem, post] = useAddOpportunityMutation({
    fixedCacheKey: apiCacheKeys.opportunity.add
  })
  const [updateItem, put] = useUpdateOpportunityMutation({
    fixedCacheKey: apiCacheKeys.opportunity.update
  })

  const [getCustomFieldLayout, { data: customFieldLayout }] =
    useLazyGetCustomFieldsByEntityQuery()

  const isEdit = fromDetailView ? !!opportunityId : !!id

  useNotifyAnalyzer({
    entityName: 'Opportunity',
    watchArray: [post, put],
    labels: [notifyLabels.add, notifyLabels.update],
    stopNotifying: !fromDetailView
  })

  useEffect(() => {
    if (loadLayout) {
      getCustomFieldLayout({
        entityType: entityValues.opportunity
      })
    }
    //eslint-disable-next-line
  }, [loadLayout])

  const layout = useMemo(
    () => _layout || customFieldLayout,
    [_layout, customFieldLayout]
  )

  useEffect(() => {
    setInitialValues({
      accountId: item?.account?.id || '',
      opportunityName:
        getTitleBasedOnEntity(entityValues.opportunity, item) || '',
      projectType:
        item?.[customFieldNames.opportunityType] ||
        opportunityTypeValues.newBusiness,
      stageId: item?.stage?.id || 1,
      stageName: item?.stage?.name || '',
      expectingClosingDate:
        item?.[customFieldNames.oppExpectedClosingDate] || '',
      expectedRevenue: item?.[customFieldNames.oppExpectedRevenue] || '',
      [customFieldNames.lostReason]: getCustomFieldValueByCode(
        item,
        `${customFieldNames.lostReason}.id`,
        ''
      )
    })
  }, [item])

  useEffect(() => {
    if (location.state && !isEdit && fromDetailView) {
      setInitialValues(val => ({
        ...val,
        ...location.state
      }))
      setDisabledFields(Object.keys(location.state))
    }
    //eslint-disable-next-line
  }, [location.state])

  useEffect(() => {
    if (fromDetailView ? opportunityId : id) {
      getItemById(fromDetailView ? opportunityId : id)
    }
    //eslint-disable-next-line
  }, [id, opportunityId])

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
      navigate(closeLink || parseToAbsolutePath(routes.opportunities.list))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const handleSubmit = useCallback(() => {
    const {
      profile: {
        accountId,
        opportunityName,
        projectType,
        stageId,
        stageName,
        expectedRevenue,
        expectingClosingDate,
        ...customFields
      },
      task
    } = values
    setSubmitting(true)

    const data = {
      accountId,
      opportunityName,
      projectType,
      stageId,
      expectedRevenue,
      expectingClosingDate,
      customFields: queryParamsHelper(customFields),
      ...task
    }
    if (isEdit) {
      updateItem({
        id: fromDetailView ? opportunityId : id,
        data
      })
    } else {
      addItem(data)
    }
  }, [isEdit, id, opportunityId, fromDetailView, values, addItem, updateItem])

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

      setValues(v => ({
        ...v,
        [entity]: data
      }))
    },
    []
  )

  const profileCardList = useMemo(
    () => [
      {
        value: _get(item, `stage.name`)
      },
      {
        value: getTitleBasedOnEntity(entityValues.opportunity, item)
      },
      {
        value: item?.projectType
      },
      {
        value: item?.expectingClosingDate
      },
      {
        value: getTitleBasedOnEntity(entityValues.account, item?.account)
      },
      {
        value: getTitleBasedOnEntity(
          entityValues.contact,
          getCustomFieldValueByCode(item, customFieldNames.contactName)
        )
      },
      {
        value: getCustomFieldValueByCode(item, customFieldNames.description)
      },
      {
        value: item?.expectedRevenue
      }
    ],
    [item]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.list]: [
        {
          name: 'stageId',
          label: 'Stage',
          value: item?.stage?.id,
          component: StageLostReasonField,
          isSingleColumn: true,
          fullWidth: true
        },
        {
          name: customFieldNames.opportunityName,
          label: 'Opportunity Name',
          value: getTitleBasedOnEntity(entityValues.opportunity, item),
          icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
          component: FormControlInput,
          fullWidth: true,
          isSingleColumn: true,
          isRequired: true
        },
        {
          name: customFieldNames.opportunityType,
          label: 'Opportunity Type',
          value: item?.[customFieldNames.opportunityType],
          icon: getIconClassName(
            iconNames.opportunityRootNav,
            iconTypes.duotone
          ),
          component: FormControlReactSelect,
          props: {
            options: opportunityTypeOptions,
            withPortal: true
          }
        },
        {
          name: customFieldNames.oppExpectedClosingDate,
          label: 'Expected Closing Date',
          value: item?.[customFieldNames.oppExpectedClosingDate],
          icon: getIconClassName(iconNames.date, iconTypes.duotone),
          component: FormControlDatePicker,
          isRequired: true,
          props: {
            withPortal: true
          }
        },
        {
          name: 'accountId',
          label: 'Account Name',
          value: item?.account?.id,
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          component: FormControlAutocomplete,
          isRequired: true,
          props: ({ accountId }) => ({
            getOptions: getLookupOptions(customFieldLookupType.account),
            initialFetchValue: accountId,
            withPortal: true
          }),
          fullWidth: true,
          isSingleColumn: true
        },
        {
          name: customFieldNames.contactName,
          value: getCustomFieldValueByCode(
            item,
            `${customFieldNames.contactName}.id`
          ),
          icon: getIconClassName(iconNames.contact, iconTypes.duotone),
          component: CustomField,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true
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
          icon: getIconClassName(iconNames.expectedRevenue, iconTypes.duotone),
          name: customFieldNames.oppExpectedRevenue,
          label: 'Expected Revenue',
          value: item?.[customFieldNames.oppExpectedRevenue],
          component: FormControlNumericInput,
          isRequired: true,
          props: {
            min: 0,
            precision: 2
          }
        }
      ],
      [profileCardEditors.footer]: {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: customFieldNames.opportunityOwner,
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.opportunityOwner}.id`,
          user?.id
        ),
        component: CustomField,
        isCustomField: true,
        props: {
          initialFetchValue: getCustomFieldValueByCode(
            item,
            `${customFieldNames.opportunityOwner}.id`,
            user?.id
          ),
          withPortal: true
        }
      }
    }),
    [item, user?.id]
  )

  return (
    <HiddenContentSideModal
      width="450px"
      afterWidth="930px"
      title={`${isEdit ? 'Edit' : 'Add'} an Opportuntiy`}
      headerClassName={classes.sideModalHeader}
      closeLink={closeLink || parseToAbsolutePath(routes.opportunities[view])}
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
          entity={activityEntityType.opportunity}
        />
      }
    >
      <ProfileCard
        displayList={profileCardList}
        editors={profileEditors}
        owner={getCustomFieldValueByCode(
          item,
          customFieldNames.opportunityOwner,
          user
        )}
        hideOwnerIcon
        onEditSubmit={handleEditSubmit('profile')}
        layout={layout}
        hideHeader
        onlyEdit
        hideFormActions
        onlyProfileList
        initialValue={initialValues}
        initialValidationSchema={initialValidationSchema}
        footerRootClassName={classes.profileFooterRoot}
        isSubmitClick={isSubmitClick}
        isResetClick={isResetClick}
        disabledFields={disabledFields}
        isAdd={!isEdit}
      />
    </HiddenContentSideModal>
  )
}

export default AddEditOpportunity
