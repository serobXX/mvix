import { useCallback, useEffect, useMemo, useState } from 'react'

import PropTypes from 'constants/propTypes'
import { _isEmpty } from 'utils/lodash'
import { FormControlReactSelect } from 'components/formControls'
import {
  useAddSubjectLineMutation,
  useGetSubjectLinesQuery
} from 'api/subjectLineApi'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import { simulateEvent } from 'utils/formik'

const FormControlSelectSubject = ({ hasDynamicCreation, styles, ...props }) => {
  const [postItem, { data, error, reset }] = useAddSubjectLineMutation()
  const { data: subjects, isFetching } = useGetSubjectLinesQuery()

  const [createdItem, setCreatedItem] = useState({})

  const permission = useDeterminePermissions(permissionGroupNames.subjectLine)

  useEffect(() => {
    if (!_isEmpty(data)) {
      setCreatedItem({ label: data.subjectText, value: data.subjectText })
      props.onChange &&
        props.onChange(simulateEvent(props.name, data.subjectText))
    } else if (!_isEmpty(error)) {
      setCreatedItem({ error: error })
    }
    // eslint-disable-next-line
  }, [data, error])

  const handleCreateItem = useCallback(
    title => {
      const data = {
        subjectText: title
      }
      postItem(data)
    },
    [postItem]
  )

  const handleClearCreatedItem = useCallback(() => reset(), [reset])

  const customStyles = useMemo(() => ({ ...styles }), [styles])

  const isCreationAllowed = useMemo(() => {
    return permission.create && hasDynamicCreation
  }, [permission, hasDynamicCreation])

  const noOptionsMessage = useCallback(
    value => {
      if (!permission.read) {
        return 'No permissions available'
      } else if (!isCreationAllowed) {
        return value ? `No Options for "${value}"` : 'No Options'
      } else {
        return 'Press Enter to add new Subject'
      }
    },
    [permission, isCreationAllowed]
  )

  const options = useMemo(
    () =>
      subjects.map(({ subjectText }) => ({
        label: subjectText,
        value: subjectText
      })),
    [subjects]
  )

  return (
    <FormControlReactSelect
      isResettable
      styles={customStyles}
      noOptionsMessage={noOptionsMessage}
      createdValue={createdItem}
      createNewValue={handleCreateItem}
      clearCreatedValue={handleClearCreatedItem}
      hasDynamicChipsCreation={isCreationAllowed}
      options={options}
      isLoading={isFetching}
      isSearchable
      {...props}
    />
  )
}

FormControlSelectSubject.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
  hasDynamicCreation: PropTypes.bool
}

FormControlSelectSubject.defaultProps = {
  styles: {},
  hasDynamicCreation: true
}

export default FormControlSelectSubject
