import { Paper, makeStyles } from '@material-ui/core'
import PropTypes from 'constants/propTypes'
import classNames from 'classnames'

import { Text } from 'components/typography'
import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(
  ({ palette, type, fontSize, lineHeight, fontWeight, typography }) => ({
    root: {
      padding: '20px',
      marginBottom: '15px',
      border: `1px solid ${palette[type].groupCard.border}`,
      borderLeft: '5px solid #3983ff',
      backgroundColor: palette[type].groupCard.templateBackground,
      borderRadius: '7px',
      boxShadow: `0 1px 4px 0 ${palette[type].groupCard.shadow}`,
      display: 'flex',
      alignItems: 'center',
      opacity: '0.8',
      cursor: 'pointer'
    },
    active: {
      opacity: 1
    },
    groupTitle: {
      fontSize: fontSize.secondary,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.secondary,
      color: palette[type].groupCard.templateTitleColor
    },
    groupSubTitle: {
      ...typography.lightText[type],
      width: 'fit-content'
    },
    groupItemRoot: {
      flex: 1,
      paddingRight: 20
    },
    actionIconBtn: {
      fontSize: '1rem'
    },
    selected: {
      borderColor: '#3983ff'
    },
    sharedRoot: {
      paddingTop: 6,
      paddingRight: 8,
      '& i': {
        fontSize: '1rem',
        color: typography.lightText[type]?.color
      }
    }
  })
)

const TemplateCard = ({
  rootClassName,
  title,
  subTitle,
  actionDropdownOn,
  actionList,
  actionData,
  isActive,
  isSelected,
  onSelect,
  isShared
}) => {
  const classes = useStyles()

  return (
    <Paper
      className={classNames(classes.root, rootClassName, {
        [classes.active]: isActive,
        [classes.selected]: isSelected
      })}
      onClick={onSelect}
    >
      <div className={classes.groupItemRoot}>
        <Text rootClassName={classes.groupTitle}>{title}</Text>
        <Text rootClassName={classes.groupSubTitle}>{subTitle}</Text>
      </div>
      {isShared && (
        <div className={classes.sharedRoot}>
          <i className={getIconClassName(iconNames.share)} />
        </div>
      )}
      <ActionDropdownButton
        on={actionDropdownOn}
        actionLinks={actionList}
        data={actionData}
        iconButtonClassName={classes.actionIconBtn}
      />
    </Paper>
  )
}

TemplateCard.propTypes = {
  rootClassName: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  actionDropdownOn: PropTypes.string,
  actionList: PropTypes.array
}

TemplateCard.defaultProps = {
  rootClassName: '',
  title: '',
  subTitle: '',
  actionDropdownOn: 'hover',
  actionList: []
}

export default TemplateCard
