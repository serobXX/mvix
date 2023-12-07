import { Grid } from '@material-ui/core'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'

import Container from 'components/containers/Container'
import { FormControlInput } from 'components/formControls'
import { customFieldItemTypes } from 'constants/dnd'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const Row = ({
  classes,
  value,
  code,
  onChange,
  index,
  onRemoveRow,
  onAddRow,
  onMoveItemHover,
  onMoveItemComplete,
  error = {},
  touched = {}
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: customFieldItemTypes.ITEM_OPTIONS,
    item: {
      index,
      item: {
        value,
        code
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })
  const [, drop] = useDrop({
    accept: customFieldItemTypes.ITEM_OPTIONS,
    hover: item => {
      onMoveItemHover(item.index, index, item.item)
    },
    drop: () => onMoveItemComplete()
  })

  return (
    <Container
      alignItems="center"
      cols="8-1"
      rootClassName={classNames(classes.rowRoot, {
        [classes.rowDragging]: isDragging
      })}
      ref={ref => drop(drag(ref))}
    >
      {!isDragging && (
        <>
          <Grid container wrap="nowrap">
            <i
              className={classNames(
                classes.icon,
                getIconClassName(iconNames.dragHandler)
              )}
            />
            <FormControlInput
              value={value}
              onChange={onChange}
              error={error.value}
              touched={touched.value}
              marginBottom={false}
              fullWidth
            />
          </Grid>
          <Grid>
            <i
              className={classNames(
                classes.icon,
                getIconClassName(iconNames.add2)
              )}
              onClick={onAddRow}
            />
            <i
              className={classNames(
                classes.icon,
                classes.marginRightZero,
                getIconClassName(iconNames.remove2)
              )}
              onClick={onRemoveRow}
            />
          </Grid>
        </>
      )}
    </Container>
  )
}

export default Row
