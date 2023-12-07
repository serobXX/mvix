import React, { cloneElement, forwardRef, useCallback } from 'react'
import { withStyles, Grid, Tooltip } from '@material-ui/core'
import classNames from 'classnames'

import { MaterialPopup } from 'components/Popup'
import { CircleIconButton } from 'components/buttons'
import PropTypes from 'constants/propTypes'
import PageTitle from 'components/PageContainer/PageTitle'
import TableLibraryActionDropdown from 'components/tableLibrary/TableLibraryActionDropdown'
import Sidebar from 'components/tableLibrary/Sidebar'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const styles = theme => {
  const { palette, type } = theme
  return {
    pageContainer: {
      position: 'relative',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pageContainer.border,
      background: palette[type].pageContainer.background,
      borderRadius: 8,
      boxShadow: `0 2px 4px 0 ${palette[type].pageContainer.shadow}`,
      width: 'calc(100% - 2px)',
      boxSizing: 'content-box !important',
      margin: 0
    },
    pageContainerHeader: {
      paddingLeft: 27,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].pageContainer.header.border,
      backgroundColor: palette[type].pageContainer.header.background,
      lineHeight: '59px',
      borderRadius: '8px 8px 0 0'
    },
    infoIconWrap: {
      paddingLeft: '7px',
      paddingRight: '7px',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: palette[type].pageContainer.header.infoIcon.border
    },
    pageContainerSubHeader: {
      paddingLeft: 27,
      borderBottom: `1px solid ${palette[type].pageContainer.subHeader.border}`,
      borderTop: `1px solid ${palette[type].pageContainer.subHeader.border}`,
      backgroundColor: palette[type].pageContainer.subHeader.background
    },
    circleIcon: {
      color: palette[type].pageContainer.header.infoIcon.color
    },
    settingsDropdown: {
      width: '315px'
    },
    isSelecting: {
      backgroundColor: palette[type].pageContainer.header.selecting,
      color: palette[type].pageContainer.header.titleColor
    },
    contentRoot: {
      flexGrow: 1
    }
  }
}

const PageContainer = forwardRef(
  (
    {
      classes,
      children,
      pageTitle,
      pageTitleIcon,
      selectedCount,
      MiddleActionComponent,
      ActionButtonsComponent,
      SubHeaderMenuComponent,
      SubHeaderLeftActionComponent,
      SubHeaderMiddleActionComponent,
      SubHeaderRightActionComponent,
      subHeader = true,
      header = true,
      pageContainerClassName = '',
      subHeaderRightActionComponentClassName = '',
      circleIconClickHandler = null,
      circleIconTitle,
      isShowSubHeaderComponent = true,
      subHeaderClassName = '',
      pageHeaderClassName = '',
      pageHeaderTitleClassName = '',
      circleIconClassName = '',
      actions = [],
      showActions,
      sidePanels = [],
      showSidebar,
      sidebarProps = {},
      FooterComponent
    },
    ref
  ) => {
    const renderSubHeaderMenuComponent = useCallback(
      close => {
        return cloneElement(SubHeaderMenuComponent, { close })
      },
      [SubHeaderMenuComponent]
    )

    return (
      <div
        ref={ref}
        className={classNames(classes.pageContainer, pageContainerClassName)}
      >
        {header && (
          <header
            className={classNames(
              classes.pageContainerHeader,
              pageHeaderClassName
            )}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <PageTitle
                  title={pageTitle}
                  icon={pageTitleIcon}
                  selectedCount={selectedCount}
                  titleClassName={pageHeaderTitleClassName}
                />
              </Grid>
              {MiddleActionComponent && (
                <Grid item>{MiddleActionComponent}</Grid>
              )}
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>{ActionButtonsComponent}</Grid>
                  {showActions && (
                    <Grid item className={classes.infoIconWrap}>
                      <TableLibraryActionDropdown actionLinks={actions} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </header>
        )}
        {subHeader && (
          <div
            className={classNames(
              classes.pageContainerSubHeader,
              subHeaderClassName
            )}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>{SubHeaderLeftActionComponent}</Grid>
              {SubHeaderMiddleActionComponent && (
                <Grid item>{SubHeaderMiddleActionComponent}</Grid>
              )}
              <Grid
                xs={2}
                item
                container
                justifyContent="flex-end"
                className={subHeaderRightActionComponentClassName}
              >
                {SubHeaderRightActionComponent && (
                  <Grid item>{SubHeaderRightActionComponent}</Grid>
                )}
                <Grid item className={classes.infoIconWrap}>
                  {!circleIconClickHandler && isShowSubHeaderComponent && (
                    <MaterialPopup
                      on="click"
                      position="bottom right"
                      trigger={
                        <CircleIconButton
                          className={classNames(
                            `hvr-grow ${classes.circleIcon}`,
                            circleIconClassName
                          )}
                        >
                          <i className={getIconClassName(iconNames.moreInfo)} />
                        </CircleIconButton>
                      }
                    >
                      {close => (
                        <div>{renderSubHeaderMenuComponent(close)}</div>
                      )}
                    </MaterialPopup>
                  )}

                  {circleIconClickHandler && (
                    <Tooltip arrow title={circleIconTitle}>
                      <CircleIconButton
                        onClick={circleIconClickHandler}
                        className={classNames(
                          `hvr-grow ${classes.circleIcon}`,
                          circleIconClassName
                        )}
                      >
                        <i className="icon-settings-1" />
                      </CircleIconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
        <Grid container wrap="nowrap">
          <div className={classes.contentRoot}>{children}</div>
          {showSidebar && (
            <div className={classes.sidebar}>
              <Sidebar panels={sidePanels} {...sidebarProps} />
            </div>
          )}
        </Grid>
        {FooterComponent && FooterComponent}
      </div>
    )
  }
)

PageContainer.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  pageTitle: PropTypes.string,
  pageTitleIcon: PropTypes.node,
  MiddleActionComponent: PropTypes.node,
  ActionButtonsComponent: PropTypes.node,
  SubHeaderMenuComponent: PropTypes.node,
  SubHeaderLeftActionComponent: PropTypes.node,
  SubHeaderMiddleActionComponent: PropTypes.node,
  SubHeaderRightActionComponent: PropTypes.node,
  subHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  header: PropTypes.bool,
  pageContainerClassName: PropTypes.string,
  subHeaderRightActionComponentClassName: PropTypes.string,
  circleIconClickHandler: PropTypes.func,
  circleIconTitle: PropTypes.string,
  replaceInfoIcon: PropTypes.string,
  isShowSubHeaderComponent: PropTypes.node,
  helpPageName: PropTypes.string,
  subHeaderClassName: PropTypes.string,
  selectedCount: PropTypes.number,
  subHeaderPopupStyle: PropTypes.object,
  showActions: PropTypes.bool,
  actions: PropTypes.array,
  showSidebar: PropTypes.bool,
  sidePanels: PropTypes.array,
  sidebarProps: PropTypes.object,
  FooterComponent: PropTypes.node
}

export default withStyles(styles)(PageContainer)
