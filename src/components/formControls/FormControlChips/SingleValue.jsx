import { components } from 'react-select'

const SingleValue = ({ classes, children, data, ...props }) => {
  return (
    <components.SingleValue {...props}>
      {typeof data.label === 'string' ? (
        <input value={data.label} readOnly size={data.label.length + 2} />
      ) : (
        <div>{data.label}</div>
      )}
    </components.SingleValue>
  )
}

export default SingleValue
