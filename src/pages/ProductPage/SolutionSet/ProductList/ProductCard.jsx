import { useMemo } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import momentTZ from 'moment-timezone'
import moment from 'moment'

import { MaterialPopup } from 'components/Popup'
import UserPic from 'components/UserPic'
import { CircleIconButton } from 'components/buttons'
import { Text, TextWithTooltip } from 'components/typography'
import { DATE_TIME_VIEW_FORMAT } from 'constants/dateTimeFormats'
import iconNames from 'constants/iconNames'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'
import { TagColumn } from 'components/tableColumns'
import { useDrag } from 'react-dnd'
import { SOLUTION_SET_TYPE } from 'constants/dnd'
import customFieldNames from 'constants/customFieldNames'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  root: {
    paddingRight: 16
  },
  productRoot: {
    padding: '15px 0',
    overflow: 'hidden',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  productTitleRoot: {
    flexGrow: 1,
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  },
  iconBtn: {
    fontSize: 14
  },
  productTitleText: {
    ...typography.darkAccent[type]
  },
  popupRoot: {
    padding: 16,
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: 10,
    ...typography.lightText[type]
  }
}))

const ProductCard = ({ product }) => {
  const classes = useStyles()
  const tz = momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()

  const [{ isDragging }, drag] = useDrag({
    type: SOLUTION_SET_TYPE,
    item: product,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const popupDisplayList = useMemo(
    () => [
      'Date Added',
      `${moment(product.createdAt).format(DATE_TIME_VIEW_FORMAT)} ${tz}`,
      'Last Updated',
      `${moment(product.updatedAt).format(DATE_TIME_VIEW_FORMAT)} ${tz}`,
      'Added By',
      `${_get(product, 'createdBy.firstName')} ${_get(
        product,
        'createdBy.lastName'
      )}`,
      'Tags',
      <TagColumn value={product.tag} showAll justifyContent="flex-start" />
    ],
    [product, tz]
  )

  return (
    <Grid item xs="6" className={classes.root} ref={drag}>
      {!isDragging && (
        <Grid container className={classes.productRoot}>
          <Grid item className={classes.productTitleRoot}>
            <UserPic
              userName={getCustomFieldValueByCode(
                product,
                customFieldNames.productCode
              )}
              noStatus
              small
              showJdenticonIcon
              jdenticonIconSize={36}
            />
            <TextWithTooltip
              maxWidth={300}
              rootClassName={classes.productTitleText}
            >
              {getCustomFieldValueByCode(product, customFieldNames.productCode)}
            </TextWithTooltip>
          </Grid>
          <Grid item>
            <MaterialPopup
              trigger={
                <CircleIconButton className={classes.iconBtn}>
                  <i className={getIconClassName(iconNames.moreInfo)} />
                </CircleIconButton>
              }
              withPortal
            >
              <div className={classes.popupRoot}>
                {popupDisplayList.map((title, index) =>
                  typeof title === 'object' ? (
                    title
                  ) : (
                    <Text key={`list-${index}`}>{title}</Text>
                  )
                )}
              </div>
            </MaterialPopup>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default ProductCard
