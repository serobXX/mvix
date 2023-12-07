import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import { customFieldLookupType } from 'constants/customFields'
import { opportunityTypeOptions } from 'constants/opportunityConstants'
import { getStageOptions } from 'utils/autocompleteOptions'
import { getLookupOptions } from 'utils/customFieldUtils'
import { _get } from 'utils/lodash'

const OpportunityForm = ({
  classes,
  values,
  errors,
  touched,
  handleChange
}) => {
  return (
    <Spacing rootClassName={classes.createNewOptionRoot}>
      <Container cols="1">
        <FormControlInput
          label="Opportunity Name"
          name={`opportunityCustomFields.opportunityName`}
          value={_get(values, 'opportunityCustomFields.opportunityName')}
          onChange={handleChange}
          error={_get(errors, 'opportunityCustomFields.opportunityName')}
          touched={_get(touched, 'opportunityCustomFields.opportunityName')}
          marginBottom={false}
          fullWidth
          isRequired
        />
        <FormControlDatePicker
          label="Expecting Closing Date"
          name={`opportunityCustomFields.expectingClosingDate`}
          value={_get(values, 'opportunityCustomFields.expectingClosingDate')}
          onChange={handleChange}
          error={_get(errors, 'opportunityCustomFields.expectingClosingDate')}
          touched={_get(
            touched,
            'opportunityCustomFields.expectingClosingDate'
          )}
          marginBottom={false}
          fullWidth
          isRequired
        />
        <FormControlAutocomplete
          label="Stage"
          name={`opportunityCustomFields.stageId`}
          value={_get(values, 'opportunityCustomFields.stageId')}
          onChange={handleChange}
          getOptions={getStageOptions()}
          initialFetchValue={_get(
            values,
            'opportunityCustomFields.stageId',
            ''
          )}
          error={_get(errors, 'opportunityCustomFields.stageId')}
          touched={_get(touched, 'opportunityCustomFields.stageId')}
          marginBottom={false}
          fullWidth
          withPortal
          isRequired
        />
        <FormControlReactSelect
          label="Opportunity Type"
          name={`opportunityCustomFields.projectType`}
          value={_get(values, 'opportunityCustomFields.projectType')}
          onChange={handleChange}
          options={opportunityTypeOptions}
          error={_get(errors, 'opportunityCustomFields.projectType')}
          touched={_get(touched, 'opportunityCustomFields.projectType')}
          marginBottom={false}
          fullWidth
          withPortal
          isRequired
        />
        <FormControlAutocomplete
          label="Solution Interest"
          name={`opportunityCustomFields.solutionInterest`}
          value={_get(values, 'opportunityCustomFields.solutionInterest')}
          onChange={handleChange}
          getOptions={getLookupOptions(customFieldLookupType.solution)}
          marginBottom={false}
          fullWidth
          withPortal
        />
        <FormControlAutocomplete
          label="Contact Authority"
          name={`opportunityCustomFields.contactAuthority`}
          value={_get(values, 'opportunityCustomFields.contactAuthority')}
          onChange={handleChange}
          getOptions={getLookupOptions(customFieldLookupType.contactAuthority)}
          marginBottom={false}
          fullWidth
          isMulti
          withPortal
        />
      </Container>
    </Spacing>
  )
}

export default OpportunityForm
