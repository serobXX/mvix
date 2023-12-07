import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const leadApi = createAppApi(
  'leadReducer',
  {
    endpoints: builder => ({
      getLeads: builder.query({
        query: params => ({
          url: '/lead',
          method: 'GET',
          params
        })
      }),
      addLead: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { activity, ...data } = body
          const leadResult = await fetchWithBQ({
            url: `/lead`,
            method: 'POST',
            body: data
          })

          if (!leadResult.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: leadResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: leadResult.data }
          } else {
            return {
              error: leadResult.error
            }
          }
        }
      }),
      getLeadById: builder.query({
        query: id => `/lead/${id}`,
        providesTags: [apiTags.leadAttachment, apiTags.lead]
      }),
      updateLead: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { id, data } = body
          const { activity, ...restData } = data
          const leadResult = await fetchWithBQ({
            url: `/lead/${id}`,
            method: 'POST',
            body: parsedToPutData(restData)
          })

          if (!leadResult.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: leadResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: leadResult.data }
          } else {
            return {
              error: leadResult.error
            }
          }
        },
        invalidatesTags: createSuccessInvalidator([apiTags.lead])
      }),
      deleteLead: builder.mutation({
        query: id => ({
          url: `/lead/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteLeads: builder.mutation({
        query: ({ ids }) => ({
          url: `/lead/bulk`,
          method: 'DELETE',
          params: {
            ids: ids.join(',')
          }
        })
      }),
      convertToContactAccount: builder.mutation({
        query: ({ id, body }) => ({
          url: `/lead/${id}/convertToContactAccount`,
          method: 'POST',
          body
        })
      }),
      restoreLead: builder.mutation({
        query: id => ({
          url: `/lead/${id}/restore`,
          method: 'POST'
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/lead/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadAttachment])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/lead/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadAttachment])
      }),
      bulkUpdateLeads: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/lead/bulk`,
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
    tagTypes: [apiTags.lead, apiTags.leadAttachment]
  }
)

export const useGetLeadsQuery = injectGetApiMiddleware(leadApi.useGetLeadsQuery)
export const useLazyGetLeadsQuery = injectLazyGetApiMiddleware(
  leadApi.useLazyGetLeadsQuery
)

export const {
  useAddLeadMutation,
  useGetLeadByIdQuery,
  useLazyGetLeadByIdQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useBulkDeleteLeadsMutation,
  useConvertToContactAccountMutation,
  useRestoreLeadMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useBulkUpdateLeadsMutation
} = leadApi
