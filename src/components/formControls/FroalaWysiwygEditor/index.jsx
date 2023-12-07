import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import classNames from 'classnames'

import { simulateEvent } from 'utils/formik'
import { makeStyles } from '@material-ui/core'
import { ErrorText } from 'components/typography'
import { defaultFontFamily, froalaEntityNames } from 'constants/froalaConstants'
import {
  getDeleteEstimateIcon,
  getDeleteProductItemIcon,
  getPageColor
} from 'utils/froalaUtils'
import useGoogleFonts from 'hooks/useGoogleFonts'
import { insertPlaceholderCommand, pageColorCommand } from './config'
import Tooltip from 'components/Tooltip'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import InsertPlaceholderPopup from './InsertPlaceholderPopup'
import { generatePlaceholderPreview } from 'utils/froalaPlaceholder'
import { getStyles } from './styles'
import DesignBlockModal from './DesignBlockModal'
import FroalaEditor from './FroalaEditor'
import { applyCSSFileToElement } from 'utils/loadCssUtils'
import useUser from 'hooks/useUser'
import {
  placeholderEntityValues,
  placeholderStaticCodes
} from 'constants/froalaPlaceholder'

const useStyles = makeStyles(getStyles)

const FroalaWysiwygEditor = forwardRef(
  (
    {
      name,
      value,
      error,
      touched,
      absoluteErrorText,
      onChange,
      formControlContainerClass,
      errorTextClass,
      config,
      fullWidth = false,
      readOnly = false,
      readOnlyWithoutSelection,
      fileName,
      isBottomError = false,
      showBackgroundPicker = false,
      entity = froalaEntityNames.email,
      placeholderData,
      previewPlaceholder,
      hidePlaceholder,
      isRemoveUnusedPlacehoder = false,
      disabled,
      ...props
    },
    parentRef
  ) => {
    const [toolbarBtnNo, setToolbarBtnNo] = useState()
    const [, setFontFamilyPage] = useState([])
    const [pageColor, setPageColor] = useState()
    const [placeholderPopupOpen, setPlaceholderPopupOpen] = useState(false)
    const [contentChanged, setContentChanged] = useState(false)
    const [isDesignBlockModalOpen, setDesignBlockModalOpen] = useState(false)
    const rootRef = useRef()
    const ref = useRef()
    const classes = useStyles({ pageColor, hidePlaceholder })
    const { data: user } = useUser()

    const { data: googleFonts, isFetching, loadFonts } = useGoogleFonts()

    const isErrorIcon = !isBottomError && !!error && touched
    const froalaRef = parentRef || ref

    useEffect(() => {
      applyCSSFileToElement(
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.css',
        '.fr-wrapper',
        'bootstrap-wrapper'
      )
    }, [])

    useEffect(() => {
      document.body.classList.add(classes.froalaRoot)
      if (rootRef.current) {
        setToolbarBtnNo(
          Math.floor(
            (rootRef.current.clientWidth - (hidePlaceholder ? 60 : 120)) / 45
          )
        )
      }
      return () => {
        document.body.classList.remove(classes.froalaRoot)
      }
    }, [classes.froalaRoot, hidePlaceholder])

    useEffect(() => {
      pageColorCommand(color => {
        setPageColor(color)
      })
      insertPlaceholderCommand(function () {
        setPlaceholderPopupOpen(open => !open)
      })
    }, [])

    const removeEstimateContainer = useCallback(() => {
      if (document.querySelector('#estimate-option-tab')) {
        document.querySelector('#estimate-option-tab').remove()
      }
    }, [])

    const removeProductItemContainer = useCallback(() => {
      if (document.querySelector('#estimate-product-table')) {
        document.querySelector('#estimate-product-table').remove()
      }
    }, [])

    useEffect(() => {
      if (contentChanged) {
        setContentChanged(false)
      }
      //eslint-disable-next-line
    }, [value])

    useEffect(() => {
      const pageColor = getPageColor(value)
      setPageColor(pageColor)

      if (getDeleteEstimateIcon()) {
        getDeleteEstimateIcon().addEventListener(
          'click',
          removeEstimateContainer
        )
      }
      if (getDeleteProductItemIcon()) {
        getDeleteProductItemIcon().addEventListener(
          'click',
          removeProductItemContainer
        )
      }
      return () => {
        if (getDeleteEstimateIcon()) {
          getDeleteEstimateIcon().removeEventListener(
            'click',
            removeEstimateContainer
          )
        }
        if (getDeleteProductItemIcon()) {
          getDeleteProductItemIcon().removeEventListener(
            'click',
            removeProductItemContainer
          )
        }
      }
      //eslint-disable-next-line
    }, [contentChanged])

    useEffect(() => {
      if (value && previewPlaceholder) {
        const _placeholderData = { ...placeholderData }
        if (user) {
          _placeholderData[placeholderEntityValues.salesPerson] = {
            [placeholderStaticCodes.appointmentLink]:
              user?.appointmentLink || ''
          }
        }
        onChange(
          simulateEvent(
            name,
            generatePlaceholderPreview(
              value,
              _placeholderData,
              isRemoveUnusedPlacehoder
            )
          )
        )
      }
      //eslint-disable-next-line
    }, [value, previewPlaceholder, user])

    const fontFamily = useMemo(() => {
      let fonts = { ...defaultFontFamily }

      googleFonts &&
        googleFonts.forEach(font => {
          if (font.variants.includes('regular')) {
            fonts["'" + font.family + "'," + font.category] = font.family
          }
        })
      return fonts
    }, [googleFonts])

    const loadAllFonts = useCallback(() => {
      if (rootRef.current) {
        const fontFamilyEle = rootRef.current.querySelector(
          '[id*="dropdown-menu-fontFamily-"]'
        )
        const listEle =
          fontFamilyEle && fontFamilyEle.querySelector('.fr-dropdown-wrapper')

        if (listEle) {
          listEle.addEventListener('scroll', ({ target }) => {
            const page =
              Math.floor((Math.floor((target.scrollTop - 8) / 30) + 15) / 15) +
              1

            setFontFamilyPage(p => {
              if (!p.includes(page)) {
                let fonts = [...Object.values(fontFamily)].slice(
                  (page - 1) * 15,
                  page * 15
                )
                if (fonts.length) {
                  loadFonts(fonts)
                }
                return [...p, page]
              }
              return p
            })
          })
        }
      }
    }, [fontFamily, loadFonts])

    const handleLoadUsedFonts = useCallback(() => {
      if (rootRef.current) {
        const fontNodes = rootRef.current.querySelectorAll(
          '.fr-view [style*="font-family"]'
        )
        const fonts = []
        fontNodes.forEach(node => fonts.push(node.style.fontFamily))
        loadFonts(fonts)
      }
    }, [loadFonts])

    const handleInitialized = useCallback(() => {
      handleLoadUsedFonts()
      loadAllFonts()
    }, [handleLoadUsedFonts, loadAllFonts])

    useEffect(() => {
      let timeout
      if (googleFonts.length) {
        timeout = setTimeout(handleLoadUsedFonts, 2000)
      }

      return () => {
        clearTimeout(timeout)
      }
      //eslint-disable-next-line
    }, [googleFonts])

    const handleAddDesignBlock = useCallback(
      content => {
        if (froalaRef.current && !!content) {
          froalaRef.current.html.insert(content)
        }
        setDesignBlockModalOpen(false)
      },
      [froalaRef]
    )

    return (
      <div
        className={classNames(classes.root, formControlContainerClass, {
          [classes.fullWidth]: fullWidth,
          [classes.fullPage]: config?.fullPage || showBackgroundPicker,
          [classes.rootDisabled]: disabled
        })}
        ref={rootRef}
        id="scrollableContainer"
        {...props}
      >
        <FroalaEditor
          ref={froalaRef}
          entity={entity}
          config={config}
          toolbarBtnNo={toolbarBtnNo}
          isFetching={isFetching}
          readOnly={readOnly}
          readOnlyWithoutSelection={readOnlyWithoutSelection}
          hidePlaceholder={hidePlaceholder}
          setContentChanged={setContentChanged}
          onInitialized={handleInitialized}
          fontFamily={fontFamily}
          showBackgroundPicker={showBackgroundPicker}
          value={value}
          name={name}
          onChange={onChange}
          onDesignBlockOpen={() => setDesignBlockModalOpen(true)}
          fileName={fileName}
        />
        {disabled && <div className={classes.disabled} />}
        {isErrorIcon && (
          <Tooltip title={error} placement="top" arrow>
            <i
              className={classNames(
                getIconClassName(iconNames.error, iconTypes.solid),
                classes.errorIcon
              )}
            />
          </Tooltip>
        )}
        {!readOnly && !readOnlyWithoutSelection && (
          <InsertPlaceholderPopup
            open={placeholderPopupOpen}
            froalaRef={froalaRef}
            onClose={() => setPlaceholderPopupOpen(false)}
            entity={entity}
            onChange={onChange}
            name={name}
          />
        )}
        {isBottomError && (
          <ErrorText
            absolute={absoluteErrorText}
            condition={touched && !!error}
            error={error}
            rootClassName={errorTextClass}
          />
        )}
        {isDesignBlockModalOpen && (
          <DesignBlockModal
            open={isDesignBlockModalOpen}
            onClose={() => setDesignBlockModalOpen(false)}
            onAdd={handleAddDesignBlock}
            entity={entity}
          />
        )}
      </div>
    )
  }
)

export default FroalaWysiwygEditor
