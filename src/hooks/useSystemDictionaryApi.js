import {
  useAddIndustryMutation,
  useBulkDeleteIndustriesMutation,
  useDeleteIndustryMutation,
  useLazyGetIndustriesQuery,
  useLazyGetIndustryByIdQuery,
  useUpdateIndustryMutation
} from 'api/leadDictionary/industry'
import {
  useAddLeadSourceMutation,
  useBulkDeleteLeadSourcesMutation,
  useDeleteLeadSourceMutation,
  useLazyGetLeadSourceByIdQuery,
  useLazyGetLeadSourcesQuery,
  useUpdateLeadSourceMutation
} from 'api/leadDictionary/leadSource'
import {
  useAddLeadStatusMutation,
  useBulkDeleteLeadStatusMutation,
  useDeleteLeadStatusMutation,
  useLazyGetLeadStatusByIdQuery,
  useLazyGetLeadStatusQuery,
  useUpdateLeadStatusMutation
} from 'api/leadDictionary/leadStatus'
import {
  useAddLeadTypeMutation,
  useBulkDeleteLeadTypesMutation,
  useDeleteLeadTypeMutation,
  useLazyGetLeadTypeByIdQuery,
  useLazyGetLeadTypesQuery,
  useUpdateLeadTypeMutation
} from 'api/leadDictionary/leadType'
import {
  useAddSolutionMutation,
  useBulkDeleteSolutionsMutation,
  useDeleteSolutionMutation,
  useLazyGetSolutionByIdQuery,
  useLazyGetSolutionsQuery,
  useUpdateSolutionMutation
} from 'api/leadDictionary/solution'
import {
  useAddContactAuthorityMutation,
  useBulkDeleteContactAuthoritiesMutation,
  useDeleteContactAuthorityMutation,
  useLazyGetContactAuthoritiesQuery,
  useLazyGetContactAuthorityByIdQuery,
  useUpdateContactAuthorityMutation
} from 'api/contactDicitionary/contactAuthority'
import {
  useAddContactTypeMutation,
  useBulkDeleteContactTypesMutation,
  useDeleteContactTypeMutation,
  useLazyGetContactTypeByIdQuery,
  useLazyGetContactTypesQuery,
  useUpdateContactTypeMutation
} from 'api/contactDicitionary/contactType'
import apiCacheKeys from 'constants/apiCacheKeys'
import { subtabNames } from 'constants/systemDictionary'
import {
  useAddPartnershipMutation,
  useBulkDeletePartnershipMutation,
  useDeletePartnershipMutation,
  useLazyGetPartnershipByIdQuery,
  useLazyGetPartnershipQuery,
  useUpdatePartnershipMutation
} from 'api/accountPartnershipApi'
import {
  useAddStageMutation,
  useBulkDeleteStagesMutation,
  useDeleteStageMutation,
  useLazyGetStageByIdQuery,
  useLazyGetStagesQuery,
  useUpdateStageMutation
} from 'api/opportunityStageApi'
import {
  useAddSubjectLineMutation,
  useBulkDeleteSubjectLineMutation,
  useDeleteSubjectLineMutation,
  useLazyGetSubjectLineByIdQuery,
  useLazyGetSubjectLinesQuery,
  useUpdateSubjectLineMutation
} from 'api/subjectLineApi'

const parseData = (
  items = {},
  post = {},
  put = {},
  item = {},
  del = {},
  getItems = f => f,
  getItemById = f => f,
  addItem = f => f,
  updateItem = f => f,
  deleteItem = f => f,
  bulkDeleteItems = f => f
) => ({
  items,
  post,
  put,
  item,
  del,
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  bulkDeleteItems
})

const useSystemDictionaryApi = activeTab => {
  // Industry
  const [getIndustries, itemsIndustry] = useLazyGetIndustriesQuery()
  const [getIndustryById, itemIndustry] = useLazyGetIndustryByIdQuery()
  const [addIndustry, postIndustry] = useAddIndustryMutation({
    fixedCacheKey: apiCacheKeys.leadIndustry.add
  })
  const [updateIndustry, putIndustry] = useUpdateIndustryMutation({
    fixedCacheKey: apiCacheKeys.leadIndustry.update
  })
  const [deleteIndustry, delIndustry] = useDeleteIndustryMutation({
    fixedCacheKey: apiCacheKeys.leadIndustry.delete
  })
  const [bulkDeleteIndustry] = useBulkDeleteIndustriesMutation({
    fixedCacheKey: apiCacheKeys.leadIndustry.delete
  })

  // Lead Source
  const [getLeadSources, itemsLeadSource] = useLazyGetLeadSourcesQuery()
  const [getLeadSourceById, itemLeadSource] = useLazyGetLeadSourceByIdQuery()
  const [addLeadSource, postLeadSource] = useAddLeadSourceMutation({
    fixedCacheKey: apiCacheKeys.leadSource.add
  })
  const [updateLeadSource, putLeadSource] = useUpdateLeadSourceMutation({
    fixedCacheKey: apiCacheKeys.leadSource.update
  })
  const [deleteLeadSource, delLeadSource] = useDeleteLeadSourceMutation({
    fixedCacheKey: apiCacheKeys.leadSource.delete
  })
  const [bulkDeleteLeadSources] = useBulkDeleteLeadSourcesMutation({
    fixedCacheKey: apiCacheKeys.leadSource.delete
  })

  // Lead Status
  const [getLeadStatus, itemsLeadStatus] = useLazyGetLeadStatusQuery()
  const [getLeadStatusById, itemLeadStatus] = useLazyGetLeadStatusByIdQuery()
  const [addLeadStatus, postLeadStatus] = useAddLeadStatusMutation({
    fixedCacheKey: apiCacheKeys.leadStatus.add
  })
  const [updateLeadStatus, putLeadStatus] = useUpdateLeadStatusMutation({
    fixedCacheKey: apiCacheKeys.leadStatus.update
  })
  const [deleteLeadStatus, delLeadStatus] = useDeleteLeadStatusMutation({
    fixedCacheKey: apiCacheKeys.leadStatus.delete
  })
  const [bulkDeleteLeadStatus] = useBulkDeleteLeadStatusMutation({
    fixedCacheKey: apiCacheKeys.leadStatus.delete
  })

  // Lead Type
  const [getLeadTypes, itemsLeadType] = useLazyGetLeadTypesQuery()
  const [getLeadTypeById, itemLeadType] = useLazyGetLeadTypeByIdQuery()
  const [addLeadType, postLeadType] = useAddLeadTypeMutation({
    fixedCacheKey: apiCacheKeys.leadType.add
  })
  const [updateLeadType, putLeadType] = useUpdateLeadTypeMutation({
    fixedCacheKey: apiCacheKeys.leadType.update
  })
  const [deleteLeadType, delLeadType] = useDeleteLeadTypeMutation({
    fixedCacheKey: apiCacheKeys.leadType.delete
  })
  const [bulkDeleteLeadTypes] = useBulkDeleteLeadTypesMutation({
    fixedCacheKey: apiCacheKeys.leadType.delete
  })

  // Solution
  const [getSolutions, itemsSolution] = useLazyGetSolutionsQuery()
  const [getSolutionById, itemSolution] = useLazyGetSolutionByIdQuery()
  const [addSolution, postSolution] = useAddSolutionMutation({
    fixedCacheKey: apiCacheKeys.leadSolution.add
  })
  const [updateSolution, putSolution] = useUpdateSolutionMutation({
    fixedCacheKey: apiCacheKeys.leadSolution.update
  })
  const [deleteSolution, delSolution] = useDeleteSolutionMutation({
    fixedCacheKey: apiCacheKeys.leadSolution.delete
  })
  const [bulkDeleteSolutions] = useBulkDeleteSolutionsMutation({
    fixedCacheKey: apiCacheKeys.leadSolution.delete
  })

  // Contact Type
  const [getContactTypes, itemsContactType] = useLazyGetContactTypesQuery()
  const [getContactTypeById, itemContactType] = useLazyGetContactTypeByIdQuery()
  const [addContactType, postContactType] = useAddContactTypeMutation({
    fixedCacheKey: apiCacheKeys.contactType.add
  })
  const [updateContactType, putContactType] = useUpdateContactTypeMutation({
    fixedCacheKey: apiCacheKeys.contactType.update
  })
  const [deleteContactType, delContactType] = useDeleteContactTypeMutation({
    fixedCacheKey: apiCacheKeys.contactType.delete
  })
  const [bulkDeleteContactType] = useBulkDeleteContactTypesMutation({
    fixedCacheKey: apiCacheKeys.contactType.delete
  })

  // Contact Authority
  const [getContactAuthorities, itemsContactAuthority] =
    useLazyGetContactAuthoritiesQuery()
  const [getContactAuthorityById, itemContactAuthority] =
    useLazyGetContactAuthorityByIdQuery()
  const [addContactAuthority, postContactAuthority] =
    useAddContactAuthorityMutation({
      fixedCacheKey: apiCacheKeys.contactAuthority.add
    })
  const [updateContactAuthority, putContactAuthority] =
    useUpdateContactAuthorityMutation({
      fixedCacheKey: apiCacheKeys.contactAuthority.update
    })
  const [deleteContactAuthority, delContactAuthority] =
    useDeleteContactAuthorityMutation({
      fixedCacheKey: apiCacheKeys.contactAuthority.delete
    })
  const [bulkDeleteContactAuthorities] =
    useBulkDeleteContactAuthoritiesMutation({
      fixedCacheKey: apiCacheKeys.contactAuthority.delete
    })

  // Account Partnership
  const [getPartnership, itemsPartnership] = useLazyGetPartnershipQuery()
  const [getPartnershipById, itemPartnership] = useLazyGetPartnershipByIdQuery()
  const [addPartnership, postPartnership] = useAddPartnershipMutation({
    fixedCacheKey: apiCacheKeys.accountPartnership.add
  })
  const [updatePartnership, putPartnership] = useUpdatePartnershipMutation({
    fixedCacheKey: apiCacheKeys.accountPartnership.update
  })
  const [deletePartnership, delPartnership] = useDeletePartnershipMutation({
    fixedCacheKey: apiCacheKeys.accountPartnership.delete
  })
  const [bulkDeletePartnership] = useBulkDeletePartnershipMutation({
    fixedCacheKey: apiCacheKeys.accountPartnership.delete
  })

  // Opportunity Stage
  const [getStages, itemsStage] = useLazyGetStagesQuery()
  const [getStageById, itemStage] = useLazyGetStageByIdQuery()
  const [addStage, postStage] = useAddStageMutation({
    fixedCacheKey: apiCacheKeys.opportunityStage.add
  })
  const [updateStage, putStage] = useUpdateStageMutation({
    fixedCacheKey: apiCacheKeys.opportunityStage.update
  })
  const [deleteStage, delStage] = useDeleteStageMutation({
    fixedCacheKey: apiCacheKeys.opportunityStage.delete
  })
  const [bulkDeleteStages] = useBulkDeleteStagesMutation({
    fixedCacheKey: apiCacheKeys.opportunityStage.delete
  })

  // Subject Line
  const [getSubjectLines, itemsSubjectLine] = useLazyGetSubjectLinesQuery()
  const [getSubjectLineById, itemSubjectLine] = useLazyGetSubjectLineByIdQuery()
  const [addSubjectLine, postSubjectLine] = useAddSubjectLineMutation({
    fixedCacheKey: apiCacheKeys.subjectLine.add
  })
  const [updateSubjectLine, putSubjectLine] = useUpdateSubjectLineMutation({
    fixedCacheKey: apiCacheKeys.subjectLine.update
  })
  const [deleteSubjectLine, delSubjectLine] = useDeleteSubjectLineMutation({
    fixedCacheKey: apiCacheKeys.subjectLine.delete
  })
  const [bulkDeleteSubjectLines] = useBulkDeleteSubjectLineMutation({
    fixedCacheKey: apiCacheKeys.subjectLine.delete
  })

  const returnData = () => {
    switch (activeTab) {
      case subtabNames.industry:
        return parseData(
          itemsIndustry,
          postIndustry,
          putIndustry,
          itemIndustry,
          delIndustry,
          getIndustries,
          getIndustryById,
          addIndustry,
          updateIndustry,
          deleteIndustry,
          bulkDeleteIndustry
        )
      case subtabNames.source:
        return parseData(
          itemsLeadSource,
          postLeadSource,
          putLeadSource,
          itemLeadSource,
          delLeadSource,
          getLeadSources,
          getLeadSourceById,
          addLeadSource,
          updateLeadSource,
          deleteLeadSource,
          bulkDeleteLeadSources
        )
      case subtabNames.leadStatus:
        return parseData(
          itemsLeadStatus,
          postLeadStatus,
          putLeadStatus,
          itemLeadStatus,
          delLeadStatus,
          getLeadStatus,
          getLeadStatusById,
          addLeadStatus,
          updateLeadStatus,
          deleteLeadStatus,
          bulkDeleteLeadStatus
        )
      case subtabNames.leadType:
        return parseData(
          itemsLeadType,
          postLeadType,
          putLeadType,
          itemLeadType,
          delLeadType,
          getLeadTypes,
          getLeadTypeById,
          addLeadType,
          updateLeadType,
          deleteLeadType,
          bulkDeleteLeadTypes
        )
      case subtabNames.solution:
        return parseData(
          itemsSolution,
          postSolution,
          putSolution,
          itemSolution,
          delSolution,
          getSolutions,
          getSolutionById,
          addSolution,
          updateSolution,
          deleteSolution,
          bulkDeleteSolutions
        )
      case subtabNames.contactType:
        return parseData(
          itemsContactType,
          postContactType,
          putContactType,
          itemContactType,
          delContactType,
          getContactTypes,
          getContactTypeById,
          addContactType,
          updateContactType,
          deleteContactType,
          bulkDeleteContactType
        )
      case subtabNames.authority:
        return parseData(
          itemsContactAuthority,
          postContactAuthority,
          putContactAuthority,
          itemContactAuthority,
          delContactAuthority,
          getContactAuthorities,
          getContactAuthorityById,
          addContactAuthority,
          updateContactAuthority,
          deleteContactAuthority,
          bulkDeleteContactAuthorities
        )
      case subtabNames.partnership:
        return parseData(
          itemsPartnership,
          postPartnership,
          putPartnership,
          itemPartnership,
          delPartnership,
          getPartnership,
          getPartnershipById,
          addPartnership,
          updatePartnership,
          deletePartnership,
          bulkDeletePartnership
        )
      case subtabNames.stages:
        return parseData(
          itemsStage,
          postStage,
          putStage,
          itemStage,
          delStage,
          getStages,
          getStageById,
          addStage,
          updateStage,
          deleteStage,
          bulkDeleteStages
        )
      case subtabNames.subjectLine:
        return parseData(
          itemsSubjectLine,
          postSubjectLine,
          putSubjectLine,
          itemSubjectLine,
          delSubjectLine,
          getSubjectLines,
          getSubjectLineById,
          addSubjectLine,
          updateSubjectLine,
          deleteSubjectLine,
          bulkDeleteSubjectLines
        )
      default:
        return parseData()
    }
  }

  return returnData()
}

export default useSystemDictionaryApi
