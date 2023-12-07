import { makeStyles } from '@material-ui/core'
import React, { useCallback, useMemo } from 'react'
import RateItemCard from './RateItemCard'
import GridCardBase from 'components/cards/GridCardBase'
import { convertToPluralize } from 'utils/pluralize'
import { CircularLoader } from 'components/loaders'
import { simulateEvent } from 'utils/formik'
import { EmptyPlaceholder } from 'components/placeholder'
import classNames from 'classnames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import Tooltip from 'components/Tooltip'

const useStyle = makeStyles(({ palette, type, typography }) => ({
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
    left: '60%',
    background: palette[type].secondary,
    width: '40%',
    paddingTop: 10,
    paddingBottom: 6
  },
  emptyContentWrap: {
    height: '100%'
  },
  refreshIcon: {
    color: typography.lightText[type].color,
    marginTop: 3,
    cursor: 'pointer'
  },
  rotating: {
    animation: '$rotating 2s linear infinite'
  },
  '@keyframes rotating': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  }
}))

const RateCard = ({
  list,
  isLoading,
  name,
  value,
  onChange,
  isPackageEdit,
  error,
  touched,
  onRefresh
}) => {
  const classes = useStyle()
  const parsedData = useMemo(
    () =>
      (list || [])
        .map(({ id, amount, estimated_days, provider, providerImage }) => ({
          id,
          price: amount,
          date: convertToPluralize('day', estimated_days, true),
          title: provider,
          imageUrl: providerImage
        }))
        .sort((a, b) => Number(a.price) - Number(b.price)),
    [list]
  )

  const handleClick = useCallback(
    id => () => {
      onChange(simulateEvent(name, id))
    },
    [name, onChange]
  )

  return (
    <GridCardBase
      title={'Rate'}
      dropdown={false}
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      contentWrapClassName={classNames({
        [classes.emptyContentWrap]: !parsedData?.length
      })}
      error={touched && error}
      iconButtonComponent={
        !isPackageEdit && (
          <Tooltip title="Refresh Data" arrow placement="top">
            <i
              className={classNames(
                getIconClassName(iconNames.refresh),
                classes.refreshIcon,
                {
                  [classes.rotating]: isLoading
                }
              )}
              onClick={!isLoading ? onRefresh : undefined}
            />
          </Tooltip>
        )
      }
    >
      {isLoading && <CircularLoader />}
      {!!parsedData?.length
        ? parsedData.map(({ id, title, price, date, imageUrl }, index) => (
            <RateItemCard
              key={`rate-item-card-${index}`}
              title={title}
              price={price}
              date={date}
              imageUrl={imageUrl}
              isActive={value === id}
              onClick={handleClick(id)}
            />
          ))
        : !isLoading && (
            <EmptyPlaceholder
              variant="small"
              requestText={
                isPackageEdit
                  ? 'Please save the package selection'
                  : 'No Shippment found!'
              }
              fullHeight
            />
          )}
    </GridCardBase>
  )
}

export default RateCard
