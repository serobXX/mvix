import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Card } from 'components/cards'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(({ palette, type }) => ({
  groupsContainer: {
    height: '100%',
    borderTop: `1px solid ${palette[type].sideModal.content.border}`
  },
  groupContainer: {
    height: 'inherit',
    padding: '0 20px',
    paddingTop: 20,
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  header: {
    paddingLeft: '0',
    border: `solid 1px ${palette[type].sideModal.content.border}`,
    backgroundColor: palette[type].card.greyHeader.background,
    margin: '0 0 20px',
    textTransform: 'capitalize'
  },
  navigationBar: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column'
  },
  itemsContainer: {
    height: 'inherit',
    padding: '0 20px',
    paddingTop: 20
  },
  itemsContent: {
    height: 'inherit'
  }
}))

const TwoColumnLayout = ({
  leftSideCard: {
    title: leftSideTitle,
    component: leftSideComponent,
    rootClassName: leftSideRootClass,
    cardRootClassName: leftSideCardRootClass,
    gridWidth: leftGridWidth = 4,
    ...leftSideCardProps
  },
  rightSideCard: {
    title: rightSideTitle,
    rootClassName: rightSideRootClass,
    cardRootClassName: rightSideCardRootClass,
    gridWidth: rightGridWidth = 8,
    ...rightSideCardProps
  },
  rootClassName,
  children
}) => {
  const classes = useStyles()
  return (
    <Grid
      container
      className={classNames(classes.groupsContainer, rootClassName)}
    >
      <Grid
        item
        xs={leftGridWidth}
        className={classNames(classes.groupContainer, leftSideRootClass)}
      >
        <Card
          grayHeader={true}
          shadow={false}
          radius={false}
          removeSidePaddings
          title={leftSideTitle}
          headerClasses={[classes.header]}
          rootClassName={classNames(
            classes.navigationBar,
            leftSideCardRootClass
          )}
          icon={false}
          dropdown={false}
          {...leftSideCardProps}
        >
          {leftSideComponent}
        </Card>
      </Grid>
      <Grid
        item
        xs={rightGridWidth}
        className={classNames(classes.itemsContainer, rightSideRootClass)}
      >
        <Card
          grayHeader={true}
          shadow={false}
          radius={false}
          removeSidePaddings
          title={rightSideTitle}
          headerClasses={[classes.header]}
          rootClassName={classNames(
            classes.navigationBar,
            rightSideCardRootClass
          )}
          icon={false}
          dropdown={false}
          {...rightSideCardProps}
        >
          <div className={classes.itemsContent}>{children}</div>
        </Card>
      </Grid>
    </Grid>
  )
}

TwoColumnLayout.propTypes = {
  leftSideCard: PropTypes.shape({
    title: PropTypes.string,
    component: PropTypes.object.isRequired,
    rootClassName: PropTypes.string
  }),
  rightSideCard: PropTypes.shape({
    title: PropTypes.string,
    rootClassName: PropTypes.string
  })
}

TwoColumnLayout.defaultProps = {
  leftSideCard: {
    title: '',
    dropdown: false,
    icon: false,
    rootClassName: '',
    gridWidth: 4
  },
  rightSideCard: {
    title: '',
    dropdown: false,
    icon: false,
    rootClassName: '',
    gridWidth: 8
  }
}

export default TwoColumnLayout
