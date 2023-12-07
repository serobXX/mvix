import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { SideModal } from 'components/modals'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import CustomFieldForm from 'components/CustomFieldForm'
import { tagEntityType as tagEntityTypes } from 'constants/tagConstants'
import PropTypes from 'constants/propTypes'
import useCustomFieldFormConfig from 'hooks/useCustomFieldFormConfig'

const AddEditCustomFieldModal = ({
  layout,
  id,
  initialValues,
  initialValidationSchema,
  getItemById,
  item,
  addItem,
  post,
  updateItem,
  put,
  hideTagField,
  hideStatusField,
  transformItem,
  closeLink,
  title,
  customFieldFormProps,
  staticFields,
  staticFieldsOn,
  staticFieldsAtFirst,
  permissionGroupName,
  tagEntityType,
  staticTabWithComponent
}) => {
  const navigate = useNavigate()

  const isEdit = !!id

  const {
    isSubmitting,
    setSubmitting,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isValid
  } = useCustomFieldFormConfig({
    id,
    layout,
    hideTagField,
    hideStatusField,
    initialValues,
    initialValidationSchema,
    item,
    updateItem,
    addItem,
    post,
    put,
    transformItem
  })

  useEffect(() => {
    if (id) {
      getItemById(id)
    }
    //eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      closeLink && navigate(closeLink)
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  return (
    <SideModal
      width="80%"
      title={`${isEdit ? 'Edit' : 'Add'} ${title}`}
      closeLink={closeLink}
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
      <CustomFieldForm
        fields={layout}
        name="customFields"
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        showTopBorder
        staticFields={staticFields}
        staticFieldsOn={staticFieldsOn}
        permissionGroupName={permissionGroupName}
        isEdit={isEdit}
        staticFieldsAtFirst={staticFieldsAtFirst}
        tagEntityType={tagEntityType}
        hideTagField={hideTagField}
        hideStatusField={hideStatusField}
        staticTabWithComponent={staticTabWithComponent}
        {...customFieldFormProps}
      />
    </SideModal>
  )
}

AddEditCustomFieldModal.propTypes = {
  layout: PropTypes.array,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialValues: PropTypes.object,
  initialValidationSchema: PropTypes.object,
  getItemById: PropTypes.func,
  item: PropTypes.object,
  addItem: PropTypes.func,
  post: PropTypes.object,
  updateItem: PropTypes.func,
  put: PropTypes.object,
  hideTagField: PropTypes.bool,
  hideStatusField: PropTypes.bool,
  transformItem: PropTypes.func,
  closeLink: PropTypes.string,
  title: PropTypes.string,
  customFieldFormProps: PropTypes.object,
  staticField: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.object,
      name: PropTypes.string,
      props: PropTypes.object
    })
  ),
  staticFieldsOn: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      name: PropTypes.string,
      props: PropTypes.object,
      code: PropTypes.string
    })
  ),
  permissionGroupName: PropTypes.string,
  staticFieldsAtFirst: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      name: PropTypes.string,
      props: PropTypes.object
    })
  ),
  staticTabWithComponent: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      name: PropTypes.string,
      code: PropTypes.string
    })
  )
}

AddEditCustomFieldModal.defaultProps = {
  layout: [],
  initialValues: {},
  initialValidationSchema: {},
  getItemById: f => f,
  addItem: f => f,
  post: {},
  updateItem: f => f,
  put: {},
  hideTagField: false,
  hideStatusField: false,
  transformItem: f => f,
  title: '',
  customFieldFormProps: {},
  staticField: [],
  staticFieldsOn: [],
  tagEntityType: tagEntityTypes.lead,
  staticFieldsAtFirst: [],
  staticTabWithComponent: []
}

export default AddEditCustomFieldModal
