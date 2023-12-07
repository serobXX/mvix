import classNames from 'classnames'

import { CircleIconButton } from 'components/buttons'
import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import iconNames from 'constants/iconNames'
import { useMemo } from 'react'
import { getIconClassName } from 'utils/iconUtils'

const TableLibraryActionDropdown = ({
  actionLinks,
  data,
  iconButtonClassName,
  width = 185
}) => {
  const popupStyle = useMemo(() => ({ width }), [width])

  return (
    actionLinks.some(({ render }) => render !== false) && (
      <ActionDropdownButton
        actionLinks={actionLinks}
        popupOn="hover"
        trigger={
          <CircleIconButton
            className={classNames(
              'hvr-grow',
              'ag-grid-action-column',
              iconButtonClassName
            )}
          >
            <i className={getIconClassName(iconNames.moreInfo)} />
          </CircleIconButton>
        }
        data={data}
        popupStyle={popupStyle}
      />
    )
  )
}

export default TableLibraryActionDropdown
