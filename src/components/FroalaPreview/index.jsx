import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import { createPortal } from 'react-dom'

import useGoogleFonts from 'hooks/useGoogleFonts'
import Scrollbars from 'components/Scrollbars'
import { getLinkActionSelectors, getPageColor } from 'utils/froalaUtils'
import { generatePlaceholderPreview } from 'utils/froalaPlaceholder'
import { froalaEntityNames } from 'constants/froalaConstants'
import OptionTabs from './OptionTabs'
import { CircularLoader } from 'components/loaders'
import ProductItemsTable from './ProductItemsTable'
import { BlueButton, WhiteButton } from 'components/buttons'
import classNames from 'classnames'
import { applyCSSFileToElement } from 'utils/loadCssUtils'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(() => ({
  froalaRoot: ({ pageColor }) => ({
    padding: '20px 5px',
    paddingRight: 10,
    height: '100%',
    background: pageColor || '#FFF',

    '& .fr-view': {
      width: '100%',
      display: 'flow-root',
      '& p': {
        marginTop: 0,
        marginBottom: 0
      }
    },

    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#25252550',
      borderRadius: '5px'
    }
  }),
  emptyDiv: {
    display: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  footerRoot: {
    padding: '10px 10px',
    display: 'flex',
    gap: 10,
    justifyContent: 'flex-end'
  },
  container: {
    maxWidth: 1600,
    position: 'relative',
    margin: '0px auto'
  },
  smallContainer: {
    padding: '40px 40px !important',
    maxWidth: '950px',
    margin: '0px auto',
    border: '1px solid #dee2e6',
    position: 'relative',
    marginTop: 3,
    '@media print': {
      padding: '0px !important',
      border: 'none !important'
    }
  }
}))

const FroalaPreview = ({
  value,
  placeholderData,
  previewPlaceholder,
  entity,
  withActions,
  actionList,
  dynamicActions,
  isContainerWrap = false,
  renderContent
}) => {
  const [pageColor, setPageColor] = useState()
  const [selectedTab, setSelectedTab] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const classes = useStyles({ pageColor })
  const { data: googleFonts, isFetching, loadFonts } = useGoogleFonts()

  useEffect(() => {
    applyCSSFileToElement(
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.css',
      '.froala-view',
      'bootstrap-view'
    )
  }, [])

  useEffect(() => {
    if (value) {
      setPageColor(getPageColor(value))
    }
  }, [value])

  const handleClickEvent = useCallback(
    eventName => event => {
      event.preventDefault()
      const action = dynamicActions.find(({ name }) => name === eventName)
      if (action && action?.onClick) {
        action.onClick(event)
      }
    },
    [dynamicActions]
  )

  useEffect(() => {
    if (initialized) {
      getLinkActionSelectors(selector => {
        const eventName = selector.getAttribute('href').split('@')?.[1]
        selector.addEventListener('click', handleClickEvent(eventName))
        selector.setAttribute('href', `#${eventName}`)
      })
    }
    //eslint-disable-next-line
  }, [initialized])

  useEffect(() => {
    if (
      entity === froalaEntityNames.proposal &&
      document.querySelector('#estimate-option-tab') &&
      initialized &&
      previewPlaceholder
    ) {
      document
        .querySelector('#estimate-option-tab')
        .setAttribute('class', 'hide-tabs')
    }
    if (
      [froalaEntityNames.proposal, froalaEntityNames.invoice].includes(
        entity
      ) &&
      document.querySelector('#estimate-product-table') &&
      initialized &&
      previewPlaceholder
    ) {
      document
        .querySelector('#estimate-product-table')
        .setAttribute('class', 'hide-tabs')
    }
  }, [previewPlaceholder, entity, initialized])

  const handleLoadUsedFonts = useCallback(() => {
    const fontNodes = document.querySelectorAll(
      '.fr-view [style*="font-family"]'
    )
    const fonts = []
    fontNodes.forEach(node => fonts.push(node.style.fontFamily))
    loadFonts(fonts)
  }, [loadFonts])

  useEffect(() => {
    let timeout
    if (googleFonts.length && !isFetching) {
      timeout = setTimeout(handleLoadUsedFonts, 2000)
    }

    return () => {
      clearTimeout(timeout)
    }
    //eslint-disable-next-line
  }, [googleFonts])

  const templateValue = useMemo(() => {
    if (value && previewPlaceholder) {
      setInitialized(false)
      const data = generatePlaceholderPreview(
        value,
        Array.isArray(placeholderData)
          ? placeholderData[selectedTab || 0]
          : placeholderData,
        true
      )
      setTimeout(() => setInitialized(true), 1000)
      return data
    } else {
      setTimeout(() => setInitialized(true), 1000)
      return value
    }
  }, [value, previewPlaceholder, placeholderData, selectedTab])

  const renderOptions = useCallback(
    (_placeholderData, _selectedTab) => (
      <OptionTabs
        optionsLength={
          Array.isArray(_placeholderData) ? _placeholderData.length : 0
        }
        selectedTab={_selectedTab}
        onChangeTab={setSelectedTab}
      />
    ),
    []
  )

  const renderTable = useCallback((_placeholderData, _selectedTab) => {
    const _data = Array.isArray(_placeholderData)
      ? _placeholderData[_selectedTab || 0]
      : _placeholderData
    return (
      <ProductItemsTable
        item={_data?.productItems || {}}
        isMultipleShip={_data?.isMultipleShip || false}
      />
    )
  }, [])

  return (
    <div className={classNames(classes.froalaRoot, 'froala-view')}>
      {!initialized && <CircularLoader />}
      <Scrollbars>
        <div
          className={classNames(classes.container, {
            [classes.smallContainer]: isContainerWrap
          })}
        >
          {!initialized && <div className={classes.emptyDiv} />}
          <FroalaEditorView model={templateValue} />
          {withActions && (
            <div className={classNames(classes.footerRoot, 'no-print')}>
              {actionList &&
                actionList
                  .filter(({ isVisible }) => isVisible !== false)
                  .map(
                    (
                      { isFilled = false, icon, text, onClick, render },
                      index
                    ) => (
                      <Fragment key={`froala-preview-action-${index}`}>
                        {render ||
                          (isFilled ? (
                            <BlueButton
                              onClick={event => onClick(event, selectedTab)}
                              iconClassName={icon}
                            >
                              {text}
                            </BlueButton>
                          ) : (
                            <WhiteButton
                              onClick={event => onClick(event, selectedTab)}
                              iconClassName={icon}
                            >
                              {text}
                            </WhiteButton>
                          ))}
                      </Fragment>
                    )
                  )}
            </div>
          )}
          {entity === froalaEntityNames.proposal &&
            document.querySelector('#estimate-option-tab') &&
            initialized &&
            createPortal(
              renderOptions(placeholderData, selectedTab),
              document.querySelector('#estimate-option-tab')
            )}
          {[froalaEntityNames.proposal, froalaEntityNames.invoice].includes(
            entity
          ) &&
            document.querySelector('#estimate-product-table') &&
            initialized &&
            createPortal(
              renderTable(placeholderData, selectedTab),
              document.querySelector('#estimate-product-table')
            )}
          {renderContent ? renderContent : null}
        </div>
      </Scrollbars>
    </div>
  )
}

FroalaPreview.propTypes = {
  value: PropTypes.string.isRequired,
  placeholderData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
  previewPlaceholder: PropTypes.bool,
  entity: PropTypes.string,
  withActions: PropTypes.bool,
  actionList: PropTypes.arrayOf(
    PropTypes.shape({
      isVisible: PropTypes.bool,
      isFilled: PropTypes.bool,
      icon: PropTypes.string,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      render: PropTypes.object
    })
  ),
  dynamicActions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  )
}

FroalaPreview.defaultProps = {
  entity: froalaEntityNames.email,
  previewPlaceholder: true,
  withActions: false,
  actionList: [],
  dynamicActions: []
}

export default FroalaPreview
