import { useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useNavigate, useParams } from 'react-router-dom'

import { SideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { entityValues } from 'constants/customFields'
import Container from 'components/containers/Container'
import DragContent from './DragContent'
import DropContent from './DropContent'
import {
  useLazyGetCustomFieldsByEntityQuery,
  useUpdateCustomFieldsByEntityMutation
} from 'api/customFieldApi'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { parseFromBEData } from 'utils/customFieldUtils'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useUser from 'hooks/useUser'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    gap: 0,
    borderTop: `1px solid ${palette[type].sideModal.content.border}`,
    height: '100%'
  }
}))

const EditCustomField = () => {
  const { entity } = useParams()
  const navigate = useNavigate()
  const classes = useStyles()
  const [fields, setFields] = useState([])
  const [resetFields, setResetFields] = useState(false)
  const { getUserDetails } = useUser()

  const [getFields, { data, isFetching }] =
    useLazyGetCustomFieldsByEntityQuery()
  const [updateFields, post] = useUpdateCustomFieldsByEntityMutation()

  useEffect(() => {
    if (
      !entity ||
      !Object.values(entityValues).some(
        e => e.toLowerCase() === entity.toLowerCase()
      )
    ) {
      navigate(parseToAbsolutePath(routes.customFields.root), { replace: true })
    } else {
      getFields({
        entityType: entity
      })
    }
    //eslint-disable-next-line
  }, [entity])

  useNotifyAnalyzer({
    entityName: entity,
    watchArray: [post],
    labels: [notifyLabels.update],
    onSuccess: () => {
      navigate(parseToAbsolutePath(routes.customFields.root))
      getUserDetails()
    }
  })

  const handleSubmit = useCallback(() => {
    if (fields) {
      const _fields = [...fields]
      _fields.forEach(({ childs }, index) => {
        childs &&
          childs.forEach(({ options }, innerIndex) => {
            if (options?.length) {
              _fields[index].childs[innerIndex].options = options.map(
                ({ label }) => label
              )
            }
          })
      })

      updateFields({
        entityType: entity,
        fields
      })
    }
  }, [updateFields, fields, entity])

  const handleReset = useCallback(() => {
    setResetFields(true)
    setFields(parseFromBEData(data))
  }, [data])

  return (
    <SideModal
      width="99%"
      title={`${entity} Layout`}
      closeLink={parseToAbsolutePath(routes.customFields.root)}
      footerLayout={
        <FormFooterLayout
          isUpdate
          onSubmit={handleSubmit}
          onReset={handleReset}
          isPending={post.isLoading}
        />
      }
    >
      <Container cols="2-8" rootClassName={classes.root}>
        <DragContent />
        <DropContent
          entity={entity}
          data={data}
          isFetching={isFetching}
          fields={fields}
          resetFields={resetFields}
          setFields={setFields}
          setResetFields={setResetFields}
        />
      </Container>
    </SideModal>
  )
}

export default EditCustomField
