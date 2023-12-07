import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core'

import { SideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { lowerCaseAndHyphen } from 'constants/regExp'
import { requiredField, roleTitle } from 'constants/validationMessages'
import FormControlInput from 'components/formControls/FormControlInput'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import Container from 'components/containers/Container'
import {
  useAddRoleMutation,
  useLazyGetRoleByIdQuery,
  useUpdateRoleMutation
} from 'api/roleApi'
import apiCacheKeys from 'constants/apiCacheKeys'

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px'
  }
}))

const initialValues = {
  name: '',
  description: ''
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(lowerCaseAndHyphen, roleTitle)
    .required(requiredField),
  description: Yup.string().required(requiredField)
})

const AddEditRole = () => {
  const initialFormValues = useRef(initialValues)
  const { id } = useParams()
  const classes = useStyles()
  const isEdit = !!id
  const navigate = useNavigate()

  const [getById, item] = useLazyGetRoleByIdQuery()
  const [addRole, post] = useAddRoleMutation({
    fixedCacheKey: apiCacheKeys.role.add
  })
  const [updateRole, put] = useUpdateRoleMutation({
    fixedCacheKey: apiCacheKeys.role.update
  })

  const onSubmit = useCallback(
    values => {
      const data = {
        name: values.name,
        description: values.description
      }

      if (id) {
        updateRole({
          id,
          ...data
        })
      } else {
        addRole(data)
      }
    },
    [id, addRole, updateRole]
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
    validateForm
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
      getById(id)
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (item.isSuccess && item.data) {
      const { name, description } = item.data
      initialFormValues.current = {
        name,
        description
      }

      setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      navigate(routes.users.toRoleAndPerm())
    }
    // eslint-disable-next-line
  }, [post.isSuccess, put.isSuccess])

  return (
    <SideModal
      width="560px"
      title={`${isEdit ? 'Edit' : 'Add'} Role`}
      closeLink={routes.users.toRoleAndPerm()}
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
          label="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          marginBottom={false}
          fullWidth
          isRequired
        />
        <FormControlInput
          name="description"
          label="Description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description}
          touched={touched.description}
          multiline
          fullWidth
          isRequired
        />
      </Container>
    </SideModal>
  )
}

export default AddEditRole
