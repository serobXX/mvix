import { useCallback, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import * as Yup from 'yup'

import { SideModal } from 'components/modals'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import { defaultTag } from 'constants/chipsColorPalette'
import { requiredField, tagNameMin } from 'constants/validationMessages'
import {
  useAddTagMutation,
  useLazyGetTagByIdQuery,
  useUpdateTagMutation
} from 'api/tagApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import {
  FormControlChipsColorPicker,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import Container from 'components/containers/Container'
import { useFormik } from 'formik'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import { tagEntityOptions, tagEntityType } from 'constants/tagConstants'

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px'
  }
}))

const initialValues = {
  tag: '',
  entityType: tagEntityType.account,
  textColor: defaultTag.textColor,
  backgroundColor: defaultTag.backgroundColor
}

const validationSchema = Yup.object().shape({
  tag: Yup.string().trim().required(requiredField).min(3, tagNameMin),
  entityType: Yup.string().required(requiredField)
})

const AddEditTag = () => {
  const { id } = useParams()
  const classes = useStyles()
  const initialFormValues = useRef(initialValues)

  const isEdit = !!id

  const navigate = useNavigate()

  const [getById, item] = useLazyGetTagByIdQuery()
  const [addTag, post] = useAddTagMutation({
    fixedCacheKey: apiCacheKeys.tag.add
  })
  const [updateTag, put] = useUpdateTagMutation({
    fixedCacheKey: apiCacheKeys.tag.update
  })

  const onSubmit = useCallback(
    values => {
      const data = {
        ...values
      }

      if (id) {
        updateTag({
          id,
          ...data
        })
      } else {
        addTag(data)
      }
    },
    [id, addTag, updateTag]
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
      getById(id)
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (item.isSuccess && item.data) {
      const { tag, textColor, backgroundColor, entityType } = item.data
      initialFormValues.current = {
        tag,
        textColor,
        backgroundColor,
        entityType
      }

      setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      navigate(parseToAbsolutePath(routes.tags.list))
    }
    // eslint-disable-next-line
  }, [post.isSuccess, put.isSuccess])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  return (
    <SideModal
      width="30%"
      title={`${isEdit ? 'Edit' : 'Add'} Tag`}
      closeLink={parseToAbsolutePath(routes.tags.list)}
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
          name="tag"
          label="Tag Name"
          value={values.tag}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.tag}
          touched={touched.tag}
          marginBottom={false}
          fullWidth
          isRequired
        />
        <FormControlReactSelect
          name="entityType"
          label="Entity Type"
          value={values.entityType}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.entityType}
          touched={touched.entityType}
          marginBottom={false}
          options={tagEntityOptions}
          fullWidth
        />
        <FormControlChipsColorPicker
          name="backgroundColor"
          lightName="textColor"
          value={values.backgroundColor}
          label={'Color'}
          onChange={handleChange}
        />
      </Container>
    </SideModal>
  )
}

export default AddEditTag
