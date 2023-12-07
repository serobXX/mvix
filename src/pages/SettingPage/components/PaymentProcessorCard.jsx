import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { BlueButton } from 'components/buttons'
import CancelButton from 'components/buttons/CancelButton'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import { FormControlReactSelect } from 'components/formControls'
import Icon from 'components/icons/Icon'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { siteConfigKeys } from '../config'
import { paymentGatewayValues } from 'constants/paymentGateway'

const useStyles = makeStyles(({ palette, type }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 10,
    paddingBottom: 6
  }
}))

const paymentGatewayOptions = [
  {
    label: 'Stripe',
    value: paymentGatewayValues.stripe
  },
  {
    label: 'Authorize.net',
    value: paymentGatewayValues.authorize
  }
]

const PaymentProcessorCard = ({ data, onUpdate }) => {
  const [isEdit, setEdit] = useState(false)
  const [textValue, setTextValue] = useState()
  const classes = useStyles()

  const item = useMemo(
    () => data.find(({ key }) => key === siteConfigKeys.paymentProcessor),
    [data]
  )

  useEffect(() => {
    setTextValue(item?.textValue || '')
  }, [item])

  const handleChange = useCallback(({ target: { value } }) => {
    setTextValue(value)
  }, [])

  const handleCancel = () => {
    setEdit(false)
    setTextValue(item?.textValue || '')
  }

  const handleSubmit = () => {
    onUpdate({
      id: item?.id,
      data: {
        key: item?.key,
        textValue: textValue
      }
    })
    setEdit(false)
  }

  return (
    <>
      <GridCardBase
        title={'Payment Processor'}
        dropdown={false}
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        removeScrollbar
        icon={!isEdit}
        iconButtonComponent={
          <Icon
            icon={getIconClassName(iconNames.edit3)}
            color="light"
            onClick={() => setEdit(true)}
          />
        }
      >
        <FormControlReactSelect
          name="textValue"
          value={textValue}
          onChange={handleChange}
          fullWidth
          options={paymentGatewayOptions}
          disabled={!isEdit}
          marginBottom={false}
        />
      </GridCardBase>
      {isEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <CancelButton onClick={handleCancel} />
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
          >
            {'Save'}
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default PaymentProcessorCard
