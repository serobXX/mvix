import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Text } from 'components/typography'
import { profileCardEditors } from 'constants/detailView'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(
  ({ palette, type, typography, fontSize, lineHeight, colors }) => ({
    root: ({ isSmallVariant }) => ({
      marginLeft: '-18px',
      marginBottom: '-25px',
      width: 'calc(100% + 36px)',
      background: palette[type].detailPage.profileCard.footer.background,
      borderTop: `1px solid ${palette[type].detailPage.profileCard.footer.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: isSmallVariant ? 'auto' : 63,
      padding: '10px'
    }),
    footerOwnerRoot: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 200
    },
    footerOwnerText: {
      ...typography.darkText[type],
      fontSize: fontSize.secondary,
      lineHeight: '30px'
    },
    ownerIcon: {
      fontSize: 30,
      color: colors.highlight,
      marginRight: 16
    }
  })
)

const BottomContent = ({
  owner,
  footerComponent,
  showEditor,
  renderEditors,
  onEditField,
  hideOwnerIcon,
  rootClassName,
  variant
}) => {
  const isSmallVariant = variant === 'small'
  const classes = useStyles({ isSmallVariant })
  return (
    <div className={classNames(classes.root, rootClassName)}>
      {footerComponent ||
        (owner ? (
          <div
            className={classes.footerOwnerRoot}
            onDoubleClick={onEditField(profileCardEditors.footer)}
          >
            {showEditor(profileCardEditors.footer) ? (
              renderEditors(
                profileCardEditors.footer,
                null,
                null,
                showEditor(profileCardEditors.footer, undefined, false)
              )
            ) : (
              <>
                {!hideOwnerIcon && (
                  <i
                    className={classNames(
                      getIconClassName(iconNames.salesPerson),
                      classes.ownerIcon
                    )}
                  />
                )}
                <Text rootClassName={classes.footerOwnerText}>
                  {`${owner?.first_name} ${owner?.last_name}`}
                </Text>
              </>
            )}
          </div>
        ) : null)}
    </div>
  )
}

export default BottomContent
