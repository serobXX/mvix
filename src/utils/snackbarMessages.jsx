export const getDeleteConfirmationMessage = (name, additionalText) => {
  name = name ? name : 'Item'
  return (
    <span>
      Are you sure you want to delete: <b>{name}</b>
      {additionalText && additionalText}
    </span>
  )
}

export const getItemSuccessMessage = (name, status) => (
  <span>
    <b>{name}</b> has been {status}.
  </span>
)

export const getBulkDeleteConfirmationMessage = name => {
  name = name ? name : 'Item'
  return <span>Are you sure you want to delete selected {name}?</span>
}

export const getConvertConfirmationMessage = (name, additionalText) => {
  name = name ? name : 'Item'
  return (
    <span>
      Are you sure you want to convert <b>{name}</b> Lead to Account/Client
      {additionalText && additionalText}
    </span>
  )
}

export const getRestoreConfirmationMessage = (name, additionalText) => {
  name = name ? name : 'Item'
  return (
    <span>
      Are you sure you want to restore: <b>{name}</b>
      {additionalText && additionalText}
    </span>
  )
}
