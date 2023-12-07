import * as ReactDOMServer from 'react-dom/server'
import FroalaEditor from 'froala-editor'

import {
  DEFAULT_COLORS,
  froalaQuickInsertNames,
  froalaToolbarNames
} from 'constants/froalaConstants'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import ProductItemsTable from 'components/FroalaPreview/ProductItemsTable'

export const loadEmailAttachmentCommand = callback => {
  FroalaEditor.DefineIcon('insertAttachmentIcon', {
    FA5NAME: 'paperclip-vertical',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterCommand(froalaToolbarNames.insertAttachment, {
    title: 'Insert Attachment',
    icon: 'insertAttachmentIcon',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback
  })
}

export const exportPdfCommand = callback => {
  FroalaEditor.DefineIcon('exportPdfIcon', {
    FA5NAME: 'file-pdf',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterCommand(froalaToolbarNames.exportPDF, {
    title: 'Export as PDF',
    icon: 'exportPdfIcon',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback
  })
}

export const pageColorPopup = () => {
  FroalaEditor.POPUP_TEMPLATES['pageColor.popup'] =
    '[_BACKGROUND_COLORS_][_CUSTOM_COLOR_]'
  Object.assign(FroalaEditor.DEFAULTS, {
    colorsBackground: DEFAULT_COLORS,
    colorsStep: 7
  })

  FroalaEditor.PLUGINS.pageColor = function (editor) {
    function initPopup() {
      let popupColors = ''

      if (editor.opts.colorsBackground.length > 1) {
        popupColors +=
          '<div class="fr-color-set fr-background-color fr-selected-set">'
        for (let i = 0; i < editor.opts.colorsBackground.length; i++) {
          popupColors += `<span class="fr-command fr-select-color" data-cmd="applyColor" data-param1="${editor.opts.colorsBackground[i]}" role="button" style="background:${editor.opts.colorsBackground[i]}">`
          popupColors += `<span class="fr-sr-only"> Color${editor.opts.colorsBackground[i]} &nbsp;&nbsp;&nbsp;</span>`
          popupColors += '</span>'
          if ((i + 1) % editor.opts.colorsStep === 0) {
            popupColors += '<br>'
          }
        }
        popupColors += '</div>'
      }

      let customColor = `<div class="fr-color-hex-layer fr-active fr-layer" id="fr-color-hex-layer-${editor.id}">`
      customColor += `<div class="fr-input-line"><input maxlength="7" id="fr-color-hex-layer-${editor.id}"  type="text" placeholder="HEX Color"  tabIndex="1" aria-required="true"></div>`
      customColor += `<div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="customColor" tabIndex="2" role="button">OK</button>`
      customColor += `</div></div>`

      // Load popup template.
      const template = {
        background_colors: popupColors,
        custom_color: customColor
      }

      // Create popup.
      const $popup = editor.popups.create('pageColor.popup', template)

      return $popup
    }

    // Show the popup
    function showPopup() {
      let $popup = editor.popups.get('pageColor.popup')

      if (!$popup) $popup = initPopup()

      editor.popups.setContainer('pageColor.popup', editor.$tb)

      const $btn = editor.$tb.find(
        `.fr-command[data-cmd="${froalaToolbarNames.pageColor}"]`
      )

      const left = $btn.offset().left + $btn.outerWidth() / 2
      const top =
        $btn.offset().top +
        (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10)

      editor.popups.show('pageColor.popup', left, top, $btn.outerHeight())
    }

    function hidePopup() {
      editor.popups.hide('pageColor.popup')
    }

    function setColor(color) {
      const doc = new DOMParser().parseFromString(
        `${editor.html.get()}`,
        'text/html'
      )
      const colorElement = doc.body.querySelector('#page-color')

      if (colorElement) {
        colorElement.setAttribute('data-color', color)
        editor.html.set(doc.body.innerHTML)
      } else {
        editor.html.set(
          `<p id="page-color" contenteditable="false" data-color="${color}" style="display: none">Color</p>${editor.html.get()}`
        )
      }
    }

    return {
      showPopup: showPopup,
      hidePopup: hidePopup,
      setColor
    }
  }
  FroalaEditor.DefineIcon('pageColorIcon', {
    FA5NAME: 'palette',
    template: 'font_awesome_5r'
  })

  FroalaEditor.RegisterCommand(froalaToolbarNames.pageColor, {
    title: 'Page Color',
    icon: 'pageColorIcon',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function () {
      this.pageColor.showPopup()
    }
  })
}

export const pageColorCommand = callback => {
  FroalaEditor.RegisterCommand('applyColor', {
    undo: !0,
    callback: function (_, color) {
      this.pageColor.setColor(color)
      callback && callback(color)
      this.pageColor.hidePopup()
    }
  })
  FroalaEditor.RegisterCommand('customColor', {
    undo: !0,
    callback: function () {
      const input = this.popups
        .get('pageColor.popup')
        .find('.fr-color-hex-layer input')
      if (input.length) {
        const color = input.val()
        this.pageColor.setColor(color)
        callback && callback(color)
        this.pageColor.hidePopup()
      }
    }
  })
}

export const insertPlaceholderCommand = callback => {
  FroalaEditor.DefineIcon('insertPlaceholderIcon', {
    FA5NAME: 'object-group',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterCommand(froalaToolbarNames.insertPlaceholder, {
    title: 'Dynamic Data Field',
    icon: 'insertPlaceholderIcon',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback
  })
}

export const insertTemplateCommand = callback => {
  FroalaEditor.DefineIcon('insertTemplateIcon', {
    FA5NAME: 'pager',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterCommand(froalaToolbarNames.insertTemplate, {
    title: 'Insert Template',
    icon: 'insertTemplateIcon',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback
  })
}

export const optionTabsCommand = (title, callback) => {
  FroalaEditor.DefineIcon('optionTabsIcon', {
    FA5NAME: 'table-tree',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterQuickInsertButton(froalaQuickInsertNames.optionTabs, {
    title: title || 'Option Tabs',
    icon: 'optionTabsIcon',
    focus: false,
    refreshAfterCallback: false,
    callback: function (...args) {
      let html = `<div id="estimate-option-tab" contenteditable="false"><div class="option-tab__container static-options">`
      Array(3)
        .fill()
        .forEach((_, index) => {
          html += `<button class='option-tab__button ${
            index === 0 ? 'active' : ''
          }'>Option ${index + 1}</button>`
        })
      html += `<div contenteditable="false" class="${getIconClassName(
        iconNames.delete2
      )} delete-estimate-icon"></div>`
      html += '</div></div><p></p>'
      this.html.insert(html)
      callback && callback(...args)
    }
  })
}

export const productItemsCommand = callback => {
  FroalaEditor.DefineIcon('productItemsIcon', {
    FA5NAME: 'table-list',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterQuickInsertButton(froalaQuickInsertNames.productItems, {
    title: 'Product Item Table',
    icon: 'productItemsIcon',
    focus: false,
    refreshAfterCallback: false,
    callback: function (...args) {
      let html = `<div id="estimate-product-table" contenteditable="false">`
      html += ReactDOMServer.renderToStaticMarkup(
        <ProductItemsTable isStatic isMultipleShip />
      )
      html += `<div contenteditable="false" class="${getIconClassName(
        iconNames.delete2
      )} delete-product-item-icon"></div>`
      html += '</div><p></p>'
      this.html.insert(html)
      callback && callback(...args)
    }
  })
}

export const designBlockCommand = callback => {
  FroalaEditor.DefineIcon('designBlockIcon', {
    FA5NAME: 'browser',
    template: 'font_awesome_5r'
  })
  FroalaEditor.RegisterQuickInsertButton(froalaQuickInsertNames.designBlock, {
    title: 'Design Blocks',
    icon: 'designBlockIcon',
    refreshAfterCallback: false,
    callback
  })
}
