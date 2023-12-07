import React, { forwardRef, useCallback, useEffect, useMemo } from 'react'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import ReactFroalaEditor from 'react-froala-wysiwyg'
import html2pdf from 'html2pdf.js'
import { titleCase } from 'title-case'

import {
  defaultEnabledPlugins,
  defaultQuickInsertButtons,
  defaultToolbarConfig,
  froalaEntityNames,
  froalaProposalActions,
  froalaQuickInsertNames,
  froalaToolbarNames,
  imageConfig,
  tableConfig
} from 'constants/froalaConstants'
import { beforeUploadImage } from 'utils/froalaUtils'
import { config as appConfig } from 'constants/app'
import { simulateEvent } from 'utils/formik'
import {
  designBlockCommand,
  exportPdfCommand,
  optionTabsCommand,
  productItemsCommand
} from './config'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'

import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/css/third_party/font_awesome.min.css'
import 'froala-editor/js/third_party/font_awesome.min.js'
import './_froala.scss'

const FroalaEditor = forwardRef(
  (
    {
      entity,
      config,
      toolbarBtnNo,
      isFetching,
      readOnly,
      readOnlyWithoutSelection,
      hidePlaceholder,
      setContentChanged,
      onInitialized = f => f,
      fontFamily,
      showBackgroundPicker,
      value,
      name,
      onChange,
      onDesignBlockOpen = f => f,
      fileName
    },
    ref
  ) => {
    useEffect(() => {
      if (entity === froalaEntityNames.proposal) {
        optionTabsCommand('Estimate Tabs')
      }
      if (
        [froalaEntityNames.proposal, froalaEntityNames.invoice].includes(entity)
      ) {
        productItemsCommand()
        designBlockCommand(() => {
          onDesignBlockOpen()
        })
      }
      //eslint-disable-next-line
    }, [entity])

    useEffect(() => {
      exportPdfCommand(function () {
        const html = this.html.get()
        html2pdf()
          .set({ margin: [0, 5], html2canvas: { useCORS: !0 } })
          .from(html)
          .save(
            `${titleCase(fileName || camelCaseToSplitCapitalize(name))}.pdf`
          )
      })
      //eslint-disable-next-line
    }, [fileName])

    const linkList = useMemo(() => {
      if (entity === froalaEntityNames.proposal) {
        return froalaProposalActions
      }
      return undefined
    }, [entity])

    const defaultConfig = useMemo(
      () => ({
        key: appConfig.FROALA_EDITOR_KEY,
        attribution: false,
        iconsTemplate: 'font_awesome_5',
        ...imageConfig,
        ...tableConfig,
        fontFamily,
        linkList,
        ...config,
        toolbarButtons: {
          ...defaultToolbarConfig(
            [...(showBackgroundPicker ? [froalaToolbarNames.pageColor] : [])],
            [
              ...(!readOnly && !readOnlyWithoutSelection && !hidePlaceholder
                ? [froalaToolbarNames.insertPlaceholder]
                : [])
            ]
          ),
          ...(config?.toolbarButtons || {})
        },
        quickInsertButtons: [
          ...defaultQuickInsertButtons,
          ...(entity === froalaEntityNames.proposal
            ? [
                froalaQuickInsertNames.optionTabs,
                froalaQuickInsertNames.productItems,
                froalaQuickInsertNames.designBlock
              ]
            : entity === froalaEntityNames.invoice
            ? [
                froalaQuickInsertNames.productItems,
                froalaQuickInsertNames.designBlock
              ]
            : []),
          ...(config?.quickInsertButtons || [])
        ],
        pluginsEnabled: [
          ...defaultEnabledPlugins,
          ...(config?.pluginsEnabled || [])
        ],
        events: {
          'image.beforeUpload': beforeUploadImage,
          initialized: function () {
            ref.current = this
            onInitialized(this)
          },
          contentChanged: () => setContentChanged(true)
        }
      }),
      [
        config,
        fontFamily,
        onInitialized,
        showBackgroundPicker,
        readOnly,
        readOnlyWithoutSelection,
        entity,
        hidePlaceholder,
        ref,
        setContentChanged,
        linkList
      ]
    )

    const froalaEditorConfig = useMemo(() => {
      return {
        ...defaultConfig,
        scrollableContainer: '#scrollableContainer',
        toolbarButtons: {
          ...defaultConfig.toolbarButtons,
          moreText: {
            ...(defaultConfig.toolbarButtons?.moreText || {}),
            ...(toolbarBtnNo ? { buttonsVisible: toolbarBtnNo } : {})
          }
        }
      }
    }, [defaultConfig, toolbarBtnNo])

    const handleModelChange = useCallback(
      _value => {
        onChange(simulateEvent(name, _value))
      },
      [onChange, name]
    )

    const renderEditor = useMemo(
      () =>
        !!toolbarBtnNo &&
        !isFetching && (
          <ReactFroalaEditor
            tag="textarea"
            config={froalaEditorConfig}
            model={value}
            onModelChange={handleModelChange}
          />
        ),
      [froalaEditorConfig, value, handleModelChange, toolbarBtnNo, isFetching]
    )

    return readOnly || readOnlyWithoutSelection ? (
      <FroalaEditorView config={froalaEditorConfig} model={value} />
    ) : (
      renderEditor
    )
  }
)

export default FroalaEditor
