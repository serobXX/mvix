import { useMemo } from 'react'

import { CheckboxSwitcher, FormControlSelectTag } from 'components/formControls'
import { position } from 'constants/common'
import { statusReturnValues } from 'constants/commonOptions'

const useCustomStaticFields = ({
  hideTagField,
  hideStatusField,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  tagEntityType,
  staticFields: staticFieldComponents,
  staticFieldsAtFirst: staticFieldsAtFirstComponents,
  staticFieldOn: staticFieldsOnComponents,
  disabled,
  handleDoubleClick
}) => {
  const staticFields = useMemo(
    () => [
      ...(hideTagField
        ? []
        : [
            <FormControlSelectTag
              label="Tag"
              name="tag"
              values={values.tag}
              error={errors.tag}
              touched={touched.tag}
              onChange={handleChange}
              onBlur={handleBlur}
              entityType={tagEntityType}
              isOptional
              marginBottom={false}
              disabled={disabled}
              onDoubleClick={handleDoubleClick('tag')}
            />
          ]),
      ...(hideStatusField
        ? []
        : [
            <CheckboxSwitcher
              labelPosition={position.top}
              label="Status"
              name="status"
              value={values.status}
              returnValues={statusReturnValues}
              onChange={handleChange}
              disabled={disabled}
              onDoubleClick={handleDoubleClick('status')}
            />
          ]),
      ...staticFieldComponents.map(({ component: Component, name, props }) => (
        <Component
          name={name}
          value={values[name]}
          error={errors[name]}
          touched={touched[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          onDoubleClick={handleDoubleClick(name)}
          {...(typeof props === 'function'
            ? props(values[name], values) || {}
            : props)}
        />
      ))
    ],
    [
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      hideStatusField,
      hideTagField,
      staticFieldComponents,
      tagEntityType,
      disabled,
      handleDoubleClick
    ]
  )

  const staticFieldsOn = useMemo(
    () => [
      ...staticFieldsOnComponents.map(
        ({ component: Component, code, name, props }) => ({
          code,
          render: (
            <Component
              name={name}
              value={values[name]}
              error={errors[name]}
              touched={touched[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              marginBottom={false}
              disabled={disabled}
              onDoubleClick={handleDoubleClick(name)}
              {...(typeof props === 'function'
                ? props(values[name], values) || {}
                : props)}
            />
          )
        })
      )
    ],
    [
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      staticFieldsOnComponents,
      disabled,
      handleDoubleClick
    ]
  )

  const staticFieldsAtFirst = useMemo(
    () => [
      ...staticFieldsAtFirstComponents.map(
        ({ component: Component, name, props }) => (
          <Component
            name={name}
            value={values[name]}
            error={errors[name]}
            touched={touched[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            onDoubleClick={handleDoubleClick(name)}
            {...(typeof props === 'function'
              ? props(values[name], values) || {}
              : props)}
          />
        )
      )
    ],
    [
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      disabled,
      staticFieldsAtFirstComponents,
      handleDoubleClick
    ]
  )

  return useMemo(
    () => ({
      staticFields,
      staticFieldsAtFirst,
      staticFieldsOn
    }),
    [staticFields, staticFieldsAtFirst, staticFieldsOn]
  )
}

export default useCustomStaticFields
