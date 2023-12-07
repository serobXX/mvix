import { components } from 'react-select'

const OptionDoubling = ({ children, data, ...props }) => {
  return (
    <components.Option data={data} {...props}>
      {typeof data?.label === 'object'
        ? data.label
        : `${data?.label} (${data?.value})`}
    </components.Option>
  )
}

export default OptionDoubling
