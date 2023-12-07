import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const paymentApi = createAppApi(
  'paymentReducer',
  {
    endpoints: builder => ({
      getPayments: builder.query({
        query: params => ({
          url: '/payment',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.payment]
      }),
      addPayment: builder.mutation({
        query: body => ({
          url: `/payment`,
          method: 'POST',
          body
        })
      }),
      getPaymentById: builder.query({
        query: id => `/payment/${id}`
      }),
      updatePayment: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/payment/${id}`,
          method: 'PUT',
          body
        })
      })
    })
  },
  {
    tagTypes: [apiTags.payment]
  }
)

export const useGetPaymentsQuery = injectGetApiMiddleware(
  paymentApi.useGetPaymentsQuery
)
export const useLazyGetPaymentsQuery = injectLazyGetApiMiddleware(
  paymentApi.useLazyGetPaymentsQuery
)

export const {
  useAddPaymentMutation,
  useGetPaymentByIdQuery,
  useLazyGetPaymentByIdQuery,
  useUpdatePaymentMutation
} = paymentApi
