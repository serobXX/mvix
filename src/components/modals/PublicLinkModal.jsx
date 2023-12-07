import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { DefaultModal } from '.'
import { CircularLoader } from 'components/loaders'
import Spacing from 'components/containers/Spacing'
import {
  FormControlCopyInput,
  FormControlReactSelect
} from 'components/formControls'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { useCreatePublicTokenMutation } from 'api/publicApi'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import update from 'utils/immutability'

const useStyles = makeStyles(() => ({
  loaderRoot: {
    minHeight: 100
  }
}))

// TODO: development remaining
const PublicLinkModal = ({
  open,
  modalTitle,
  onClose,
  tokenList,
  transformLink = f => f,
  isLoading,
  entityType,
  entityId
}) => {
  const classes = useStyles()
  const [selectedToken, setSelectedToken] = useState({})
  const [tokenOptions, setTokenOptions] = useState([])

  const [createToken, tokenReducer] = useCreatePublicTokenMutation()

  useEffect(() => {
    setTokenOptions(
      (tokenList || []).map(({ token, reference }) => ({
        label: reference,
        value: reference,
        token
      }))
    )
  }, [tokenList])

  const handleSuccess = ({ data }) => {
    if (data?.token) {
      setTokenOptions(
        update(tokenOptions, {
          $push: [
            {
              label: selectedToken?.label,
              value: selectedToken?.label,
              token: data?.token
            }
          ]
        })
      )
      setSelectedToken({
        label: selectedToken?.label,
        value: selectedToken?.label,
        token: data?.token
      })
    }
  }

  useNotifyAnalyzer({
    onSuccess: handleSuccess,
    entityName: 'Public Link',
    watchArray: [tokenReducer],
    labels: [notifyLabels.add]
  })

  useEffect(() => {
    if (tokenOptions?.length && !selectedToken?.label) {
      setSelectedToken(tokenOptions[0])
    }
    //eslint-disable-next-line
  }, [tokenOptions])

  const handleChangeToken = ({
    target: { value, label, token, __isNew__ }
  }) => {
    setSelectedToken({ value, label, token, isNew: __isNew__ })
  }

  const handleGenerateLink = () => {
    createToken({
      entityType,
      entityId,
      reference: selectedToken.label
    })
  }

  return (
    <DefaultModal
      modalTitle={modalTitle}
      onCloseModal={onClose}
      open={open}
      maxWidth="xs"
      withActions={false}
      hasCancelBtn={false}
      buttonPrimaryText="Generate Link"
      buttonPrimaryIcon={getIconClassName(iconNames.link)}
      onClickSave={handleGenerateLink}
      buttonPrimaryDisabled={tokenReducer.isLoading}
    >
      {isLoading ? (
        <div className={classes.loaderRoot}>
          <CircularLoader />
        </div>
      ) : (
        <Spacing>
          {false && (
            <FormControlReactSelect
              label="Link for"
              name="reference"
              value={selectedToken?.value}
              onChange={handleChangeToken}
              options={tokenOptions}
              withPortal
              isSearchable
              isCreatable
              createOptionLabelText={value => `Add '${value}'`}
            />
          )}
          <FormControlCopyInput
            value={selectedToken?.token && transformLink(selectedToken?.token)}
            marginBottom={false}
          />
        </Spacing>
      )}
    </DefaultModal>
  )
}

export default PublicLinkModal
