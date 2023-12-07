import { Grid, makeStyles } from '@material-ui/core'
import moment from 'moment'

import Container from 'components/containers/Container'
import { Text, TextWithTooltip } from 'components/typography'
import { DATE_TIME_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { BACKEND_DATE_TIME_FORMAT } from 'constants/dateTimeFormats'
import { Card } from 'components/cards'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(
  ({ palette, typography, type, fontSize, lineHeight }) => ({
    cardRoot: {
      padding: '20px 30px',
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    title: {
      ...typography.darkAccent[type],
      fontSize: fontSize.big,
      lineHeight: lineHeight.big,
      textTransform: 'capitalize'
    },
    iconRoot: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      margin: '10px 0px',
      '& i': {
        ...typography.lightText[type],
        fontSize: 18,
        marginLeft: 3
      },
      '& p': {
        ...typography.darkText[type],
        fontSize: fontSize.primary,
        lineHeight: lineHeight.primary
      }
    },
    titleRoot: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    rightSideRoot: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    dateText: {
      ...typography.darkText[type]
    },
    actionIconBtn: {
      marginLeft: 5
    },
    header: {
      marginBottom: 16
    },
    chip: {
      marginTop: 4,
      borderRadius: 20,
      marginRight: 8,
      display: 'grid',
      placeItems: 'center',
      '& i': {
        ...typography.darkText[type],
        fontSize: 16
      }
    },
    descriptionRoot: {
      display: 'flex',
      gap: 20,
      marginBottom: 10,
      '& i': {
        ...typography.darkText[type],
        fontSize: 14,
        marginLeft: 3
      }
    }
  })
)

const EmailRow = ({ item, onView }) => {
  const classes = useStyles()

  return (
    <Card rootClassName={classes.cardRoot}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
        className={classes.header}
      >
        <div className={classes.titleRoot}>
          <div className={classes.chip}>
            <i className={getIconClassName(iconNames.subject)} />
          </div>
          <TextWithTooltip
            rootClassName={classes.title}
            linkView
            onClick={() => onView(item.id)}
            maxWidth={945}
          >
            {item.subject}
          </TextWithTooltip>
        </div>
        <div className={classes.rightSideRoot}>
          <Text>Date:</Text>
          <Text>
            <i className={getIconClassName(iconNames.date)} />
          </Text>

          <Text rootClassName={classes.dateText}>
            {moment
              .utc(item.receivedDate, BACKEND_DATE_TIME_FORMAT)
              .local()
              .format(DATE_TIME_VIEW_FORMAT)}
          </Text>
        </div>
      </Grid>
      <div className={classes.descriptionRoot}>
        <i className={getIconClassName(iconNames.description)} />
        <div>
          <Text linkView onClick={() => onView(item.id)}>
            View Content
          </Text>
        </div>
      </div>
      <Container cols="1-2">
        <div className={classes.iconRoot}>
          <i className={getIconClassName(iconNames.contact)} />
          <TextWithTooltip maxWidth={200}>
            {item?.to?.length ? item.to?.join(', ') : '----'}
          </TextWithTooltip>
        </div>
        <div className={classes.iconRoot}>
          <i className={getIconClassName(iconNames.users)} />
          <TextWithTooltip maxWidth={700}>
            {item?.cc?.length > 1 ? item?.cc?.join(', ') : '----'}
          </TextWithTooltip>
        </div>
      </Container>
    </Card>
  )
}

export default EmailRow
