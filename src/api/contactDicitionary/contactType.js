import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const contactTypeApi = createAppApi(
  'contactTypeReducer',
  {
    endpoints: builder => ({
      getContactTypes: builder.query({
        query: params => ({
          url: '/contactType',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.contactType]
      }),
      addContactType: builder.mutation({
        query: body => ({
          url: `/contactType`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactType])
      }),
      getContactTypeById: builder.query({
        query: id => `/contactType/${id}`
      }),
      updateContactType: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/contactType/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactType])
      }),
      deleteContactType: builder.mutation({
        query: id => ({
          url: `/contactType/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactType])
      }),
      bulkDeleteContactTypes: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/contactType/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.contactType])
      })
    })
  },
  {
    tagTypes: [apiTags.contactType]
  }
)

export const useGetContactTypesQuery = injectGetApiMiddleware(
  contactTypeApi.useGetContactTypesQuery
)
export const useLazyGetContactTypesQuery = injectLazyGetApiMiddleware(
  contactTypeApi.useLazyGetContactTypesQuery
)

export const {
  useAddContactTypeMutation,
  useGetContactTypeByIdQuery,
  useLazyGetContactTypeByIdQuery,
  useUpdateContactTypeMutation,
  useDeleteContactTypeMutation,
  useBulkDeleteContactTypesMutation
} = contactTypeApi
