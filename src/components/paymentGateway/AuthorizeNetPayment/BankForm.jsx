import { useCallback } from 'react'
import { Grid } from '@material-ui/core'

import PaymentFormInput from '../components/PaymentFormInput'
import { simulateEvent } from 'utils/formik'
import PaymentReactSelect from '../components/PaymentReactSelect'

const paymentTypeOptions = [
  {
    label: 'Personal Checking',
    value: 'checking'
  },
  {
    label: 'Personal Savings',
    value: 'savings'
  },
  {
    label: 'Business Checking',
    value: 'businessChecking'
  }
]

const BankForm = ({
  name,
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  const handleChangeNumber = useCallback(
    ({ target: { name, value } }) => {
      if (/^[\d]*$/.test(value)) {
        handleChange(simulateEvent(name, value))
      }
    },
    [handleChange]
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <PaymentFormInput
          label="Name On Account"
          name={`${name}.nameOnAccount`}
          placeholder="Xyz"
          value={values.nameOnAccount}
          error={errors.nameOnAccount}
          touched={touched.nameOnAccount}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <PaymentFormInput
          label="Account Number"
          name={`${name}.accountNumber`}
          placeholder="21345678912345234"
          value={values.accountNumber}
          error={errors.accountNumber}
          touched={touched.accountNumber}
          onChange={handleChangeNumber}
          pattern={/^[\d]*$/}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <PaymentFormInput
          label="ABA Routing Number"
          name={`${name}.routingNumber`}
          placeholder="123456789"
          value={values.routingNumber}
          error={errors.routingNumber}
          touched={touched.routingNumber}
          onChange={handleChangeNumber}
          pattern={/^[\d]*$/}
          onBlur={handleBlur}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <PaymentReactSelect
          label="Account Type"
          name={`${name}.accountType`}
          value={values.accountType}
          error={errors.accountType}
          touched={touched.accountType}
          onChange={handleChange}
          onBlur={handleBlur}
          options={paymentTypeOptions}
        />
      </Grid>
    </Grid>
  )
}

export default BankForm
