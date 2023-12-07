import { Grid, makeStyles } from '@material-ui/core'

import PageContainer from 'components/PageContainer'
import Container from 'components/containers/Container'
import ModuleListing from './ModuleListing'
import { useCallback, useState } from 'react'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import { useLazyGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import CustomFieldForm from 'components/CustomFieldForm'
import { CircularLoader } from 'components/loaders'
import { routes } from 'constants/routes'
import { Route, Routes } from 'react-router-dom'
import EditCustomField from './EditCustomField'

const useStyles = makeStyles(({ palette, type }) => ({
  containerRoot: {
    height: 'calc(100vh - 190px)'
  },
  leftContentRoot: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  rightContentRoot: {
    position: 'relative'
  }
}))

const CustomFieldsPage = () => {
  const classes = useStyles()
  const [selected, setSelected] = useState()

  const permission = useDeterminePermissions(permissionGroupNames.customFields)

  const [getCustomFields, { data, isFetching, originalArgs }] =
    useLazyGetCustomFieldsByEntityQuery()

  const handleSelect = useCallback(
    entity => {
      setSelected(entity)
      if (entity) {
        getCustomFields({
          entityType: entity
        })
      }
    },
    [getCustomFields]
  )

  return (
    <PageContainer pageTitle="Custom Fields" isShowSubHeaderComponent={false}>
      <Container variant={0} cols="2-8" rootClassName={classes.containerRoot}>
        <Grid item className={classes.leftContentRoot}>
          <ModuleListing
            selected={selected}
            onSelect={handleSelect}
            permission={permission}
          />
        </Grid>
        {selected && (
          <Grid item className={classes.rightContentRoot}>
            {isFetching && <CircularLoader />}
            <CustomFieldForm
              fields={
                originalArgs?.entityType === selected && !isFetching ? data : []
              }
              showAll
            />
          </Grid>
        )}
      </Container>
      <Routes>
        {permission.update && (
          <Route
            path={routes.customFields.edit}
            element={<EditCustomField />}
          />
        )}
      </Routes>
    </PageContainer>
  )
}

export default CustomFieldsPage
