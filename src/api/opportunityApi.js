import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const opportunityApi = createAppApi(
  'opportunityReducer',
  {
    endpoints: builder => ({
      getOpportunities: builder.query({
        query: params => ({
          url: '/opportunity',
          method: 'GET',
          params
        })
      }),
      addOpportunity: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { activity, ...data } = body
          const opportunityResult = await fetchWithBQ({
            url: `/opportunity`,
            method: 'POST',
            body: data
          })

          if (!opportunityResult.error) {
            await new Promise(async resolve => {
              if (activity.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: opportunityResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: opportunityResult.data }
          } else {
            return {
              error: opportunityResult.error
            }
          }
        }
      }),
      getOpportunityById: builder.query({
        query: id => `/opportunity/${id}`,
        providesTags: [apiTags.opportunity, apiTags.opportunityAttachment]
      }),
      updateOpportunity: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { id, data, successMessage } = body
          const { activity, ...restData } = data
          const opportunityResult = await fetchWithBQ({
            url: `/opportunity/${id}`,
            method: 'PUT',
            body: restData
          })

          if (!opportunityResult.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: opportunityResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: { ...opportunityResult.data, successMessage } }
          } else {
            return {
              error: opportunityResult.error
            }
          }
        },
        invalidatesTags: createSuccessInvalidator([apiTags.opportunity])
      }),
      deleteOpportunity: builder.mutation({
        query: id => ({
          url: `/opportunity/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteOpportunities: builder.mutation({
        query: ({ ids }) => ({
          url: `/opportunity/bulk`,
          method: 'DELETE',
          params: {
            ids: ids.join(',')
          }
        })
      }),
      bulkUpdateOpportunities: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/opportunity/bulk`,
          method: 'PUT',
          params: {
            ids: ids.join(',')
          },
          body: data
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/opportunity/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([
          apiTags.opportunityAttachment
        ])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/opportunity/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([
          apiTags.opportunityAttachment
        ])
      }),
      getOpportunityProposals: builder.query({
        query: opportunityId => ({
          url: `/opportunity/${opportunityId}/proposal`,
          method: 'GET'
        }),
        providesTags: [apiTags.proposal]
      }),
      updateOpportunityProposal: builder.mutation({
        query: ({ id, data }) => ({
          url: `/proposal/${id}`,
          method: 'PUT',
          body: {
            ...data
          }
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.proposal])
      }),
      getProposalStats: builder.query({
        query: opportunityId => ({
          url: `/opportunity/${opportunityId}/proposalStats`,
          method: 'GET'
        }),
        providesTags: [apiTags.proposal]
      })
    })
  },
  {
    tagTypes: [
      apiTags.opportunity,
      apiTags.opportunityAttachment,
      apiTags.proposal
    ]
  }
)

export const useGetOpportunitiesQuery = injectGetApiMiddleware(
  opportunityApi.useGetOpportunitiesQuery
)
export const useLazyGetOpportunitiesQuery = injectLazyGetApiMiddleware(
  opportunityApi.useLazyGetOpportunitiesQuery
)

export const {
  useAddOpportunityMutation,
  useGetOpportunityByIdQuery,
  useLazyGetOpportunityByIdQuery,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
  useBulkDeleteOpportunitiesMutation,
  useBulkUpdateOpportunitiesMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetOpportunityProposalsQuery,
  useUpdateOpportunityProposalMutation,
  useGetProposalStatsQuery
} = opportunityApi
