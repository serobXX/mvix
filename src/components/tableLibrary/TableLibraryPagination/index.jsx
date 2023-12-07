import React from 'react'
import classNames from 'classnames'
import { withStyles, Typography, Grid, List } from '@material-ui/core'
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons'

import { WhiteButton } from 'components/buttons'
import {
  DropdownHoverListItem,
  DropdownHoverListItemText
} from 'components/dropdowns'
import BasePaginate from 'components/BasePaginate'
import { FormControlInput } from 'components/formControls'
import PropTypes from 'constants/propTypes'
import './_pagination.scss'
import { MaterialPopup } from 'components/Popup'
import { materialPopupPosition } from 'constants/common'
import { convertToPluralize } from 'utils/pluralize'

const styles = ({ palette, type, typography }) => ({
  root: {
    height: '40px',
    paddingRight: '15px'
  },
  paginationInputWraps: {
    width: '55px',
    marginRight: '13px',
    '& input': {
      height: '27px !important'
    }
  },
  paginationWrap: {
    marginRight: '18px',
    paddingRight: '5px',
    borderRight: `1px solid ${palette[type].tableLibrary.footer.pagination.border}`
  },
  goToWrap: {
    marginRight: '20px',
    borderRight: `1px solid ${palette[type].tableLibrary.footer.pagination.border}`
  },
  paginationText: {
    marginRight: '10px',
    ...typography.lightText[type]
  },
  rowActionBtn: {
    minWidth: '55px',
    width: 55,
    paddingLeft: '10px',
    paddingRight: '10px',
    boxShadow: `0 1px 0 0 ${palette[type].tableLibrary.footer.pagination.button.shadow}`,
    color: palette[type].tableLibrary.footer.pagination.button.color,
    backgroundColor:
      palette[type].tableLibrary.footer.pagination.button.background,
    borderColor: palette[type].tableLibrary.footer.pagination.button.border,
    height: 27,

    '&:hover': {
      borderColor: '#1c5dca',
      backgroundColor: '#1c5dca',
      color: '#fff'
    }
  },
  rowActionBtnIcon: {
    width: 18,
    height: 18
  },
  totalItemsWrap: {
    marginRight: '18px',
    paddingRight: '18px',
    borderRight: `1px solid ${palette[type].tableLibrary.footer.pagination.border}`
  },
  totalItemsLabel: {
    ...typography.darkText[type],
    fontSize: '14px',
    fontWeight: 'bold',
    color: typography.darkText[type].color
  },
  textLight: {
    ...typography.lightText[type]
  },
  paginationGrid: {
    width: 'auto'
  },
  paginateActive: {
    '& a': {
      width: '27px !important',
      height: '27px !important',
      minWidth: '27px !important'
    }
  }
})

const dropdownStyle = {
  width: 65,
  animation: 'fade-in'
}

const TableLibraryPagination = ({
  classes,
  pageCount = 0,
  previousLabel = <KeyboardArrowLeft />,
  nextLabel = <KeyboardArrowRight />,
  marginPagesDisplayed = 1,
  pageRangeDisplayed = 5,
  onPageChange,
  page = 1,
  onPressJumper,
  perPage,
  perPageOptions,
  onChangeRowsPerPage,
  displayPaginationOptions = true,
  totalCount,
  entity,
  paginationClasses = {}
}) => {
  const calculatedPageRangeDisplayed =
    page < parseInt(pageCount / 2) + 2
      ? pageRangeDisplayed - 1
      : pageRangeDisplayed
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="flex-end"
      className={classNames(classes.root, paginationClasses.root)}
    >
      {totalCount !== undefined && totalCount !== 0 ? (
        <Grid
          item
          className={classNames(
            classes.totalItemsWrap,
            paginationClasses.totalItemsWrap
          )}
        >
          <Typography
            className={classNames(
              classes.totalItemsLabel,
              paginationClasses.totalItemsLabel
            )}
          >
            {convertToPluralize(
              `Total ${totalCount} ${entity || 'Item'}`,
              totalCount
            )}
          </Typography>
        </Grid>
      ) : null}
      <Grid
        item
        className={classNames(
          classes.paginationWrap,
          paginationClasses.paginationWrap
        )}
      >
        <BasePaginate
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          page={page}
          pageCount={pageCount}
          marginPagesDisplayed={marginPagesDisplayed}
          pageRangeDisplayed={calculatedPageRangeDisplayed}
          onPageChange={onPageChange}
          containerClassName={classes.textLight}
          activeClassName={classes.paginateActive}
        />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        className={classes.paginationGrid}
      >
        <Grid
          item
          className={classNames({
            [classes.goToWrap]: displayPaginationOptions
          })}
        >
          <Grid container alignItems="center">
            <Grid item>
              <Typography className={classes.paginationText}>
                Go to page
              </Typography>
            </Grid>
            <Grid item className={classes.paginationInputWraps}>
              <FormControlInput
                fullWidth
                type="text"
                defaultValue=""
                onKeyPress={onPressJumper}
                marginBottom={false}
              />
            </Grid>
          </Grid>
        </Grid>
        {displayPaginationOptions && (
          <Grid item>
            <Grid container alignItems="center">
              <Grid item>
                <Typography className={classes.paginationText}>Show</Typography>
              </Grid>
              <Grid item className={classes.paginationInputWraps}>
                <MaterialPopup
                  on="hover"
                  trigger={
                    <WhiteButton className={classes.rowActionBtn}>
                      {perPage}
                      <KeyboardArrowDown className={classes.rowActionBtnIcon} />
                    </WhiteButton>
                  }
                  style={dropdownStyle}
                  placement={materialPopupPosition.topCenter}
                  preventOverflow={{
                    enabled: true,
                    boundariesElement: 'viewport'
                  }}
                >
                  <List component="nav" disablePadding>
                    {perPageOptions.map((item, index) => (
                      <DropdownHoverListItem
                        key={`perPageItem-${index}`}
                        onClick={() => onChangeRowsPerPage(item)}
                      >
                        <DropdownHoverListItemText primary={item} />
                      </DropdownHoverListItem>
                    ))}
                  </List>
                </MaterialPopup>
              </Grid>
              <Grid item>
                <Typography className={classes.paginationText}>
                  Per page
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

TableLibraryPagination.propTypes = {
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onPressJumper: PropTypes.func,
  displayPaginationOptions: PropTypes.bool,
  paginationClasses: PropTypes.shape({
    root: PropTypes.className,
    totalItemsWrap: PropTypes.className,
    totalItemsLabel: PropTypes.className,
    paginationWrap: PropTypes.className
  }),
  entity: PropTypes.string
}

export default withStyles(styles)(TableLibraryPagination)
