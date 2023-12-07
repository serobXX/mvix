import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import GridCardBase from 'components/cards/GridCardBase'
import { Text } from 'components/typography'
import CardRow from './CardRow'
import Scrollbars from 'components/Scrollbars'
import { EmptyPlaceholder } from 'components/placeholder'
import { CircularLoader } from 'components/loaders'
import handleBottomScroll from 'utils/handleBottomScroll'

const useStyles = makeStyles(
  ({ palette, type, typography, colors, lineHeight, fontSize }) => ({
    cardRoot: {
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    scrollbarRoot: ({ showFooter }) => ({
      height: showFooter ? '495px !important' : '557px !important'
    }),
    contentWrap: ({ showFooter }) => ({
      padding: '8px 0px',
      paddingBottom: showFooter ? 0 : 8
    }),
    hoverOverActionButton: {
      color: typography.darkText[type].color,
      marginRight: '-9px',
      transition: '0.3s opacity, 0.3s visibility',
      fontSize: '1rem'
    },
    titleComponent: {
      width: 21
    },
    titleRoot: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      '& i': {
        fontSize: 20,
        color: colors.highlight
      },
      '& p': {
        ...typography.dashboardTitle[type],
        lineHeight: '32px'
      }
    },
    footerRoot: {
      marginLeft: '-5px',
      marginBottom: '-5px',
      width: 'calc(100% + 8px)',
      background: palette[type].detailPage.profileCard.footer.background,
      borderTop: `1px solid ${palette[type].detailPage.profileCard.footer.border}`,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 55,
      borderRadius: 4
    },
    footerText: {
      ...typography.darkText[type],
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary
    }
  })
)

const ListBaseCard = ({
  title,
  titleIcon,
  data,
  rowItems,
  actions,
  showFooter = false,
  footerLeftText = '',
  footerRightText = '',
  emptyText = 'No Data',
  emptyRequestText = '',
  onRequestTextClick,
  rowActions,
  isLoading = false,
  onFetchMore = f => f,
  iconButtonComponent
}) => {
  const classes = useStyles({ showFooter })
  return (
    <GridCardBase
      titleComponentWrapClassName={classNames({
        [classes.titleComponent]: !!actions?.length
      })}
      titleComponent={<div></div>}
      headerComponent={
        <div className={classes.titleRoot}>
          <i className={titleIcon} />
          <Text>{title}</Text>
        </div>
      }
      dropdown={false}
      rootClassName={classes.cardRoot}
      removeScrollbar
      contentWrapClassName={classes.contentWrap}
      iconButtonComponent={
        iconButtonComponent || (
          <HoverOverDropdownButton
            iconButtonClassName={classes.hoverOverActionButton}
            items={actions || []}
          />
        )
      }
    >
      <Scrollbars
        className={classes.scrollbarRoot}
        onUpdate={handleBottomScroll(onFetchMore)}
      >
        {isLoading && <CircularLoader />}
        {!!data.length ? (
          data.map((item, index) => (
            <CardRow
              item={item}
              rowItems={rowItems}
              index={index}
              key={`invoice-opp-card-${index}`}
              actions={rowActions}
            />
          ))
        ) : (
          <EmptyPlaceholder
            text={emptyText}
            requestText={emptyRequestText}
            onClick={onRequestTextClick}
            fullHeight
            variant="small"
          />
        )}
      </Scrollbars>
      {showFooter && (
        <div className={classes.footerRoot}>
          <Text rootClassName={classes.footerText}>{footerLeftText}</Text>
          <Text rootClassName={classes.footerText}>{footerRightText}</Text>
        </div>
      )}
    </GridCardBase>
  )
}

export default ListBaseCard
