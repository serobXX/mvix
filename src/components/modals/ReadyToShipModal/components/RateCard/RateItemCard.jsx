import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Card } from 'components/cards'

import { Text } from 'components/typography'
import { parseCurrency } from 'utils/generalUtils'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  root: {
    marginBottom: '15px',
    padding: 20,
    border: `1px solid ${palette[type].groupCard.border}`,
    borderRadius: '7px',
    boxShadow: `0 1px 4px 0 ${palette[type].groupCard.shadow}`,
    display: 'flex',
    alignItems: 'center',
    opacity: '0.8',
    cursor: 'pointer'
  },
  active: {
    borderColor: '#0ec90e',
    backgroundColor: 'rgba(14,201,14,0.17)'
  },
  groupItemRoot: {
    paddingRight: 20,
    flexGrow: 1
  },
  groupTitle: {
    fontSize: '15px',
    lineHeight: '22px',
    color: typography.darkText[type].color
  },
  sharedRoot: {},
  iconRoot: {
    marginRight: '14px'
  },
  imageRoot: {
    maxHeight: '40px',
    maxWidth: '40px',
    marginRight: '10px',
    borderRadius: '8px'
  },
  priceText: {
    ...typography.darkAccent[type],
    fontSize: '15px'
  }
}))

const RateItemCard = ({
  rootClassName,
  price,
  date,
  title,
  imageUrl,
  imageClassName,
  isActive = false,
  onClick
}) => {
  const classes = useStyles()
  return (
    <Card
      rootClassName={classNames(classes.root, rootClassName, {
        [classes.active]: isActive
      })}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        className={classNames(classes.imageRoot, imageClassName)}
        alt=""
      ></img>
      <div className={classes.groupItemRoot}>
        <Text rootClassName={classes.groupTitle}>{title}</Text>
      </div>
      <div className={classes.sharedRoot}>
        <Text rootClassName={classes.priceText}>{parseCurrency(price)}</Text>
        <Text>{date}</Text>
      </div>
    </Card>
  )
}

export default RateItemCard
