import { useCallback, useContext, useEffect } from 'react'

import { _get } from 'utils/lodash'
import TableLibraryFooter from '../TableLibraryFooter'
import BaseTableContext from './context'

const TableFooter = ({
  api,
  tableFooterWrapClasName,
  paginationClasses,
  footerActionsComponent,
  hasPagination,
  entity,
  perPageOptions
}) => {
  const { statusBarChanged, setStatusBarChanged } = useContext(BaseTableContext)
  useEffect(() => {
    if (statusBarChanged) {
      setStatusBarChanged(false)
    }
    //eslint-disable-next-line
  }, [statusBarChanged])

  const handleChangePage = useCallback(
    ({ selected }) => {
      api.paginationGoToPage(selected)
    },
    [api]
  )

  const handlePressJumper = useCallback(
    ({ target: { value }, key }) => {
      const page = Number.parseInt(value)

      if (
        key === 'Enter' &&
        page <= _get(api, 'paginationProxy.totalPages', 0)
      ) {
        api.paginationGoToPage(page - 1)
      }
    },
    [api]
  )

  const handleChangeRowsPerPage = useCallback(
    pageSize => {
      api.setCacheBlockSize(pageSize)
      api.paginationSetPageSize(pageSize)
      api.paginationGoToPage(0)
    },
    [api]
  )

  return (
    <TableLibraryFooter
      page={_get(api, 'paginationProxy.currentPage', 0) + 1}
      pageCount={_get(api, 'paginationProxy.totalPages', 0)}
      perPage={+_get(api, 'paginationProxy.pageSize', 0)}
      onPageChange={handleChangePage}
      onPressJumper={handlePressJumper}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      totalCount={_get(api, 'paginationProxy.masterRowCount', 0)}
      tableFooterWrapClasName={tableFooterWrapClasName}
      paginationClasses={paginationClasses}
      footerActionsComponent={footerActionsComponent}
      hasPagination={hasPagination}
      entity={entity}
      perPageOptions={perPageOptions}
    />
  )
}

export default TableFooter
