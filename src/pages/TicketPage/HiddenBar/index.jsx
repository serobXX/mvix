import { useCallback, useEffect, useRef } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import {
  FormControlAutocomplete,
  FormControlFileInput,
  FormControlInput,
  FormControlReactSelect,
  FormControlSelectTag
} from 'components/formControls'
import { convertArr, fromChipObj } from 'utils/select'
import { getCategoryOptions } from 'utils/autocompleteOptions'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { reportOptions } from 'constants/ticketConstants'
import { Card } from 'components/cards'
import Container from 'components/containers/Container'
import { tagEntityType } from 'constants/tagConstants'

const useStyles = makeStyles(({ palette, type }) => ({
  cardWrapper: {
    height: '566px',
    cursor: 'default'
  },
  cardRoot: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '25px 18px',
    overflow: 'hidden',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  internalNotesInput: {
    height: '100px !important'
  }
}))

const initialValues = () => ({
  internalNotes: '',
  project: '',
  category: '',
  reportVia: 'Inbound Phone Call',
  attachments: [],
  tag: []
})

const validationSchema = Yup.object().shape({
  internalNotes: Yup.string().nullable()
})

const HiddenBar = ({
  onSubmit,
  isSubmitClick,
  isResetClick,
  entity,
  values: valuesFromParent
}) => {
  const classes = useStyles()

  const initialFormValues = useRef(initialValues(entity))

  const onSubmitValues = useCallback(
    ({ tag, ...values }) => {
      const data = {
        ...values,
        tag: convertArr(tag, fromChipObj)
      }
      onSubmit(data)
    },
    [onSubmit]
  )

  const { values, handleChange, setValues, handleSubmit, handleReset } =
    useFormik({
      initialValues: initialFormValues.current,
      validationSchema,
      enableReinitialize: true,
      onSubmit: onSubmitValues
    })

  useEffect(() => {
    if (isSubmitClick) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      handleReset()
    }
    //eslint-disable-next-line
  }, [isResetClick])

  useEffect(() => {
    if (valuesFromParent) {
      setValues({
        ...values,
        ...valuesFromParent
      })
    }
    //eslint-disable-next-line
  }, [valuesFromParent])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card rootClassName={classes.cardRoot} dropdown={false} icon={false}>
        <Container cols="1" isFormContainer>
          <FormControlInput
            label="Activity Notes"
            name="internalNotes"
            fullWidth
            multiline
            formControlInputClass={classes.internalNotesInput}
            value={values.internalNotes}
            onChange={handleChange}
            marginBottom={false}
          />

          <FormControlInput
            label="Project"
            name="project"
            fullWidth
            value={values.project}
            onChange={handleChange}
            marginBottom={false}
            startAdornmentIcon={getIconClassName(
              iconNames.production,
              iconTypes.duotone
            )}
          />
          <FormControlAutocomplete
            label="Category"
            name="category"
            fullWidth
            getOptions={getCategoryOptions()}
            value={values.category}
            onChange={handleChange}
            marginBottom={false}
            startAdornmentIcon={getIconClassName(
              iconNames.category,
              iconTypes.duotone
            )}
          />

          <FormControlFileInput
            label="Attachments"
            name="files"
            fullWidth
            value={values.files}
            isMulti={true}
            onChange={handleChange}
            marginBottom={false}
          />
          <Container>
            <FormControlReactSelect
              startAdornmentIcon={getIconClassName(
                iconNames.report,
                iconTypes.duotone
              )}
              label="Report By"
              name="reportedVia"
              options={reportOptions}
              value={values.reportedVia || 'Inbound Phone Call'}
              onChange={handleChange}
              marginBottom={false}
              fullWidth
            />
            <FormControlSelectTag
              label="Tag"
              name="tag"
              values={values.tag}
              onChange={handleChange}
              isOptional
              entityType={tagEntityType.ticket}
              startAdornmentIcon={getIconClassName(
                iconNames.tag,
                iconTypes.duotone
              )}
              marginBottom={false}
              fullWidth
            />
          </Container>
        </Container>
      </Card>
    </Grid>
  )
}

export default HiddenBar
