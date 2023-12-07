import { useCallback, useEffect, useMemo, useState } from 'react'

import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import { prepareTagData } from 'utils/tagUtils'
import { parseNestedError } from 'utils/errorHandler'
import PropTypes from 'constants/propTypes'
import { _isEmpty } from 'utils/lodash'
import { defaultTag } from 'constants/chipsColorPalette'
import { useAddTagMutation, useLazyGetTagsQuery } from 'api/tagApi'
import { getOptions, transformDataByForTag } from 'utils/autocompleteOptions'
import { FormControlAutocomplete } from 'components/formControls'
import { tagToChipObj } from 'utils/select'

const getStyles = () => {
  return {
    multiValue: ({ data }) => ({
      borderColor: data.border || '#fd7b25',
      background: data.background || '#fd7b25'
    }),
    multiValueLabel: ({ data }) => ({
      color: data.color || 'rgba(255,255,255,1)'
    })
  }
}

const FormControlSelectTag = ({
  hasDynamicChipsCreation,
  styles,
  error: rawError,
  entityType,
  ...props
}) => {
  const [postTag, { data, error, reset }] = useAddTagMutation()
  const [getTags] = useLazyGetTagsQuery()

  const [createdTag, setCreatedTag] = useState({})

  const tagPermission = useDeterminePermissions(permissionGroupNames.tag)

  useEffect(() => {
    if (!_isEmpty(data)) {
      const newTag = tagToChipObj(data)
      setCreatedTag({ data: newTag })
    } else if (!_isEmpty(error)) {
      setCreatedTag({ error: error })
    }
    // eslint-disable-next-line
  }, [data, error])

  const handleCreateTag = useCallback(
    title => {
      const data = prepareTagData({ ...defaultTag, tag: title, entityType })
      postTag(data)
    },
    [postTag, entityType]
  )

  const handleClearCreatedTag = useCallback(() => reset(), [reset])

  const customStyles = useMemo(() => ({ ...getStyles(), ...styles }), [styles])

  const isCreationAllowed = useMemo(() => {
    return tagPermission.create && hasDynamicChipsCreation
  }, [tagPermission, hasDynamicChipsCreation])

  const noOptionsMessage = useMemo(() => {
    if (!tagPermission.read) {
      return 'No permissions available'
    } else if (!isCreationAllowed) {
      return value => (value ? `No Options for "${value}"` : 'No Options')
    } else {
      return 'Press Enter to add new Tag'
    }
  }, [tagPermission, isCreationAllowed])

  const getTagOptions = useCallback(
    (value, params) => {
      return getOptions({
        fetcher: getTags,
        params: {
          ...params,
          entityType
        },
        value,
        field: 'tag',
        transformData: transformDataByForTag
      })
    },
    [getTags, entityType]
  )

  return (
    <FormControlAutocomplete
      isResettable
      isMulti
      styles={customStyles}
      noOptionsMessage={noOptionsMessage}
      createdValue={createdTag}
      createNewValue={handleCreateTag}
      clearCreatedValue={handleClearCreatedTag}
      hasDynamicChipsCreation={isCreationAllowed}
      getOptions={getTagOptions}
      error={parseNestedError(rawError)}
      {...props}
    />
  )
}

FormControlSelectTag.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
  styles: PropTypes.object,
  hasDynamicChipsCreation: PropTypes.bool
}

FormControlSelectTag.defaultProps = {
  styles: {},
  hasDynamicChipsCreation: false,
  values: []
}

export default FormControlSelectTag
