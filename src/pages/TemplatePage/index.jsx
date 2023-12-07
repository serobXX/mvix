import { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import {
  useAddTemplateMutation,
  useDeleteTemplateMutation,
  useLazyGetTemplatesQuery,
  useUpdateTemplateMutation
} from 'api/templateApi'
import PageContainer from 'components/PageContainer'
import TwoColumnLayout from 'components/TwoColumnLayout'
import apiCacheKeys from 'constants/apiCacheKeys'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import handleBottomScroll from 'utils/handleBottomScroll'
import Scrollbars from 'components/Scrollbars'
import useLazyLoad from 'hooks/useLazyLoad'
import TemplateCard from './TemplateCard'
import { routes } from 'constants/routes'
import { statusValues } from 'constants/commonOptions'
import AddEditTemplate from './AddEditTemplate'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { parseToAbsolutePath } from 'utils/urlUtils'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import Container from 'components/containers/Container'
import Tooltip from 'components/Tooltip'
import { templateTabs } from 'constants/templateConstants'
import queryParamsHelper from 'utils/queryParamsHelper'
import TemplateLoader from 'components/loaders/TemplateLoader'
import FroalaPreview from 'components/FroalaPreview'
import useUser from 'hooks/useUser'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'

const useStyles = makeStyles(({ colors, typography, type }) => ({
  columnLayoutRoot: {
    height: 'calc(100vh - 190px)'
  },
  columnLayoutCardRoot: {
    background: 'transparent'
  },
  scrollContainer: {
    margin: '0 -20px',
    height: 'inherit',
    overflow: 'auto'
  },
  scrollInner: {
    padding: '0px 20px 0 20px',
    height: 'inherit',
    overflow: 'auto'
  },
  headerBtnIcon: {
    fontSize: 16,
    color: typography.lightText[type].color,
    cursor: 'pointer'
  },
  headerBtnIconActive: {
    color: colors.highlight
  },
  templatePreviewRoot: {
    background: '#fff',
    height: '100%'
  }
}))

const TemplatePage = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const { showConfirmation } = useConfirmation()
  const [selectedTab, setSelectedTab] = useState()
  const [selectedTemplate, setSelectedTemplate] = useState()
  const [isTabChanged, setTabChanged] = useState(false)

  const permission = useDeterminePermissions(permissionGroupNames.template)
  const [, post] = useAddTemplateMutation({
    fixedCacheKey: apiCacheKeys.template.add
  })
  const [updateItem, put] = useUpdateTemplateMutation({
    fixedCacheKey: apiCacheKeys.template.update
  })
  const [deleteItem, del] = useDeleteTemplateMutation({
    fixedCacheKey: apiCacheKeys.template.delete
  })

  const [getItems, { data: list, isFetching, meta = {} }] =
    useLazyGetTemplatesQuery()
  const { role } = useUser()

  const filteredTemplateTabs = useMemo(
    () =>
      [...templateTabs].filter(
        ({ isSystem }) => !isSystem || (isSystem && role.isSystem)
      ),
    [role]
  )

  const fetcher = useCallback(
    (params = {}) => {
      const tab =
        selectedTab &&
        filteredTemplateTabs.find(({ value }) => value === selectedTab)
      if (tab?.entity || params?.entity) {
        getItems(
          queryParamsHelper(
            {
              limit: 10,
              ...(tab ? { entity: tab.entity } : {}),
              ...(!role?.isSystem ? { group: 'my' } : {}),
              ...params
            },
            ['entity']
          )
        )
        setTabChanged(false)
      }
    },
    [getItems, selectedTab, filteredTemplateTabs, role?.isSystem]
  )

  useEffect(() => {
    if (role?.name) {
      const tab =
        filteredTemplateTabs.find(({ value }) => value === 'email') ||
        filteredTemplateTabs[0]
      setSelectedTab(tab.value)
      tab.entity && fetcher({ entity: tab.entity })
    }
    //eslint-disable-next-line
  }, [role])

  const { data, handleLoadMore } = useLazyLoad({
    isFetching,
    response: list,
    meta,
    fetcher,
    initialFetch: false
  })

  useNotifyAnalyzer({
    fetcher,
    entityName: 'Template',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const handleDelete = useCallback(
    (_, { id, name }) => {
      showConfirmation(getDeleteConfirmationMessage(name), () => {
        deleteItem(id)
        if (location.pathname.includes('edit')) {
          navigate(parseToAbsolutePath(routes.template.root), { replace: true })
        }
      })
    },
    [showConfirmation, deleteItem, navigate, location.pathname]
  )

  const handleShareToggle = useCallback(
    (e, { id, isShared }) => {
      e.stopPropagation()
      updateItem({
        id,
        data: {
          isShared: !isShared
        }
      })
    },
    [updateItem]
  )

  const templateActionList = useMemo(
    () => [
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        to: ({ id }) => routes.template.toEdit(id),
        render: permission.update
      },
      {
        label: 'Share to All',
        clickAction: handleShareToggle,
        icon: getIconClassName(iconNames.share),
        render: ({ isShared }) => !isShared && !role?.isSystem
      },
      {
        label: 'Stop Sharing',
        clickAction: handleShareToggle,
        icon: getIconClassName(iconNames.share),
        render: ({ isShared }) => isShared && !role?.isSystem
      },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        clickAction: handleDelete,
        render: permission.delete
      }
    ],
    [permission, handleDelete, role?.isSystem, handleShareToggle]
  )

  const handleSelectTemplate = useCallback(
    item => event => {
      setSelectedTemplate(item)
      if (
        (location.pathname.includes('add') ||
          location.pathname.includes('edit')) &&
        event?.target?.innerText !== 'Edit'
      ) {
        navigate(parseToAbsolutePath(routes.template.root))
      }
    },
    [navigate, location.pathname]
  )

  const handleClickAdd = () => {
    setSelectedTemplate()
    navigate(routes.template.toAdd())
  }

  const leftSideComponent = useMemo(
    () => (
      <div className={classes.scrollContainer}>
        <Scrollbars onUpdate={handleBottomScroll(handleLoadMore)}>
          <div className={classes.scrollInner}>
            {isFetching ? (
              <TemplateLoader />
            ) : (
              !isTabChanged && (
                <Grid container direction="column" wrap="nowrap">
                  {data.map(
                    ({ id, name, entity, status, template, isShared }) => (
                      <TemplateCard
                        key={`template-list-${id}`}
                        title={name}
                        subTitle={entity}
                        actionList={templateActionList}
                        isShared={!role?.isSystem && isShared}
                        actionData={{ id, name, isShared }}
                        isActive={status === statusValues.active}
                        isSelected={selectedTemplate?.id === id}
                        onSelect={handleSelectTemplate({ id, template, name })}
                      />
                    )
                  )}
                </Grid>
              )
            )}
          </div>
        </Scrollbars>
      </div>
    ),
    [
      handleLoadMore,
      classes,
      isFetching,
      templateActionList,
      data,
      selectedTemplate?.id,
      handleSelectTemplate,
      role?.isSystem,
      isTabChanged
    ]
  )

  const handleFilterIconChange = useCallback(
    ({ value, entity }) =>
      () => {
        if (value !== selectedTab) {
          setTabChanged(true)

          if (entity) {
            fetcher({
              page: 1,
              entity
            })
          }
          setSelectedTab(value)
        }
      },
    [selectedTab, fetcher]
  )

  const leftIconButtonComponent = useMemo(
    () => (
      <Container cols={filteredTemplateTabs.length}>
        {filteredTemplateTabs.map(({ label, icon, value, entity }) => (
          <Tooltip
            title={label}
            placement="top"
            arrow
            key={`filter-icon-${value}`}
          >
            <i
              className={classNames(icon, classes.headerBtnIcon, {
                [classes.headerBtnIconActive]: selectedTab === value
              })}
              onClick={handleFilterIconChange({ value, entity })}
            />
          </Tooltip>
        ))}
      </Container>
    ),
    [
      handleFilterIconChange,
      selectedTab,
      classes.headerBtnIcon,
      classes.headerBtnIconActive,
      filteredTemplateTabs
    ]
  )

  return (
    <PageContainer pageTitle="Templates" isShowSubHeaderComponent={false}>
      <TwoColumnLayout
        leftSideCard={{
          title: 'Templates',
          cardRootClassName: classes.columnLayoutCardRoot,
          gridWidth: 3,
          component: leftSideComponent,
          icon: true,
          iconButtonComponent: leftIconButtonComponent
        }}
        rightSideCard={{
          title:
            location.pathname.includes('add') || !selectedTemplate
              ? `Create a New ${camelCaseToSplitCapitalize(
                  selectedTab
                )} Template`
              : selectedTemplate?.name,
          cardRootClassName: classes.columnLayoutCardRoot,
          gridWidth: 9,
          icon: !['add', 'edit'].some(v => location.pathname.includes(v)),
          iconClassName: getIconClassName(iconNames.add2),
          onClickFunction: handleClickAdd
        }}
        rootClassName={classes.columnLayoutRoot}
      >
        <Routes>
          {permission.update && (
            <Route path={routes.template.edit} element={<AddEditTemplate />} />
          )}
          {permission.create && (
            <Route
              path={routes.template.add}
              element={<AddEditTemplate selectedTab={selectedTab} />}
            />
          )}
          {selectedTemplate?.id && (
            <Route
              path={'*'}
              element={
                <div className={classes.templatePreviewRoot}>
                  <FroalaPreview
                    value={selectedTemplate?.template}
                    previewPlaceholder={false}
                  />
                </div>
              }
            />
          )}
        </Routes>
      </TwoColumnLayout>
    </PageContainer>
  )
}

export default TemplatePage
