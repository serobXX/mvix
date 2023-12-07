import React from 'react'
import { Grid, withStyles } from '@material-ui/core'
import classNames from 'classnames'

import PropTypes from 'constants/propTypes'
import TableLibraryPagination from './TableLibraryPagination'
import { getPaginationValues } from 'utils/libraryUtils'
import { paginationViews } from 'constants/library'

const styles = ({ palette, type }) => ({
  tableFooterWrap: {
    paddingLeft: '21px',
    backgroundColor: palette[type].tableLibrary.footer.background,
    borderRadius: '0 0 4px 4px'
  }
})

const TableLibraryFooter = ({
  page,
  classes,
  perPage,
  pageCount,
  onPageChange,
  perPageOptions,
  onChangeRowsPerPage,
  onPressJumper,
  footerActionsComponent,
  totalCount,
  entity,
  hasPagination,
  displayPaginationOptions,
  tableFooterWrapClasName = '',
  paginationClasses = {}
}) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={classNames(classes.tableFooterWrap, tableFooterWrapClasName)}
    >
      <Grid item>{footerActionsComponent && footerActionsComponent}</Grid>
      {hasPagination && (
        <Grid item>
          <TableLibraryPagination
            pageCount={pageCount}
            perPageOptions={
              perPageOptions || getPaginationValues(paginationViews.listView)
            }
            component="div"
            perPage={perPage}
            page={page}
            onPageChange={onPageChange}
            onChangeRowsPerPage={onChangeRowsPerPage}
            onPressJumper={onPressJumper}
            totalCount={totalCount}
            entity={entity}
            displayPaginationOptions={displayPaginationOptions}
            paginationClasses={paginationClasses}
          />
        </Grid>
      )}
    </Grid>
  )
}

TableLibraryFooter.propTypes = {
  page: PropTypes.number,
  classes: PropTypes.object,
  perPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageChange: PropTypes.func,
  perPageOptions: PropTypes.array,
  onChangeRowsPerPage: PropTypes.func,
  onPressJumper: PropTypes.func,
  footerActions: PropTypes.node,
  totalCount: PropTypes.number,
  hasPagination: PropTypes.bool,
  entity: PropTypes.string
}

TableLibraryFooter.defaultProps = {
  page: 1,
  pageCount: 0,
  onPageChange: f => f,
  onChangeRowsPerPage: f => f,
  onPressJumper: f => f,
  hasPagination: true,
  footerActions: null
}

export default withStyles(styles)(TableLibraryFooter)
