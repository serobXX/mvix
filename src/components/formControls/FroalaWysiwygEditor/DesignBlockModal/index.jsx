import * as ReactDOMServer from 'react-dom/server'
import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'

import { DefaultModal } from 'components/modals'
import { ToggleTab } from 'components/tabs'
import {
  designBlockCategories,
  designBlockCategoryOptions,
  designBlockList
} from 'constants/froalaDesignBlock'
import Spacing from 'components/containers/Spacing'
import Container from 'components/containers/Container'
import { makeStyles } from '@material-ui/core'
import Scrollbars from 'components/Scrollbars'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, colors }) => ({
  thumbnailRoot: {
    width: '100%',
    boxShadow: palette[type].pages.dashboard.card.boxShadow,
    cursor: 'pointer',
    border: '3px solid transparent',
    borderRadius: 4,
    height: 'fit-content',

    '& img': {
      maxWidth: '100%',
      overflow: 'hidden',
      borderRadius: 4
    }
  },
  thumbnailActive: {
    borderColor: colors.highlight
  },
  listRoot: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }
}))

const DesignBlockModal = ({ open, onClose, onAdd }) => {
  const classes = useStyles()
  const [selectedCategory, setSelectedCategory] = useState(
    designBlockCategories.callToAction
  )
  const [selectedIndex, setSelectedIndex] = useState()

  const chunks = useMemo(() => {
    if (designBlockList[selectedCategory]) {
      const len = designBlockList[selectedCategory].length
      const rows = Math.floor(len / 4)
      const extraRow = len % 4
      const blocks = [...designBlockList[selectedCategory]].map(
        (block, index) => ({
          ...block,
          id: index
        })
      )
      const blockSize = Array(4)
        .fill()
        .map((_, index) => rows + (index + 1 <= extraRow ? 1 : 0))

      return blockSize.map((size, index) => {
        const prevSize = blockSize.reduce(
          (a, b, sizeIndex) => (a += sizeIndex < index ? b : 0),
          0
        )
        return blocks.slice(prevSize, prevSize + size)
      })
    }
    return []
  }, [selectedCategory])

  const handleChangeCategory = useCallback((_, tab) => {
    setSelectedIndex()
    setSelectedCategory(tab)
  }, [])

  const handleSave = useCallback(() => {
    if (!!selectedCategory && (!!selectedIndex || selectedIndex === 0)) {
      const block = designBlockList[selectedCategory]?.[selectedIndex]
      block &&
        onAdd(`${ReactDOMServer.renderToStaticMarkup(block.content)}<p></p>`)
    }
  }, [onAdd, selectedCategory, selectedIndex])

  return (
    <DefaultModal
      modalTitle="Design Blocks"
      open={open}
      onCloseModal={onClose}
      onClickSave={handleSave}
      buttonPrimaryDisabled={
        !selectedCategory || (!selectedIndex && selectedIndex !== 0)
      }
      buttonPrimaryText="Add"
      buttonPrimaryIcon={getIconClassName(iconNames.add2)}
      maxWidth="xl"
    >
      <Spacing container justifyContent="center">
        <ToggleTab
          tabs={designBlockCategoryOptions}
          value={selectedCategory}
          onChange={handleChangeCategory}
          tabWidth={120}
        />
      </Spacing>
      <Scrollbars autoHeight autoHeightMax="calc(100vh - 240px)">
        <Spacing>
          <Container cols="4">
            {chunks.map((list, index) => (
              <div
                key={`design-block-chunk-${index}`}
                className={classes.listRoot}
              >
                {list.map(({ id, thumbnail }, listIndex) => (
                  <div
                    className={classNames(classes.thumbnailRoot, {
                      [classes.thumbnailActive]: selectedIndex === id
                    })}
                    onClick={() => setSelectedIndex(id)}
                    key={`desing-block-list-${index}-${listIndex}`}
                  >
                    <img
                      src={thumbnail}
                      alt={`${selectedCategory}.${listIndex}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </Container>
        </Spacing>
      </Scrollbars>
    </DefaultModal>
  )
}

export default DesignBlockModal
