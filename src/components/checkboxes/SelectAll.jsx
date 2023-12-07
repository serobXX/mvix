import Tooltip from 'components/Tooltip'
import Checkbox from './Checkbox'

const CheckboxSelectAll = ({
  indeterminate = null,
  checked = false,
  onChange = f => f,
  tReady,
  ...props
}) => (
  <Tooltip arrow title={'Select All'}>
    <Checkbox
      indeterminate={indeterminate}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  </Tooltip>
)

export default CheckboxSelectAll
