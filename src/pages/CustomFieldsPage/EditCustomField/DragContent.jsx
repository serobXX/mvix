import React from 'react'
import { useDrag } from 'react-dnd'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { useGetCustomFieldSettingsQuery } from 'api/customFieldApi'
import Scrollbars from 'components/Scrollbars'
import Spacing from 'components/containers/Spacing'
import { CircularLoader } from 'components/loaders'
import { Text } from 'components/typography'
import {
  customFieldTypeDetails,
  customFieldTypes
} from 'constants/customFields'
import { customFieldItemTypes } from 'constants/dnd'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  root: {
    height: '100%',
    position: 'relative',
    borderRight: `1px solid ${palette[type].sideModal.content.border}`,
    background: palette[type].pages.customField.edit.leftContent.background
  },
  contentRoot: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  cardRoot: {
    background: palette[type].sideModal.background,
    borderRadius: 4,
    padding: 10,
    width: 'calc(50% - 8px)',
    display: 'flex',
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%'
  },
  cardText: {
    ...typography.darkText[type],
    textTransform: 'capitalize'
  },
  cardIcon: {
    ...typography.lightAccent[type],
    lineHeight: 1,
    marginRight: 10,
    fontSize: 18
  },
  cardDragging: {
    opacity: 0.5
  }
}))

const DragCard = ({ classes, item }) => {
  const [{ isDragging }, drag] = useDrag({
    type:
      item === customFieldTypes.tab
        ? customFieldItemTypes.TAB
        : customFieldItemTypes.ITEM,
    item: {
      type: item
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <div
      className={classNames(classes.cardRoot, {
        [classes.cardDragging]: isDragging,
        [classes.fullWidth]:
          customFieldTypeDetails?.[item]?.sourceWidth || false
      })}
      ref={drag}
    >
      <i
        className={classNames(
          classes.cardIcon,
          getIconClassName(iconNames.dragHandler)
        )}
      />
      <Text rootClassName={classes.cardText}>
        {customFieldTypeDetails?.[item]?.title || item}
      </Text>
    </div>
  )
}

const DragContent = () => {
  const classes = useStyles()
  const { data = {}, isFetching } = useGetCustomFieldSettingsQuery()

  return (
    <div className={classes.root}>
      {isFetching && <CircularLoader />}
      <Scrollbars>
        <Spacing variant={0} paddingVert={2} paddingHor={2}>
          <div className={classes.contentRoot}>
            {data.availableCustomFieldTypes?.map((item, index) =>
              [customFieldTypes.json, customFieldTypes.image].includes(item) ? (
                <React.Fragment
                  key={`drag-custom-field-type-${item}`}
                ></React.Fragment>
              ) : (
                <DragCard
                  key={`drag-custom-field-type-${item}`}
                  classes={classes}
                  item={item}
                  index={index}
                />
              )
            )}
          </div>
        </Spacing>
      </Scrollbars>
    </div>
  )
}

export default DragContent
