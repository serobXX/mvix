import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const reminderApi = createAppApi(
  'reminderReducer',
  {
    endpoints: builder => ({
      getReminders: builder.query({
        query: params => ({
          url: '/reminders',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.reminders]
      }),
      addReminder: builder.mutation({
        query: body => ({
          url: `/reminders`,
          method: 'POST',
          body
        })
      }),
      getReminderById: builder.query({
        query: id => `/reminders/${id}`
      }),
      updateReminder: builder.mutation({
        query: ({ id, data }) => ({
          url: `/reminders/${id}`,
          method: 'PUT',
          body: data
        })
      }),
      deleteReminder: builder.mutation({
        query: id => ({
          url: `/reminders/${id}`,
          method: 'DELETE'
        })
      })
    })
  },
  {
    tagTypes: [apiTags.reminders]
  }
)

export const useGetRemindersQuery = injectGetApiMiddleware(
  reminderApi.useGetRemindersQuery
)
export const useLazyGetRemindersQuery = injectLazyGetApiMiddleware(
  reminderApi.useLazyGetRemindersQuery
)

export const {
  useAddReminderMutation,
  useGetReminderByIdQuery,
  useLazyGetReminderByIdQuery,
  useUpdateReminderMutation,
  useDeleteReminderMutation
} = reminderApi
