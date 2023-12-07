import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { MaterialPopup } from 'components/Popup'
import { CircleIconButton } from 'components/buttons'
import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { FormControlReactSelect } from 'components/formControls'
import { activityStatusOptions, priorityOptions } from 'constants/activity'
import iconNames from 'constants/iconNames'
import { useFormik } from 'formik'
import { useCallback, useEffect } from 'react'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ typography, type }) => ({
  filterIcon: {
    ...typography.lightText[type],
    fontSize: 16
  },
  root: {
    padding: '17px'
  }
}))

const initialValues = {
  type: 'upcoming',
  activityStatus: '',
  priority: ''
}

const typeOptions = [
  {
    label: 'Upcoming',
    value: 'upcoming'
  },
  {
    label: 'Older',
    value: 'older'
  }
]

const ActivityFilter = ({ fetcher, setFilterValues, filterValues }) => {
  const classes = useStyles()

  const onSubmit = useCallback(
    values => {
      fetcher({
        ...initialValues,
        ...values
      })
      setFilterValues(values)
    },
    [setFilterValues, fetcher]
  )

  const { values, handleChange, handleSubmit, handleReset, setValues } =
    useFormik({
      initialValues,
      onSubmit
    })

  useEffect(() => {
    if (filterValues) {
      setValues({
        ...initialValues,
        ...filterValues
      })
    }
    //eslint-disable-next-line
  }, [filterValues])

  const handleFormSubmit = close => values => {
    handleSubmit(values)
    close()
  }

  const handleFormReset = close => () => {
    handleReset(initialValues)
    setFilterValues(initialValues)
    fetcher(initialValues)
    close()
  }

  return (
    <MaterialPopup
      on="click"
      trigger={
        <CircleIconButton
          className={classNames('hvr-grow', classes.filterIcon)}
        >
          <i className={getIconClassName(iconNames.filter)} />
        </CircleIconButton>
      }
      withArrow
      style={{
        width: 290
      }}
    >
      {close => (
        <div className={classes.root}>
          <Spacing>
            <Container cols="1" isFormContainer>
              <FormControlReactSelect
                label="Type"
                name="type"
                value={values.type}
                onChange={handleChange}
                options={typeOptions}
                marginBottom={false}
                fullWidth
              />
              <FormControlReactSelect
                label="Status"
                name="activityStatus"
                value={values.activityStatus}
                onChange={handleChange}
                options={activityStatusOptions}
                isMulti
                marginBottom={false}
                isClearable
                fullWidth
              />
              <FormControlReactSelect
                label="Priority"
                name="priority"
                value={values.priority}
                onChange={handleChange}
                options={priorityOptions}
                marginBottom={false}
                isClearable
                fullWidth
              />
            </Container>
          </Spacing>
          <FormFooterLayout
            submitLabel={'Search'}
            submitIconName={getIconClassName(iconNames.search)}
            onSubmit={handleFormSubmit(close)}
            onReset={handleFormReset(close)}
          />
        </div>
      )}
    </MaterialPopup>
  )
}

export default ActivityFilter
