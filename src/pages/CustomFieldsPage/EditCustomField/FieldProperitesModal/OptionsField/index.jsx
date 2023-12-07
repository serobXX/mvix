import { useCallback, useEffect, useMemo, useState } from 'react'
import update from 'immutability-helper'
import { FormControl, makeStyles } from '@material-ui/core'

import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import FormControlLabel from 'components/formControls/FormControlLabel'
import Row from './Row'
import classNames from 'classnames'
import { simulateEvent } from 'utils/formik'
import { _uniqueId } from 'utils/lodash'
import { ErrorText } from 'components/typography'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  containerRoot: {
    borderRadius: 4,
    border: `1px solid ${palette[type].formControls.input.border}`,
    padding: '16px 10px'
  },
  rowRoot: {
    '&:hover $icon': {
      opacity: 1
    }
  },
  icon: {
    ...typography.lightAccent[type],
    fontSize: 20,
    marginRight: 10,
    opacity: 0,
    transition: '0.3s opacity',
    cursor: 'pointer'
  },
  marginRightZero: {
    marginRight: 0
  },
  visible: {
    opacity: 1
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 30
  },
  rowDragging: {
    height: 40
  },
  label: {
    position: 'relative'
  }
}))

const OptionsField = ({ label, name, values, errors, touched, onChange }) => {
  const [options, setOptions] = useState([])
  const classes = useStyles()

  useEffect(() => {
    setOptions(values)
  }, [values])

  const handleChange = useCallback(
    index =>
      ({ target: { value } }) => {
        const val = [...values]
        val[index] = {
          ...val[index],
          value
        }
        onChange(simulateEvent(name, val))
      },
    [onChange, name, values]
  )

  const handleAddRow =
    (index = 0) =>
    () => {
      const val = [...values]
      val.splice(index + 1, 0, { value: 'Option', code: _uniqueId() })
      onChange(simulateEvent(name, val))
    }

  const handleRemoveRow =
    (index = 0) =>
    () => {
      const val = [...values]
      val.splice(index, 1)
      onChange(simulateEvent(name, val))
    }

  const handleMoveItemHover = useCallback(
    (sourceIndex, destinationIndex, item) => {
      setOptions(
        update(values, {
          $splice: [
            [sourceIndex, 1],
            [destinationIndex, 0, item]
          ]
        })
      )
    },
    [values]
  )

  const handleMoveItemComplete = useCallback(() => {
    onChange(simulateEvent(name, options))
  }, [onChange, name, options])

  const error = useMemo(() => {
    if (typeof errors === 'string') {
      return errors
    }
    return ''
  }, [errors])

  return (
    <Spacing variant={0}>
      <FormControl>
        <FormControlLabel
          label={label}
          classes={{
            root: classes.label
          }}
        />
        <Container cols="1" rootClassName={classes.containerRoot}>
          {options.map(({ value, code }, index) => (
            <Row
              key={`options-${code}`}
              value={value}
              code={code}
              classes={classes}
              onChange={handleChange(index)}
              index={index}
              onAddRow={handleAddRow(index)}
              onRemoveRow={handleRemoveRow(index)}
              onMoveItemHover={handleMoveItemHover}
              onMoveItemComplete={handleMoveItemComplete}
              error={errors?.[index]}
              touched={touched?.[index]}
            />
          ))}
          {!values.length && (
            <div className={classes.emptyContainer}>
              <i
                className={classNames(
                  classes.icon,
                  classes.visible,
                  getIconClassName(iconNames.add2)
                )}
                onClick={handleAddRow()}
              />
            </div>
          )}
        </Container>
        <ErrorText
          absolute={true}
          condition={touched && !!error}
          error={error}
        />
      </FormControl>
    </Spacing>
  )
}

export default OptionsField
