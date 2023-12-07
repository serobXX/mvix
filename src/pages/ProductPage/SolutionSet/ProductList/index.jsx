import { useCallback, useEffect, useMemo } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { useLazyGetProductsQuery } from 'api/productApi'
import { EmptyPlaceholder } from 'components/placeholder'
import BasePaginate from 'components/BasePaginate'
import ProductCard from './ProductCard'
import Scrollbars from 'components/Scrollbars'
import { SolutionSetItemsLoader } from 'components/loaders'
import queryParamsHelper from 'utils/queryParamsHelper'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    height: 'inherit',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  paginateWrapper: {
    marginTop: 16
  },
  scrollContainer: {
    margin: '0 -20px',
    height: 'calc(100% - 51px)',
    overflow: 'auto'
  },
  scrollInner: {
    padding: '5px 20px 0 20px',
    height: 'inherit',
    overflow: 'auto'
  }
}))

const ProductList = ({ filterValues }) => {
  const classes = useStyles()
  const [getProducts, { isFetching, meta, data }] = useLazyGetProductsQuery()

  const itemsLimit = useMemo(() => {
    return Math.floor((window.innerHeight - 360) / 67) * 2
  }, [])

  const fetcher = useCallback(
    params => {
      getProducts(
        queryParamsHelper(
          {
            limit: itemsLimit,
            ...filterValues,
            ...(params || {})
          },
          ['tags']
        )
      )
    },
    [itemsLimit, getProducts, filterValues]
  )

  useEffect(() => {
    fetcher()
    //eslint-disable-next-line
  }, [filterValues])

  const handleChangePage = useCallback(
    ({ selected }) => {
      fetcher({
        page: selected + 1
      })
    },
    [fetcher]
  )

  return isFetching ? (
    <SolutionSetItemsLoader />
  ) : !data.length ? (
    <EmptyPlaceholder text={'No Results Found'} />
  ) : (
    <Grid
      container
      direction={'column'}
      justifyContent={'space-between'}
      className={classes.root}
    >
      <div className={classes.scrollContainer}>
        <Scrollbars>
          <div className={classes.scrollInner}>
            <Grid container justifyContent={'space-between'}>
              {data.map(product => (
                <ProductCard product={product} key={`product-${product.id}`} />
              ))}
            </Grid>
          </div>
        </Scrollbars>
      </div>
      <Grid
        container
        justifyContent={'center'}
        className={classes.paginateWrapper}
      >
        {meta && meta.lastPage > 1 && (
          <BasePaginate
            page={meta.currentPage}
            pageCount={meta.lastPage}
            onPageChange={handleChangePage}
          />
        )}
      </Grid>
    </Grid>
  )
}

export default ProductList
