import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const contactApi = createAppApi(
  'contactReducer',
  {
    endpoints: builder => ({
      getContacts: builder.query({
        query: params => ({
          url: '/contact',
          method: 'GET',
          params
        })
      }),
      addContact: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { activity, ...data } = body
          const contactResult = await fetchWithBQ({
            url: `/contact`,
            method: 'POST',
            body: data
          })

          if (!contactResult.error) {
            await new Promise(async resolve => {
              if (activity.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: contactResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: contactResult.data }
          } else {
            return {
              error: contactResult.error
            }
          }
        }
      }),
      getContactById: builder.query({
        query: id => `/contact/${id}`,
        providesTags: [apiTags.contact, apiTags.contactAttachment]
      }),
      updateContact: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { id, data } = body
          const { activity, ...restData } = data
          const contactResult = await fetchWithBQ({
            url: `/contact/${id}`,
            method: 'POST',
            body: parsedToPutData(restData)
          })

          if (!contactResult.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: contactResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: contactResult.data }
          } else {
            return {
              error: contactResult.error
            }
          }
        },
        invalidatesTags: createSuccessInvalidator([apiTags.contact])
      }),
      deleteContact: builder.mutation({
        query: id => ({
          url: `/contact/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteContacts: builder.mutation({
        query: ({ ids }) => ({
          url: `/contact/bulk`,
          method: 'DELETE',
          params: {
            ids: ids.join(',')
          }
        })
      }),
      restoreContact: builder.mutation({
        query: id => ({
          url: `/contact/${id}/restore`,
          method: 'POST'
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/contact/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactAttachment])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/contact/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.contactAttachment])
      }),
      bulkUpdateContacts: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/contact/bulk`,
          method: 'PUT',
          params: {
            ids: ids.join(',')
          },
          body: data
        })
      })
    })
  },
  {
    tagTypes: [apiTags.contact, apiTags.contactAttachment]
  }
)

export const useGetContactsQuery = injectGetApiMiddleware(
  contactApi.useGetContactsQuery
)
export const useLazyGetContactsQuery = injectLazyGetApiMiddleware(
  contactApi.useLazyGetContactsQuery
)

export const {
  useAddContactMutation,
  useGetContactByIdQuery,
  useLazyGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useBulkDeleteContactsMutation,
  useRestoreContactMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useBulkUpdateContactsMutation
} = contactApi
