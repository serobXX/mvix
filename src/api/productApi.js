import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const productApi = createAppApi(
  'productReducer',
  {
    endpoints: builder => ({
      getProducts: builder.query({
        query: params => ({
          url: '/product',
          method: 'GET',
          params
        })
      }),
      addProduct: builder.mutation({
        query: body => ({
          url: `/product`,
          method: 'POST',
          body
        })
      }),
      getProductById: builder.query({
        query: id => `/product/${id}`,
        providesTags: [apiTags.product, apiTags.productAttachment]
      }),
      updateProduct: builder.mutation({
        query: ({ id, data }) => ({
          url: `/product/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.product])
      }),
      deleteProduct: builder.mutation({
        query: id => ({
          url: `/product/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteProducts: builder.mutation({
        query: ({ ids }) => ({
          url: `/product/bulk`,
          method: 'DELETE',
          params: {
            ids: ids.join(',')
          }
        })
      }),
      bulkUpdateProducts: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/product/bulk`,
          method: 'PUT',
          params: {
            ids: ids.join(',')
          },
          body: data
        })
      }),
      restoreProduct: builder.mutation({
        query: id => ({
          url: `/product/${id}/restore`,
          method: 'POST'
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/product/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.productAttachment])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/product/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.productAttachment])
      })
    })
  },
  {
    tagTypes: [apiTags.product, apiTags.productAttachment]
  }
)

export const useGetProductsQuery = injectGetApiMiddleware(
  productApi.useGetProductsQuery
)
export const useLazyGetProductsQuery = injectLazyGetApiMiddleware(
  productApi.useLazyGetProductsQuery
)

export const {
  useAddProductMutation,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateProductsMutation,
  useRestoreProductMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation
} = productApi
