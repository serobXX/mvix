import apiTags from 'constants/apiTags.js'
import { createAppApi } from '../api.js'
import { createSuccessInvalidator } from 'utils/apiUtils.js'

export const dashboardApi = createAppApi(
  'dashboardReducer',
  {
    endpoints: builder => ({
      getDashboard: builder.query({
        query: () => '/dashboard',
        providesTags: [apiTags.dashboard]
      }),
      updateDashboardStats: builder.mutation({
        query: body => ({
          url: `/dashboard/updateStats`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.dashboard])
      })
    })
  },
  {
    tagTypes: [apiTags.dashboard]
  }
)

export const {
  useGetDashboardQuery,
  useLazyGetDashboardQuery,
  useUpdateDashboardStatsMutation
} = dashboardApi
