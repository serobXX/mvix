import { useCallback, useEffect, useMemo } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import Yup from 'utils/yup'

import {
  useAddSolutionSetMutation,
  useDeleteSolutionSetMutation,
  useGetSolutionSetsQuery,
  useUpdateSolutionSetMutation
} from 'api/solutionSetApi'
import Scrollbars from 'components/Scrollbars'
import { BlueButton, CircleIconButton } from 'components/buttons'
import SolutionSetCard from 'components/cards/SolutionSetCard'
import { FormControlInput } from 'components/formControls'
import { SolutionSetLoader } from 'components/loaders'
import { TwoColumnLayoutModal } from 'components/modals'
import { SOLUTION_SET_TYPE } from 'constants/dnd'
import iconNames from 'constants/iconNames'
import { permissionGroupNames } from 'constants/permissionGroups'
import { routes } from 'constants/routes'
import { requiredField } from 'constants/validationMessages'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import useLazyLoad from 'hooks/useLazyLoad'
import handleBottomScroll from 'utils/handleBottomScroll'
import { getIconClassName } from 'utils/iconUtils'
import { convertToPluralize } from 'utils/pluralize'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import ProductList from './ProductList'
import { _uniqBy } from 'utils/lodash'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import useFilter from 'hooks/useFilter'
import entityConstants from 'constants/entityConstants'
import Filter from './Filter'
import queryParamsHelper from 'utils/queryParamsHelper'

const useStyles = makeStyles(({ palette, type }) => ({
  circleIcon: {
    color: palette[type].pageContainer.header.infoIcon.color,
    fontSize: 16
  },
  addNewGroupWrap: {
    paddingLeft: '10px'
  },
  addNewGroupLabel: {
    fontWeight: 'normal'
  },
  errorText: {
    lineHeight: 1.5
  },
  scrollContainer: {
    margin: '0 -20px',
    height: 'inherit',
    overflow: 'auto'
  },
  scrollInner: {
    padding: '20px 20px 0 20px',
    height: 'inherit',
    overflow: 'auto'
  },
  modalContainer: {
    zIndex: 2001
  },
  groupsAddInput: {
    flexGrow: 1
  }
}))

const SolutionSet = ({ layout }) => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.solutionSet)
  const { showConfirmation } = useConfirmation()
  const [filterValues, updateFilter, resetFilter] = useFilter(
    entityConstants.ProductLibrary
  )

  const {
    data: list,
    meta,
    isFetching,
    refetch
  } = useGetSolutionSetsQuery({
    limit: 10
  })

  const [addItem, post] = useAddSolutionSetMutation({
    fixedCacheKey: apiCacheKeys.solutionSet.add
  })
  const [updateItem, put] = useUpdateSolutionSetMutation({
    fixedCacheKey: apiCacheKeys.solutionSet.update
  })
  const [deleteItem, del] = useDeleteSolutionSetMutation({
    fixedCacheKey: apiCacheKeys.solutionSet.delete
  })

  const isCreateActionDisabled = !permission.create || isFetching

  const onSubmit = useCallback(
    values => {
      addItem({
        name: values.name,
        items: []
      })
    },
    [addItem]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid,
    handleSubmit,
    validateForm,
    handleReset
  } = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(requiredField)
    }),
    onSubmit
  })

  useEffect(() => {
    validateForm()
    //eslint-disable-next-line
  }, [])

  const fetcher = useCallback(
    (params = {}) => {
      refetch({
        limit: 10,
        ...params
      })
    },
    [refetch]
  )

  useNotifyAnalyzer({
    fetcher,
    entityName: 'Solution Sets',
    onSuccess: () => handleReset(),
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const { data, handleLoadMore } = useLazyLoad({
    isFetching,
    response: list,
    meta,
    fetcher,
    initialFetch: false
  })

  const handleMoveItem = useCallback(
    (item, product) => {
      if (item && product) {
        updateItem({
          id: item.id,
          data: {
            items: _uniqBy(
              [
                ...item.items.map(({ product, ...items }) =>
                  queryParamsHelper({
                    ...items,
                    productId: product?.id
                  })
                ),
                {
                  productId: product.id,
                  price: getCustomFieldValueByCode(
                    product,
                    customFieldNames.productPrice,
                    0
                  ),
                  quantity: 1
                }
              ],
              'productId'
            )
          }
        })
      }
    },
    [updateItem]
  )

  const handleRemoveItem = useCallback(
    ({ id, items }, { id: productId }) => {
      if (id) {
        updateItem({
          id,
          data: {
            items: items
              .filter(item => item.product?.id !== productId)
              .map(({ product, ...item }) =>
                queryParamsHelper({
                  ...item,
                  productId: product.id
                })
              )
          }
        })
      }
    },
    [updateItem]
  )

  const handleChangeGroupTitle = useCallback(
    ({ id, items }, name) => {
      if (id && name) {
        updateItem({
          id,
          data: {
            name,
            items
          }
        })
      }
    },
    [updateItem]
  )

  const handleDeleteItem = useCallback(
    ({ id, name }) =>
      () => {
        if (id) {
          showConfirmation(getDeleteConfirmationMessage(name), () =>
            deleteItem(id)
          )
        }
      },
    [deleteItem, showConfirmation]
  )

  const handleUpdate = useCallback(
    (id, data) => {
      updateItem({
        id,
        data
      })
    },
    [updateItem]
  )

  const solutionSetCards = useMemo(() => {
    return data.map(item => (
      <SolutionSetCard
        key={`solution-set-${item.id}`}
        title={item.name}
        itemsCount={item?.items?.length}
        itemsLabel={`${convertToPluralize('Items', item?.items?.length)}`}
        dropItemType={SOLUTION_SET_TYPE}
        onChangeGroupTitle={handleChangeGroupTitle}
        onMoveItem={handleMoveItem}
        onRemoveItem={handleRemoveItem}
        itemList={item?.items.map(({ product, quantity }) => ({
          id: product?.id,
          title: getCustomFieldValueByCode(
            product,
            customFieldNames.productCode
          ),
          quantity
        }))}
        item={item}
        actionList={[
          {
            icon: getIconClassName(iconNames.delete),
            label: 'Delete',
            clickAction: handleDeleteItem(item)
          }
        ]}
        onUpdate={handleUpdate}
      />
    ))
  }, [
    data,
    handleChangeGroupTitle,
    handleMoveItem,
    handleRemoveItem,
    handleDeleteItem,
    handleUpdate
  ])

  return (
    <TwoColumnLayoutModal
      title={'Solution Sets'}
      closeLink={parseToAbsolutePath(routes.products.list)}
      leftSideCard={{
        title: 'Solution Sets',
        component: (
          <>
            <Grid container alignItems="center">
              <Grid item className={classes.groupsAddInput}>
                <FormControlInput
                  fullWidth
                  label={''}
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  touched={touched.name}
                  errorTextClass={classes.errorText}
                  disabled={isCreateActionDisabled}
                  marginBottom={false}
                />
              </Grid>
              <Grid item className={classes.addNewGroupWrap}>
                <BlueButton
                  classes={{
                    label: classes.addNewGroupLabel
                  }}
                  onClick={handleSubmit}
                  opaque={!isValid}
                  disabled={isCreateActionDisabled}
                  iconClassName={getIconClassName(iconNames.add)}
                >
                  {'Add'}
                </BlueButton>
              </Grid>
            </Grid>
            <div className={classes.scrollContainer}>
              <Scrollbars onUpdate={handleBottomScroll(handleLoadMore)}>
                <div className={classes.scrollInner}>
                  {isFetching ? (
                    <SolutionSetLoader />
                  ) : (
                    <Grid container direction="column" wrap="nowrap">
                      {solutionSetCards}
                    </Grid>
                  )}
                </div>
              </Scrollbars>
            </div>
          </>
        ),
        dropdown: false,
        icon: false
      }}
      rightSideCard={{
        title: 'Product Items',
        iconButtonComponent: (
          <CircleIconButton className={`hvr-grow ${classes.circleIcon}`}>
            <i className={getIconClassName(iconNames.filter)} />
          </CircleIconButton>
        ),
        popupContentStyle: {
          width: 300
        },
        menuDropdownComponent: close => (
          <Filter
            closePopup={close}
            filterValues={filterValues}
            updateFilter={updateFilter}
            resetFilter={resetFilter}
            layout={layout}
          />
        )
      }}
    >
      <ProductList filterValues={filterValues} />
    </TwoColumnLayoutModal>
  )
}

export default SolutionSet
