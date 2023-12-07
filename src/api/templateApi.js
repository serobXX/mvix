import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const templateApi = createAppApi(
  'templateReducer',
  {
    endpoints: builder => ({
      getTemplates: builder.query({
        query: params => ({
          url: '/template',
          method: 'GET',
          params
        })
      }),
      addTemplate: builder.mutation({
        query: body => ({
          url: `/template`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.template])
      }),
      getTemplateById: builder.query({
        query: id => `/template/${id}`,
        providesTags: [apiTags.template]
      }),
      updateTemplate: builder.mutation({
        query: ({ id, data }) => ({
          url: `/template/${id}`,
          method: 'POST',
          body: parsedToPutData(data)
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.template])
      }),
      deleteTemplate: builder.mutation({
        query: id => ({
          url: `/template/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.template])
      })
    })
  },
  {
    tagTypes: [apiTags.template]
  }
)

export const useGetTemplatesQuery = injectGetApiMiddleware(
  templateApi.useGetTemplatesQuery
)
export const useLazyGetTemplatesQuery = injectLazyGetApiMiddleware(
  templateApi.useLazyGetTemplatesQuery
)

export const {
  useAddTemplateMutation,
  useGetTemplateByIdQuery,
  useLazyGetTemplateByIdQuery,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation
} = templateApi
