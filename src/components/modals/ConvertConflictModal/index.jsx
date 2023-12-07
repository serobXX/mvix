import { useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import moment from 'moment'
import Yup from 'utils/yup'

import { DefaultModal } from 'components/modals'
import AccordionRow from './AccordionRow'
import {
  accountMappingList,
  conflictActionNames,
  contactMappingList
} from 'constants/leadConstants'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'
import Scrollbars from 'components/Scrollbars'
import { _get, _isEmpty } from 'utils/lodash'
import { entityValues } from 'constants/customFields'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { opportunityTypeValues } from 'constants/opportunityConstants'
import { NORMAL_DATE_FORMAT } from 'constants/dateTimeFormats'
import OpportunityForm from './OpportunityForm'
import { requiredField } from 'constants/validationMessages'

const useStyles = makeStyles(() => ({
  modalContent: {
    paddingTop: 16
  },
  createNewOptionRoot: {
    marginBottom: 0,
    paddingLeft: 580,
    paddingRight: 40
  }
}))

const compressValue = (name, value) => {
  if (Array.isArray(value)) {
    if (typeof value === 'object' && name === customFieldNames.addresses) {
      return {
        label:
          value &&
          value
            .map(({ address1, address2 }) => `${address1}, ${address2}`)
            .join(', '),
        value: value || []
      }
    } else {
      return {
        label: value.join(', '),
        value
      }
    }
  } else if (value && typeof value === 'object') {
    if (
      [
        customFieldNames.leadOwner,
        customFieldNames.contactOwner,
        customFieldNames.accountOwner
      ].includes(name)
    ) {
      return {
        label: `${value.first_name} ${value.last_name}`,
        value: value?.id
      }
    } else {
      return {
        label: value.name,
        value: value.id
      }
    }
  } else
    return {
      label: value,
      value
    }
}

const validationSchema = Yup.object().shape({
  actionOpportunity: Yup.string(),
  doNotCreateOpportunity: Yup.boolean(),
  opportunityCustomFields: Yup.object().when(
    ['actionOpportunity', 'doNotCreateOpportunity'],
    {
      is: (actionOpportunity, doNotCreateOpportunity) =>
        !doNotCreateOpportunity &&
        actionOpportunity === conflictActionNames.createNew,
      then: () =>
        Yup.object().shape({
          opportunityName: Yup.string().required(requiredField),
          projectType: Yup.string().required(requiredField),
          stageId: Yup.string().required(requiredField),
          expectingClosingDate: Yup.string().required(requiredField)
        }),
      otherwise: () => Yup.object().nullable()
    }
  )
})

const ConvertConflictModal = ({ open, title, data, onConvert, onClose }) => {
  const classes = useStyles()

  const expectingClosingDate = useMemo(() => {
    let nextMonth = moment().add(1, 'month')
    return nextMonth.endOf('month').format(NORMAL_DATE_FORMAT)
  }, [])

  const initialValues = useMemo(
    () => ({
      actionContact: conflictActionNames.createNew,
      contactCustomFields: {},
      actionAccount: conflictActionNames.createNew,
      accountCustomFields: {},
      actionOpportunity: conflictActionNames.createNew,
      doNotCreateOpportunity: false,
      selectedOpportunityId: '',
      opportunityCustomFields: {
        opportunityName: '',
        projectType: opportunityTypeValues.newBusiness,
        stageId: 1,
        expectingClosingDate,
        contactAuthority: [],
        solutionInterest: ''
      }
    }),
    [expectingClosingDate]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: onConvert
  })

  const { accountCustomFields } = values

  useEffect(() => {
    setFieldValue(
      'opportunityCustomFields.opportunityName',
      `${
        accountCustomFields?.[customFieldNames.accountName]
      }_${getCustomFieldValueByCode(
        data?.account,
        `${customFieldNames.leadSolutionInterest}.name`,
        ''
      )}_${moment().format('MMMMYYYY')}`
    )
    //eslint-disable-next-line
  }, [accountCustomFields?.[customFieldNames.accountName]])

  useEffect(() => {
    if (values?.actionAccount === conflictActionNames.createNew) {
      setFieldValue('actionOpportunity', conflictActionNames.createNew)
    }
    //eslint-disable-next-line
  }, [values?.actionAccount])

  const accountList = useMemo(() => {
    if (!data) return []
    const { lead, account } = data

    return Object.entries(accountMappingList).map(([key, { label, value }]) => {
      let oldValue = compressValue(key, getCustomFieldValueByCode(account, key))
      let newValue = compressValue(
        value,
        getCustomFieldValueByCode(lead, value)
      )

      return {
        label,
        name: key,
        options: [oldValue, newValue]
      }
    })
  }, [data])

  const contactList = useMemo(() => {
    if (!data) return []
    const { lead, contact } = data

    return Object.entries(contactMappingList).map(([key, { label, value }]) => {
      let oldValue = compressValue(key, getCustomFieldValueByCode(contact, key))
      let newValue = compressValue(
        value,
        getCustomFieldValueByCode(lead, value)
      )

      return {
        label,
        name: key,
        options: [oldValue, newValue]
      }
    })
  }, [data])

  useEffect(() => {
    setValues({
      ...values,
      selectedOpportunityId: _get(data, 'opportunity.0.id'),
      accountCustomFields: accountList.reduce((a, b) => {
        a[b.name] =
          _get(b, 'options.1.value', '') || _get(b, 'options.0.value', '')
        return a
      }, {}),
      contactCustomFields: contactList.reduce((a, b) => {
        a[b.name] =
          _get(b, 'options.1.value', '') || _get(b, 'options.0.value', '')
        return a
      }, {})
    })
    //eslint-disable-next-line
  }, [accountList, contactList, data?.opportunity])

  const opportunityList = useMemo(
    () =>
      data?.opportunity &&
      data?.opportunity.map(opp => ({
        value: opp.id,
        label: getTitleBasedOnEntity(entityValues.opportunity, opp)
      })),
    [data]
  )

  const opportunityTitle = useMemo(
    () =>
      opportunityList.find(
        ({ value }) => value === values?.selectedOpportunityId
      )?.label,
    [opportunityList, values?.selectedOpportunityId]
  )

  const createNewOptionsRender = useMemo(
    () => (
      <OpportunityForm
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        classes={classes}
      />
    ),
    [values, handleChange, classes, errors, touched]
  )

  return (
    <DefaultModal
      maxWidth="lg"
      open={open}
      modalTitle={title}
      onClickSave={handleSubmit}
      onCloseModal={onClose}
      buttonPrimaryText="Convert"
      contentClass={classes.modalContent}
    >
      <Scrollbars autoHeight autoHeightMax={'calc(100vh - 200px)'}>
        <AccordionRow
          title="Account"
          actionName="actionAccount"
          values={values}
          handleChange={handleChange}
          fieldName="accountCustomFields"
          list={accountList}
          title1={getCustomFieldValueByCode(
            data?.account,
            customFieldNames.accountName
          )}
          title2={getCustomFieldValueByCode(
            data?.lead,
            customFieldNames.leadCompany
          )}
          hideExisting={_isEmpty(data?.account)}
          icon1={getIconClassName(iconNames.account, iconTypes.duotone)}
          icon2={getIconClassName(iconNames.account, iconTypes.duotone)}
        />
        <AccordionRow
          title="Contact"
          actionName="actionContact"
          values={values}
          handleChange={handleChange}
          fieldName="contactCustomFields"
          list={contactList}
          title1={getTitleBasedOnEntity(entityValues.contact, data?.contact)}
          title2={getTitleBasedOnEntity(entityValues.lead, data?.lead)}
          hideExisting={_isEmpty(data?.contact)}
          icon1={getIconClassName(iconNames.contact, iconTypes.duotone)}
          icon2={getIconClassName(iconNames.contact, iconTypes.duotone)}
        />
        <AccordionRow
          title="Opportunity"
          actionName="actionOpportunity"
          values={values}
          handleChange={handleChange}
          fieldName="selectedOpportunityId"
          title1={opportunityTitle}
          hideTitle2
          hideExisting={_isEmpty(data?.opportunity)}
          icon1={getIconClassName(iconNames.opportunity, iconTypes.duotone)}
          showTitle2CheckBox
          title2CheckboxName="doNotCreateOpportunity"
          title2CheckboxText="Do not create an opportunity upon conversion"
          disabledExisting={
            _get(values, 'actionAccount') === conflictActionNames.createNew
          }
          existingList={
            values.actionOpportunity === conflictActionNames.addToExisting &&
            opportunityList
          }
          createNewOptionsRender={createNewOptionsRender}
        />
      </Scrollbars>
    </DefaultModal>
  )
}

export default ConvertConflictModal
