import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import Yup from 'utils/yup'

import { DefaultModal } from 'components/modals'
import { useLazyGetEmailByIdQuery, useSendEmailMutation } from 'api/emailApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { emailField, requiredField } from 'constants/validationMessages'
import Container from 'components/containers/Container'
import {
  FormControlAutocomplete,
  FormControlEmailEditor,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import Scrollbars from 'components/Scrollbars'
import Spacing from 'components/containers/Spacing'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { useGetOauthQuery } from 'api/configApi'
import { CircularLoader } from 'components/loaders'
import Alert from 'components/Alert'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import queryParamsHelper from 'utils/queryParamsHelper'
import {
  emailEntityAutoComplete,
  emailEntityFetchRecord,
  emailEntityOptions,
  emailEntityType
} from 'constants/emailConstants'
import { simulateEvent } from 'utils/formik'
import { _isEmpty, _isNotEmpty } from 'utils/lodash'
import { oauthServiceName } from 'constants/oauthConstants'
import { convertToFormData } from 'utils/apiUtils'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useLazyGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { getEmails } from 'utils/detailViewUtils'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { useLazyGetContactsQuery } from 'api/contactApi'
import { BIG_LIMIT } from 'constants/app'
import { froalaEntityNames } from 'constants/froalaConstants'
import { getPlaceholderPreviewData } from 'utils/froalaPlaceholder'
import { store } from '../../store/store'
import useUser from 'hooks/useUser'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'

const useStyles = makeStyles(({ typography, type }) => ({
  container: {
    gap: 16
  },
  emailEditor: {
    '& .fr-wrapper .fr-element': {
      minHeight: `300px !important`
    }
  },
  downArrowIcon: {
    color: typography.lightText[type].color,
    cursor: 'pointer'
  },
  ccContainer: {
    height: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: '0.3s height, 0.3s opacity, 0.3s visibility',
    marginBottom: '-16px'
  },
  ccContainerVisible: {
    height: '45px',
    opacity: 1,
    visibility: 'visible',
    marginBottom: 0
  },
  alert: {
    cursor: 'pointer'
  }
}))

const initialValues = {
  to: [],
  cc: [],
  message: '',
  subject: '',
  relatedToId: '',
  relatedToEntity: '',
  attachments: [],
  relatedEntity: {}
}

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(requiredField),
  message: Yup.string().required(requiredField),
  to: Yup.array()
    .min(1, requiredField)
    .of(
      Yup.object().shape({
        value: Yup.string().email(emailField)
      })
    ),
  cc: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().email(emailField)
    })
  ),
  bcc: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().email(emailField)
    })
  )
})

const entityToFroalaEntity = {
  [emailEntityType.lead]: froalaEntityNames.leadEmail,
  [emailEntityType.account]: froalaEntityNames.accountEmail,
  [emailEntityType.contact]: froalaEntityNames.contactEmail,
  [emailEntityType.opportunity]: froalaEntityNames.opportunityEmail,
  [emailEntityType.estimate]: froalaEntityNames.estimateEmail
}

const ComposeEmailModal = ({
  open = false,
  onClose,
  fetcher,
  hideRelatedFields = false,
  entity,
  entityId,
  entityRecord,
  froalaEntity,
  id,
  isValidateAppointmentLink = false
}) => {
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = useState(false)
  const [showCcFields, setShowCcFields] = useState(false)
  const [entityData, setEntityData] = useState()
  const permission = useDeterminePermissions(permissionGroupNames.email)

  const [composeEmail, post] = useSendEmailMutation({
    fixedCacheKey: apiCacheKeys.email.add
  })

  const [getById, emailReducer] = useLazyGetEmailByIdQuery()
  const [getCustomFields, { data: layout, isFetching: layoutFetching }] =
    useLazyGetCustomFieldsByEntityQuery()
  const { data, isFetching } = useGetOauthQuery(oauthServiceName.gmail)
  const [getContacts] = useLazyGetContactsQuery()
  const { data: user } = useUser()

  useEffect(() => {
    if (id) {
      getById(id)
    }
    //eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (entityRecord) {
      setEntityData(entityRecord)
    }
  }, [entityRecord])

  const onSubmit = useCallback(
    ({
      subject,
      message,
      to,
      cc,
      bcc,
      relatedToId,
      relatedToEntity,
      attachments
    }) => {
      setSubmitting(true)
      composeEmail(
        convertToFormData(
          queryParamsHelper(
            {
              subject,
              message,
              sendTo: [...(to || []).map(({ value }) => value)],
              cc: [...(cc || []).map(({ value }) => value)],
              bcc: [...(bcc || []).map(({ value }) => value)],
              tokenId: [...data].reverse()[0].id,
              relatedToId,
              relatedToEntity,
              attachments
            },
            [],
            ['sendTo', 'cc', 'bcc', 'attachments']
          )
        )
      )
    },
    [composeEmail, data]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    validateForm,
    setValues
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (entity || entityId) {
      setValues({
        ...values,
        relatedToEntity: entity,
        relatedToId: entityId,
        relatedEntity: entityRecord
      })
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (values.relatedToEntity) {
      if (
        [
          emailEntityType.account,
          emailEntityType.opportunity,
          emailEntityType.estimate
        ].includes(values.relatedToEntity)
      ) {
        getCustomFields(
          {
            entityType: emailEntityType.contact
          },
          true
        )
      } else {
        getCustomFields(
          {
            entityType: values.relatedToEntity
          },
          true
        )
      }
    }
    //eslint-disable-next-line
  }, [values.relatedToEntity])

  const emailOptions = useMemo(() => {
    let emails = []
    if (
      [
        emailEntityType.account,
        emailEntityType.opportunity,
        emailEntityType.estimate
      ].includes(values.relatedToEntity)
    ) {
      const contacts =
        values.relatedEntity?.contacts ||
        values.relatedEntity?.account?.contacts ||
        []

      contacts.forEach(contact => {
        emails = [
          ...emails,
          ...Object.values(getEmails(layout, contact)).map(email => ({
            label: getTitleBasedOnEntity(emailEntityType.contact, contact),
            value: email
          }))
        ]
      })
    } else {
      emails = Object.values(getEmails(layout, values.relatedEntity)).map(
        email => ({
          label: getTitleBasedOnEntity(
            values.relatedToEntity,
            values.relatedEntity
          ),
          value: email
        })
      )
    }
    return _isEmpty(emails) ? [] : emails.filter(({ value }) => !!value)
  }, [layout, values])

  useEffect(() => {
    if (emailOptions?.length && entityId) {
      handleChange(simulateEvent('to', [emailOptions?.[0]]))
    }
    //eslint-disable-next-line
  }, [layout])

  useEffect(() => {
    if (_isNotEmpty(emailReducer?.data)) {
      const { to, cc, bcc, subject, content, relatedToEntity, relatedEntity } =
        emailReducer.data

      setValues({
        to: to.map(value => ({
          label: value,
          value
        })),
        cc: cc || [],
        bcc: bcc || [],
        subject,
        message: content,
        relatedToEntity,
        relatedToId: relatedEntity?.id,
        relatedEntity
      })
    }
    //eslint-disable-next-line
  }, [emailReducer])

  useNotifyAnalyzer({
    fetcher,
    onSuccess: onClose,
    onError: () => setSubmitting(false),
    entityName: 'Email',
    watchArray: [post],
    labels: [notifyLabels.sent]
  })

  const handleChangeRelatedEntity = useCallback(
    e => {
      handleChange(e)
      handleChange(simulateEvent('relatedToId', ''))
    },
    [handleChange]
  )

  const handleChangeRecord = useCallback(
    async e => {
      const {
        target: { value }
      } = e
      handleChange(e)

      if (
        !entityId &&
        [
          emailEntityType.account,
          emailEntityType.opportunity,
          emailEntityType.estimate
        ].includes(values.relatedToEntity)
      ) {
        const { data: contacts } = await getContacts({
          limit: BIG_LIMIT,
          accountId: value
        }).unwrap()
        handleChange(
          simulateEvent('relatedEntity', {
            ...e.target,
            contacts
          })
        )
      } else {
        handleChange(simulateEvent('relatedEntity', e.target))
      }
      if (emailEntityFetchRecord[values.relatedToEntity]) {
        const _data = await emailEntityFetchRecord[values.relatedToEntity](
          value
        )(store.dispatch, store.getState).unwrap()

        setEntityData(_data)
      }
    },
    [handleChange, entityId, getContacts, values.relatedToEntity]
  )

  const placeholderData = useMemo(() => {
    return getPlaceholderPreviewData(
      entityData,
      froalaEntity || entityToFroalaEntity[values.relatedToEntity]
    )
  }, [values.relatedToEntity, entityData, froalaEntity])

  const handleOpenProfile = () => {
    window.open(parseToAbsolutePath(routes.profile.root), '_blank')
  }

  return (
    <DefaultModal
      open={open}
      onClickSave={handleSubmit}
      onCloseModal={onClose}
      modalTitle={
        !!entityId
          ? `Send Email to ${getTitleBasedOnEntity(entity, entityRecord)}`
          : 'Compose Email'
      }
      buttonPrimaryText="Send"
      buttonPrimaryIcon={getIconClassName(iconNames.sendMail)}
      buttonPrimaryOpaque={isValid}
      buttonPrimaryDisabled={
        isSubmitting ||
        !data?.length ||
        !permission.create ||
        (isValidateAppointmentLink && !user.appointmentLink)
      }
      withActions={!id}
      maxWidth="lg"
    >
      <Scrollbars autoHeight autoHeightMax="calc(100vh - 235px)">
        {isFetching ? (
          <CircularLoader />
        ) : (
          <Spacing>
            <Container cols="1">
              {!data?.length && (
                <Alert
                  severity="warning"
                  className={classes.alert}
                  onClick={handleOpenProfile}
                >
                  No Email Integrated. Please click here to integrate email.
                </Alert>
              )}
              {isValidateAppointmentLink && !user.appointmentLink && (
                <Alert
                  severity="warning"
                  className={classes.alert}
                  onClick={handleOpenProfile}
                >
                  Your Google Worksuite Appointment Booking Link is not
                  available. Please click here to add the link.
                </Alert>
              )}
            </Container>
          </Spacing>
        )}
        <Spacing rootClassName={classes.container}>
          {!hideRelatedFields && (
            <Container isFormContainer>
              <FormControlReactSelect
                label="Related Entity"
                name="relatedToEntity"
                value={values.relatedToEntity}
                options={emailEntityOptions}
                onChange={handleChangeRelatedEntity}
                onBlur={handleBlur}
                marginBottom={false}
                readOnly={!!id}
                isOptional
                fullWidth
              />
              <FormControlAutocomplete
                label="Related Record"
                name="relatedToId"
                value={values.relatedToId}
                error={errors.relatedToId}
                touched={touched.relatedToId}
                getOptions={emailEntityAutoComplete[values.relatedToEntity]}
                onChange={handleChangeRecord}
                onBlur={handleBlur}
                optionsDependency={values.relatedToEntity}
                initialFetchValue={values.relatedToId}
                marginBottom={false}
                readOnly={!!id}
                isOptional
                fullWidth
              />
            </Container>
          )}
          <Container isFormContainer>
            <FormControlReactSelect
              name="to"
              label="To"
              value={values.to}
              error={Array.isArray(errors.to) ? emailField : errors.to}
              touched={touched.to}
              onChange={handleChange}
              onBlur={handleBlur}
              marginBottom={false}
              isMulti
              fullWidth
              isCreatable
              isSearchable
              readOnly={!!id}
              isLoading={layoutFetching}
              options={emailOptions}
              showValueOnDoubleClick
              createOptionLabelText={value => `Add "${value}"`}
              isRequired
              endAdornment={
                <i
                  className={classNames(
                    getIconClassName(
                      showCcFields ? iconNames.arrowUp : iconNames.arrowDown
                    ),
                    classes.downArrowIcon
                  )}
                  onClick={() => setShowCcFields(!showCcFields)}
                />
              }
            />
            <div></div>
          </Container>
          <Container
            rootClassName={classNames(classes.ccContainer, {
              [classes.ccContainerVisible]: showCcFields
            })}
            isFormContainer
          >
            <FormControlReactSelect
              name="cc"
              label="CC"
              value={values.cc}
              error={Array.isArray(errors.cc) ? emailField : errors.cc}
              touched={touched.cc}
              onChange={handleChange}
              onBlur={handleBlur}
              marginBottom={false}
              options={emailOptions}
              isMulti
              fullWidth
              isCreatable
              isSearchable
              showValueOnDoubleClick
              readOnly={!!id}
              createOptionLabelText={value => `Add "${value}"`}
            />
            <FormControlReactSelect
              name="bcc"
              label="BCC"
              value={values.bcc}
              error={Array.isArray(errors.bcc) ? emailField : errors.bcc}
              touched={touched.bcc}
              onChange={handleChange}
              onBlur={handleBlur}
              marginBottom={false}
              options={emailOptions}
              isMulti
              fullWidth
              isCreatable
              showValueOnDoubleClick
              isSearchable
              readOnly={!!id}
              createOptionLabelText={value => `Add "${value}"`}
            />
          </Container>
          <FormControlInput
            name="subject"
            label="Subject"
            value={values.subject}
            error={errors.subject}
            touched={touched.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            marginBottom={false}
            readOnly={!!id}
            fullWidth
            isRequired
          />
          <FormControlEmailEditor
            name="message"
            attachmentName="attachments"
            attachmentValue={values.attachments}
            value={values.message}
            error={errors.message}
            touched={touched.message}
            onChange={handleChange}
            marginBottom={false}
            fullWidth
            readOnly={!!id}
            formControlContainerClass={classes.emailEditor}
            entity={
              froalaEntity || entityToFroalaEntity[values.relatedToEntity]
            }
            placeholderData={placeholderData}
            previewPlaceholder
          />
        </Spacing>
      </Scrollbars>
    </DefaultModal>
  )
}

export default ComposeEmailModal
