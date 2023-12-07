import { useMemo } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { useDrag, useDrop } from 'react-dnd'

import { parseCurrency } from 'utils/generalUtils'
import { ProfileCard } from '..'
import { getPhones } from 'utils/detailViewUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { routes, tableViews } from 'constants/routes'
import { DATE_TIME_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { Text } from 'components/typography'
import { FormControlCheckbox } from 'components/formControls'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { removeAbsolutePath } from 'utils/urlUtils'
import { PROPOSAL_ITEM_CARD_TYPE } from 'constants/dnd'

const popupStyle = {
  width: 190
}

const RowCard = ({
  item,
  estimateLayout,
  opportunityId,
  classes,
  isSelected,
  index,
  disabled = false,
  onToggleEstimate,
  onItemHover = f => f,
  onItemDropped = f => f
}) => {
  const [, drag] = useDrag({
    type: PROPOSAL_ITEM_CARD_TYPE,
    item: {
      index,
      item
    }
  })
  const [{ isOver }, drop] = useDrop({
    accept: PROPOSAL_ITEM_CARD_TYPE,
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    hover: e => {
      onItemHover(e.index, index, e.item)
    },
    drop: e => {
      onItemDropped(e.index, index, e.item)
    }
  })

  const phones = useMemo(
    () => getPhones(estimateLayout, item),
    [estimateLayout, item]
  )

  const profileCardList = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.contact, iconTypes.duotone),
        value: getTitleBasedOnEntity(entityValues.contact, item?.contact),
        to: routes.contacts.toView(item?.contact?.id)
      },
      {
        icon: getIconClassName(iconNames.phoneNumber2, iconTypes.duotone),
        values: Object.values(phones).reverse()
      },
      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        value: moment(item?.createdAt).format(DATE_TIME_VIEW_FORMAT)
      }
    ],
    [phones, item]
  )

  const profileActions = useMemo(
    () => [
      {
        label: 'View',
        icon: getIconClassName(iconNames.estimate),
        onClick: () => window.open(routes.estimates.toView(item?.id), '_blank')
      },
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        url: routes.estimates.toDetailEdit(
          removeAbsolutePath(
            routes.opportunities.toView(opportunityId, tableViews.list)
          ),
          item?.id
        )
      },
      {
        label: 'Clone',
        icon: getIconClassName(iconNames.clone),
        url: routes.estimates.toDetailClone(
          removeAbsolutePath(
            routes.opportunities.toView(opportunityId, tableViews.list)
          ),
          item?.id
        )
      }
    ],
    [opportunityId, item?.id]
  )

  return (
    <div
      ref={ref => isSelected && drop(drag(ref))}
      style={{ opacity: isOver ? 0 : 1 }}
    >
      <ProfileCard
        title={`${item?.id}: ${parseCurrency(item?.grandTotal)}`}
        hideProfileIcon
        subTitle={getTitleBasedOnEntity(entityValues.estimate, item)}
        displayList={profileCardList}
        noEdit
        actions={profileActions}
        variant="small"
        footerComponent={
          <Text rootClassName={classes.cardFooterText}>
            {isSelected ? `Option ${index + 1}` : 'Not Selected'}
          </Text>
        }
        topChipComponent={
          <FormControlCheckbox
            name={item.id}
            value={isSelected}
            disabled={disabled}
            onChange={onToggleEstimate}
          />
        }
        cardRootClassName={classNames(classes.cardContentRoot, {
          [classes.cardInactive]: !isSelected
        })}
        actionProps={{
          popupStyle,
          popupHoverCardClassName: classes.actionHoverCard
        }}
      />
    </div>
  )
}

export default RowCard
