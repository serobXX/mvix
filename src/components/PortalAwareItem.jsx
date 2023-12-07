import React from 'react'
import ReactDOM from 'react-dom'

const PortalAwareItem = ({
  provided,
  snapshot,
  portal,
  children,
  isCustomDragHandle = false,
  component: Component = 'div',
  ...props
}) => {
  const usePortal = snapshot.isDragging

  const child = (
    <Component
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...(!isCustomDragHandle ? { ...provided.dragHandleProps } : {})}
      {...props}
    >
      {children}
    </Component>
  )

  if (!usePortal) {
    return child
  }

  return ReactDOM.createPortal(child, portal)
}

export default PortalAwareItem
