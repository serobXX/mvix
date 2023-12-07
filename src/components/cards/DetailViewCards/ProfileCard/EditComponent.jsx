import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { titleCase } from 'title-case'
import { makeStyles } from '@material-ui/core'

import Container from 'components/containers/Container'
import { defaultCustomFieldLayout } from 'constants/detailView'
import { getFieldFromCustomFieldCode } from 'utils/customFieldUtils'
import { _get, _isNotEmpty } from 'utils/lodash'

const useStyles = makeStyles(() => ({
  splitEditorRoot: {
    width: '100% !important',
    maxWidth: '200px'
  },
  singleEditorRoot: {
    width: '240px',
    maxWidth: '240px'
  },
  editorFullWidth: {
    width: '100%',
    maxWidth: '100%'
  },
  hideLabel: {
    marginTop: 10
  }
}))

const EditComponent = ({
  name: _editName,
  index,
  innerIndex,
  editors,
  handleChange,
  values,
  handleBlur,
  layout,
  autoFocus,
  errors,
  touched,
  marginBottom = false,
  isWidthAuto = false,
  disabled = false,
  readOnlyWithoutSelection = false,
  hideLabel = false,
  disabledFields
}) => {
  const classes = useStyles()
  const editor = useMemo(() => {
    let _editor = editors[_editName] || {}
    let _innerIndex = innerIndex
    if (_editor[index]?.isSingleEditor && _innerIndex > 0) {
      return null
    }
    if (index >= 0 && Array.isArray(_editor) && !!_editor[index]) {
      if (
        !_innerIndex &&
        !_editor[index]?.name &&
        _isNotEmpty(_editor[index]?.values)
      )
        _innerIndex = 0
      if (_innerIndex >= 0 && _editor[index].values) {
        const _names = Object.keys(_editor[index].values).reverse()
        _editor = {
          ..._editor[index],
          name: _names?.[_innerIndex]
        }
      } else _editor = _editor[index]
    }
    return _editor
  }, [editors, _editName, innerIndex, index])

  const renderComponent = useCallback(
    (
      {
        name,
        component: Component,
        props,
        isCustomField,
        label,
        icon,
        fullWidth,
        showLabel,
        isRequired
      },
      _index
    ) => {
      const layoutField =
        getFieldFromCustomFieldCode(layout, name) ||
        defaultCustomFieldLayout(name)

      if (!name || !Component) return null
      props = (typeof props === 'function' ? props(values) : props) || {}

      return (
        <Component
          marginBottom={marginBottom}
          key={`component-${name}-${index}-${innerIndex}`}
          isRequired={
            isRequired !== undefined ? isRequired : layoutField?.isRequired
          }
          {...props}
          label={
            hideLabel && !showLabel
              ? ''
              : titleCase(props?.label || label || layoutField?.name)
          }
          name={name}
          value={_get(values, name)}
          onChange={
            props?.onChange ? props?.onChange(handleChange) : handleChange
          }
          onBlur={handleBlur}
          formControlContainerClass={classNames(classes.singleEditorRoot, {
            [classes.editorFullWidth]: fullWidth,
            [classes.splitEditorRoot]: isWidthAuto || _index >= 0,
            [classes.hideLabel]: hideLabel
          })}
          fullWidth={fullWidth}
          autoFocus={autoFocus}
          error={_get(errors, name)}
          touched={_get(touched, name)}
          allValues={values}
          allErrors={errors}
          allTouched={touched}
          startAdornmentIcon={icon}
          disabled={
            disabled || (!!disabledFields && disabledFields.includes(name))
          }
          readOnlyWithoutSelection={readOnlyWithoutSelection}
          hideLabel={hideLabel}
          layout={layout}
          {...(isCustomField
            ? {
                type: layoutField?.type,
                lookupType: layoutField?.lookupType,
                options: layoutField?.options
                  ? layoutField?.options.map(({ id, name }) => ({
                      label: name,
                      value: id
                    }))
                  : [],
                property: layoutField?.property,
                tooltip: layoutField?.tooltip,
                tooltipType: layoutField?.tooltipType,
                isMultiple: layoutField?.isMultiple
              }
            : {})}
        />
      )
    },
    [
      layout,
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      classes,
      isWidthAuto,
      autoFocus,
      marginBottom,
      index,
      innerIndex,
      disabled,
      readOnlyWithoutSelection,
      hideLabel,
      disabledFields
    ]
  )

  if (Array.isArray(editor)) {
    return (
      <Container cols={editor.length}>{editor.map(renderComponent)}</Container>
    )
  } else {
    return renderComponent(editor)
  }
}

export default EditComponent
