import { useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'

import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import {
  FormControlAutocomplete,
  FormControlCustomField,
  FormControlReactSelect,
  FormControlSelectTag
} from 'components/formControls'
import { statusOptions } from 'constants/commonOptions'
import customFieldNames from 'constants/customFieldNames'
import { productLibraryInitialFilter } from 'constants/filter'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { tagEntityType } from 'constants/tagConstants'
import {
  getProductOptions,
  transformDataByValueNameForCustomFields
} from 'utils/autocompleteOptions'

const useStyles = makeStyles(({ typography, type }) => ({
  root: {
    padding: '17px'
  }
}))

const Filter = ({
  fetcher,
  filterValues,
  updateFilter,
  resetFilter,
  closePopup,
  layout
}) => {
  const classes = useStyles()

  const onSubmit = useCallback(
    values => {
      fetcher &&
        fetcher({
          ...productLibraryInitialFilter,
          ...values
        })
      updateFilter(values)
    },
    [updateFilter, fetcher]
  )

  const { values, handleChange, handleSubmit, handleReset, setValues } =
    useFormik({
      initialValues: productLibraryInitialFilter,
      onSubmit
    })

  useEffect(() => {
    if (filterValues) {
      setValues({
        ...productLibraryInitialFilter,
        ...filterValues
      })
    }
    //eslint-disable-next-line
  }, [filterValues])

  const handleFormSubmit = values => {
    handleSubmit(values)
    closePopup()
  }

  const handleFormReset = () => {
    handleReset(productLibraryInitialFilter)
    resetFilter()
    fetcher && fetcher(productLibraryInitialFilter)
    closePopup()
  }

  return (
    <div className={classes.root}>
      <Spacing>
        <Container cols="1" isFormContainer>
          <FormControlAutocomplete
            label="Product Name"
            name={customFieldNames.productName}
            value={values[customFieldNames.productName]}
            getOptions={getProductOptions(
              null,
              transformDataByValueNameForCustomFields
            )}
            onChange={handleChange}
            fullWidth
            isCreatable
            marginBottom={false}
          />
          <FormControlCustomField
            name={customFieldNames.productCategory}
            value={values[customFieldNames.productCategory]}
            layout={layout}
            onChange={handleChange}
            marginBottom={false}
          />
          <FormControlReactSelect
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            options={statusOptions}
            marginBottom={false}
            fullWidth
            isClearable
          />
          <FormControlSelectTag
            label="Tags"
            name="tags"
            values={values.tags}
            onChange={handleChange}
            marginBottom={false}
            entityType={tagEntityType.product}
            fullWidth
            isClearable
          />
        </Container>
      </Spacing>
      <FormFooterLayout
        submitLabel={'Search'}
        submitIconName={getIconClassName(iconNames.search)}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
      />
    </div>
  )
}

export default Filter
