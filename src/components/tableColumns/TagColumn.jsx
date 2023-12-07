import { useEffect, useMemo, useRef, useState } from 'react'
import { Grid, IconButton, Tooltip, makeStyles } from '@material-ui/core'
import ResizeObserver from 'react-resize-observer'

import { TagChip } from '../chips'
import { sortByTag, sortByTagDesc } from 'utils/libraryUtils'
import { MaterialPopup } from 'components/Popup'
import { materialPopupPosition } from 'constants/common'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    position: 'relative'
  },
  tagRoot: ({ maxWidth }) => ({
    width: 'fit-content',
    '& > span': {
      display: 'inline',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: `${maxWidth}px !important`
    }
  }),
  popupTagRoot: {
    width: 'fit-content',
    '& > span': {
      display: 'inline',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '195px'
    }
  },
  overflowIconWrap: {
    padding: '0px',
    width: '22px',
    height: '22px',
    margin: 'auto 0px',
    marginLeft: 5
  },
  overflowIconContent: {
    fontSize: '20px',
    width: 'inherit',
    height: 'inherit',
    color: palette[type].header.rightAction.iconColor
  },
  overflowIcon: {
    transform: 'rotate(90deg)'
  },
  popupContent: {
    padding: '5px'
  },
  popupTag: {
    margin: '5px 0 5px 5px'
  },
  tagWrap: {
    padding: '4px'
  }
}))

const popupContentStyle = {
  animation: 'fade-in',
  width: 230
}

const TagColumn = ({
  maxWidth = 150,
  descend,
  value,
  getValue,
  data,
  showAll = false,
  justifyContent = 'center'
}) => {
  const containerRef = useRef()
  const [containerWidth, setContainerWidth] = useState(0)
  const tags = useMemo(
    () => (getValue ? getValue(data) : value) || [],
    [value, data, getValue]
  )
  const tagChipRef = useRef()
  const classes = useStyles({
    maxWidth
  })
  const [showTooltip, setShowTooltip] = useState(false)
  const [maxDisplayTags, setMaxDisplayTags] = useState(6)

  const [hasTags, displayTags, popupTags] = useMemo(() => {
    const hasTags = tags && tags.length && tags.every(({ tag }) => tag)
    const displayTagsCount = hasTags
      ? tags.length > maxDisplayTags
        ? maxDisplayTags
        : tags.length
      : 0
    const newTags = hasTags ? [...tags] : []

    const sortedTags = descend ? sortByTagDesc(newTags) : sortByTag(newTags)

    return [
      hasTags,
      showAll ? sortedTags : sortedTags.slice(0, displayTagsCount),
      showAll ? [] : sortedTags.slice(displayTagsCount)
    ]
  }, [tags, maxDisplayTags, descend, showAll])

  useEffect(() => {
    if (tagChipRef.current) {
      const textElement = tagChipRef.current?.querySelector('span')
      setShowTooltip(
        textElement?.clientWidth !== textElement?.scrollWidth ||
          textElement?.clientWidth > maxWidth
      )
    }
    // eslint-disable-next-line
  }, [tagChipRef.current, maxWidth])

  const handleResize = ({ height, width }) => {
    if (height >= 60) {
      setMaxDisplayTags(max => max - 1)
    } else if (width !== containerWidth) {
      setMaxDisplayTags(max => max + 1)
    }
    setContainerWidth(width)
  }

  useEffect(() => {
    if (containerRef.current && containerRef.current.clientHeight >= 60) {
      setMaxDisplayTags(max => max - 1)
    }
  }, [maxDisplayTags])

  if (!hasTags) {
    return 'N/A'
  }

  return (
    <Grid
      container
      justifyContent={justifyContent}
      className={classes.root}
      ref={containerRef}
    >
      {displayTags.map((tag, index) => (
        <Tooltip arrow key={index} title={showTooltip ? tag.tag : ''}>
          <Grid item className={classes.tagWrap}>
            <TagChip
              tag={tag}
              classes={{
                root: classes.tagRoot
              }}
              ref={tagChipRef}
            />
          </Grid>
        </Tooltip>
      ))}
      {!!popupTags.length && (
        <MaterialPopup
          on="hover"
          position={materialPopupPosition.bottomCenter}
          contentStyle={popupContentStyle}
          trigger={
            <IconButton
              classes={{
                root: classes.overflowIconWrap,
                label: classes.overflowIconContent
              }}
            >
              <i
                className={[
                  getIconClassName(iconNames.moreInfo),
                  classes.overflowIcon
                ].join(' ')}
              />
            </IconButton>
          }
        >
          <Grid container className={classes.popupContent}>
            {popupTags.map((tag, index) => (
              <Grid item className={classes.popupTag} key={index}>
                <TagChip
                  tag={tag}
                  classes={{
                    root: classes.popupTagRoot
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </MaterialPopup>
      )}
      <ResizeObserver onResize={handleResize} />
    </Grid>
  )
}

export default TagColumn
