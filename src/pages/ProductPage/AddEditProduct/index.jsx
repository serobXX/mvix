import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import { SideModal } from 'components/modals'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import {
  useAddProductMutation,
  useLazyGetProductByIdQuery,
  useUpdateProductMutation
} from 'api/productApi'
import { tagEntityType } from 'constants/tagConstants'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import GridLayout from 'components/GridLayout'
import { useLazyGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { entityValues } from 'constants/customFields'
import ProductDescriptionCard from '../DetailView/ProductDescriptionCard'
import { DetailTagCard } from 'components/cards'
import ProfileCardDetails from './ProfileCardDetails'
import queryParamsHelper from 'utils/queryParamsHelper'

const useStyles = makeStyles(({ palette, type }) => ({
  sideModalHeader: {
    padding: '17px 24px',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    background: palette[type].body.background,
    borderLeft: `2px solid ${palette[type].sideModal.content.border}`,
    borderRight: `2px solid ${palette[type].sideModal.content.border}`,
    padding: 20,
    paddingRight: 6
  }
}))

const AddEditProduct = ({
  layout: _layout,
  closeLink,
  loadLayout = false,
  fromDetailView = false
}) => {
  const { id, view, productId } = useParams()
  const classes = useStyles()
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitClick, setSubmitClick] = useState(false)
  const [isResetClick, setResetClick] = useState(false)
  const [values, setValues] = useState({})
  const navigate = useNavigate()

  const [getItemById, { data: item, isFetching }] = useLazyGetProductByIdQuery()
  const [addItem, post] = useAddProductMutation({
    fixedCacheKey: apiCacheKeys.product.add
  })
  const [updateItem, put] = useUpdateProductMutation({
    fixedCacheKey: apiCacheKeys.product.update
  })

  const [getCustomFieldLayout, { data: customFieldLayout }] =
    useLazyGetCustomFieldsByEntityQuery()

  const isEdit = fromDetailView ? !!productId : !!id

  useNotifyAnalyzer({
    entityName: 'Product',
    watchArray: [post, put],
    labels: [notifyLabels.add, notifyLabels.update],
    stopNotifying: !fromDetailView
  })

  useEffect(() => {
    if (loadLayout) {
      getCustomFieldLayout({
        entityType: entityValues.product
      })
    }
    //eslint-disable-next-line
  }, [loadLayout])

  const layout = useMemo(
    () => _layout || customFieldLayout,
    [_layout, customFieldLayout]
  )

  useEffect(() => {
    if (fromDetailView ? productId : id) {
      getItemById(fromDetailView ? productId : id)
    }
    //eslint-disable-next-line
  }, [id, productId])

  useEffect(() => {
    if (isSubmitClick) {
      setSubmitClick(false)
    }
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      setResetClick(false)
    }
  }, [isResetClick])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(closeLink || parseToAbsolutePath(routes.products.list))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const handleSubmit = useCallback(() => {
    const {
      profile: { status, isCustomProduct, ...customFields },
      tag: { tag },
      detail
    } = values
    setSubmitting(true)

    const data = {
      tag,
      status,
      isCustomProduct,
      customFields: queryParamsHelper({
        ...customFields,
        ...detail
      })
    }

    if (isEdit) {
      updateItem({
        id: fromDetailView ? productId : id,
        data
      })
    } else {
      addItem(data)
    }
  }, [addItem, updateItem, productId, fromDetailView, id, isEdit, values])

  useEffect(() => {
    if (values.profile && values.tag && values.detail && !isSubmitting) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [values])

  const handleEditSubmit = useCallback(
    entity => _values => {
      let data = {
        ..._values
      }

      setValues(v => ({
        ...v,
        [entity]: data
      }))
    },
    []
  )

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 17,
        i: 'profile_card',
        autoHeight: true
      },
      {
        x: 1,
        y: 0,
        w: 3,
        h: 30,
        i: 'details_card'
      },
      {
        x: 4,
        y: 0,
        w: 1,
        h: 10,
        i: 'tag_card',
        autoHeight: true
      }
    ],
    []
  )

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          item={isFetching ? {} : item}
          onEditSubmit={handleEditSubmit('profile')}
          layout={layout}
          isFetching={isFetching}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
          isAdd={!isEdit}
        />
      ),
      details_card: (
        <ProductDescriptionCard
          item={item}
          onEditSubmit={handleEditSubmit('detail')}
          layout={layout}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
        />
      ),
      tag_card: (
        <DetailTagCard
          entity={tagEntityType.product}
          values={item?.tag}
          onChange={handleEditSubmit('tag')}
          onlyEdit
          isSubmitClick={isSubmitClick}
          isResetClick={isResetClick}
        />
      )
    }),
    [
      isFetching,
      item,
      layout,
      handleEditSubmit,
      isResetClick,
      isSubmitClick,
      isEdit
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={`${isEdit ? 'Edit' : 'Add'} a Product`}
      headerClassName={classes.sideModalHeader}
      closeLink={closeLink || parseToAbsolutePath(routes.products[view])}
      footerLayout={
        <FormFooterLayout
          isUpdate={isEdit}
          onSubmit={() => setSubmitClick(true)}
          isPending={isSubmitting}
          onReset={() => setResetClick(true)}
        />
      }
    >
      <div className={classes.container}>
        <GridLayout
          positions={positions}
          cards={cards}
          disableDragging
          gridWidth={1800}
        />
      </div>
    </SideModal>
  )
}

export default AddEditProduct
