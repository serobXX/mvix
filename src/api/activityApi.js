import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const activityApi = createAppApi(
  'activityReducer',
  {
    endpoints: builder => ({
      getActivities: builder.query({
        query: params => ({
          url: '/activity',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.activity]
      }),
      addActivity: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { activity, ...data } = body
          const result = await fetchWithBQ({
            url: `/activity`,
            method: 'POST',
            body: data
          })

          if (!result.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const res = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity
                  }
                })
                resolve(res)
              } else resolve()
            })

            return { data: result.data }
          } else {
            return {
              error: result.error
            }
          }
        }
      }),
      getActivityById: builder.query({
        query: id => `/activity/${id}`
      }),
      updateActivity: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { id, data } = body
          const { activity, ...restData } = data
          const result = await fetchWithBQ({
            url: `/activity/${id}`,
            method: 'PUT',
            body: restData
          })

          if (!result.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const res = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity
                  }
                })
                resolve(res)
              } else resolve()
            })

            return { data: result.data }
          } else {
            return {
              error: result.error
            }
          }
        }
      }),
      deleteActivity: builder.mutation({
        query: id => ({
          url: `/activity/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteActivities: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/activity/${id}`,
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
        }
      })
    })
  },
  {
    activityTypes: [apiTags.activity]
  }
)

export const useGetActivitiesQuery = injectGetApiMiddleware(
  activityApi.useGetActivitiesQuery
)
export const useLazyGetActivitiesQuery = injectLazyGetApiMiddleware(
  activityApi.useLazyGetActivitiesQuery
)

export const {
  useAddActivityMutation,
  useGetActivityByIdQuery,
  useLazyGetActivityByIdQuery,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useBulkDeleteActivitiesMutation
} = activityApi
