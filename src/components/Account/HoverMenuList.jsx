import React from 'react'

const HoverMenuList = ({ classes, menuItems, renderListItem }) => {
  return (
    <>
      {menuItems
        .filter(item => (item.hasOwnProperty('render') ? item.render : true))
        .map((itemData, index) => {
          const {
            onLinkClick: onClick,
            url,
            icon,
            iconClassName,
            description,
            printEnterprise,
            closeDropDownOnClick = true,
            type = 'item',
            disabled
          } = itemData

          if (type === 'row') {
            return (
              <div className={classes.subItemRow} key={description + index}>
                {itemData.items.map((subItem, subIndex) => {
                  const {
                    onLinkClick: onClick,
                    url,
                    icon,
                    text,
                    printEnterprise,
                    closeDropDownOnClick = true
                  } = subItem

                  return renderListItem({
                    type,
                    text,
                    index,
                    onClick,
                    closeDropDownOnClick,
                    url,
                    itemData,
                    subIndex,
                    printEnterprise,
                    icon
                  })
                })}
              </div>
            )
          }

          return renderListItem({
            type,
            text: itemData.text,
            index,
            onClick,
            closeDropDownOnClick,
            url,
            itemData,
            printEnterprise,
            icon,
            iconClassName,
            description,
            disabled
          })
        })}
    </>
  )
}

export default HoverMenuList
