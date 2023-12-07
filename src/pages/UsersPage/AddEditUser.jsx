import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { SideModal } from 'components/modals'
import { statusReturnValues, statusValues } from 'constants/commonOptions'
import { emailField, requiredField } from 'constants/validationMessages'
import { imageValidateSchema } from 'constants/validation'
import {
  CheckboxSwitcher,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import Container from 'components/containers/Container'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { useGetRolesQuery } from 'api/roleApi'
import { BIG_LIMIT } from 'constants/app'
import {
  useAddUserMutation,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation
} from 'api/userApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(() => ({
  wrapContent: {
    padding: '0px 20px',
    width: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '16px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  errorTextClass: {
    whiteSpace: 'nowrap'
  },
  switchWrapCheck: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '3px'
  },
  marginBottom: {
    marginBottom: 16
  }
}))

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: null,
  status: statusValues.inactive,
  profile: null
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(requiredField),
  lastName: Yup.string().required(requiredField),
  email: Yup.string().email(emailField).required(requiredField),
  roleId: Yup.number().required('Please select role'),
  profile: imageValidateSchema
})

const AddEditUser = () => {
  const { id, view } = useParams()
  const classes = useStyles()
  const initiFormValues = useRef(initialValues)
  const navigate = useNavigate()

  const [isSubmitting, setSubmitting] = useState(false)

  const { data: roles, isLoading: roleLoading } = useGetRolesQuery({
    limit: BIG_LIMIT,
    status: statusValues.active
  })
  const [getUserById, { data: user }] = useLazyGetUserByIdQuery()
  const [addUser, post] = useAddUserMutation({
    fixedCacheKey: apiCacheKeys.user.add
  })
  const [updateUser, put] = useUpdateUserMutation({
    fixedCacheKey: apiCacheKeys.user.update
  })

  const isEdit = !!id

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      const data = {
        ...values
      }
      if (id) {
        data.id = id
        updateUser(data)
      } else {
        addUser(data)
      }
    },
    [id, addUser, updateUser]
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
    setFieldError,
    validateForm
  } = useFormik({
    initialValues: initiFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (id) {
      getUserById(id)
    }
    //eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (user) {
      const { firstName, lastName, email, role, status, profile } = user
      initiFormValues.current = {
        firstName,
        lastName,
        email,
        roleId: role?.id,
        profile,
        status
      }
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [user])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(parseToAbsolutePath(routes.users[view]))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  const transformedRoles = useMemo(
    () => roles.map(({ name: label, id: value }) => ({ label, value })),
    [roles]
  )

  return (
    <SideModal
      width="30%"
      title={isEdit ? 'Edit User' : 'Add User'}
      closeLink={parseToAbsolutePath(routes.users[view])}
      footerLayout={
        <FormFooterLayout
          onSubmit={handleSubmit}
          isPending={isSubmitting}
          opaqueSubmit={!isValid}
          onReset={handleReset}
          isUpdate={isEdit}
        />
      }
    >
      <Grid container direction="row" className={classes.wrapContent}>
        <Grid item xs={12}>
          <Container isFormContainer>
            <FormControlInput
              label={'First Name'}
              name="firstName"
              value={values.firstName}
              error={errors.firstName}
              touched={touched.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              marginBottom={false}
              fullWidth
              isRequired
            />
            <FormControlInput
              label={'Last Name'}
              name="lastName"
              value={values.lastName}
              error={errors.lastName}
              touched={touched.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              marginBottom={false}
              fullWidth
              isRequired
            />
            <FormControlInput
              label={'Email'}
              name="email"
              value={values.email}
              error={errors.email}
              touched={touched.email}
              onChange={handleChange}
              onBlur={handleBlur}
              formControlContainerClass={classes.stretch}
              fullWidth
              marginBottom={false}
              isRequired
            />
            <FormControlReactSelect
              label={'Role'}
              name="roleId"
              options={transformedRoles}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.roleId}
              error={errors.roleId}
              touched={touched.roleId}
              marginBottom={false}
              isLoading={roleLoading}
              isRequired
            />
            <CheckboxSwitcher
              returnValues={statusReturnValues}
              justify="space-between"
              value={values.status}
              name="status"
              label={'Active'}
              onChange={handleChange}
              formControlRootClass={classes.switchWrapCheck}
            />
          </Container>
        </Grid>
      </Grid>
    </SideModal>
  )
}

export default AddEditUser
