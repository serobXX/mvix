import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const tagApi = createAppApi(
  'tagReducer',
  {
    endpoints: builder => ({
      getTags: builder.query({
        query: params => ({
          url: '/tag',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.tag]
      }),
      addTag: builder.mutation({
        query: body => ({
          url: `/tag`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.tag])
      }),
      getTagById: builder.query({
        query: id => `/tag/${id}`
      }),
      updateTag: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/tag/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.tag])
      }),
      deleteTag: builder.mutation({
        query: id => ({
          url: `/tag/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.tag])
      }),
      bulkDeleteTags: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/tag/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.tag])
      })
    })
  },
  {
    tagTypes: [apiTags.tag]
  }
)

export const useGetTagsQuery = injectGetApiMiddleware(tagApi.useGetTagsQuery)
export const useLazyGetTagsQuery = injectLazyGetApiMiddleware(
  tagApi.useLazyGetTagsQuery
)

export const {
  useAddTagMutation,
  useGetTagByIdQuery,
  useLazyGetTagByIdQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useBulkDeleteTagsMutation
} = tagApi
