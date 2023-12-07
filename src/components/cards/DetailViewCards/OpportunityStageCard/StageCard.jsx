import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { TextWithTooltip } from 'components/typography'

const useStyles = makeStyles(({ palette, colors, typography, type }) => ({
  root: {
    position: 'relative',
    height: 70,
    background: palette[type].card.background,
    borderRadius: 4,
    transitionDuration: '0.3s',

    '&:after': {
      borderRadius: 9,
      content: '""',
      right: '-25px',
      position: 'absolute',
      width: 0,
      height: 0,
      borderTop: '37px solid transparent',
      borderLeft: `28px solid ${palette[type].card.background}`,
      borderBottom: '37px solid transparent',
      top: '-1.3px',
      transitionDuration: '0.3s'
    },
    '&:hover': {
      background: colors.highlight,

      '& $titleText': {
        color: '#fff'
      },
      '& $subtitleText': {
        color: '#fff'
      },

      '&:after': {
        borderLeftColor: colors.highlight
      }
    }
  },
  rootWidth: ({ width }) => ({
    width: `${width}px`
  }),
  active: {
    background: `${colors.highlight} !important`,
    '&:after': {
      borderLeftColor: `${colors.highlight} !important`
    }
  },
  textRoot: ({ width }) => ({
    position: 'absolute',
    left: 15,
    top: 15,
    maxWidth: `${width - 20}px`,
    zIndex: 1
  }),
  titleText: {
    ...typography.darkAccent[type],
    transitionDuration: '0.3s'
  },
  titleTextActive: {
    color: '#fff'
  },
  subtitleText: {
    ...typography.lightText[type],
    transitionDuration: '0.3s',
    display: 'inline-block',
    lineHeight: '16px'
  },
  subtitleTextActive: {
    color: '#fff'
  }
}))

const StageCard = ({
  title,
  duration,
  width = 195,
  isActive = false,
  onClick = f => f
}) => {
  const classes = useStyles({ width })
  return (
    <div
      className={classNames(classes.root, classes.rootWidth, {
        [classes.active]: isActive
      })}
      onClick={onClick}
    >
      <div className={classes.textRoot}>
        <TextWithTooltip
          rootClassName={classNames(classes.titleText, {
            [classes.titleTextActive]: isActive
          })}
          maxWidth={width - 20}
        >
          {title}
        </TextWithTooltip>
        {!!duration && isActive && (
          <TextWithTooltip
            rootClassName={classNames(classes.subtitleText, {
              [classes.subtitleTextActive]: isActive
            })}
            maxWidth={width - 20}
          >
            {duration}
          </TextWithTooltip>
        )}
      </div>
    </div>
  )
}

export default StageCard
