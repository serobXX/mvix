import { makeStyles } from '@material-ui/core'
import { useDrag, useDrop } from 'react-dnd'
import { Resizable } from 're-resizable'
import classNames from 'classnames'

import { Text } from 'components/typography'
import { customFieldTypeDetails } from 'constants/customFields'
import { customFieldItemTypes } from 'constants/dnd'
import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormControlInput } from 'components/formControls'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  resizeRoot: {
    padding: 2
  },
  root: {
    padding: 5,
    border: '1px solid transparent',
    borderRadius: 4,
    '&:hover': {
      borderColor: '#00b3ff'
    }
  },
  active: {
    borderColor: '#00b3ff'
  },
  cardRoot: ({ fieldType }) => ({
    height: customFieldTypeDetails?.[fieldType]?.destinationHeight || 'auto',
    background: palette[type].pages.customField.edit.leftContent.background,
    borderRadius: 4,
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between'
  }),
  cardText: {
    ...typography.darkText[type],
    textTransform: 'capitalize',
    margin: '12px 0px',
    marginLeft: 12
  },
  cardIcon: {
    ...typography.lightAccent[type],
    lineHeight: 1,
    marginRight: 10,
    fontSize: 18,
    cursor: 'pointer'
  },
  draggingHover: {
    width: '100%',
    height: 42
  },
  dragHandler: {
    display: 'flex',
    width: 10,
    height: '100%',
    alignItems: 'center'
  },
  dragHandlerMaker: {
    width: 10,
    height: 10,
    borderRadius: '10px',
    backgroundColor: '#00b3ff'
  }
}))

const resizeValue = [0.5, 1, 1.5, 2, 2.5, 3]
const calculateResizeValue = (width, value, isTabs = false) =>
  (width / (isTabs ? 3 : 4)) * value

const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'

const CustomFieldItem = ({
  width,
  item,
  index,
  onMoveItemHover = f => f,
  onMoveItemComplete = f => f,
  actions = [],
  onUpdateLabel = f => f,
  isTabs = false,
  containerWidth,
  isResizeEnable = false,
  onResizeEnable = f => f,
  onUpdateWidth = f => f
}) => {
  const [isEdit, setEdit] = useState(false)
  const [value, setValue] = useState()
  const [resizeWidth, setResizeWidth] = useState(width)
  const { type, code, name } = item
  const classes = useStyles({
    fieldType: type
  })

  useEffect(() => {
    setValue(name)
  }, [name])

  const [{ isDragging }, drag] = useDrag({
    type: customFieldItemTypes.ITEM,
    item: {
      code,
      index,
      item
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })
  const [, drop] = useDrop({
    code,
    index,
    accept: customFieldItemTypes.ITEM,
    hover: _item => {
      onMoveItemHover(_item.index, index, _item.item)
    },
    drop: e => {
      onMoveItemComplete(e.index, index, e.item)
    }
  })

  const handleChange = ({ target: { value } }) => {
    setValue(value)
  }

  const handleBlur = () => {
    onUpdateLabel(code, value)
    setEdit(false)
  }

  const handleKeyDown = event => {
    const key = event.key

    if (key === KEY_ENTER || key === KEY_TAB) {
      if (event.preventDefault) event.preventDefault()

      handleBlur()
    }
  }

  const snapGridX = useMemo(() => {
    if (containerWidth) {
      return resizeValue.map(r =>
        calculateResizeValue(containerWidth, r, isTabs)
      )
    }
    return []
  }, [containerWidth, isTabs])

  const handleResizeStop = useCallback(
    (_, d, element) => {
      const clientWidth = element.clientWidth
      const w = (clientWidth / (containerWidth / (isTabs ? 3 : 4))).toFixed(2)
      setResizeWidth(w)
      onUpdateWidth(code, w)
    },
    [containerWidth, onUpdateWidth, isTabs, code]
  )

  return (
    <Resizable
      size={{
        width: `${calculateResizeValue(100, resizeWidth, isTabs)}%`,
        height: '100%'
      }}
      className={classes.resizeRoot}
      enable={{
        top: false,
        right: isResizeEnable,
        bottom: false,
        left: false
      }}
      minWidth={`${calculateResizeValue(
        100,
        Math.min(...resizeValue),
        isTabs
      )}%`}
      maxWidth={`${calculateResizeValue(
        100,
        Math.max(...resizeValue),
        isTabs
      )}%`}
      snap={{ x: snapGridX }}
      onResizeStop={handleResizeStop}
      handleComponent={{
        right: (
          <div className={classes.dragHandler}>
            <div className={classes.dragHandlerMaker}></div>
          </div>
        )
      }}
      handleStyles={{
        right: {
          right: '-3px'
        }
      }}
    >
      <div
        className={classNames(classes.root, {
          [classes.active]: isResizeEnable
        })}
        ref={ref => drop(drag(ref))}
        onClick={onResizeEnable}
      >
        {isDragging ? (
          <div className={classes.draggingHover} />
        ) : (
          <div className={classes.cardRoot} onDoubleClick={() => setEdit(true)}>
            {isEdit ? (
              <FormControlInput
                value={value}
                marginBottom={false}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <Text rootClassName={classes.cardText}>
                {name || customFieldTypeDetails?.[type]?.title || type}
              </Text>
            )}
            <ActionDropdownButton
              actionLinks={actions}
              iconClassName={getIconClassName(iconNames.moreInfo)}
              data={{ ...item, isItem: true }}
            />
          </div>
        )}
      </div>
    </Resizable>
  )
}

export default CustomFieldItem
