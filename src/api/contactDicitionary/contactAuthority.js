import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const contactAuthorityApi = createAppApi(
  'contactAuthorityReducer',
  {
    endpoints: builder => ({
      getContactAuthorities: builder.query({
        query: params => ({
          url: '/contactAuthority',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.contactAuthority]
      }),
      addContactAuthority: builder.mutation({
        query: body => ({
          url: `/contactAuthority`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactAuthority])
      }),
      getContactAuthorityById: builder.query({
        query: id => `/contactAuthority/${id}`
      }),
      updateContactAuthority: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/contactAuthority/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactAuthority])
      }),
      deleteContactAuthority: builder.mutation({
        query: id => ({
          url: `/contactAuthority/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactAuthority])
      }),
      bulkDeleteContactAuthorities: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/contactAuthority/${id}`,
                method: 'DELETE'
              })
            )
          )
          const isSuccess = result.find(({ error }) => !error)
          if (isSuccess) {
            return { data: {} }
          } else {
            return {
              error: result[0]?.error
            }
          }
        },
        invalidatesTags: createSuccessInvalidator([apiTags.contactAuthority])
      })
    })
  },
  {
    tagTypes: [apiTags.contactAuthority]
  }
)

export const useGetContactAuthoritiesQuery = injectGetApiMiddleware(
  contactAuthorityApi.useGetContactAuthoritiesQuery
)
export const useLazyGetContactAuthoritiesQuery = injectLazyGetApiMiddleware(
  contactAuthorityApi.useLazyGetContactAuthoritiesQuery
)

export const {
  useAddContactAuthorityMutation,
  useGetContactAuthorityByIdQuery,
  useLazyGetContactAuthorityByIdQuery,
  useUpdateContactAuthorityMutation,
  useDeleteContactAuthorityMutation,
  useBulkDeleteContactAuthoritiesMutation
} = contactAuthorityApi
