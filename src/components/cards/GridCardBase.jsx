import React, { forwardRef, useCallback } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { Card } from 'components/cards'
import Spacing from 'components/containers/Spacing'
import Scrollbars from 'components/Scrollbars'

const useStyles = makeStyles(({ typography, type, palette }) => ({
  cardWrapper: {
    width: '100%',
    height: '100%'
  },
  cardRoot: ({ isTitle }) => ({
    paddingTop: isTitle ? 12 : 0,
    paddingBottom: 0,
    height: '100%',
    background: palette[type].pages.dashboard.card.background,
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  }),
  cardHeader: {
    marginBottom: 6
  },
  cardHeaderText: {
    ...typography.dashboardTitle[type]
  },
  contentRoot: {
    border: '5px solid ' + palette[type].pages.dashboard.card.background,
    borderRightWidth: '4px',
    backgroundColor: palette[type].tableLibrary.body.row.background
  },
  contentWrap: {
    padding: '15px 22px'
  },
  footerRoot: {
    padding: '15px 22px'
  },
  footerNoPadding: {
    padding: '15px 0px'
  },
  fullHeight: {
    height: '100%'
  },
  faded: {
    opacity: '0.5'
  }
}))

const GridCardBase = forwardRef(
  (
    {
      title,
      titleComponent,
      headerTextClasses = [],
      children,
      scrollbarRootClassName,
      removeSidePaddings = false,
      removeScrollbar = false,
      contentWrapClassName,
      rootClassName,
      headerClasses = [],
      iconButtonComponent,
      cardWrapperClassName,
      contentRootClassName,
      showFooter,
      footerComponent,
      removeFooterSidePaddings = false,
      variant = 1,
      isFaded,
      ...props
    },
    ref
  ) => {
    const isSecondVariant = variant === 2
    const classes = useStyles({
      isTitle: !!title || !!titleComponent
    })

    const ApplyScrollbar = useCallback(
      ({ children: _children }) =>
        removeScrollbar || isSecondVariant ? (
          _children
        ) : (
          <Scrollbars className={scrollbarRootClassName}>
            {_children}
          </Scrollbars>
        ),
      [removeScrollbar, scrollbarRootClassName, isSecondVariant]
    )

    const Content = useCallback(
      ({ children: _children }) =>
        isSecondVariant ? (
          _children
        ) : (
          <Spacing
            variant={0}
            rootClassName={classNames(
              classes.contentRoot,
              contentRootClassName
            )}
            ref={ref}
          >
            <ApplyScrollbar>
              <Spacing
                variant={0}
                rootClassName={classNames(
                  {
                    [classes.contentWrap]: !removeSidePaddings
                  },
                  contentWrapClassName
                )}
              >
                {_children}
              </Spacing>
            </ApplyScrollbar>
          </Spacing>
        ),
      [
        isSecondVariant,
        classes,
        removeSidePaddings,
        contentRootClassName,
        contentWrapClassName,
        ref
      ]
    )

    return (
      <Grid
        item
        className={classNames(classes.cardWrapper, cardWrapperClassName, {
          [classes.faded]: isFaded
        })}
      >
        <Card
          removeSidePaddings={!isSecondVariant}
          title={title}
          headerClasses={[
            ...(isSecondVariant ? [] : [classes.cardHeader]),
            ...headerClasses
          ]}
          headerTextClasses={[classes.cardHeaderText, ...headerTextClasses]}
          dropdown={false}
          titleComponent={titleComponent}
          rootClassName={classNames(
            classes.fullHeight,
            { [classes.cardRoot]: !isSecondVariant },
            rootClassName
          )}
          icon={!!iconButtonComponent}
          iconButtonComponent={iconButtonComponent}
          {...props}
        >
          <Content>{children}</Content>
          {showFooter && footerComponent && !isSecondVariant && (
            <Spacing
              variant={0}
              rootClassName={classNames(classes.footerRoot, {
                [classes.footerNoPadding]: removeFooterSidePaddings
              })}
            >
              {footerComponent}
            </Spacing>
          )}
        </Card>
      </Grid>
    )
  }
)

export default GridCardBase
