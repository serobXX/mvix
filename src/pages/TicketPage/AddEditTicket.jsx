import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import * as Yup from 'yup'
import { HiddenContentSideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { ProfileCard } from 'components/cards'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { profileCardEditors } from 'constants/detailView'
import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlTelInput
} from 'components/formControls'
import { requiredField } from 'constants/validationMessages'
import useUser from 'hooks/useUser'
import { _get } from 'utils/lodash'
import {
  getAccountOptions,
  getContactOptions,
  getDeviceOptions,
  getUserOptions
} from 'utils/autocompleteOptions'
import {
  useAddTicketMutation,
  useLazyGetTicketByIdQuery,
  useUpdateTicketMutation
} from 'api/ticketApi'
import { simulateEvent } from 'utils/formik'
import queryParamsHelper from 'utils/queryParamsHelper'
import apiCacheKeys from 'constants/apiCacheKeys'
import HiddenBar from './HiddenBar'

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
  inputRoot: {
    height: '187px !important'
  },
  hiddenPanelVisible: {
    width: 420
  }
}))

const initialValidationSchema = {
  accountId: Yup.string().required(requiredField),
  contactId: Yup.string().required(requiredField),
  email: Yup.string().required(requiredField),
  phone: Yup.string().required(requiredField),
  subject: Yup.string().required(requiredField),
  message: Yup.string().required(requiredField)
}

const AddEditTicket = ({ layout }) => {
  const { id } = useParams()
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const { data: user } = useUser()
  const navigate = useNavigate()
  const [getItemById, { data: item }] = useLazyGetTicketByIdQuery()
  const isEdit = !!id

  const [addItem, post] = useAddTicketMutation({
    fixedCacheKey: apiCacheKeys.ticket.add
  })
  const [updateItem, put] = useUpdateTicketMutation({
    fixedCacheKey: apiCacheKeys.ticket.update
  })

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
      navigate(parseToAbsolutePath(routes.tickets.open))
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

    const updatedCustomFields = { ...customFields }
    if (isNaN(updatedCustomFields.contactId)) {
      updatedCustomFields.contactName = updatedCustomFields.contactId
      delete updatedCustomFields.contactId
    }
    const data = {
      ...queryParamsHelper(updatedCustomFields),
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
  }, [values, isEdit, updateItem, id, addItem])

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

  const handleChange = useCallback(
    handleChange => e => {
      const {
        target: { name, value, customFields, accountId }
      } = e
      handleChange(simulateEvent(name, value))
      handleChange(simulateEvent('accountId', accountId?.id))
      handleChange(
        simulateEvent(
          'email',
          customFields?.email !== 'undefined' ? customFields?.email : null
        )
      )
      handleChange(
        simulateEvent(
          'phone',
          customFields?.phone !== 'undefined' ? customFields?.phone : null
        )
      )
    },
    []
  )

  const profileCardList = useMemo(
    () => [
      {
        value: item?.contact?.id
      },
      {
        value: item?.account?.id
      },
      {
        values: item?.email
      },
      {
        values: item?.phone
      },
      {
        value: item?.deviceId
      },
      {
        value: item?.serialNumber
      },
      {
        value: item?.ticketSubject
      },
      {
        value: item?.ticketDescription
      }
    ],
    [item]
  )

  const profileEditors = useMemo(
    () => ({
      [profileCardEditors.list]: [
        {
          icon: getIconClassName(iconNames.contact, iconTypes.duotone),
          name: 'contactId',
          label: 'Contact',
          value: item?.contact?.id,
          component: FormControlAutocomplete,
          isSingleEditor: true,
          isRequired: true,
          props: ({ contactId, accountId }) => ({
            isCreatable: true,
            createOptionLabelText: value => `Add new "${value}"`,
            getOptions: getContactOptions(null, null, {
              options: { accountId },
              passAllFields: true
            }),
            passAllFields: true,
            onChange: handleChange,
            initialFetchValue: contactId
          })
        },
        {
          icon: getIconClassName(iconNames.account, iconTypes.duotone),
          label: 'Account',
          name: 'accountId',
          value: item?.account?.id,
          component: FormControlAutocomplete,
          isRequired: true,
          props: ({ accountId }) => ({
            getOptions: getAccountOptions(null, null, { passAllFields: true }),
            initialFetchValue: accountId
          })
        },
        {
          name: 'email',
          type: 'email',
          icon: getIconClassName(iconNames.email2, iconTypes.duotone),
          component: FormControlInput,
          value: item?.contact?.customFields?.email,
          isRequired: true
        },
        {
          name: 'phone',
          component: FormControlTelInput,
          value: item?.contact?.customFields?.phone,
          isRequired: true
        },
        {
          icon: getIconClassName(iconNames.device, iconTypes.duotone),
          name: 'deviceId',
          label: 'Device ID',
          value: item?.device || '',
          component: FormControlAutocomplete,
          props: ({ accountId }) => ({
            getOptions: getDeviceOptions(null, null, {
              options: { accountId }
            })
          })
        },
        {
          component: FormControlInput,
          icon: getIconClassName(iconNames.serial, iconTypes.duotone),
          name: 'serialNumber',
          label: 'Serial Number',
          isCustomField: true,
          value: item?.serialNumber || '',
          props: {
            hideCopyBtn: true
          }
        },
        {
          component: FormControlInput,
          name: 'subject',
          icon: getIconClassName(iconNames.subject, iconTypes.duotone),
          isCustomField: true,
          isRequired: true,
          fullWidth: true,
          isSingleColumn: true,
          value: item?.subject,
          props: {
            hideCopyBtn: true
          }
        },
        {
          name: 'message',
          value: item?.message,
          component: FormControlInput,
          isCustomField: true,
          fullWidth: true,
          isSingleColumn: true,
          label: 'Ticket Description',
          props: {
            formControlInputClass: classes.inputRoot,
            multiline: true
          }
        }
      ],
      [profileCardEditors.footer]: {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: 'ticketOwner',
        label: 'Ticket Owner',
        fullWidth: true,
        isSingleColumn: true,
        value: item?.ticketOwner?.id || user?.id,
        component: FormControlAutocomplete,
        isCustomField: true,
        props: ({ accountId }) => ({
          getOptions: getUserOptions(null, null, {
            options: { accountId }
          })
        })
      }
    }),
    [classes.inputRoot, handleChange, item, user?.id]
  )
  return (
    <HiddenContentSideModal
      width="450px"
      afterWidth="900px"
      title={`${isEdit ? 'Edit' : 'Add'} a Ticket`}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.tickets.open)}
      hiddenPanelVisibleClassName={classes.hiddenPanelVisible}
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
        <HiddenBar
          internalNotes={_get(item, `internalNote.description`)}
          onSubmit={handleEditSubmit('task')}
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
        />
      }
    >
      <ProfileCard
        displayList={profileCardList}
        editors={profileEditors}
        owner={getCustomFieldValueByCode(item, 'ticketOwner', user)}
        hideOwnerIcon
        onEditSubmit={handleEditSubmit('profile')}
        layout={layout}
        hideHeader
        onlyEdit
        hideFormActions
        onlyProfileList
        initialValidationSchema={initialValidationSchema}
        footerRootClassName={classes.profileFooterRoot}
        isSubmitClick={isSubmitClick}
        isResetClick={isResetClick}
        isAdd={!isEdit}
      />
    </HiddenContentSideModal>
  )
}

export default AddEditTicket
