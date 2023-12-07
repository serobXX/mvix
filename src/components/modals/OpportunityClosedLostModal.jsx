import { useCallback, useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import { makeStyles } from '@material-ui/core'
import Yup from 'utils/yup'
import moment from 'moment'
import momentTZ from 'moment-timezone'

import Scrollbars from 'components/Scrollbars'
import { DefaultModal } from '.'
import Spacing from 'components/containers/Spacing'
import Container from 'components/containers/Container'
import { requiredField } from 'constants/validationMessages'
import {
  FormControlAutocomplete,
  FormControlCustomField,
  FormControlEmailEditor,
  FormControlInput
} from 'components/formControls'
import customFieldNames from 'constants/customFieldNames'
import { getOptionsByFieldAndEntity } from 'utils/autocompleteOptions'
import { optionEntity } from 'constants/autocompleteOptions'
import { templateEntityValues } from 'constants/templateConstants'
import { froalaEntityNames } from 'constants/froalaConstants'
import { getPlaceholderPreviewData } from 'utils/froalaPlaceholder'
import { DATE_TIME_VIEW_FORMAT } from 'constants/dateTimeFormats'

const useStyles = makeStyles(() => ({
  strect: { gridColumnStart: 1, gridColumnEnd: 4 },
  strect2Col: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  emailEditor: {
    '& .fr-wrapper .fr-element': {
      height: `calc(100vh - 500px) !important`
    }
  }
}))

const initialValues = {
  lostReason: '',
  lostDetails: '',
  followupEmailSubject: '',
  followupEmailBody: '',
  followupSendEmailClient: ''
}

const validationSchema = Yup.object().shape({
  lostReason: Yup.string().required(requiredField),
  lostDetails: Yup.string().nullable(),
  followupSendEmailClient: Yup.mixed().required(requiredField),
  followupEmailSubject: Yup.string().when('followupSendEmailClient', {
    is: value => value !== 0,
    then: () => Yup.string().required(requiredField)
  }),
  followupEmailBody: Yup.string().when('followupSendEmailClient', {
    is: value => value !== 0,
    then: () => Yup.string().required(requiredField)
  })
})

const transformData = (data, searchField, passAllFields) => {
  return data.map(d => ({
    data: passAllFields ? d : {},
    value: d.id,
    label: d[searchField],
    group: 'group2'
  }))
}

const groupedOptions = [
  {
    label: 'Group 1: -- No Email Needed --',
    value: 'group1'
  },
  {
    label: 'Group 2: -- Select Email Template --',
    value: 'group2'
  }
]

const staticOptions = [
  {
    label: 'Do not send any email',
    value: 0,
    data: {},
    group: 'group1'
  }
]

const OpportunityClosedLostModal = ({
  layout,
  open,
  onClose,
  onSave,
  item
}) => {
  const classes = useStyles()
  const timezone = momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()

  const onSubmit = useCallback(
    ({ lostReason, lostDetails, followupSendEmailClient, ...values }) => {
      onSave(
        {
          ...values,
          [customFieldNames.lostReason]: lostReason,
          [customFieldNames.lostDetails]: lostDetails
        },
        followupSendEmailClient === 0
          ? 'Opportunity is marked closed and Lost Reason has been recorded'
          : 'Opportunity is marked closed, Lost Reason is recorded and Email sent to Client.'
      )
    },
    [onSave]
  )

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    setFieldValue,
    handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    //eslint-disable-next-line
  }, [])

  const isEmailVisible = values.followupSendEmailClient !== 0

  const handleChangeCustomField = useCallback(
    name =>
      ({ target: { value } }) => {
        setFieldValue(name, value)
      },
    [setFieldValue]
  )

  const placeholderData = useMemo(
    () => getPlaceholderPreviewData(item, froalaEntityNames.opportunityEmail),
    [item]
  )

  const handleChangeSendEmailClient = useCallback(
    e => {
      const {
        target: {
          data: { template },
          value
        }
      } = e
      handleChange(e)
      if (value === 0) {
        setFieldValue('followupEmailSubject', '')
        setFieldValue('followupEmailBody', '')
      } else setFieldValue('followupEmailBody', template)
    },
    [handleChange, setFieldValue]
  )

  return (
    <DefaultModal
      modalTitle="Closed Lost?"
      open={open}
      onCloseModal={onClose}
      onClickSave={handleSubmit}
      maxWidth="lg"
      buttonPrimaryOpaque={!isValid}
      buttonPrimaryText={isEmailVisible ? 'Send Email' : 'Save'}
    >
      <Scrollbars autoHeight autoHeightMax="calc(100vh - 200px)">
        <Spacing>
          <Container cols={'3'}>
            <FormControlCustomField
              label="Lost Reason"
              name={customFieldNames.lostReason}
              layout={layout}
              value={values.lostReason}
              onChange={handleChangeCustomField('lostReason')}
              error={errors.lostReason}
              touched={touched.lostReason}
              fullWidth
              isRequired
              marginBottom={false}
              withPortal
            />
            <FormControlCustomField
              label="Details"
              name={customFieldNames.lostDetails}
              layout={layout}
              value={values.lostDetails}
              onChange={handleChangeCustomField('lostDetails')}
              error={errors.lostDetails}
              touched={touched.lostDetails}
              fullWidth
              marginBottom={false}
            />
            <FormControlInput
              label="Being Closed on"
              value={`${moment().format(DATE_TIME_VIEW_FORMAT)} ${timezone}`}
              marginBottom={false}
              disabled={true}
              fullWidth
            />

            <FormControlAutocomplete
              label="Send Email to Client?"
              name="followupSendEmailClient"
              value={values.followupSendEmailClient}
              onChange={handleChangeSendEmailClient}
              onBlur={handleBlur}
              error={errors.followupTemplateId}
              touched={touched.followupTemplateId}
              formControlContainerClass={classes.strect2Col}
              getOptions={getOptionsByFieldAndEntity({
                entity: optionEntity.template,
                field: 'name',
                options: {
                  entity: templateEntityValues.email
                },
                passAllFields: true,
                transformData
              })}
              staticOptions={staticOptions}
              groupedOptions={groupedOptions}
              fullWidth
              isRequired
              marginBottom={false}
              withPortal
              isGroupedSelect={true}
              isSelectFirstOption
            />

            <FormControlInput
              name="followupEmailSubject"
              label="Subject"
              value={values.followupEmailSubject}
              error={errors.followupEmailSubject}
              touched={touched.followupEmailSubject}
              onChange={handleChange}
              onBlur={handleBlur}
              formControlContainerClass={classes.strect}
              marginBottom={false}
              disabled={!isEmailVisible}
              fullWidth
              isRequired={isEmailVisible}
            />
            <FormControlEmailEditor
              name="followupEmailBody"
              value={values.followupEmailBody}
              error={errors.followupEmailBody}
              touched={touched.followupEmailBody}
              onChange={handleChange}
              marginBottom={false}
              fullWidth
              rootClassName={classes.strect}
              formControlContainerClass={classes.emailEditor}
              entity={froalaEntityNames.opportunityEmail}
              placeholderData={placeholderData}
              previewPlaceholder
              disabled={!isEmailVisible}
              hideAttachment
              hideTemplate
            />
          </Container>
        </Spacing>
      </Scrollbars>
    </DefaultModal>
  )
}

export default OpportunityClosedLostModal
