import { useCallback, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import * as Yup from 'yup'

import { SideModal } from 'components/modals'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { routes } from 'constants/routes'
import { requiredField } from 'constants/validationMessages'
import {
  CheckboxSwitcher,
  FormControlInput,
  FormControlNumericInput
} from 'components/formControls'
import Container from 'components/containers/Container'
import { useFormik } from 'formik'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import { statusReturnValues, statusValues } from 'constants/commonOptions'
import useSystemDictionaryApi from 'hooks/useSystemDictionaryApi'
import { subtabNames, subtabTitles } from 'constants/systemDictionary'

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px'
  },
  switchWrapCheck: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 3
  }
}))

const initialValues = {
  name: '',
  sortOrder: 1,
  status: statusValues.active
}

const subjectLineMapping = {
  name: 'subjectText'
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required(requiredField)
})

const AddEditItem = ({ activeTab, activeSubtab }) => {
  const { id } = useParams()
  const classes = useStyles()
  const initialFormValues = useRef(initialValues)
  const { getItemById, addItem, updateItem, post, put, item } =
    useSystemDictionaryApi(activeSubtab)

  const isEdit = !!id
  const isSubjectLineTab = activeSubtab === subtabNames.subjectLine

  const navigate = useNavigate()

  const onSubmit = useCallback(
    values => {
      let data = {
        ...values
      }
      if (activeSubtab !== subtabNames.stages) {
        delete data.sortOrder
      }

      if (isSubjectLineTab) {
        data = Object.entries(data).reduce((a, [field, value]) => {
          a[subjectLineMapping[field] || field] = value
          return a
        }, {})
      }

      if (id) {
        updateItem({
          id,
          ...data
        })
      } else {
        addItem(data)
      }
    },
    [id, addItem, updateItem, activeSubtab, isSubjectLineTab]
  )

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setValues,
    validateForm,
    setFieldError
  } = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: true,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (id) {
      getItemById(id)
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (item.isSuccess && item.data) {
      const { name, status, sortOrder, subjectText } = item.data
      initialFormValues.current = isSubjectLineTab
        ? { name: subjectText }
        : {
            name,
            status,
            sortOrder
          }

      setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      navigate(routes.systemDictionary.toEntity(null, activeTab, activeSubtab))
    }
    // eslint-disable-next-line
  }, [post.isSuccess, put.isSuccess])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(
      post,
      'error.errorFields',
      _get(put, 'error.errorFields')
    ),
    fieldMapping: isSubjectLineTab && subjectLineMapping
  })

  return (
    <SideModal
      width="30%"
      title={
        isEdit
          ? subtabTitles[activeSubtab]?.editPage
          : subtabTitles[activeSubtab]?.addPage
      }
      closeLink={routes.systemDictionary.toEntity(
        null,
        activeTab,
        activeSubtab
      )}
      footerLayout={
        <FormFooterLayout
          opaqueSubmit={!isValid}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isUpdate={isEdit}
        />
      }
    >
      <Container cols="1" rootClassName={classes.container} isFormContainer>
        <FormControlInput
          name="name"
          label={isSubjectLineTab ? 'Subject' : 'Name'}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          marginBottom={false}
          fullWidth
          isRequired
        />
        {!isSubjectLineTab && (
          <Container cols="2">
            {activeSubtab === subtabNames.stages && (
              <FormControlNumericInput
                name="sortOrder"
                label="Sort Order"
                min={1}
                value={values.sortOrder}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.sortOrder}
                touched={touched.sortOrder}
                marginBottom={false}
                fullWidth
              />
            )}
            <CheckboxSwitcher
              returnValues={statusReturnValues}
              justify="space-between"
              value={values.status}
              name="status"
              label={'Active'}
              onChange={handleChange}
              formControlRootClass={classes.switchWrapCheck}
              fullWidth
            />
          </Container>
        )}
      </Container>
    </SideModal>
  )
}

export default AddEditItem
