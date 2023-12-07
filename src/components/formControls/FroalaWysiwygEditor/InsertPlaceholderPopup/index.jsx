import { useCallback, useMemo, useRef } from 'react'
import { makeStyles, useTheme } from '@material-ui/core'

import { MaterialPopup } from 'components/Popup'
import HoverOverDropdown from 'components/dropdowns/HoverOverDropdown'
import { placeholderEntityOptions } from 'constants/froalaPlaceholder'
import SubPlaceholderPopup from './SubPlaceholderPopup'
import { simulateEvent } from 'utils/formik'

const useStyles = makeStyles(() => ({
  placeHolderRoot: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: '40px',
    height: '50px'
  },
  listItem: {
    padding: '5px 10px'
  },
  hoverCard: {
    width: 150
  }
}))

const InsertPlaceholderPopup = ({
  open,
  froalaRef,
  onClose,
  entity,
  name,
  onChange
}) => {
  const placeholderRef = useRef()
  const classes = useStyles()
  const theme = useTheme()

  const handleInsertPlaceholder = useCallback(
    placeholder => {
      if (froalaRef.current) {
        froalaRef.current.html.insert(
          `<span class="fr-deletable">$\{${placeholder}}</span>`,
          true
        )
        onChange && onChange(simulateEvent(name, froalaRef.current.html.get()))
      }
    },
    [froalaRef, onChange, name]
  )

  const filteredListOptions = useMemo(
    () =>
      placeholderEntityOptions.filter(({ entities }) =>
        entities.includes(entity)
      ),
    [entity]
  )

  return (
    <MaterialPopup
      open={open}
      onClose={onClose}
      trigger={
        <div ref={placeholderRef} className={classes.placeHolderRoot}></div>
      }
      anchorEl={open && placeholderRef.current}
      withPortal
      on="click"
    >
      {closePopup => (
        <HoverOverDropdown
          items={filteredListOptions}
          listItemClassName={classes.listItem}
          hoverCardClassName={classes.hoverCard}
          hoverCardHeight={34}
          hoverCardWidth={150}
          color={theme.typography.darkText[theme.type].color}
          listWrapperComponent={SubPlaceholderPopup}
          listWrapperProps={{
            onInsertPlaceholder: handleInsertPlaceholder,
            closePopup
          }}
        />
      )}
    </MaterialPopup>
  )
}

export default InsertPlaceholderPopup
