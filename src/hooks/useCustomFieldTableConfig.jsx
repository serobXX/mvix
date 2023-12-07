import { useCallback, useMemo } from 'react'

import {
  customFieldLookupType,
  customFieldTableEditors,
  customFieldTableFilters,
  customFieldTypes,
  entityValues
} from 'constants/customFields'
import {
  StatusColumn,
  TagColumn,
  TextWithTooltipColumn
} from 'components/tableColumns'
import { _get, _isEqual } from 'utils/lodash'
import {
  getLookupOptions,
  getTitleBasedOnEntity,
  sortDataBySortOrder
} from 'utils/customFieldUtils'
import {
  CheckboxSwitcher,
  FormControlAutocomplete,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect,
  FormControlSelectTag,
  FormControlTelInput
} from 'components/formControls'
import {
  filterStatusOptions,
  statusReturnValues,
  statusOptions
} from 'constants/commonOptions'
import { chipObjToTag, convertArr, tagToChipObj } from 'utils/select'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import useUserPermissionGroupsByType from './useUserPermissionGroupsByType'
import { permissionTypes } from 'constants/permissionGroups'
import { getCustomFieldPermissionByGroup } from 'utils/permissionsUtils'
import customFieldNames from 'constants/customFieldNames'
import useUser from './useUser'
import { ADMINISTRATOR } from 'constants/roleConstants'
import { createdAndUpdatedColumns } from 'utils/libraryUtils'
import { customFieldTypeToFilterType } from 'constants/filter'

const staticHideFields = [
  customFieldNames.apolloId,
  customFieldNames.apolloContactId,
  customFieldNames.apolloOrganizationId,
  customFieldNames.githubUrl,
  customFieldNames.twitterUrl,
  customFieldNames.facebookUrl,
  customFieldNames.linkedinUrl,
  'blog_url',
  'angellist_url',
  'logo_url',
  'crunchbase_url',
  'seo_description',
  'total_funding',
  'latest_funding_round_date',
  'latest_funding_stage',
  'account_id'
]

const useCustomFieldTableConfig = ({
  name = 'customFields',
  initialColumns,
  initialFilters,
  initialEditors,
  layout,
  appendValueBeforeOn,
  hideTagField = false,
  hideStatusField = false,
  tagEntityType,
  getFilterOptions,
  permissionGroupName,
  hideColumnsWithFilter,
  hideColumnsOnly,
  getColumnDef
}) => {
  const { role } = useUser()
  const readGroups = useUserPermissionGroupsByType(permissionTypes.read)
  const updateGroups = useUserPermissionGroupsByType(permissionTypes.update)

  const filteredFields = useMemo(() => {
    return sortDataBySortOrder(
      (layout || []).filter(
        ({ type, name, code }) =>
          ![
            customFieldTypes.tab,
            customFieldTypes.container,
            customFieldTypes.textarea,
            customFieldTypes.json,
            'internal'
          ].includes(type) &&
          ![...(hideColumnsWithFilter || []), ...staticHideFields].includes(
            code
          ) &&
          readGroups.includes(
            getCustomFieldPermissionByGroup(permissionGroupName, name)
          )
      )
    )
  }, [layout, permissionGroupName, readGroups, hideColumnsWithFilter])

  const columns = useMemo(
    () =>
      [
        ...filteredFields
          .filter(({ code }) => !(hideColumnsOnly || []).includes(code))
          .map(({ name: label, code, type, lookupType, width, sortOrder }) => ({
            headerName: label,
            field: code,
            width: width * 135,
            type: 'centerAligned',
            cellRenderer: TextWithTooltipColumn,
            ...(getColumnDef
              ? getColumnDef({
                  name: label,
                  code,
                  type,
                  lookupType,
                  width,
                  sortOrder
                })
              : {}),
            cellRendererParams: {
              isPhoneField: type === customFieldTypes.phone,
              to: data => {
                if (
                  type === customFieldTypes.email &&
                  !!_get(data, `${name}.${code}`)
                ) {
                  return `mailto:${_get(data, `${name}.${code}`)}`
                }
                return null
              },
              getValue: data => {
                let value = _get(data, `${name}.${code}`)
                if (
                  Array.isArray(value) &&
                  [
                    customFieldTypes.multiselect,
                    customFieldTypes.lookup
                  ].includes(type)
                ) {
                  value = value.map(({ name }) => name).join(', ')
                } else if (Array.isArray(value)) {
                  value = value?.join(', ')
                } else if (
                  typeof value === 'object' &&
                  type === customFieldTypes.select
                ) {
                  return value?.name
                } else if (
                  typeof value === 'object' &&
                  type === customFieldTypes.lookup
                ) {
                  if (lookupType === customFieldLookupType.user) {
                    value = value
                      ? `${value.first_name} ${value.last_name}`
                      : ''
                  } else if (lookupType === customFieldLookupType.account) {
                    value = getTitleBasedOnEntity(entityValues.account, value)
                  } else if (lookupType === customFieldLookupType.opportunity) {
                    value = getTitleBasedOnEntity(
                      entityValues.opportunity,
                      value
                    )
                  } else if (lookupType === customFieldLookupType.contact) {
                    value = getTitleBasedOnEntity(entityValues.contact, value)
                  } else {
                    value = value ? value?.name : ''
                  }
                } else if (type === customFieldTypes.bool) {
                  value = value ? 'Enabled' : 'Disabled'
                }
                if (appendValueBeforeOn?.length) {
                  const field = appendValueBeforeOn.find(
                    item => item.code === code
                  )
                  if (field) {
                    value = `${data[field.name] || ''} ${value || ''}`
                  }
                }
                return value
              },
              ...((getColumnDef &&
                getColumnDef({
                  name: label,
                  code,
                  type,
                  lookupType,
                  width,
                  sortOrder
                })?.cellRendererParams) ||
                {})
            },
            positionIndex: sortOrder
          })),
        ...(hideStatusField
          ? []
          : [
              {
                headerName: 'Record Status',
                field: 'status',
                width: 100,
                type: 'centerAligned',
                cellRenderer: StatusColumn
              }
            ]),
        ...(hideTagField
          ? []
          : [
              {
                field: 'tag',
                headerName: 'Tags',
                width: 200,
                type: 'centerAligned',
                cellRenderer: TagColumn,
                cellRendererParams: {
                  maxWidth: 100,
                  getValue: data => data.tag
                }
              }
            ]),
        ...(initialColumns || []).reverse(),
        ...createdAndUpdatedColumns
      ].sort((a, b) =>
        (a.positionIndex || 999) > (b.positionIndex || 999) ? 1 : -1
      ),
    [
      initialColumns,
      filteredFields,
      name,
      hideStatusField,
      hideTagField,
      appendValueBeforeOn,
      hideColumnsOnly,
      getColumnDef
    ]
  )

  const getFilterField = useCallback(
    ({ type, code, options, lookupType }) => {
      if (type === customFieldTypes.lookup) {
        return {
          field: FormControlAutocomplete,
          props: {
            getOptions: getLookupOptions(lookupType),
            isCreatable: false
          }
        }
      } else if (
        [customFieldTypes.select, customFieldTypes.multiselect].includes(type)
      ) {
        options = sortDataBySortOrder([...(options || [])]).map(
          ({ id, name }) => ({ label: name, value: id })
        )
        return {
          field: FormControlReactSelect,
          props: {
            options: options,
            isCreatable: false
          }
        }
      } else if (getFilterOptions) {
        return {
          field: FormControlAutocomplete,
          props: {
            getOptions: getFilterOptions
              ? async (value, params) => {
                  const data = await getFilterOptions(code)(value, params)
                  return {
                    ...data,
                    ...(type === customFieldTypes.phone
                      ? {
                          data: data.data.map(({ label, value }) => ({
                            value,
                            label: label.startsWith('+') ? label : `+1 ${label}`
                          }))
                        }
                      : {})
                  }
                }
              : null
          }
        }
      } else if (type === customFieldTypes.phone) {
        return {
          field: FormControlTelInput,
          props: {
            hideDropdown: true
          }
        }
      } else if (type === customFieldTypes.number) {
        return {
          field: FormControlNumericInput
        }
      } else {
        return {
          field: FormControlInput
        }
      }
    },
    [getFilterOptions]
  )

  const filters = useMemo(
    () => [
      ...filteredFields
        .filter(({ type }) => customFieldTableFilters.includes(type))
        .map(({ type, lookupType, options, code }) => {
          const { field, props = {} } =
            getFilterField({ type, code, lookupType, options }) || {}
          return {
            field: code,
            filter: field,
            filterProps: {
              filterType: customFieldTypeToFilterType[type],
              withPortal: true,
              isClearable: true,
              isCreatable: true,
              ...props
            }
          }
        }),
      ...(hideStatusField
        ? []
        : [
            {
              field: 'status',
              filter: FormControlReactSelect,
              filterProps: {
                options:
                  role?.name === ADMINISTRATOR
                    ? filterStatusOptions
                    : statusOptions,
                withPortal: true,
                isClearable: true,
                isMulti: true,
                isMultiSelection: true,
                fixedHeight: true
              }
            }
          ]),
      ...(hideTagField
        ? []
        : [
            {
              field: 'tag',
              filter: FormControlSelectTag,
              filterProps: {
                withPortal: true,
                isMultiSelection: true,
                hasDynamicChipsCreation: false,
                fixedHeight: true,
                entityType: tagEntityType
              }
            }
          ]),
      ...(initialFilters || [])
    ],
    [
      initialFilters,
      hideStatusField,
      hideTagField,
      filteredFields,
      tagEntityType,
      getFilterField,
      role?.name
    ]
  )

  const editors = useMemo(
    () => [
      ...filteredFields
        .filter(
          ({ type, name }) =>
            customFieldTableEditors.includes(type) &&
            updateGroups.includes(
              getCustomFieldPermissionByGroup(permissionGroupName, name)
            )
        )
        .map(({ type, lookupType, options, code }) => {
          return {
            field: code,
            cellEditor: CustomField,
            cellEditorProps: {
              type,
              name: `customFields.${code}`,
              lookupType,
              hideCopyBtn: true,
              options: sortDataBySortOrder([...(options || [])]).map(
                ({ id, name }) => ({ label: name, value: id })
              ),
              fullHeight: true,
              ...(type === customFieldTypes.phone
                ? { hideDropdown: true }
                : {}),
              isInput: ![
                customFieldTypes.select,
                customFieldTypes.lookup
              ].includes(type)
            },
            valueGetter: ({ data }) => {
              const value = _get(data, `customFields.${code}`, '')
              if (typeof value === 'object' && !Array.isArray(value)) {
                return value?.id
              }
              if (
                type === customFieldTypes.phone &&
                value &&
                !value.startsWith('+')
              ) {
                return '+1 ' + value
              }
              if (type === customFieldTypes.multiselect) {
                return value?.length
                  ? value.map(({ id, name }) => ({
                      label: name,
                      value: id
                    }))
                  : []
              }
              return value
            },
            valueSetter: params => {
              if (
                params.newValue &&
                params.newValue !== _get(params.data, `customFields.${code}`)
              ) {
                if (type === customFieldTypes.multiselect) {
                  params.data.newCustomFields = {
                    [code]: params.newValue.map(({ value }) => value)
                  }
                } else {
                  params.data.customFields[code] = params.newValue
                  params.data.newCustomFields = {
                    [code]: params.newValue
                  }
                }
                return true
              }
              return false
            }
          }
        }),
      ...(hideStatusField
        ? []
        : [
            {
              field: 'status',
              cellEditor: CheckboxSwitcher,
              cellEditorProps: {
                returnValues: statusReturnValues,
                isInput: false
              }
            }
          ]),
      ...(hideTagField
        ? []
        : [
            {
              field: 'tag',
              cellEditor: FormControlSelectTag,
              cellEditorProps: {
                isMultiSelection: true,
                withPortal: true,
                entityType: tagEntityType
              },
              valueGetter: params => convertArr(params.data?.tag, tagToChipObj),
              valueSetter: params => {
                if (
                  params.newValue &&
                  !_isEqual(
                    convertArr(params.newValue, chipObjToTag),
                    params.data.tag
                  )
                ) {
                  params.data.tag = convertArr(params.newValue, chipObjToTag)
                  return true
                }
                return false
              }
            }
          ]),
      ...(initialEditors || [])
    ],
    [
      initialEditors,
      hideStatusField,
      hideTagField,
      tagEntityType,
      filteredFields,
      permissionGroupName,
      updateGroups
    ]
  )

  return useMemo(
    () => ({
      columns,
      filters,
      editors
    }),
    [columns, filters, editors]
  )
}

export default useCustomFieldTableConfig
