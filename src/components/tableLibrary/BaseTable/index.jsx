import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { makeStyles } from '@material-ui/core'
import ResizeObserver from 'react-resize-observer'
import classNames from 'classnames'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
import { createPortal } from 'react-dom'

import { getAgGridStyle } from './style'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import TableFooter from './TableFooter'
import BaseTableContext from './context'
import { _get, _isNotEmpty } from 'utils/lodash'
import SideBarFilterPanel from './SideBarFilterPanel'
import {
  appendCellEditor,
  createServerSideDatasource,
  filterGrid,
  getActionColumnDef,
  getCheckboxColumnDef,
  getColumnSidebarPanel,
  getColumnTypes,
  getDefaultColDef,
  getFilterSidebarPanel,
  getProfileColumnDef,
  getTitleColumnDef,
  paginationGrid,
  resizeColumnsWidthWithTitle,
  sortGrid
} from './config'
import TableLibraryActionDropdown from '../TableLibraryActionDropdown'
import withFloatingFilterField from 'hoc/withFloatingFilterField'
import withFilterField from 'hoc/withFilterField'
import PropTypes from 'constants/propTypes'
import { isMultipleSelected } from 'utils/libraryUtils'
import { EmptyPlaceholder } from 'components/placeholder'
import { LibraryLoader } from 'components/loaders'
import { statusValues } from 'constants/commonOptions'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import Tooltip from 'components/Tooltip'

const useStyles = makeStyles(theme => ({
  container: ({ extraHeight, fullHeight, isAutoHeight }) => ({
    width: '100%',
    height:
      isAutoHeight && !fullHeight ? 'auto' : `calc(100vh - ${extraHeight}px)`,

    ...getAgGridStyle(theme)
  }),
  floatingFilterBtnRoot: {
    position: 'absolute',
    width: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    zIndex: 101
  },
  floatingFilterBtn: {
    fontSize: 14,
    cursor: 'pointer'
  },
  floatingFilterBtnSelected: {
    color: theme.colors.highlight
  },
  overlayRoot: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100
  }
}))

const BaseTable = forwardRef(
  (
    {
      containerClassName,
      columns,
      rows,
      columnTypes: parentColumnTypes,
      defaultColDef: parendDefaultColDef,
      suppressHorizontalScroll,
      isServerSide,
      pagination,
      rowActions,
      rowHeight,
      rowActionPopupWidth,
      onGridReady,
      fetcher,
      tableFooterWrapClasName,
      paginationClasses,
      footerActionsComponent,
      filters,
      editors,
      onCellValueChanged,
      entity,
      selectedRows,
      pageSize,
      initialParams,
      fullHeight,
      sortMapping,
      isLoading,
      hideEditors,
      disabledRowActions,
      perPageOptions,
      defaultColShow,
      showProfilePicColumn,
      titleColumnDef,
      transformProfilePicValue,
      transformTitleValue,
      redirectToViewPage,
      showJdenticonIcon,
      profileIcon,
      sidebarToolPanels,
      onFilterChanged,
      filterData,
      saveFilterItem,
      onSaveFilter,
      filterPanelWidth,
      clearSelectedFilter
    },
    ref
  ) => {
    const [isAutoHeight, setAutoHeight] = useState(true)
    const [extraHeight, setExtraHeight] = useState(0)
    const [statusBarChanged, setStatusBarChanged] = useState(false)
    const [filterPanelOpened, setFilterPanelOpened] = useState(false)
    const [toolPanelVisible, setToolPanelVisible] = useState(false)
    const [filterChanged, setFilterChanged] = useState(false)
    const [columnDefs, setColumnDefs] = useState()
    const [gridReady, setGridReady] = useState(false)
    const [showFloatingFliter, setShowFloatingFliter] = useState(false)
    const classes = useStyles({ isAutoHeight, fullHeight, extraHeight })
    const containerRef = useRef()
    const agGridRef = useRef()

    const floatingFilterButtonRender = useCallback(
      _showFloatingFliter => (
        <div className={classes.floatingFilterBtnRoot}>
          <Tooltip title="Show / Hide Column Filters" arrow>
            <i
              className={classNames(
                getIconClassName(iconNames.filter),
                classes.floatingFilterBtn,
                {
                  [classes.floatingFilterBtnSelected]: _showFloatingFliter
                }
              )}
              onClick={() => setShowFloatingFliter(f => !f)}
            />
          </Tooltip>
        </div>
      ),
      [classes]
    )

    const clickAwayListenerRender = useCallback(
      _toolPanelVisible =>
        _toolPanelVisible ? (
          <div
            className={classes.overlayRoot}
            onClick={() =>
              agGridRef.current?.api && agGridRef.current.api.closeToolPanel()
            }
          ></div>
        ) : null,
      [classes]
    )

    const handleRefresh = useCallback((params, resetFilter) => {
      const { limit, page, sort, order, ...filter } = params || {}
      sortGrid(agGridRef.current, sort, order)
      filterGrid(agGridRef.current, filter, resetFilter)
      paginationGrid(agGridRef.current, limit, page)
      // agGridRef.current?.api.onFilterChanged()
      !(page > 1) && agGridRef.current?.api.refreshServerSide({ purge: true })
    }, [])

    useEffect(() => {
      if (filterData && gridReady && agGridRef.current) {
        handleRefresh(filterData, true)
      }
      //eslint-disable-next-line
    }, [filterData])

    useImperativeHandle(ref, () => ({
      api: agGridRef.current?.api,
      refresh: handleRefresh,
      getSelectedRows: () => {
        if (selectedRows.selectedAll) {
          const { paginationProxy } = agGridRef.current?.api
          const data = []
          if (paginationProxy.active) {
            const min = paginationProxy.currentPage * paginationProxy.pageSize
            const max =
              (paginationProxy.currentPage + 1) * paginationProxy.pageSize

            agGridRef.current?.api.forEachNode(node => {
              if (
                node.rowIndex >= min &&
                node.rowIndex < max &&
                (!selectedRows.excludeSelected.includes(
                  String(node.rowIndex)
                ) ||
                  !selectedRows.excludeSelected.includes(String(node.id)))
              ) {
                data.push(node.data)
              }
            })
          } else {
            agGridRef.current?.api.forEachNode(node => {
              if (
                !selectedRows.excludeSelected.includes(String(node.rowIndex)) ||
                !selectedRows.excludeSelected.includes(String(node.id))
              ) {
                data.push(node.data)
              }
            })
          }
          return data
        } else {
          return selectedRows.selectedRows
        }
      }
    }))

    useEffect(() => {
      if (containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect()
        setExtraHeight(Math.round(top) + 20)
      }
      //eslint-disable-next-line
    }, [containerRef.current])

    useEffect(() => {
      if (!filterPanelOpened && agGridRef.current?.api) {
        agGridRef.current.api.closeToolPanel()
        setToolPanelVisible(false)
      }
    }, [filterPanelOpened])

    useEffect(() => {
      if (
        selectedRows?.initialRows &&
        agGridRef.current &&
        agGridRef.current.api?.forEachNode
      ) {
        agGridRef.current.api.forEachNode(node =>
          node.setSelected(
            !!selectedRows?.initialRows.find(({ id }) => id === node.data.id)
          )
        )
      }
      //eslint-disable-next-line
    }, [selectedRows?.initialRows])

    useEffect(() => {
      if (selectedRows?.isClearRows && agGridRef.current) {
        agGridRef.current.api.deselectAll()
      }
    }, [selectedRows?.isClearRows])

    const contextValue = useMemo(
      () => ({
        statusBarChanged,
        setStatusBarChanged,
        filterChanged,
        setFilterChanged,
        filterPanelOpened,
        setFilterPanelOpened
      }),
      [statusBarChanged, filterChanged, filterPanelOpened]
    )

    const [modifiedColumns, remainingFilters] = useMemo(() => {
      const _columns = [
        ...(showProfilePicColumn
          ? [
              getProfileColumnDef({
                transformProfilePicValue,
                transformTitleValue,
                redirectToViewPage,
                showJdenticonIcon,
                profileIcon
              })
            ]
          : []),
        ...(titleColumnDef
          ? [
              getTitleColumnDef(
                titleColumnDef,
                transformTitleValue,
                redirectToViewPage
              )
            ]
          : []),
        ...columns
      ]
      const cols = appendCellEditor(
        resizeColumnsWidthWithTitle(_columns),
        hideEditors ? [] : editors
      )
      const restFilters = []

      if (!!filters.length) {
        filters.forEach(filter => {
          const index = cols.findIndex(({ field }) => field === filter.field)
          if (index > -1 && (filter.filter || filter.filters)) {
            cols[index] = {
              ...cols[index],
              filter: withFilterField(
                filter.filter,
                filter.filters,
                filter.filterProps
              ),
              floatingFilterComponent: withFloatingFilterField(
                filter.filter,
                filter.filters,
                filter.filterProps
              ),
              floatingFilterComponentParams: {
                suppressFilterButton: true
              },
              filters: filter.filters,
              menuTabs: ['generalMenuTab', 'filterMenuTab']
            }
          } else {
            restFilters.push(filter)
          }
        })
      }

      cols.forEach((_, index) => {
        if (index >= defaultColShow) {
          cols[index].hide = true
        }
      })

      return [cols, restFilters]
    }, [
      filters,
      columns,
      editors,
      hideEditors,
      titleColumnDef,
      showProfilePicColumn,
      transformProfilePicValue,
      transformTitleValue,
      defaultColShow,
      redirectToViewPage,
      showJdenticonIcon,
      profileIcon
    ])

    const displayCheckbox = !!selectedRows

    useEffect(() => {
      const _columns = [
        ...(displayCheckbox ? [getCheckboxColumnDef()] : []),
        ...modifiedColumns,
        ...(rowActions.length
          ? [
              getActionColumnDef({
                cellRenderer: ({ data }) => (
                  <TableLibraryActionDropdown
                    actionLinks={
                      data.status === statusValues.disabled
                        ? disabledRowActions
                        : typeof rowActions === 'function'
                        ? rowActions(data)
                        : rowActions
                    }
                    data={data}
                    width={rowActionPopupWidth}
                  />
                )
              })
            ]
          : [])
      ]
      if (gridReady && agGridRef.current) {
        agGridRef.current.api.setColumnDefs(_columns)
        agGridRef.current.api.refreshHeader()
      } else {
        setColumnDefs(_columns)
      }
      //eslint-disable-next-line
    }, [modifiedColumns, rowActions])

    const sideBar = useMemo(() => {
      return {
        toolPanels: [
          getColumnSidebarPanel(),
          ...(sidebarToolPanels || []),
          ...(_isNotEmpty(filters)
            ? [
                getFilterSidebarPanel({
                  toolPanel: SideBarFilterPanel,
                  toolPanelParams: {
                    remainingFilters,
                    onSaveFilter,
                    saveFilterItem,
                    clearSelectedFilter
                  },
                  width: filterPanelWidth
                })
              ]
            : [])
        ]
      }
    }, [
      filters,
      remainingFilters,
      sidebarToolPanels,
      onSaveFilter,
      saveFilterItem,
      filterPanelWidth,
      clearSelectedFilter
    ])

    const defaultColDef = useMemo(() => {
      return getDefaultColDef({
        floatingFilter: !!modifiedColumns.some(
          ({ floatingFilterComponent }) => !!floatingFilterComponent
        ),
        ...parendDefaultColDef
      })
    }, [parendDefaultColDef, modifiedColumns])

    const columnTypes = useMemo(
      () => getColumnTypes(parentColumnTypes),
      [parentColumnTypes]
    )

    const statusBar = useMemo(() => {
      return {
        statusPanels: [
          ...(!footerActionsComponent && !pagination
            ? []
            : [
                {
                  statusPanel: TableFooter,
                  statusPanelParams: {
                    tableFooterWrapClasName,
                    paginationClasses,
                    hasPagination: pagination,
                    footerActionsComponent,
                    entity,
                    perPageOptions
                  }
                }
              ])
        ]
      }
    }, [
      tableFooterWrapClasName,
      paginationClasses,
      footerActionsComponent,
      pagination,
      entity,
      perPageOptions
    ])

    const handleGridReady = useCallback(
      params => {
        if (isServerSide && fetcher) {
          const datasource = createServerSideDatasource(fetcher, sortMapping)
          params.api.setServerSideDatasource(datasource)
          initialParams && handleRefresh(initialParams)
        }
        if (!pagination) {
          setAutoHeight(false)
        }
        setStatusBarChanged(true)
        const totalWidth =
          columns.reduce((a, { width = 100 }) => a + width, 0) + 100
        if (containerRef.current?.clientWidth > totalWidth || defaultColShow) {
          params.api.sizeColumnsToFit()
        }
        setGridReady(true)
        onGridReady && onGridReady(params)
      },
      [
        onGridReady,
        sortMapping,
        fetcher,
        isServerSide,
        pagination,
        columns,
        initialParams,
        handleRefresh,
        defaultColShow
      ]
    )

    const handleResizeContainer = useCallback(
      ({ height }) => {
        if (height > window.innerHeight - extraHeight || !pagination) {
          setAutoHeight(false)
        } else {
          setAutoHeight(true)
        }
      },
      [extraHeight, pagination]
    )

    const handleToolPanelVisibleChanged = event => {
      const { key, source } = event
      if (key === 'filters') {
        setFilterPanelOpened(true)
      } else if (source === null || source === undefined) {
        handleColumnEverythingChanged(event)
        setFilterPanelOpened(false)
      }
      setToolPanelVisible(event.visible || event.switchingToolPanel)
    }

    const handleCellValueChanged = event => {
      const { api } = event
      onCellValueChanged({
        ...event,
        refresh: (purge = true) => {
          api.refreshServerSide({ purge })
        }
      })
    }

    const handleSelectionChanged = ({ api }) => {
      const { selectAll, toggledNodes } = api.getServerSideSelectionState()
      if (selectAll) {
        selectedRows.setSelectedAll(true)
        selectedRows.setExcludeSelected(toggledNodes)
        selectedRows.setSelectedRows([])
      } else {
        selectedRows.setSelectedRows(api.getSelectedRows())
        selectedRows.setSelectedAll(false)
        selectedRows.setExcludeSelected([])
      }
    }

    const handlePaginationChanged = () => {
      setStatusBarChanged(true)
    }

    const handleColumnEverythingChanged = event => {
      const _columns = event.columnApi.getColumnState() || {}
      const totalWidth =
        _columns
          .filter(({ hide }) => !hide)
          .reduce((a, { width = 100 }) => a + width, 0) + 100
      if (
        containerRef.current?.clientWidth > totalWidth &&
        event.source !== 'uiColumnDragged'
      ) {
        event.api.sizeColumnsToFit()
      }
    }

    const handleSortChanged = ({ api }) => {
      if (_get(api, 'paginationProxy.masterRowCount', 0) <= 0) {
        api.refreshServerSide({ purge: true })
      }
    }

    const handleSort = useCallback((params, order) => {
      sortGrid(agGridRef.current, params.column.getId(), order)
      agGridRef.current?.api.refreshServerSide({ purge: true })
    }, [])

    const getMainMenuItems = useCallback(
      params => {
        return [
          {
            icon: '<i class="fa-regular fa-arrow-up" />',
            name: 'Asc',
            action: () => handleSort(params, 'asc')
          },
          {
            icon: '<i class="fa-regular fa-arrow-down" />',
            name: 'Desc',
            action: () => handleSort(params, 'desc')
          },
          'pinSubMenu'
        ]
      },
      [handleSort]
    )

    const handleFilterChanged = useCallback(
      ({ api }) => {
        setFilterChanged(true)
        onFilterChanged &&
          onFilterChanged({
            ...(api.getFilterModel() || {}),
            ...(api.getQuickFilter() || {})
          })
      },
      [onFilterChanged]
    )

    return isLoading ? (
      <LibraryLoader />
    ) : (
      <div
        className={classNames(classes.container, containerClassName)}
        ref={containerRef}
      >
        <div
          className={classNames('ag-theme-alpine', {
            'ag-hide-action': isMultipleSelected(selectedRows),
            'ag-show-floating-filter':
              showFloatingFliter && modifiedColumns.some(f => !!f.filter)
          })}
        >
          <BaseTableContext.Provider value={contextValue}>
            <AgGridReact
              ref={agGridRef}
              rowModelType={
                isServerSide && fetcher ? 'serverSide' : 'clientSide'
              }
              icons={{
                sortAscending: '<i class="fa-solid fa-sort-up "/>',
                sortDescending: '<i class="fa-solid fa-sort-down"/>',
                sortUnSort: '<i class="fa-solid fa-sort"/>',
                views: '<i class="fa-regular fa-rectangle-vertical-history" />'
              }}
              rowData={rows}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              columnTypes={columnTypes}
              rowSelection={'multiple'}
              suppressRowClickSelection={true}
              onGridReady={handleGridReady}
              suppressHorizontalScroll={suppressHorizontalScroll}
              sideBar={sideBar}
              maxBlocksInCache={1}
              animateRows={false}
              cacheBlockSize={pageSize}
              pagination={pagination}
              paginationPageSize={pageSize}
              domLayout={isAutoHeight && !fullHeight ? 'autoHeight' : 'normal'}
              rowHeight={rowHeight}
              statusBar={statusBar}
              suppressPaginationPanel={true}
              onPaginationChanged={handlePaginationChanged}
              onToolPanelVisibleChanged={handleToolPanelVisibleChanged}
              onFilterChanged={handleFilterChanged}
              onSelectionChanged={handleSelectionChanged}
              onColumnEverythingChanged={handleColumnEverythingChanged}
              noRowsOverlayComponent={EmptyPlaceholder}
              loadingOverlayComponent={LibraryLoader}
              loadingCellRenderer={LibraryLoader}
              loadingCellRendererParams={{
                rowCount: 2,
                footerHeight: 0
              }}
              onCellValueChanged={handleCellValueChanged}
              noRowsOverlayComponentParams={{
                text: 'No Results Found'
              }}
              onSortChanged={handleSortChanged}
              getMainMenuItems={getMainMenuItems}
            ></AgGridReact>
          </BaseTableContext.Provider>
        </div>
        {gridReady &&
          document.querySelector('.ag-side-bar') &&
          createPortal(
            floatingFilterButtonRender(showFloatingFliter),
            document.querySelector('.ag-side-bar')
          )}
        {gridReady &&
          document.querySelector('.ag-side-bar') &&
          createPortal(
            clickAwayListenerRender(toolPanelVisible),
            document.querySelector('.ag-side-bar')
          )}
        <ResizeObserver onResize={handleResizeContainer} />
      </div>
    )
  }
)

BaseTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      headerName: PropTypes.string,
      field: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
      hide: PropTypes.bool,
      pinned: PropTypes.bool
    })
  ).isRequired,
  defaultColDef: PropTypes.object,
  isServerSide: PropTypes.bool,
  suppressHorizontalScroll: PropTypes.bool,
  pagination: PropTypes.bool,
  rowActions: PropTypes.array,
  disabledRowActions: PropTypes.array,
  rowHeight: PropTypes.number,
  filters: PropTypes.array,
  editors: PropTypes.array,
  containerClassName: PropTypes.className,
  columnTypes: PropTypes.object,
  onGridReady: PropTypes.func,
  fetcher: PropTypes.func,
  tableFooterWrapClasName: PropTypes.className,
  paginationClasses: PropTypes.object,
  footerActionsComponent: PropTypes.node,
  onCellValueChanged: PropTypes.func,
  entity: PropTypes.tableEntities,
  selectedRows: PropTypes.object,
  pageSize: PropTypes.number,
  initialParams: PropTypes.object,
  fullHeight: PropTypes.bool,
  sortMapping: PropTypes.object,
  isLoading: PropTypes.bool,
  hideEditors: PropTypes.bool,
  perPageOptions: PropTypes.array,
  defaultColShow: PropTypes.number
}

BaseTable.defaultProps = {
  rows: [],
  columns: [],
  defaultColDef: {},
  isServerSide: true,
  suppressHorizontalScroll: false,
  pagination: false,
  rowActions: [],
  disabledRowActions: [],
  rowHeight: 60,
  filters: [],
  editors: [],
  pageSize: 100,
  fullHeight: true,
  isLoading: false,
  hideEditors: false,
  defaultColShow: 12,
  filterPanelWidth: 350
}

export default BaseTable
