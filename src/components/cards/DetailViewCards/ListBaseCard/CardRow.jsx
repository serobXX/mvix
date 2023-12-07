import { Fragment } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import Tooltip from 'components/Tooltip'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'

import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import { TextWithTooltip } from 'components/typography'

const useStyles = makeStyles(
  ({ palette, type, colors, typography, fontSize, lineHeight }) => ({
    row: {
      padding: '12px 22px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${palette[type].detailPage.profileCard.footer.border}`,
      width: '100%',
      position: 'relative',
      '&:hover $hoverOverActionButton': {
        opacity: 1,
        visibility: 'visible'
      }
    },
    rowGrid: {
      gap: 8
    },
    icon: {
      color: colors.highlight,
      fontSize: 22,
      width: 25,
      height: 25,
      display: 'grid',
      placeItems: 'center'
    },
    text: {
      ...typography.lightText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary
    },
    itemRoot: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    },
    fullWidth: {
      gridColumnStart: 1,
      gridColumnEnd: 3
    },
    hoverOverActionButton: {
      ...typography.lightText[type],
      position: 'absolute',
      fontSize: '18px',
      lineHeight: '18px',
      padding: 5,
      top: 5,
      right: 9,
      opacity: 0,
      visibility: 'hidden',
      transition: '0.3s opacity, 0.3s visibility'
    }
  })
)

const CardRow = ({ rowItems, item, index: outerIndex, actions }) => {
  const classes = useStyles()
  return (
    <div className={classes.row}>
      <Spacing paddingVert={1} variant={0}>
        <Container cols="7-5" rootClassName={classes.rowGrid}>
          {rowItems.map(({ icon, name, render, tooltip, fullWidth }, index) => (
            <Fragment key={`row-item-${outerIndex}-${index}`}>
              {render ? (
                render(item[name], item)
              ) : (
                <div
                  className={classNames(classes.itemRoot, {
                    [classes.fullWidth]: fullWidth
                  })}
                >
                  <Tooltip
                    title={
                      typeof tooltip === 'function'
                        ? tooltip(item[name], item)
                        : tooltip
                    }
                    placement="top"
                    disableHoverListener={!tooltip}
                    arrow
                  >
                    <i
                      className={classNames(
                        typeof icon === 'function'
                          ? icon(item[name], item)
                          : icon,
                        classes.icon
                      )}
                    />
                  </Tooltip>
                  <TextWithTooltip
                    rootClassName={classes.text}
                    maxWidth={fullWidth ? 250 : 120}
                  >
                    {item[name] || 'N/A'}
                  </TextWithTooltip>
                </div>
              )}
            </Fragment>
          ))}
        </Container>
      </Spacing>

      <HoverOverDropdownButton
        iconButtonClassName={classes.hoverOverActionButton}
        items={actions || []}
        data={item}
      />
    </div>
  )
}

export default CardRow
