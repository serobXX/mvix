import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const paymentProfileApi = createAppApi(
  'paymentProfileReducer',
  {
    endpoints: builder => ({
      getPaymentProfiles: builder.query({
        query: params => ({
          url: '/payment_profile',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.paymentProfile]
      }),
      addPaymentProfile: builder.mutation({
        query: body => ({
          url: `/payment_profile`,
          method: 'POST',
          body
        })
      }),
      getPaymentProfileById: builder.query({
        query: id => `/payment_profile/${id}`
      }),
      updatePaymentProfile: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/payment_profile/${id}`,
          method: 'PUT',
          body
        })
      }),
      deletePaymentProfile: builder.mutation({
        query: id => ({
          url: `/payment_profile/${id}`,
          method: 'DELETE'
        })
      })
    })
  },
  {
    tagTypes: [apiTags.paymentProfile]
  }
)

export const useGetPaymentProfilesQuery = injectGetApiMiddleware(
  paymentProfileApi.useGetPaymentProfilesQuery
)
export const useLazyGetPaymentProfilesQuery = injectLazyGetApiMiddleware(
  paymentProfileApi.useLazyGetPaymentProfilesQuery
)

export const {
  useAddPaymentProfileMutation,
  useGetPaymentProfileByIdQuery,
  useLazyGetPaymentProfileByIdQuery,
  useUpdatePaymentProfileMutation,
  useDeletePaymentProfileMutation
} = paymentProfileApi
