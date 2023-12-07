import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClickAwayListener, makeStyles } from '@material-ui/core'

import { BlueButton } from 'components/buttons'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { FormControlReactSelect } from 'components/formControls'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    position: 'relative'
  },
  mainButton: {
    paddingRight: 0,
    zIndex: 2
  },
  arrowButton: {
    padding: '7px 9px',
    width: 32,
    minWidth: 32,
    marginLeft: 18
  },
  selectRoot: {
    position: 'absolute',
    zIndex: 0,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    '& .react-select__control': {
      minHeight: '100%'
    }
  }
}))

const SplitButton = ({
  items,
  defaultSelected,
  onClick,
  onChange,
  ...props
}) => {
  const classes = useStyles()
  const [currentItem, setCurrentItem] = useState()
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const handleSelectItem = useCallback(
    ({ target: { label, value, onClick, icon } }) => {
      setCurrentItem({ label, value, onClick, icon })
      onChange && onChange({ label, value, onClick, icon })
      setMenuIsOpen(false)
    },
    [onChange]
  )

  const parseItem = useMemo(() => {
    return items
      .filter(({ render }) => render !== false)
      .map(({ label, onClick, icon, value }) => ({
        label,
        value,
        onClick,
        icon
      }))
  }, [items])

  useEffect(() => {
    if (parseItem?.length) {
      setCurrentItem(
        (defaultSelected &&
          parseItem.find(({ value }) => value === defaultSelected)) ||
          parseItem[0]
      )
    }
    //eslint-disable-next-line
  }, [parseItem])

  const handleClick = e => {
    if (currentItem.onClick) {
      currentItem.onClick()
    } else onClick && onClick(e, currentItem?.value || currentItem?.value)
  }

  const handleClickArrow = e => {
    e.stopPropagation()
    setMenuIsOpen(m => !m)
  }

  return (
    !!items?.length && (
      <ClickAwayListener onClickAway={() => setMenuIsOpen(false)}>
        <div className={classes.root}>
          <BlueButton
            {...props}
            onClick={handleClick}
            className={classes.mainButton}
            iconClassName={currentItem?.icon}
          >
            {currentItem?.label}

            <div className={classes.arrowButton} onClick={handleClickArrow}>
              <i className={getIconClassName(iconNames.arrowDown)} />
            </div>
          </BlueButton>
          <FormControlReactSelect
            menuIsOpen={menuIsOpen}
            value={currentItem?.value}
            formControlContainerClass={classes.selectRoot}
            onChange={handleSelectItem}
            options={parseItem}
            withPortal
            marginBottom={false}
            fullHeight
            isSort={false}
          />
        </div>
      </ClickAwayListener>
    )
  )
}

export default SplitButton
