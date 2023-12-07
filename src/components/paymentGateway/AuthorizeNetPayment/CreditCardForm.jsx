import { useCallback } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import PaymentFormInput from '../components/PaymentFormInput'
import { simulateEvent } from 'utils/formik'

import visaCard from '/src/assets/icons/visa-card.svg'
import masterCard from '/src/assets/icons/mastercard-card.svg'
import amexCard from '/src/assets/icons/amex-card.svg'
import discoverCard from '/src/assets/icons/discover-card.svg'
import dinersCard from '/src/assets/icons/diners-card.svg'
import Payment from 'payment'

const useStyles = makeStyles(() => ({
  cardNumberRoot: {
    position: 'relative'
  },
  cardNumberInput: {
    paddingRight: '3.5em'
  },
  cardIconRoot: {
    position: 'absolute',
    right: 8,
    top: 26,
    display: 'flex',
    gap: '0.2em',
    padding: '0.75em'
  },
  cardIconImg: {
    width: '1.95em',
    height: 'auto',
    display: 'block'
  }
}))

const cardTypeIcon = {
  visa: visaCard,
  mastercard: masterCard,
  discover: discoverCard,
  amex: amexCard,
  dinersclub: dinersCard
}

const CreditCardForm = ({
  name,
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  const classes = useStyles()
  const handleChangeNumber = useCallback(
    ({ target: { name, value } }) => {
      if (/^[\d ]*$/.test(value)) {
        let cardValue = (value || '').replaceAll(' ', '')
        if (cardValue.length > 16) {
          cardValue = cardValue.slice(0, 16)
        }
        const cardType = Payment.fns.cardType(cardValue)
        if (cardType === 'amex') {
          cardValue = [
            cardValue.slice(0, 4),
            cardValue.slice(4, 10),
            cardValue.slice(10, 15)
          ]
        } else if (cardType === 'dinersclub') {
          if (cardValue.length <= 14) {
            cardValue = [
              cardValue.slice(0, 4),
              cardValue.slice(4, 10),
              cardValue.slice(10, 14)
            ]
          } else {
            cardValue = cardValue.match(/.{1,4}/g)
          }
        } else {
          cardValue = cardValue.match(/.{1,4}/g)
        }

        handleChange(
          simulateEvent(name, cardValue?.length ? cardValue.join(' ') : '')
        )
      }
    },
    [handleChange]
  )

  const handleChangeExpire = useCallback(
    ({ target: { name, value } }) => {
      if (/^[\d/ ]{0,7}$/.test(value)) {
        let cardValue = (value || '').replaceAll('/', '').replaceAll(' ', '')
        if (cardValue.length > 4) {
          cardValue = cardValue.slice(0, 4)
        }
        cardValue = cardValue.match(/.{1,2}/g)

        handleChange(
          simulateEvent(name, cardValue?.length ? cardValue.join(' / ') : '')
        )
      }
    },
    [handleChange]
  )

  const handleChangeCvc = useCallback(
    ({ target: { name, value } }) => {
      if (/^[\d]{0,4}$/.test(value)) {
        handleChange(simulateEvent(name, value))
      }
    },
    [handleChange]
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} className={classes.cardNumberRoot}>
        <PaymentFormInput
          label="Card Number"
          name={`${name}.cardNumber`}
          placeholder="1234 1234 1234 1234"
          value={values.cardNumber}
          error={errors.cardNumber}
          touched={touched.cardNumber}
          onChange={handleChangeNumber}
          pattern={/^[\d ]*$/}
          onBlur={handleBlur}
          formControlInputClass={classes.cardNumberInput}
        />
        <div className={classes.cardIconRoot}>
          {!values.cardNumber ? (
            <>
              <img src={visaCard} alt="visa" className={classes.cardIconImg} />
              <img
                src={masterCard}
                alt="master"
                className={classes.cardIconImg}
              />
              <img src={amexCard} alt="amex" className={classes.cardIconImg} />
            </>
          ) : cardTypeIcon[Payment.fns.cardType(values.cardNumber)] ? (
            <img
              src={cardTypeIcon[Payment.fns.cardType(values.cardNumber)]}
              alt="card"
              className={classes.cardIconImg}
            />
          ) : null}
        </div>
      </Grid>
      <Grid item xs={6} md={3}>
        <PaymentFormInput
          label="Expiry"
          name={`${name}.expire`}
          placeholder="MM / YY"
          value={values.expire}
          error={errors.expire}
          touched={touched.expire}
          onChange={handleChangeExpire}
          onBlur={handleBlur}
          pattern={/^[\d/ ]{0,7}$/}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <PaymentFormInput
          label="CVC"
          name={`${name}.cardCode`}
          placeholder="CVC"
          value={values.cardCode}
          error={errors.cardCode}
          touched={touched.cardCode}
          onChange={handleChangeCvc}
          onBlur={handleBlur}
          pattern={/^[\d]{0,4}$/}
        />
      </Grid>
    </Grid>
  )
}

export default CreditCardForm
