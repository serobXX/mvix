export const statusValues = {
  active: 'Active',
  inactive: 'Inactive',
  disabled: 'Disabled'
}

export const statusReturnValues = {
  [statusValues.active]: true,
  [statusValues.inactive]: false
}

export const statusOptions = [
  { label: 'Active', value: statusValues.active },
  { label: 'Inactive', value: statusValues.inactive }
]

export const filterStatusOptions = [
  { label: 'Active', value: statusValues.active },
  { label: 'Inactive', value: statusValues.inactive },
  { label: 'Disabled', value: statusValues.disabled }
]

export const salutationOptions = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Ms.', value: 'Ms.' },
  { label: 'Dr.', value: 'Dr.' }
]
