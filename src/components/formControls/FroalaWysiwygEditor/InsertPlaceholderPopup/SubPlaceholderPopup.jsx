import { useEffect, useMemo } from 'react'
import { makeStyles, useTheme } from '@material-ui/core'

import { useLazyGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { MaterialPopup } from 'components/Popup'
import HoverOverDropdown from 'components/dropdowns/HoverOverDropdown'
import { materialPopupPosition } from 'constants/common'
import { customFieldTypes } from 'constants/customFields'
import { placeholderEntityToCustomFieldEntity } from 'constants/froalaPlaceholder'
import { LibraryGridLoader } from 'components/loaders'

const useStyles = makeStyles(() => ({
  listItem: {
    padding: '5px 10px'
  },
  hoverCard: {
    width: 130
  },
  loaderRoot: {
    padding: 20
  }
}))

const SubPlaceholderPopup = ({
  item,
  children,
  onInsertPlaceholder,
  closePopup
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [getFields, { data, isFetching }] =
    useLazyGetCustomFieldsByEntityQuery()

  useEffect(() => {
    if (placeholderEntityToCustomFieldEntity[item.value]) {
      getFields(
        {
          entityType: placeholderEntityToCustomFieldEntity[item.value]
        },
        true
      )
    }
    //eslint-disable-next-line
  }, [item.value])

  const list = useMemo(
    () =>
      (item?.options || data)
        .filter(
          ({ type }) =>
            ![
              customFieldTypes.tab,
              customFieldTypes.container,
              customFieldTypes.textarea,
              customFieldTypes.json,
              'internal'
            ].includes(type)
        )
        .map(({ code, name }) => ({
          label: name,
          onClick: () => {
            onInsertPlaceholder(`${item.value}.${code}`)
            closePopup()
          }
        })),
    [onInsertPlaceholder, data, item.value, closePopup, item?.options]
  )

  return (
    <MaterialPopup
      trigger={children}
      withPortal
      placement={materialPopupPosition.leftCenter}
      style={isFetching ? { width: 590 } : null}
    >
      {isFetching ? (
        <div className={classes.loaderRoot}>
          <LibraryGridLoader
            rows={5}
            cols={4}
            rectHeight={34}
            rectWidth={130}
            footerHeight={0}
            rowSpacing={44}
            padding={10}
            maxWidth={580}
          />
        </div>
      ) : (
        <HoverOverDropdown
          items={list}
          listItemClassName={classes.listItem}
          hoverCardClassName={classes.hoverCard}
          hoverCardHeight={34}
          hoverCardWidth={130}
          color={theme.typography.lightText[theme.type].color}
          cols={Math.ceil(list.length / 10)}
        />
      )}
    </MaterialPopup>
  )
}

export default SubPlaceholderPopup
