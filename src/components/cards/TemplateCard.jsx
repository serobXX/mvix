import { useCallback, useState } from 'react'
import { Typography, makeStyles } from '@material-ui/core'

import { TextWithTooltip } from 'components/typography'
import { Card } from '.'
import classNames from 'classnames'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    border: `solid 1px ${palette[type].dialog.border}`,
    boxShadow: `0 2px 4px 0 ${palette[type].card.shadow}`,
    borderRadius: '8px',
    cursor: 'pointer'
  },
  select: {
    border: `solid 2px ${palette[type].buttons.white.hover.border}`
  },
  moreInfoCardHeader: {
    padding: '0 20px',
    marginBottom: 0,
    borderBottom: `solid 1px ${palette[type].dialog.border}`,
    backgroundColor: palette[type].card.greyHeader.background,
    borderRadius: '8px 8px 0 0'
  },
  moreInfoCardHeaderText: {
    ...typography.darkText[type],
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '50px',
    wordWrap: 'break-word',
    maxHeight: '50px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  content: {
    padding: 0,
    flexGrow: 1,
    maxHeight: '204px'
  },
  screenshotWrap: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0 0 8px 8px'
  },
  screenshot: {
    maxWidth: '100%',
    maxHeight: '100%',
    background: '#fff'
  },
  noScreenshot: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  noScreenshotText: {
    lineHeight: '190px',
    color: 'rgba(255, 255, 255, 0.3)'
  },
  footer: {
    padding: '5px 18px',
    backgroundColor: '#f9fafc',
    borderRadius: '0 0 7px 7px'
  },
  footerText: {
    color: '#3f3f3f'
  },
  blurred: {
    filter: 'blur(7px)'
  }
}))

const TemplateCard = ({
  className,
  title,
  src,
  isSelect = false,
  id,
  onSelectImage = f => f,
  name,
  imageWrapperClass,
  render = null,
  maxTitleWidth
}) => {
  const classes = useStyles()
  const [isLoading, setLoading] = useState(true)
  const handleClickImage = useCallback(
    () => onSelectImage({ target: { value: id, name } }),
    [name, id, onSelectImage]
  )

  return (
    <Card
      icon={false}
      title={!maxTitleWidth && title}
      titleComponent={
        maxTitleWidth && (
          <TextWithTooltip
            maxWidth={maxTitleWidth}
            rootClassName={classes.moreInfoCardHeaderText}
          >
            {title}
          </TextWithTooltip>
        )
      }
      rootClassName={classNames(classes.cardRoot, className, {
        [classes.select]: isSelect
      })}
      headerClasses={[classes.moreInfoCardHeader]}
      headerTextClasses={[classes.moreInfoCardHeaderText]}
      onClick={handleClickImage}
    >
      <div className={classes.content}>
        <div
          className={classNames(
            classes.screenshotWrap,
            !render && !src && classes.noScreenshot,
            imageWrapperClass
          )}
        >
          {render ? (
            render
          ) : src ? (
            <img
              className={classNames(classes.screenshot, {
                [classes.blurred]: isLoading
              })}
              src={src}
              alt=""
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          ) : (
            <Typography className={classes.noScreenshotText}>
              {'No Screenshot Available'}
            </Typography>
          )}
        </div>
      </div>
    </Card>
  )
}

export default TemplateCard
