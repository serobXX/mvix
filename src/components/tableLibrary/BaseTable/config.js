import { titleCase } from 'title-case'

import { TextWithTooltipColumn } from 'components/tableColumns'
import ProfilePicColumn from 'components/tableColumns/ProfilePicColumn'
import { statusValues } from 'constants/commonOptions'
import withEditorField from 'hoc/withEditorField'
import { measureText } from 'utils/generalUtils'
import { parseAgGridRequestData } from 'utils/libraryUtils'
import { _cloneDeep, _debounce, _get, _isObject, _isString } from 'utils/lodash'

export const createServerSideDatasource = (fetcher, sortMapping) => {
  return {
    getRows: _debounce(async event => {
      try {
        event.api.hideOverlay()
        const { data, meta } = await fetcher(
          parseAgGridRequestData(
            {
              ...event.request,
              filter: event.api.getQuickFilter(),
              filterModel: event.api.getFilterModel()
            },
            sortMapping
          )
        )
        if (!data.length) {
          event.api.showNoRowsOverlay()
        }
        event.success({ rowData: _cloneDeep(data), rowCount: meta?.total })
      } catch (error) {
        event.fail()
      }
    }, 500)
  }
}

export const sortGrid = (event, field, sortDir = 'asc') => {
  if (field) {
    const columnState = {
      state: [
        {
          colId: field,
          sort: sortDir
        }
      ]
    }
    event.columnApi.applyColumnState(columnState)
  }
}

export const filterGrid = (event, filter, resetFilter = false) => {
  if (filter) {
    const columns = event.columnApi.columnModel.columnDefs || {}
    const filterModel = { ...(resetFilter ? {} : event.api.getFilterModel()) }
    const quickFilter = {
      ...(resetFilter ? {} : event.api.getQuickFilter()),
      ...filter
    }

    Object.entries(filter).forEach(([key, value]) => {
      if (columns.find(({ field }) => field === key)) {
        filterModel[key] = value
        delete quickFilter[key]
      }
    })

    event.api.setFilterModel(filterModel)
    event.api.setQuickFilter(quickFilter)
  }
}

export const paginationGrid = async (event, limit, page) => {
  if (page) {
    const { api, props } = event
    page = page - 1
    limit = limit || props.cacheBlockSize
    if (_get(api, 'paginationProxy.masterRowCount', 0) < page * limit + 1) {
      api.setRowCount(page * limit + 1, false)
    }
    api.ensureIndexVisible(page * limit + 1)
  }
}

export const getCheckboxColumnDef = () => ({
  headerCheckboxSelection: true,
  checkboxSelection: ({ data }) => data.status !== statusValues.disabled,
  showDisabledCheckboxes: true,
  width: 50,
  maxWidth: 50,
  sortable: false,
  suppressMovable: true,
  menuTabs: [],
  lockVisible: true,
  lockPosition: 'left',
  editable: false,
  cellClass: 'no-border',
  suppressColumnsToolPanel: true
})

export const getProfileColumnDef = ({
  transformProfilePicValue,
  transformTitleValue,
  redirectToViewPage,
  showJdenticonIcon = false,
  profileIcon
}) => ({
  headerName: '',
  field: 'avatar',
  width: 70,
  maxWidth: 70,
  sortable: false,
  cellRenderer: ProfilePicColumn,
  cellRendererParams: row => ({
    getValue: transformProfilePicValue,
    getTitleValue: transformTitleValue,
    to: redirectToViewPage || null,
    showJdenticonIcon,
    customIcon: profileIcon
  }),
  type: 'centerAligned',
  lockPosition: 'left',
  suppressColumnsToolPanel: true
})

export const getTitleColumnDef = (
  titleColumnDef,
  transformTitleValue,
  redirectToViewPage
) => ({
  headerName: 'title',
  field: 'title',
  width: 200,
  cellRenderer: TextWithTooltipColumn,
  ...(titleColumnDef || {}),
  cellRendererParams: {
    getValue: transformTitleValue,
    isTitle: true,
    to: redirectToViewPage || null,
    ...(titleColumnDef?.cellRendererParams || {})
  },
  lockPosition: 'left'
})

export const getActionColumnDef = (extra = {}) => ({
  field: 'action',
  headerName: '',
  width: 50,
  maxWidth: 50,
  sortable: false,
  suppressMovable: true,
  menuTabs: [],
  lockVisible: true,
  lockPosition: 'right',
  type: 'centerAligned',
  suppressNavigable: true,
  cellClass: 'no-border action-column',
  editable: false,
  suppressColumnsToolPanel: true,
  ...extra
})

export const getColumnSidebarPanel = () => ({
  id: 'columns',
  labelDefault: 'Columns',
  labelKey: 'columns',
  iconKey: 'columns',
  toolPanel: 'agColumnsToolPanel',
  toolPanelParams: {
    suppressRowGroups: true,
    suppressValues: true,
    suppressPivots: true,
    suppressPivotMode: true,
    suppressColumnFilter: true,
    suppressColumnSelectAll: true,
    suppressColumnExpandAll: true
  }
})

export const getFilterSidebarPanel = (extra = {}) => ({
  id: 'filters',
  labelDefault: 'Filters',
  labelKey: 'filters',
  iconKey: 'filter',
  width: 660,
  ...extra
})

export const getDefaultColDef = (extra = {}) => ({
  sortable: true,
  resizable: true,
  menuTabs: ['generalMenuTab'],
  width: 100,
  valueSetter: params => {
    const { newValue, column, data } = params
    if (_isString(newValue)) {
      data[column.colId] = newValue
      return true
    } else if (_isObject(newValue)) {
      Object.entries(newValue).forEach(([key, value]) => {
        data[key] = value
      })
      return true
    }
    return false
  },
  ...extra
})

export const getColumnTypes = extra => ({
  centerAligned: {
    headerClass: 'ag-center-aligned-header',
    cellClass: 'ag-center-aligned-cell'
  },
  ...extra
})

export const appendCellEditor = (columns, editors) => {
  const cols = [...columns]
  if (!editors.length) return cols
  editors.forEach(editor => {
    const fields = Array.isArray(editor.field) ? editor.field : [editor.field]
    fields.forEach(_field => {
      const index = cols.findIndex(({ field }) => field === _field)
      if (index > -1 && (editor.cellEditor || !!editor.cellEditors?.length)) {
        cols[index] = {
          ...cols[index],
          editable: ({ data }) => data.status !== statusValues.disabled,
          cellEditor: withEditorField(
            editor.cellEditor,
            editor.cellEditors,
            editor.cellEditorProps
          ),
          ...(editor.valueSetter ? { valueSetter: editor.valueSetter } : {}),
          ...(editor.valueGetter ? { valueGetter: editor.valueGetter } : {})
        }
      }
    })
  })
  return cols
}

export const resizeColumnsWidthWithTitle = columns => {
  return columns.map(col => {
    const headerName =
      col.headerName === ''
        ? col.headerName
        : titleCase(col.headerName || col.field)
    const textWidth = measureText(headerName, 13) + 90
    return {
      ...col,
      width: col.width < textWidth ? textWidth : col.width,
      headerName
    }
  })
}
