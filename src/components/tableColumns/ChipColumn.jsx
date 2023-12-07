import { makeStyles } from '@material-ui/core'
import { BaseChip } from 'components/chips'
import { Text, TextWithTooltip } from 'components/typography'

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '100%'
  },
  text: ({ color }) => ({
    color,
    lineHeight: '13px'
  })
}))

const ChipColumn = ({
  value,
  data,
  getValue,
  getProps,
  iconClassName,
  color,
  backgroundColor
}) => {
  const _value = value || getValue(data)
  const props = getProps ? getProps(data) : {}
  const classes = useStyles({ color: props.color || color })

  return !!_value ? (
    <BaseChip
      rootClassName={classes.root}
      label={
        <TextWithTooltip rootClassName={classes.text} maxWidth={'100%'}>
          {props.label || _value}
        </TextWithTooltip>
      }
      iconClassName={props.iconClassName || iconClassName}
      color={props.color || color}
      backgroundColor={props.backgroundColor || backgroundColor}
      iconColor={props.color || color}
    />
  ) : (
    <Text>N/A</Text>
  )
}

export default ChipColumn
