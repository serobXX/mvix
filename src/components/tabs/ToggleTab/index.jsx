import { makeStyles, withStyles } from '@material-ui/core'
import { ToggleButtonGroup } from '@material-ui/lab'
import { TabToggleButton } from 'components/buttons'

export const TabToggleButtonGroup = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette[type].tabs.background,
      borderRadius: '100px',
      boxShadow: 'none'
    }
  }
})(ToggleButtonGroup)

export const TabToggleStaticButton = ({ width = 150, ...rest }) => {
  const classes = makeStyles({
    root: {
      width: ({ width }) => width
    }
  })({ width })

  return <TabToggleButton classes={classes} {...rest} />
}

const ToggleTab = ({
  tabs,
  value,
  onChange,
  tabWidth,
  tabProps = {},
  ...props
}) => {
  return (
    <TabToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      {...props}
    >
      {tabs.map(({ label, value: _value }) => (
        <TabToggleStaticButton
          key={`toggle-tab-${_value}`}
          value={_value}
          width={tabWidth}
          {...tabProps}
        >
          {label}
        </TabToggleStaticButton>
      ))}
    </TabToggleButtonGroup>
  )
}

export default ToggleTab
