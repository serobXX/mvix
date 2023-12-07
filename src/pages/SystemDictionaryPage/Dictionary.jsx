import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Grid, makeStyles } from '@material-ui/core'

import SystemDictionaryContext from './context'
import useIds from 'hooks/useIds'
import useSelectedList from 'hooks/useSelectedList'
import DictionaryTable from './DictionaryTable'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import { permissionTypes } from 'constants/permissionGroups'
import useConfirmation from 'hooks/useConfirmation'
import { getBulkDeleteConfirmationMessage } from 'utils/snackbarMessages'
import entityConstants from 'constants/entityConstants'
import Filter from './Filter'
import { systemDictionaryInitialFilter } from 'constants/filter'
import useFilter from 'hooks/useFilter'
import queryParamsHelper from 'utils/queryParamsHelper'
import { SingleIconTextTab, SingleIconTextTabs } from 'components/tabs'
import {
  subtabNames,
  subtabPermissions,
  subtabTitles,
  subtabs,
  tabMapping
} from 'constants/systemDictionary'
import { routes } from 'constants/routes'
import useSystemDictionaryApi from 'hooks/useSystemDictionaryApi'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { filterEntityValues } from 'constants/filterPreference'
import useFilterPreference from 'hooks/useFilterPreference'

const useStyles = makeStyles(({ palette, type, spacing }) => ({
  root: {
    height: '100%'
  },
  tabHeader: {
    display: 'grid',
    position: 'relative',
    alignItems: 'center',
    grid: '1fr / 1fr max-content',
    backgroundColor: palette[type].sideTab.selected.background,
    borderBottom: `1px solid ${palette[type].sideModal.tabs.header.border}`,
    zIndex: 10,
    paddingLeft: spacing(1)
  },
  tabIconWrap: {
    fontSize: '24px',
    lineHeight: '16px',
    marginBottom: '5px !important'
  },
  tabLabelWrap: {
    flexGrow: 1,
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineClamp: 2,
    boxOrient: 'vertical',
    maxWidth: '100%',
    wordBreak: 'break-word'
  },
  gridContent: {
    flexGrow: 1
  }
}))

const Dictionary = ({ readGroups }) => {
  const { dictionary, entity } = useParams()
  const { showConfirmation } = useConfirmation()
  const [params, setParams] = useState({})
  const filterRef = useRef()
  const classes = useStyles()
  const navigate = useNavigate()

  const deleteGroups = useUserPermissionGroupsByType(permissionTypes.delete)

  const {
    activeTab,
    onChangeTab,
    activeSubtab,
    onChangeSubtab,
    tabs,
    setShowCommonActions,
    setCommonActions,
    setSidePanels
  } = useContext(SystemDictionaryContext)

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues[activeSubtab]
  })

  const [filterValues, updateFilter, resetFilter] = useFilter(
    entityConstants.SystemDictionary,
    {},
    setFilterModel
  )

  const {
    getItems,
    deleteItem,
    updateItem,
    bulkDeleteItems,
    post,
    put,
    items,
    del
  } = useSystemDictionaryApi(activeSubtab)

  const { data = [], meta = {}, isFetching = false } = items
  const itemIds = useIds(data)
  const selectedList = useSelectedList(itemIds)

  useEffect(() => {
    if (tabs.length) {
      if (dictionary && tabs.some(t => t.value === dictionary)) {
        onChangeTab(dictionary)
      } else {
        onChangeTab(tabs[0]?.value)
      }
    }
    //eslint-disable-next-line
  }, [dictionary, tabs])

  useEffect(() => {
    if (staticFilterModel) {
      fetcher(staticFilterModel)
      updateFilter(staticFilterModel)
    }
    //eslint-disable-next-line
  }, [staticFilterModel])

  useEffect(() => {
    setShowCommonActions(selectedList.selectedIds.length > 1)
    //eslint-disable-next-line
  }, [selectedList.selectedIds])

  const parsedSubtabs = useMemo(() => {
    if (!activeTab || !tabMapping[activeTab]) return []
    return tabMapping[activeTab].subtabs
      .filter(t => readGroups.includes(subtabPermissions[t]) || !!subtabs[t])
      .map(t => subtabs[t])
  }, [activeTab, readGroups])

  useEffect(() => {
    if (parsedSubtabs.length) {
      if (entity && parsedSubtabs.some(t => t.value === entity)) {
        onChangeSubtab(entity)
      }
    }
    //eslint-disable-next-line
  }, [entity, parsedSubtabs])

  useEffect(() => {
    if (parsedSubtabs.length) {
      if (!(entity && parsedSubtabs.some(t => t.value === entity))) {
        onChangeSubtab(parsedSubtabs?.[0]?.value)
        navigate(
          routes.systemDictionary.toEntity(
            null,
            activeTab,
            parsedSubtabs?.[0]?.value
          ),
          {
            replace: true
          }
        )
      }
    }
    //eslint-disable-next-line
  }, [activeTab, parsedSubtabs])

  const handleBulkDelete = useCallback(() => {
    showConfirmation(
      getBulkDeleteConfirmationMessage(subtabTitles[activeSubtab]?.rootPage),
      () => {
        bulkDeleteItems(selectedList.selectedIds)
      }
    )
  }, [
    showConfirmation,
    bulkDeleteItems,
    activeSubtab,
    selectedList.selectedIds
  ])

  useEffect(() => {
    setCommonActions([
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        clickAction: handleBulkDelete,
        render: deleteGroups.includes(subtabPermissions[activeSubtab])
      }
    ])
    //eslint-disable-next-line
  }, [activeSubtab, deleteGroups, selectedList.selectedIds])

  const fetcher = useCallback(
    async (_params = {}) => {
      getItems(
        queryParamsHelper(
          {
            page: 1,
            limit: 100,
            ...params,
            ...filterValues,
            ..._params
          },
          ['status']
        ),
        true
      )
    },
    [params, getItems, filterValues]
  )

  const handleResetFilter = useCallback(() => {
    resetFilter()
    clearSelectedFilter()
  }, [resetFilter, clearSelectedFilter])

  useEffect(() => {
    if (activeSubtab) {
      selectedList.clear()
      handleResetFilter()
      fetcher(systemDictionaryInitialFilter)
      filterRef.current?.closePanel && filterRef.current?.closePanel()
    }
    //eslint-disable-next-line
  }, [activeSubtab])

  useEffect(() => {
    setSidePanels([
      {
        icon: getIconClassName(iconNames.tableViews),
        label: viewToolPanel?.labelDefault || 'Views',
        component: viewToolPanel?.toolPanel,
        componentProps: {
          ...(viewToolPanel?.toolPanelParams || {})
        },
        isVisible: ![subtabNames.subjectLine].includes(activeSubtab)
      },
      {
        icon: getIconClassName(iconNames.filter),
        label: 'Filters',
        component: Filter,
        componentProps: {
          activeSubtab,
          filterValues,
          updateFilter,
          handleResetFilter,
          fetcher,
          ref: filterRef,
          onSaveFilter: handleSaveFilter,
          selectedFilter
        },
        panelWidth: 350,
        isVisible: ![subtabNames.subjectLine].includes(activeSubtab)
      }
    ])
    //eslint-disable-next-line
  }, [filterValues, activeSubtab, selectedFilter])

  useNotifyAnalyzer({
    entityName: subtabTitles[activeSubtab]?.rootPage,
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete],
    onSuccess: selectedList.clear
  })

  const handleUpdateStatus = useCallback(
    item =>
      ({ target: { value } }) => {
        updateItem({
          id: item.id,
          name: item.name,
          status: value
        })
      },
    [updateItem]
  )

  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <header className={classes.tabHeader}>
          <SingleIconTextTabs
            value={activeSubtab}
            onChange={(_, tab) => onChangeSubtab(tab)}
          >
            {parsedSubtabs.map(({ label, value, icon }) => (
              <SingleIconTextTab
                key={`single-icon-text-tab-${value}`}
                icon={
                  <div className={classes.tabIconWrap}>
                    <i className={icon} />
                  </div>
                }
                disableRipple
                component={Link}
                alias={label}
                to={routes.systemDictionary.toEntity(null, activeTab, value)}
                value={value}
                label={<div className={classes.tabLabelWrap}>{label}</div>}
              />
            ))}
          </SingleIconTextTabs>
        </header>
      </Grid>
      <Grid item className={classes.gridContent}>
        <DictionaryTable
          fetcher={fetcher}
          activeTab={activeTab}
          activeSubtab={activeSubtab}
          data={data}
          meta={meta}
          isFetching={isFetching}
          selectedList={selectedList}
          params={params}
          setParams={setParams}
          onDeleteItem={deleteItem}
          onUpdateStatus={handleUpdateStatus}
        />
      </Grid>
    </Grid>
  )
}

export default Dictionary
