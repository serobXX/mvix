import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import * as htmlToImage from 'html-to-image'

import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import { statusReturnValues, statusValues } from 'constants/commonOptions'
import Yup from 'utils/yup'
import { requiredField } from 'constants/validationMessages'
import {
  useAddTemplateMutation,
  useLazyGetTemplateByIdQuery,
  useUpdateTemplateMutation
} from 'api/templateApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import { _get } from 'utils/lodash'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import Scrollbars from 'components/Scrollbars'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import {
  CheckboxSwitcher,
  FormControlInput,
  FormControlSelectTag,
  FroalaWysiwygEditor
} from 'components/formControls'
import {
  templateEntityValues,
  templateTabs,
  templateToFroalaEntity
} from 'constants/templateConstants'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import { convertToFormData } from 'utils/apiUtils'
import { tagEntityType } from 'constants/tagConstants'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    height: '100%'
  },
  contentRoot: {
    flexGrow: 1
  },
  footer: {
    padding: '16px 20px 14px 20px',
    marginLeft: '-20px',
    borderTop: `1px solid ${palette[type].sideModal.footer.border}`,
    background: palette[type].sideModal.footer.backgroundColor,
    width: 'calc(100% + 40px)'
  },
  innerScrollbar: {
    paddingRight: 20
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16
  },
  froalaContainer: {
    '& .fr-iframe, & .fr-view': {
      height: 'calc(100vh - 475px) !important'
    }
  }
}))

const initialValues = {
  name: '',
  entity: '',
  status: statusValues.active,
  isDefault: false,
  template: '',
  tag: []
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(requiredField),
  entity: Yup.string().required(requiredField),
  template: Yup.string().required(requiredField)
})

const AddEditTemplate = ({ selectedTab }) => {
  const { id } = useParams()
  const classes = useStyles()
  const initialFormValues = useRef(initialValues)
  const navigate = useNavigate()

  const [isSubmitting, setSubmitting] = useState(false)

  const [getItemById, { data: item }] = useLazyGetTemplateByIdQuery()
  const [addItem, post] = useAddTemplateMutation({
    fixedCacheKey: apiCacheKeys.template.add
  })
  const [updateItem, put] = useUpdateTemplateMutation({
    fixedCacheKey: apiCacheKeys.template.update
  })

  const isEdit = !!id

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      let data = {
        ...values,
        tag: convertArr(values.tag, fromChipObj)
      }
      htmlToImage
        .toBlob(
          document.querySelector('.fr-view') ||
            document.querySelector('.fr-iframe'),
          {
            quality: 0.95,
            width: 1300,
            height: 730
          }
        )
        .then(function (dataUrl) {
          const file = new File([dataUrl], 'file.jpg')
          data = convertToFormData(data)
          data.append('thumbImage', file)

          if (id) {
            updateItem({ id, data })
          } else {
            addItem(data)
          }
        })
    },
    [id, updateItem, addItem]
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
    initialValues: initialFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (selectedTab) {
      const tab = templateTabs.find(({ value }) => value === selectedTab)
      if (tab) {
        initialFormValues.current = {
          ...initialFormValues.current,
          entity: tab?.entity
        }
        setValues(initialFormValues.current)
      }
    }
    //eslint-disable-next-line
  }, [selectedTab])

  useEffect(() => {
    if (id) {
      getItemById(id)
    } else {
      const tab = templateTabs.find(({ value }) => value === selectedTab)

      initialFormValues.current = {
        ...initialValues,
        entity: tab?.entity || ''
      }
      setValues(initialFormValues.current)
    }
    //eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (!!id && item) {
      const { name, template, status, entity, isDefault, tag } = item
      initialFormValues.current = {
        name,
        template,
        status,
        entity,
        isDefault,
        tag: convertArr(tag, tagToChipObj)
      }
      setValues(initialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item, id])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(parseToAbsolutePath(routes.template.root))
      initialFormValues.current = {
        ...initialValues
      }
      setValues(initialFormValues.current)
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

  const Editor = useCallback(
    props => (
      <FroalaWysiwygEditor
        showBackgroundPicker={values.entity !== templateEntityValues.email}
        entity={templateToFroalaEntity[values.entity]}
        {...props}
      />
    ),
    [values.entity]
  )

  return (
    <Spacing variant={0} rootClassName={classes.root}>
      <div className={classes.contentRoot}>
        <Scrollbars>
          <div className={classes.innerScrollbar}>
            <Spacing>
              <Container cols="3-3-1">
                <FormControlInput
                  name="name"
                  label="Name"
                  error={errors.name}
                  touched={touched.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  marginBottom={false}
                  isRequired
                  fullWidth
                />
                <div className={classes.fieldContainer}>
                  <CheckboxSwitcher
                    name="status"
                    label="Status"
                    labelPosition="top"
                    onChange={handleChange}
                    value={values.status}
                    returnValues={statusReturnValues}
                    marginBottom={false}
                  />
                  {values.entity !== templateEntityValues.email && (
                    <CheckboxSwitcher
                      name="isDefault"
                      label="Default"
                      labelPosition="top"
                      onChange={handleChange}
                      value={values.isDefault}
                      marginBottom={false}
                    />
                  )}

                  <FormControlSelectTag
                    name="tag"
                    label="Tag"
                    error={errors.tag}
                    touched={touched.tag}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values.tag}
                    marginBottom={false}
                    entityType={tagEntityType.template}
                    isOptional
                    fullWidth
                  />
                </div>
              </Container>
            </Spacing>
            <Spacing>
              <Editor
                name="template"
                error={errors.template}
                touched={touched.template}
                onChange={handleChange}
                value={values.template}
                marginBottom={false}
                formControlContainerClass={classes.froalaContainer}
                config={{
                  useClasses: values.entity !== templateEntityValues.email
                }}
              />
            </Spacing>
          </div>
        </Scrollbars>
      </div>
      <div className={classes.footer}>
        <FormFooterLayout
          onReset={handleReset}
          onSubmit={handleSubmit}
          isPending={isSubmitting}
          isUpdate={isEdit}
          opaqueSubmit={!isValid}
        />
      </div>
    </Spacing>
  )
}

export default AddEditTemplate
