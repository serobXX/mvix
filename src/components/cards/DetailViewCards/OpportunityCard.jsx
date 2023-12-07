import React, { useMemo } from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core'

import ListBaseCard from './ListBaseCard'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { parseCurrency } from 'utils/generalUtils'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { BaseChip } from 'components/chips'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import customFieldNames from 'constants/customFieldNames'
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

const OpportunityCard = ({ data }) => {
  const classes = useStyles()
  const rowItems = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.opportunity, iconTypes.duotone),
        name: 'oppName',
        tooltip: 'Opportunity Name'
      },
      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'date',
        tooltip: 'Created Date'
      },
      {
        icon: getIconClassName(iconNames.expectedRevenue, iconTypes.duotone),
        name: 'expectedRevenue',
        tooltip: 'Expected Revenue'
      },
      {
        render: value => {
          const randomColor = getRandomColor()
          return (
            <BaseChip
              label={value}
              iconClassName={getIconClassName(iconNames.opportunityStage)}
              color={getDarkenColorFromRgb(randomColor, 0.5)}
              backgroundColor={getLightenColorFromRgb(randomColor, 0.5)}
              iconColor={getDarkenColorFromRgb(randomColor, 0.5)}
              className={classes.baseChipRoot}
            />
          )
        },
        name: 'oppStatus'
      },
      {
        icon: getIconClassName(iconNames.estimate, iconTypes.duotone),
        name: 'estimateName',
        tooltip: 'Estimate Name'
      },

      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'closingDate',
        tooltip: 'Expected Closing Date'
      }
    ],
    [classes]
  )

  const oppData = useMemo(
    () =>
      data.map(item => ({
        oppName: getTitleBasedOnEntity(entityValues.opportunity, item),
        expectedRevenue: parseCurrency(
          getCustomFieldValueByCode(item, customFieldNames.oppExpectedRevenue)
        ),
        estimateName: 'N/A',
        date: moment(item.createdAt).format(DATE_VIEW_FORMAT),
        closingDate:
          getCustomFieldValueByCode(
            item,
            customFieldNames.oppExpectedClosingDate
          ) &&
          moment(
            getCustomFieldValueByCode(
              item,
              customFieldNames.oppExpectedClosingDate
            )
          ).format(DATE_VIEW_FORMAT),
        oppStatus: item.stage?.name
      })),
    [data]
  )

  return (
    <ListBaseCard
      title="Opportunity"
      titleIcon={getIconClassName(iconNames.opportunity, iconTypes.duotone)}
      rowItems={rowItems}
      data={oppData}
      emptyText="No Associated Opportunity"
    />
  )
}

OpportunityCard.defaultProps = {
  data: []
}

export default OpportunityCard
