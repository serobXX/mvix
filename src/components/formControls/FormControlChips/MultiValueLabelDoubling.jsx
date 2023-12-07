import { useCallback, useState } from 'react'
import { components } from 'react-select'

const MultiValueLabelDoubling = ({ children, data, ...props }) => {
  const [showValue, setShowValue] = useState(false)

  const handleDoubleClick = useCallback(() => {
    if (data.label !== data.value) {
      setShowValue(true)
      if (showValue !== true) {
        setTimeout(() => setShowValue(false), 5000)
      }
    }
  }, [showValue, data])

  return (
    <div onDoubleClick={handleDoubleClick}>
      <components.MultiValueLabel data={data} {...props}>
        {`${showValue ? `${data?.label} (${data?.value})` : data?.label}`}
      </components.MultiValueLabel>
    </div>
  )
}

export default MultiValueLabelDoubling
