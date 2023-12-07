import { ActiveStatus, InactiveStatus } from 'components/StatusText'

const StatusColumn = ({ value, data, getValue }) => {
  const _value = value || getValue(data)
  return _value === 'Active' ? (
    <ActiveStatus title={_value} />
  ) : (
    <InactiveStatus title={_value} />
  )
}

export default StatusColumn
