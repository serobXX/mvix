import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { useGetAccountByIdQuery } from 'api/accountApi'
import Scrollbars from 'components/Scrollbars'
import { SolutionLoader } from 'components/loaders'
import { DefaultModal } from 'components/modals'
import { EmptyPlaceholder } from 'components/placeholder'
import { Text, TextWithTooltip } from 'components/typography'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { useMemo } from 'react'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  dialogContentRoot: {
    padding: '0px'
  },
  rowRoot: {
    padding: '10px 20px',
    borderBottom: `1px solid ${palette[type].pages.dashboard.card.background}`,
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      background: palette[type].pages.dashboard.card.background
    }
  },
  emptyPlaceholder: {
    height: 400
  },
  rowTitle: {
    ...typography.darkAccent[type]
  },
  rowIcon: {
    fontSize: 26,
    color: colors.highlight
  }
}))

const SelectAddressModal = ({ id, open, onClose, onSelect }) => {
  const classes = useStyles()
  const { data, isFetching } = useGetAccountByIdQuery(id)

  const addresses = useMemo(
    () => getCustomFieldValueByCode(data, customFieldNames.addresses),
    [data]
  )

  return (
    <DefaultModal
      modalTitle={'Select Address'}
      open={open}
      onCloseModal={onClose}
      maxWidth="xs"
      useDialogContent={false}
      withActions={false}
    >
      <Scrollbars autoHeight autoHeightMin={'min(450px, calc(100vh - 200px))'}>
        <div className={classes.dialogContentRoot}>
          {isFetching ? (
            <SolutionLoader />
          ) : !addresses?.length ? (
            <EmptyPlaceholder
              rootClassName={classes.emptyPlaceholder}
              fullHeight
              text={'No Addresses Found'}
            />
          ) : (
            addresses.map(item => (
              <div
                className={classes.rowRoot}
                key={`solution-set-${item.id}`}
                onClick={() => onSelect(item)}
              >
                <i
                  className={classNames(
                    getIconClassName(iconNames.location, iconTypes.duotone),
                    classes.rowIcon
                  )}
                />
                <div>
                  <TextWithTooltip
                    maxWidth={340}
                    rootClassName={classes.rowTitle}
                  >
                    {item.address1}
                  </TextWithTooltip>
                  <Text>{item.address2}</Text>
                </div>
              </div>
            ))
          )}
        </div>
      </Scrollbars>
    </DefaultModal>
  )
}

export default SelectAddressModal
