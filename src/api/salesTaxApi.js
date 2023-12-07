import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const salesTaxApi = createAppApi(
  'salesTaxReducer',
  {
    endpoints: builder => ({
      getSalesTaxes: builder.query({
        query: params => ({
          url: '/sales_tax',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.salesTax]
      }),
      addSalesTax: builder.mutation({
        query: body => ({
          url: `/sales_tax`,
          method: 'POST',
          body
        })
      }),
      getSalesTaxById: builder.query({
        query: id => `/sales_tax/${id}`
      }),
      updateSalesTax: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/sales_tax/${id}`,
          method: 'PUT',
          body
        })
      }),
      deleteSalesTax: builder.mutation({
        query: id => ({
          url: `/sales_tax/${id}`,
          method: 'DELETE'
        })
      })
    })
  },
  {
    tagTypes: [apiTags.salesTax]
  }
)

export const useGetSalesTaxesQuery = injectGetApiMiddleware(
  salesTaxApi.useGetSalesTaxesQuery
)
export const useLazyGetSalesTaxesQuery = injectLazyGetApiMiddleware(
  salesTaxApi.useLazyGetSalesTaxesQuery
)

export const {
  useAddSalesTaxMutation,
  useGetSalesTaxByIdQuery,
  useLazyGetSalesTaxByIdQuery,
  useUpdateSalesTaxMutation,
  useDeleteSalesTaxMutation
} = salesTaxApi
