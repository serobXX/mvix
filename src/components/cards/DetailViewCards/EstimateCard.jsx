import React, { useMemo } from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core'

import ListBaseCard from './ListBaseCard'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { parseCurrency } from 'utils/generalUtils'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { BaseChip } from 'components/chips'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import {
  getDarkenColorFromRgb,
  getLightenColorFromRgb,
  getRandomColor
} from 'utils/color'

const useStyles = makeStyles(() => ({
  baseChipRoot: {
    maxWidth: 118
  }
}))

const EstimateCard = ({ data }) => {
  const classes = useStyles()
  const rowItems = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
        name: 'estimateName',
        tooltip: 'Estimate Name'
      },
      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'date',
        tooltip: 'Created Date'
      },
      {
        icon: getIconClassName(iconNames.expectedRevenue, iconTypes.duotone),
        name: 'grandTotal',
        tooltip: 'Grand Total'
      },
      {
        render: value => {
          const randomColor = getRandomColor()
          return (
            <BaseChip
              label={value}
              iconClassName={getIconClassName(iconNames.clock)}
              color={getDarkenColorFromRgb(randomColor, 0.5)}
              backgroundColor={getLightenColorFromRgb(randomColor, 0.5)}
              iconColor={getDarkenColorFromRgb(randomColor, 0.5)}
              className={classes.baseChipRoot}
            />
          )
        },
        name: 'estimateStatus'
      },
      {
        icon: getIconClassName(iconNames.info, iconTypes.duotone),
        name: 'outOfEstimate',
        tooltip: 'Current Estimate of Total Estimates'
      },
      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'estimateValidityDuration',
        tooltip: 'Validity Date'
      }
    ],
    [classes]
  )

  const estimateData = useMemo(
    () =>
      data.map(item => ({
        estimateName: getTitleBasedOnEntity(entityValues.estimate, item),
        grandTotal: parseCurrency(item?.grandTotal),
        date: moment(item.createdAt).format(DATE_VIEW_FORMAT),
        estimateValidityDuration:
          item.estimateValidityDuration &&
          moment(item.estimateValidityDuration).format(DATE_VIEW_FORMAT),
        estimateStatus: item.status,
        outOfEstimate: `${item?.currentEstimate} of ${item?.totalNoOfEstimates}`
      })),
    [data]
  )

  return (
    <ListBaseCard
      title="Estimate"
      titleIcon={getIconClassName(iconNames.estimate, iconTypes.duotone)}
      rowItems={rowItems}
      data={estimateData}
      emptyText="No Associated Estimates"
    />
  )
}

EstimateCard.defaultProps = {
  data: []
}

export default EstimateCard
