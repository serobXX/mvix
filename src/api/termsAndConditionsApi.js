import { createSuccessInvalidator } from 'utils/apiUtils.js'
import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'

export const termsAndConditionsApi = createAppApi(
  'termsAndConditionsReducer',
  {
    endpoints: builder => ({
      getTermsAndConditions: builder.query({
        query: params => ({
          url: '/terms_and_conditions',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.termsAndConditions]
      }),
      addTermsAndConditions: builder.mutation({
        query: body => ({
          url: `/terms_and_conditions`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.termsAndConditions])
      }),
      getTermsAndConditionsById: builder.query({
        query: id => `/terms_and_conditions/${id}`
      }),
      updateTermsAndConditions: builder.mutation({
        query: ({ id, data }) => ({
          url: `/terms_and_conditions/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.termsAndConditions])
      }),
      deleteTermsAndConditions: builder.mutation({
        query: id => ({
          url: `/terms_and_conditions/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.termsAndConditions])
      })
    })
  },
  {
    tagTypes: [apiTags.termsAndConditions]
  }
)

export const {
  useGetTermsAndConditionsQuery,
  useLazyGetTermsAndConditionsQuery,
  useAddTermsAndConditionsMutation,
  useGetTermsAndConditionsByIdQuery,
  useLazyGetTermsAndConditionsByIdQuery,
  useUpdateTermsAndConditionsMutation,
  useDeleteTermsAndConditionsMutation
} = termsAndConditionsApi
