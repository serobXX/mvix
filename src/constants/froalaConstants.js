import { parseLinkToAction } from 'utils/froalaUtils'

export const froalaEntityNames = {
  email: 'Email',
  leadEmail: 'leadEmail',
  accountEmail: 'accountEmail',
  contactEmail: 'contactEmail',
  opportunityEmail: 'opportunityEmail',
  estimateEmail: 'estimateEmail',
  proposalEmail: 'proposalEmail',
  proposal: 'Proposal',
  invoice: 'Invoice',
  emailSign: 'emailSignature'
}

export const froalaPluginNames = {
  align: 'align',
  colors: 'colors',
  entities: 'entities',
  fontSize: 'fontSize',
  help: 'help',
  image: 'image',
  link: 'link',
  lists: 'lists',
  paragraphFormat: 'paragraphFormat',
  paragraphStyle: 'paragraphStyle',
  save: 'save',
  table: 'table',
  wordPaste: 'wordPaste',
  emoticons: 'emoticons',
  specialCharacters: 'specialCharacters',
  codeView: 'codeView',
  charCounter: 'charCounter',
  codeBeautifier: 'codeBeautifier',
  draggable: 'draggable',
  embedly: 'embedly',
  file: 'file',
  fontAwesome: 'fontAwesome',
  fontFamily: 'fontFamily',
  fullscreen: 'fullscreen',
  imageTui: 'imageTUI',
  imageManager: 'imageManager',
  inlineStyle: 'inlineStyle',
  inlineClass: 'inlineClass',
  quickInsert: 'quickInsert',
  quote: 'quote',
  url: 'url',
  video: 'video',
  filesManager: 'filesManager',
  print: 'print',
  markdown: 'markdown',
  spellChecker: 'spellChecker',
  trackChanges: 'track_changes',

  // Custom
  pageColor: 'pageColor'
}

export const froalaToolbarNames = {
  align: 'align',
  alignLeft: 'alignLeft',
  alignRight: 'alignRight',
  textColor: 'textColor',
  backgroundColor: 'backgroundColor',
  paragraphFormat: 'paragraphFormat',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  insertImage: 'insertImage',
  formatOL: 'formatOL',
  formatUL: 'formatUL',
  indent: 'indent',
  outdent: 'outdent',
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  insertHR: 'insertHR',
  insertLink: 'insertLink',
  insertTable: 'insertTable',
  emoticons: 'emoticons',
  specialCharacters: 'specialCharacters',
  codeView: 'html',
  insertFile: 'insertFile',
  strikeThrough: 'strikeThrough',
  subscript: 'subscript',
  superscript: 'superscript',
  paragraphStyle: 'paragraphStyle',
  quote: 'quote',
  fontAwesome: 'fontAwesome',
  getPDF: 'getPDF',

  // custom
  insertAttachment: 'insertAttachment',
  exportPDF: 'exportPDF',
  pageColor: 'pageColor',
  insertTemplate: 'insertTemplate',
  insertPlaceholder: 'insertPlaceholder'
}

export const froalaQuickInsertNames = {
  image: 'image',
  table: 'table',
  hr: 'hr',
  optionTabs: 'optionTabs',
  productItems: 'productItems',
  designBlock: 'designBlock'
}

export const imageConfig = {
  imageResizeWithPercent: true,
  imageMultipleStyles: false,
  imageOutputSize: true,
  imageRoundPercent: true,
  imageMaxSize: 1024 * 1024 * 2.5,
  imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif']
}

export const tableConfig = {
  tableEditButtons: [
    'tableHeader',
    'tableRemove',
    'tableRows',
    'tableColumns',
    'tableStyle',
    '-',
    'tableCells',
    'tableCellBackground',
    'tableCellVerticalAlign',
    'tableCellHorizontalAlign'
  ],
  tableStyles: {
    grayTableBorder: 'Gray Table Border',
    blackTableBorder: 'Black Table Border',
    noTableBorder: 'No Table Border'
  }
}

export const DIVIDER = '|'

export const defaultToolbarConfig = (toolbars = [], rightToolbars = []) => ({
  moreText: {
    buttons: [
      froalaToolbarNames.bold,
      froalaToolbarNames.italic,
      froalaToolbarNames.underline,
      froalaToolbarNames.strikeThrough,
      DIVIDER,
      froalaToolbarNames.fontFamily,
      froalaToolbarNames.fontSize,
      froalaToolbarNames.textColor,
      froalaToolbarNames.backgroundColor,
      ...toolbars,
      DIVIDER,
      froalaToolbarNames.paragraphFormat,
      froalaToolbarNames.align,
      froalaToolbarNames.formatOL,
      froalaToolbarNames.formatUL,
      froalaToolbarNames.outdent,
      froalaToolbarNames.indent,
      DIVIDER,
      froalaToolbarNames.fontAwesome,
      froalaToolbarNames.insertImage,
      froalaToolbarNames.insertLink,
      froalaToolbarNames.emoticons,

      DIVIDER,
      froalaToolbarNames.exportPDF,
      froalaToolbarNames.codeView
    ],
    buttonsVisible: 20 + toolbars.length
  },
  ...(rightToolbars.length
    ? {
        moreMisc: {
          buttons: [...rightToolbars],
          align: 'right',
          buttonsVisible: rightToolbars.length
        }
      }
    : {})
})

export const defaultQuickInsertButtons = [
  froalaQuickInsertNames.image,
  froalaQuickInsertNames.table,
  froalaQuickInsertNames.hr
]

export const defaultFontFamily = {
  'Arial,Helvetica,sans-serif': 'Arial',
  'Arial Black,Arial Bold,Gadget, sans-serif': 'Arial Black',
  'Arial Narrow,Arial,sans-serif': 'Arial Narrow',
  'Georgia,serif': 'Georgia',
  'Impact,Charcoal,sans-serif': 'Impact',
  'Tahoma,Geneva,sans-serif': 'Tahoma',
  'Times New Roman,Times,serif,-webkit-standard': 'Times New Roman',
  'Verdana,Geneva,sans-serif': 'Verdana',
  'Palatino Linotype,Book Antiqua,Palatino,serif': 'Palatino Linotype',
  'Lucida Sans Unicode,Lucida Grande,sans-serif': 'Lucida Sans Unicode',
  'Lucida Console,Monaco,monospace': 'Lucida Console',
  'Gill Sans,Gill Sans MT,Calibri,sans-serif': 'Gill Sans',
  'Century Gothic,CenturyGothic,AppleGothic,sans-serif': 'Century Gothic',
  'Copperplate,Copperplate Gothic Light,fantasy': 'Copperplate',
  'Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif':
    'Trebuchet MS',
  'Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace':
    'Courier New',
  'Garamond,Baskerville,Baskerville Old Face,Hoefler Text,Times New Roman,serif':
    'Garamond',
  'Helvetica Neue,Helvetica,Arial,sans-serif': 'Helvetica Neue'
}

export const defaultEnabledPlugins = [
  froalaPluginNames.align,
  froalaPluginNames.colors,
  froalaPluginNames.entities,
  froalaPluginNames.fontSize,
  froalaPluginNames.help,
  froalaPluginNames.image,
  froalaPluginNames.link,
  froalaPluginNames.lists,
  froalaPluginNames.paragraphFormat,
  froalaPluginNames.paragraphStyle,
  froalaPluginNames.save,
  froalaPluginNames.table,
  froalaPluginNames.wordPaste,
  froalaPluginNames.emoticons,
  froalaPluginNames.specialCharacters,
  froalaPluginNames.codeView,
  froalaPluginNames.fontFamily,
  froalaPluginNames.quote,
  froalaPluginNames.fontAwesome,
  froalaPluginNames.quickInsert,
  froalaPluginNames.pageColor
]

export const DEFAULT_COLORS = [
  '#61BD6D',
  '#1ABC9C',
  '#54ACD2',
  '#2C82C9',
  '#9365B8',
  '#475577',
  '#CCCCCC',
  '#41A85F',
  '#00A885',
  '#3D8EB9',
  '#2969B0',
  '#553982',
  '#28324E',
  '#000000',
  '#F7DA64',
  '#FBA026',
  '#EB6B56',
  '#E25041',
  '#A38F84',
  '#EFEFEF',
  '#FFFFFF',
  '#FAC51C',
  '#F37934',
  '#D14841',
  '#B8312F',
  '#7C706B',
  '#D1D5D8'
]

export const froalaActionNames = {
  scheduleMeeting: 'schedule-meeting',
  additionalEstimate: 'additional-estimates'
}

export const froalaProposalActions = [
  {
    text: 'Schedule Meeting',
    href: parseLinkToAction(froalaActionNames.scheduleMeeting)
  },
  {
    text: 'Additional Estimates',
    href: parseLinkToAction(froalaActionNames.additionalEstimate)
  }
]
