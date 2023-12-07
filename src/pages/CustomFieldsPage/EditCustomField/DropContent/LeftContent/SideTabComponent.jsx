import { forwardRef, useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import { SideTab } from 'components/tabs'
import { customFieldItemTypes } from 'constants/dnd'
import { FormControlInput } from 'components/formControls'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'

const CustomTab = forwardRef(
  (
    {
      children,
      isEdit,
      tabLabel,
      spanClassName,
      rightComponent,
      onUpdateLabel,
      ...props
    },
    ref
  ) => {
    const [text, setText] = useState()

    useEffect(() => {
      setText(tabLabel)
    }, [tabLabel])

    const handleChange = ({ target: { value } }) => {
      setText(value)
    }

    const handleBlur = () => {
      onUpdateLabel(text)
    }

    const handleKeyDown = event => {
      const key = event.key

      if (key === KEY_ENTER || key === KEY_TAB) {
        if (event.preventDefault) event.preventDefault()

        handleBlur()
      }
    }

    return (
      <div {...props} ref={ref}>
        {isEdit ? (
          <FormControlInput
            value={text}
            marginBottom={false}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <span className={spanClassName}>{tabLabel}</span>
        )}

        {rightComponent}
      </div>
    )
  }
)

const SideTabComponent = ({
  tabSelected,
  classes,
  handleChange,
  item,
  index,
  onMoveTabHover,
  onMoveTabComplete,
  actions,
  onUpdateLabel = f => f
}) => {
  const [isEdit, setEdit] = useState(false)
  const { label, value } = item
  const [{ isDragging }, drag] = useDrag({
    type: customFieldItemTypes.TAB,
    item: {
      code: value,
      index,
      item
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })
  const [{ isOver }, drop] = useDrop({
    accept: customFieldItemTypes.TAB,
    collect: monitor => ({
      isOver: monitor.isOver() && monitor.getItem()?.index === undefined
    }),
    hover: e => {
      onMoveTabHover(e.index, index, e.item)
    },
    drop: e => {
      onMoveTabComplete(e.index, index, e.item)
    }
  })

  const handleUpdateLabel = text => {
    onUpdateLabel(value, text)
    setEdit(false)
  }

  return (
    <div ref={ref => drop(drag(ref))}>
      {isOver && <div className={classes.draggingHover} />}
      {isDragging ? (
        <div className={classes.draggingHover} />
      ) : (
        <SideTab
          disableRipple
          label={label}
          tabLabel={label}
          selected={tabSelected}
          onClick={handleChange(value)}
          classes={{
            root: classes.tabRoot,
            selected: classes.tabSelected
          }}
          onDoubleClick={() => setEdit(true)}
          component={CustomTab}
          spanClassName={classes.tabWrapper}
          isEdit={isEdit}
          onUpdateLabel={handleUpdateLabel}
          rightComponent={
            <ActionDropdownButton
              actionLinks={actions}
              iconClassName={getIconClassName(iconNames.moreInfo)}
              data={item}
            />
          }
        />
      )}
    </div>
  )
}

export default SideTabComponent
