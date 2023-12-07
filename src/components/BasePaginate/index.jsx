import React from 'react'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import ReactPaginate from 'react-paginate'
import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'

function styles({ fontSize, lineHeight, fontWeight }) {
  return {
    root: {
      '& .TableLibraryPagination li:not(.previous):not(.next) a': {
        fontSize: fontSize.primary,
        lineHeight: lineHeight.primary,
        fontWeight: fontWeight.bold
      }
    }
  }
}

const BasePaginate = ({
  classes,
  page,
  onPageChange = f => f,
  pageCount = 10,
  className,
  marginPagesDisplayed = 1,
  pageRangeDisplayed = 5,
  containerClassName,
  breakClassName,
  subContainerClassName,
  activeClassName,
  ...props
}) => {
  return (
    <div className={classNames(classes.root, className)}>
      <ReactPaginate
        previousLabel={<KeyboardArrowLeft />}
        nextLabel={<KeyboardArrowRight />}
        forcePage={page - 1}
        breakLabel="..."
        breakClassName={classNames(
          'TableLibraryPagination_break-me',
          breakClassName
        )}
        pageCount={pageCount || 1}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
        containerClassName={classNames(
          'TableLibraryPagination',
          containerClassName
        )}
        subContainerClassName={classNames(
          'TableLibraryPagination_pages TableLibraryPagination_pagination',
          subContainerClassName
        )}
        activeClassName={classNames(
          'TableLibraryPagination_active',
          activeClassName
        )}
        {...props}
      />
    </div>
  )
}

export default withStyles(styles)(BasePaginate)
