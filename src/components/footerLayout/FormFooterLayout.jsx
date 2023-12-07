import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'

import { BlueButton, WhiteButton } from 'components/buttons'
import PropTypes from 'constants/propTypes'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import SplitButton from 'components/buttons/SplitButton'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
  actionCancel: {
    marginRight: 16
  },
  footerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

const FormFooterLayout = ({
  disabledSubmit = false,
  opaqueSubmit = false,
  isUpdate = false,
  isClone = false,
  isPending = false,
  onSubmit = f => f,
  onReset = f => f,
  submitButtonProps = {},
  submitIconName,
  resetIconName = getIconClassName(iconNames.reset),
  submitLabel,
  isSubmitSplit = false,
  submitItems,
  resetLabel,
  rootClassName
}) => {
  const classes = useStyles()
  const translate = useMemo(
    () => ({
      update: 'Update',
      pending: 'Pending',
      add: 'Add',
      reset: 'Reset',
      clone: 'Clone'
    }),
    []
  )

  return (
    <div className={classNames(classes.footerContainer, rootClassName)}>
      <WhiteButton
        className={classes.actionCancel}
        onClick={onReset}
        iconClassName={resetIconName}
        variant="danger"
      >
        {resetLabel || translate.reset}
      </WhiteButton>
      {isSubmitSplit ? (
        <SplitButton
          type="submit"
          onClick={onSubmit}
          opaque={opaqueSubmit}
          disabled={isPending || disabledSubmit}
          iconClassName={
            submitIconName ||
            getIconClassName(isUpdate ? iconNames.update : iconNames.add)
          }
          {...submitButtonProps}
          items={submitItems}
        />
      ) : (
        <BlueButton
          type="submit"
          onClick={onSubmit}
          opaque={opaqueSubmit}
          disabled={isPending || disabledSubmit}
          iconClassName={
            submitIconName ||
            getIconClassName(isUpdate ? iconNames.update : iconNames.add)
          }
          {...submitButtonProps}
        >
          {submitLabel ||
            (isPending
              ? translate.pending
              : isUpdate
              ? translate.update
              : isClone
              ? translate.clone
              : translate.add)}
        </BlueButton>
      )}
    </div>
  )
}

FormFooterLayout.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isUpdate: PropTypes.bool,
  isClone: PropTypes.bool,
  isPending: PropTypes.bool,
  titleSubmit: PropTypes.string,
  disabledSubmit: PropTypes.bool,
  opaqueSubmit: PropTypes.bool,
  submitIconName: PropTypes.string,
  resetIconName: PropTypes.string
}

export default FormFooterLayout
